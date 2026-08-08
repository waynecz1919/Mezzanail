import { bridgeConfigurationMissing } from "../result";
import type { MemberBridge } from "./bridge";

export class UnconfiguredMemberBridge implements MemberBridge {
  readonly source = "member-center" as const;

  async getMemberSummary(_customerIdOrMemberId: string) {
    return bridgeConfigurationMissing(this.source);
  }
}
