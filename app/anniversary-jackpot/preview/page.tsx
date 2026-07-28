import { notFound } from "next/navigation";
import { JackpotConsole } from "@/components/jackpot/jackpot-console";
import type { JackpotState } from "@/lib/jackpot/types";

export const dynamic = "force-dynamic";

const createdAt = "2026-07-28T10:00:00.000Z";

const previewState: JackpotState = {
  role: "owner",
  staffId: "preview-owner",
  campaign: {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "mezzanail-7th-anniversary",
    name: "Mezzanail 7th Anniversary Final Day",
    event_date: "2026-09-30",
    status: "live",
    participant_list_locked: true,
    locked_at: createdAt,
    locked_by: "preview-owner",
    allow_multiple_wins: false,
  },
  participants: [
    ["101", "MN7001", "Alicia Tan", "1827", 12, true, "Eligible"],
    ["102", "MN7002", "Nur Aina", "6408", 9, true, "Eligible"],
    ["103", "MN7003", "Chloe Lim", "2714", 8, true, "Eligible"],
    ["104", "MN7004", "Mei Ling", "8932", 14, true, "Eligible"],
    ["105", "MN7005", "Siti Hajar", "3379", 7, true, "Eligible"],
    ["106", "MN7006", "Rachel Lee", "5081", 11, true, "Eligible"],
    ["107", "MN7007", "Jasmine Wong", "7640", 6, true, "Eligible"],
    ["108", "MN7008", "Sofia Ong", "1196", 10, true, "Eligible"],
    ["109", "MN7009", "Amelia Chan", "4523", 5, true, "Eligible"],
    ["110", "MN7010", "Emma Low", "9065", 3, false, "Duplicate entry"],
  ].map(([entryId, memberId, customerName, phoneLast4, ticketCount, eligible, eligibilityStatus], index) => ({
    id: `00000000-0000-4000-8000-${String(index + 101).padStart(12, "0")}`,
    entry_id: String(entryId),
    member_id: String(memberId),
    customer_name: String(customerName),
    phone_last4: String(phoneLast4),
    ticket_count: Number(ticketCount),
    eligible: Boolean(eligible),
    eligibility_status: String(eligibilityStatus),
    source: "Anniversary campaign",
    created_at: createdAt,
  })),
  prizes: [
    ["201", "Cuccio Butter Manicure", "Signature anniversary care", 3, 0, 1, false, "completed"],
    ["202", "RM100 Member Voucher", "For the next Mezzanail visit", 3, 0, 2, false, "completed"],
    ["203", "Premium Nail Care Set", "A curated home-care collection", 2, 0, 3, false, "completed"],
    ["204", "Apple Watch SE 3", "Anniversary special prize", 1, 0, 4, false, "completed"],
    ["205", "Dyson Supersonic", "Final celebration feature prize", 1, 1, 5, false, "active"],
    ["206", "7th Anniversary Jackpot", "The final grand prize", 1, 1, 6, true, "active"],
  ].map(([id, name, description, quantity, remaining, order, isJackpot, status]) => ({
    id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
    prize_name: String(name),
    prize_description: String(description),
    prize_image_url: null,
    quantity: Number(quantity),
    remaining_quantity: Number(remaining),
    draw_order: Number(order),
    is_jackpot: Boolean(isJackpot),
    allow_previous_winner: false,
    status: status as "active" | "completed",
  })),
  draws: [
    ["301", "201", "101", 1, "Cuccio Butter Manicure", "Alicia Tan", "MN***01", "1827"],
    ["302", "202", "103", 2, "RM100 Member Voucher", "Chloe Lim", "MN***03", "2714"],
    ["303", "203", "105", 3, "Premium Nail Care Set", "Siti Hajar", "MN***05", "3379"],
    ["304", "204", "107", 4, "Apple Watch SE 3", "Jasmine Wong", "MN***07", "7640"],
  ].map(([id, prizeId, participantId, sequence, prizeName, customerName, memberId, phoneLast4], index) => ({
    id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
    prize_id: `00000000-0000-4000-8000-${String(prizeId).padStart(12, "0")}`,
    participant_id: `00000000-0000-4000-8000-${String(participantId).padStart(12, "0")}`,
    request_id: `preview-request-${index + 1}`,
    draw_sequence: Number(sequence),
    status: "confirmed" as const,
    drawn_at: `2026-09-30T${String(10 + index).padStart(2, "0")}:15:00.000+08:00`,
    drawn_by: "owner",
    confirmed_at: `2026-09-30T${String(10 + index).padStart(2, "0")}:17:00.000+08:00`,
    confirmed_by: "owner",
    void_reason: null,
    prize_name: String(prizeName),
    is_jackpot: false,
    customer_name: String(customerName),
    member_id_masked: String(memberId),
    phone_last4: String(phoneLast4),
  })),
  audit: [
    ["401", "participant_list.locked", "campaign", "Final list verified and locked"],
    ["402", "draw.confirmed", "draw", "Apple Watch SE 3 winner confirmed"],
    ["403", "prize.activated", "prize", "Dyson Supersonic is ready for draw"],
  ].map(([id, action, entityType, reason], index) => ({
    id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`,
    action: String(action),
    entity_type: String(entityType),
    entity_id: null,
    performed_by: index === 0 ? "admin" : "owner",
    created_at: `2026-09-30T${String(9 + index).padStart(2, "0")}:00:00.000+08:00`,
    reason: String(reason),
  })),
  summary: {
    totalParticipants: 10,
    eligibleParticipants: 9,
    totalTickets: 85,
    remainingTickets: 39,
    invalidRecords: 1,
  },
};

export default function AnniversaryJackpotPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <JackpotConsole initialState={previewState} previewMode />;
}
