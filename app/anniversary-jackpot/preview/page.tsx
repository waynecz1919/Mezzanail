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
    allow_multiple_wins: true,
  },
  participants: [
    ["101", "PREV01", "Aster Vale", "0001", 2],
    ["102", "PREV02", "Briar Cove", "0002", 2],
    ["103", "PREV03", "Cedar Lane", "0003", 2],
    ["104", "PREV04", "Dove Ellis", "0004", 2],
    ["105", "PREV05", "Ember Frost", "0005", 2],
    ["106", "PREV06", "Fern Grove", "0006", 1],
    ["107", "PREV07", "Gale Harbor", "0007", 1],
    ["108", "PREV08", "Haven Isle", "0008", 1],
    ["109", "PREV09", "Indigo June", "0009", 1],
    ["110", "PREV10", "Juniper Knox", "0010", 1],
    ["111", "PREV11", "Kestrel Lake", "0011", 1],
    ["112", "PREV12", "Lumen Moss", "0012", 1],
    ["113", "PREV13", "Meadow North", "0013", 1],
    ["114", "PREV14", "Nova Oak", "0014", 1],
    ["115", "PREV15", "Orchid Pine", "0015", 1],
    ["116", "PREV16", "Petal Quartz", "0016", 1],
    ["117", "PREV17", "Quarry Rain", "0017", 1],
    ["118", "PREV18", "River Sage", "0018", 1],
    ["119", "PREV19", "Solstice Tide", "0019", 1],
    ["120", "PREV20", "Thistle Vale", "0020", 1],
    ["121", "PREV21", "Umber Wave", "0021", 1],
    ["122", "PREV22", "Vesper Willow", "0022", 1],
    ["123", "PREV23", "Willow Xen", "0023", 1],
    ["124", "PREV24", "Zephyr Yarrow", "0024", 1],
  ].map(([entryId, memberId, customerName, phoneLast4, ticketCount], index) => ({
    id: `00000000-0000-4000-8000-${String(index + 101).padStart(12, "0")}`,
    entry_id: String(entryId),
    member_id: String(memberId),
    customer_name: String(customerName),
    phone_last4: String(phoneLast4),
    ticket_count: Number(ticketCount),
    eligible: true,
    eligibility_status: "Eligible",
    source: "Preview fixture",
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
    ["301", "201", "101", 1, "Cuccio Butter Manicure", "Aster Vale", "PR***01", "0001"],
    ["302", "202", "103", 2, "RM100 Member Voucher", "Cedar Lane", "PR***03", "0003"],
    ["303", "203", "105", 3, "Premium Nail Care Set", "Ember Frost", "PR***05", "0005"],
    ["304", "204", "107", 4, "Apple Watch SE 3", "Gale Harbor", "PR***07", "0007"],
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
    totalParticipants: 24,
    eligibleParticipants: 24,
    totalTickets: 29,
    remainingTickets: 29,
    invalidRecords: 0,
  },
};

export default function AnniversaryJackpotPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <JackpotConsole initialState={previewState} previewMode />;
}
