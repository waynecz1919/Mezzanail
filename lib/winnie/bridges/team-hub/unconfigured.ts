import { bridgeConfigurationMissing } from "../result";
import type { TeamHubBridge } from "./bridge";

export class UnconfiguredTeamHubBridge implements TeamHubBridge {
  readonly source = "team-hub" as const;

  async getTeamStatus() {
    return bridgeConfigurationMissing(this.source);
  }
}
