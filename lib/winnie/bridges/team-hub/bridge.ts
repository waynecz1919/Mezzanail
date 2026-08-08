import type { WinnieBridgeResult } from "../contracts";
import type { WinnieTeamMember } from "./contracts";

export interface TeamHubBridge {
  readonly source: "team-hub";
  getTeamStatus(): Promise<
    WinnieBridgeResult<readonly WinnieTeamMember[], "team-hub">
  >;
}
