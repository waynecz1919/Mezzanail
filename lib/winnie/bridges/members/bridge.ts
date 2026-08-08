import type { WinnieBridgeResult } from "../contracts";
import type { WinnieMember } from "./contracts";

export interface MemberBridge {
  readonly source: "member-center";
  searchMembers(
    query: string,
    limit?: number,
  ): Promise<WinnieBridgeResult<readonly WinnieMember[], "member-center">>;
  getMemberSummary(
    customerId: string | number,
  ): Promise<WinnieBridgeResult<WinnieMember, "member-center">>;
  getMemberByMemberNo(
    memberNo: string,
  ): Promise<WinnieBridgeResult<WinnieMember, "member-center">>;
  getMemberByPhone(
    normalizedPhone: string,
  ): Promise<WinnieBridgeResult<WinnieMember, "member-center">>;
}
