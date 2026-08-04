import type { StaffRole } from "@/lib/redeem/auth";

export type JackpotCampaign = {
  id: string;
  slug: string;
  name: string;
  event_date: string;
  status: "setup" | "live" | "completed" | "archived";
  participant_list_locked: boolean;
  locked_at: string | null;
  locked_by: string | null;
  allow_multiple_wins: boolean;
};

export type JackpotParticipant = {
  id: string;
  entry_id: string | null;
  member_id: string | null;
  customer_name: string;
  phone_last4: string;
  ticket_count: number;
  eligible: boolean;
  eligibility_status: string;
  source: string;
  created_at: string;
};

export type JackpotPrize = {
  id: string;
  prize_name: string;
  prize_description: string | null;
  prize_image_url: string | null;
  quantity: number;
  remaining_quantity: number;
  draw_order: number;
  is_jackpot: boolean;
  allow_previous_winner: boolean;
  status: "active" | "inactive" | "completed";
};

export type JackpotDraw = {
  id: string;
  prize_id: string;
  participant_id: string;
  request_id: string;
  draw_sequence: number;
  status: "pending" | "unreachable" | "confirmed" | "voided";
  drawn_at: string;
  drawn_by: string;
  confirmed_at: string | null;
  confirmed_by: string | null;
  void_reason: string | null;
  prize_name: string;
  is_jackpot: boolean;
  customer_name: string;
  member_id_masked: string;
  phone_last4: string;
};

export type JackpotAudit = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  performed_by: string;
  created_at: string;
  reason: string | null;
};

export type JackpotState = {
  role: StaffRole;
  staffId: string;
  campaign: JackpotCampaign;
  participants: JackpotParticipant[];
  prizes: JackpotPrize[];
  draws: JackpotDraw[];
  audit: JackpotAudit[];
  summary: {
    totalParticipants: number;
    eligibleParticipants: number;
    totalTickets: number;
    remainingTickets: number;
    invalidRecords: number;
  };
};

export type ImportParticipant = {
  entryId: string | null;
  memberId: string | null;
  customerName: string;
  phoneNumber: string;
  phoneLast4: string;
  ticketCount: number;
  eligible: boolean;
  eligibilityStatus: string;
  source: string;
};

export type ImportSummary = {
  totalRows: number;
  importedParticipants: number;
  totalTickets: number;
  duplicateMembers: number;
  invalidNumbers: number;
  ineligibleRecords: number;
  errors: string[];
};

export type WinnerResult = {
  drawId: string;
  prizeId: string;
  winnerParticipantId: string;
  displayName: string;
  memberIdMasked: string;
  phoneLast4: string;
  prizeName: string;
  isJackpot: boolean;
  resultToken: string;
  drawnAt: string;
  status: JackpotDraw["status"];
};
