import "server-only";

import type { AppointmentBridge } from "./appointments/bridge";
import { UnconfiguredAppointmentBridge } from "./appointments/unconfigured";
import type { MemberBridge } from "./members/bridge";
import { UnconfiguredMemberBridge } from "./members/unconfigured";
import type { TeamHubBridge } from "./team-hub/bridge";
import { UnconfiguredTeamHubBridge } from "./team-hub/unconfigured";

export type WinnieBridgeRegistry = Readonly<{
  appointments: AppointmentBridge;
  members: MemberBridge;
  teamHub: TeamHubBridge;
}>;

export const winnieBridgeRegistry: WinnieBridgeRegistry = Object.freeze({
  appointments: new UnconfiguredAppointmentBridge(),
  members: new UnconfiguredMemberBridge(),
  teamHub: new UnconfiguredTeamHubBridge(),
});
