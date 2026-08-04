import "server-only";

import { randomBytes, randomInt } from "node:crypto";
import type {
  ImportParticipant,
  ImportSummary,
} from "@/lib/jackpot/types";

type CsvRow = Record<string, string>;

const headerAliases: Record<string, string[]> = {
  entryId: ["entry id", "entryid", "entry_id"],
  memberId: ["member id", "memberid", "member_id"],
  customerName: ["customer name", "name", "customer", "customer_name"],
  phoneNumber: ["phone number", "phone", "mobile", "phone_number"],
  ticketCount: ["draw tickets", "tickets", "ticket count", "ticket_count"],
  eligibilityStatus: ["eligibility status", "eligible", "status", "eligibility_status"],
  source: ["source"],
  createdAt: ["created at", "created_at", "date"],
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseCsvMatrix(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function findValue(row: CsvRow, key: keyof typeof headerAliases) {
  const alias = headerAliases[key].find((candidate) => candidate in row);
  return alias ? row[alias]?.trim() || "" : "";
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length >= 9) return `60${digits.slice(1)}`;
  if (digits.startsWith("60") && digits.length >= 10) return digits;
  return digits;
}

export function maskMemberId(value: string | null | undefined) {
  const memberId = value?.trim();
  if (!memberId) return "—";
  if (memberId.length <= 3) return `${memberId[0] || ""}**`;
  return `${memberId.slice(0, 1)}${"*".repeat(Math.min(5, memberId.length - 3))}${memberId.slice(-2)}`;
}

export function secureTicketOrdinal(totalTickets: number) {
  if (!Number.isSafeInteger(totalTickets) || totalTickets < 1) {
    throw new Error("EMPTY_ELIGIBLE_POOL");
  }
  return randomInt(1, totalTickets + 1);
}

export function createResultToken() {
  return randomBytes(24).toString("base64url");
}

export function selectWeightedParticipant<T extends { ticketCount: number }>(
  participants: T[],
  ticketOrdinal: number,
) {
  let cumulative = 0;
  for (const participant of participants) {
    cumulative += participant.ticketCount;
    if (ticketOrdinal <= cumulative) return participant;
  }
  return null;
}

export function parseParticipantCsv(input: string): {
  participants: ImportParticipant[];
  summary: ImportSummary;
} {
  const matrix = parseCsvMatrix(input.replace(/^\uFEFF/, ""));
  if (matrix.length < 2) throw new Error("CSV must contain a header row and at least one participant.");

  const headers = matrix[0].map(normalizeHeader);
  const rows: CsvRow[] = matrix.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ""])),
  );
  const errors: string[] = [];
  const consolidated = new Map<string, ImportParticipant>();
  const seenMembers = new Set<string>();
  let duplicateMembers = 0;
  let invalidNumbers = 0;
  let ineligibleRecords = 0;

  rows.forEach((row, rowIndex) => {
    const customerName = findValue(row, "customerName").slice(0, 160);
    const memberId = findValue(row, "memberId").slice(0, 80) || null;
    const phoneNumber = normalizePhone(findValue(row, "phoneNumber"));
    const ticketValue = Number.parseInt(findValue(row, "ticketCount") || "1", 10);
    const rawStatus = findValue(row, "eligibilityStatus").toLowerCase();
    const eligible = !["false", "no", "0", "ineligible", "invalid"].includes(rawStatus);

    if (!customerName) {
      errors.push(`Row ${rowIndex + 2}: customer name is required.`);
      return;
    }
    if (!/^\d{10,15}$/.test(phoneNumber)) {
      invalidNumbers += 1;
      errors.push(`Row ${rowIndex + 2}: invalid phone number.`);
      return;
    }
    if (!Number.isInteger(ticketValue) || ticketValue < 1 || ticketValue > 10000) {
      errors.push(`Row ${rowIndex + 2}: draw tickets must be between 1 and 10,000.`);
      return;
    }
    if (!eligible) ineligibleRecords += 1;

    const memberKey = memberId?.toLowerCase() || "";
    if (memberKey && seenMembers.has(memberKey)) duplicateMembers += 1;
    if (memberKey) seenMembers.add(memberKey);
    const identityKey = memberKey ? `member:${memberKey}` : `phone:${phoneNumber}`;
    const existing = consolidated.get(identityKey);
    if (existing) {
      existing.ticketCount += ticketValue;
      existing.eligible = existing.eligible && eligible;
      if (!eligible) existing.eligibilityStatus = rawStatus || "ineligible";
      return;
    }

    consolidated.set(identityKey, {
      entryId: findValue(row, "entryId").slice(0, 100) || null,
      memberId,
      customerName,
      phoneNumber,
      phoneLast4: phoneNumber.slice(-4),
      ticketCount: ticketValue,
      eligible,
      eligibilityStatus: rawStatus || (eligible ? "eligible" : "ineligible"),
      source: findValue(row, "source").slice(0, 80) || "csv",
    });
  });

  const participants = [...consolidated.values()];
  return {
    participants,
    summary: {
      totalRows: rows.length,
      importedParticipants: participants.length,
      totalTickets: participants.reduce((total, item) => total + item.ticketCount, 0),
      duplicateMembers,
      invalidNumbers,
      ineligibleRecords,
      errors: errors.slice(0, 100),
    },
  };
}

export const redrawReasons = [
  "Winner Not Present",
  "Winner Unreachable",
  "Eligibility Error",
  "Duplicate Entry",
  "Declined Prize",
  "Technical Issue",
  "Other",
] as const;
