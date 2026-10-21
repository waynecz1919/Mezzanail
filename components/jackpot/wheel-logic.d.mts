export type WheelParticipant = {
  id: string;
  customer_name: string;
  ticket_count: number;
  eligible: boolean;
};

export type WheelDraw = {
  id: string;
  prize_id: string;
  participant_id: string;
  status: string;
};

export type WheelPrize = {
  id: string;
  allow_previous_winner: boolean;
};

export type WheelSegment<TParticipant extends WheelParticipant = WheelParticipant> = {
  id: string;
  participantId: string;
  ticketNumber: number;
  participant: TParticipant;
};

export function buildWheelTicketSegments<TParticipant extends WheelParticipant>(
  participants: TParticipant[],
  draws: WheelDraw[],
  campaign: { allow_multiple_wins: boolean },
  prize: WheelPrize,
  ignoredDrawId?: string | null,
): WheelSegment<TParticipant>[];

export function chooseWinnerSegmentIndex<TParticipant extends WheelParticipant>(
  segments: WheelSegment<TParticipant>[],
  participantId: string,
  random?: () => number,
): number;

export function calculateWheelStopAngle(
  segmentIndex: number,
  segmentCount: number,
  random?: () => number,
  turns?: number,
): number;

export function buildWheelFaceGradient(segmentCount: number): string;
export function buildWheelSeparatorGradient(segmentCount: number): string;
