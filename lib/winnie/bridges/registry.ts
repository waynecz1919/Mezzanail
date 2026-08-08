import "server-only";

import type { AppointmentBridge } from "./appointments/bridge";
import { ProductionAppointmentBridge } from "./appointments/production";
import type { MemberBridge } from "./members/bridge";
import { ProductionMemberBridge } from "./members/production";
import type { TeamHubBridge } from "./team-hub/bridge";
import { UnconfiguredTeamHubBridge } from "./team-hub/unconfigured";

export type WinnieBridgeRegistry = Readonly<{
  appointments: AppointmentBridge;
  members: MemberBridge;
  teamHub: TeamHubBridge;
}>;

export const winnieBridgeRegistry: WinnieBridgeRegistry = Object.freeze({
  appointments: new ProductionAppointmentBridge({
    baseUrl: process.env.APPOINTMENT_READ_API_URL,
    token: process.env.WINNIE_APPOINTMENT_READ_TOKEN,
  }),
  members: new ProductionMemberBridge({
    baseUrl: process.env.MEMBER_READ_API_URL,
    token: process.env.WINNIE_MEMBER_READ_TOKEN,
  }),
  teamHub: new UnconfiguredTeamHubBridge(),
});
