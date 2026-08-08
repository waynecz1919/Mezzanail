import type { WinnieBridgeResult } from "../contracts";
import type { WinnieMember } from "./contracts";

export interface MemberBridge {
  readonly source: "member-center";
  getMemberSummary(
    customerIdOrMemberId: string,
  ): Promise<WinnieBridgeResult<WinnieMember, "member-center">>;
}
