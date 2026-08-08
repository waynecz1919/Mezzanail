export type WinnieMemberStatus =
  | "active"
  | "pending"
  | "inactive"
  | "suspended"
  | "expired"
  | "unknown";

export type WinnieMember = Readonly<{
  customerId: string;
  memberId: string;
  name: string;
  phone: string | null;
  discountRate: number | null;
  memberStatus: WinnieMemberStatus;
}>;
