export type WinnieMemberStatus =
  | "active"
  | "pending"
  | "inactive"
  | "suspended"
  | "expired"
  | "unknown";

export type WinnieMember = Readonly<{
  customerId: number;
  memberNo: string | null;
  name: string;
  phone: string | null;
  normalizedPhone: string | null;
  status: WinnieMemberStatus;
  sourceTier: string | null;
  birthMonth: number | null;
  sourceSystem: string | null;
  syncedAt: string | null;
  memberDiscountRate: null;
}>;
