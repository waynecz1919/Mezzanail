import "server-only";

import type { WinnieSession } from "@/lib/auth/session";

import { runAuthorizedBridgeRead } from "./access";
import { winnieBridgeRegistry } from "./registry";

export function getTodayAppointmentsForWinnie(session: WinnieSession) {
  return runAuthorizedBridgeRead({
    session,
    permission: "appointments.view",
    source: winnieBridgeRegistry.appointments.source,
    read: () => winnieBridgeRegistry.appointments.getTodayAppointments(),
  });
}

export function getAppointmentSummaryForWinnie(
  session: WinnieSession,
  appointmentId: string,
) {
  return runAuthorizedBridgeRead({
    session,
    permission: "appointments.view",
    source: winnieBridgeRegistry.appointments.source,
    read: () => winnieBridgeRegistry.appointments.getAppointmentSummary(appointmentId),
  });
}

export function getMemberSummaryForWinnie(
  session: WinnieSession,
  customerIdOrMemberId: string,
) {
  return runAuthorizedBridgeRead({
    session,
    permission: "member_credit.view",
    source: winnieBridgeRegistry.members.source,
    read: () => winnieBridgeRegistry.members.getMemberSummary(customerIdOrMemberId),
  });
}

export function getTeamStatusForWinnie(session: WinnieSession) {
  return runAuthorizedBridgeRead({
    session,
    permission: "team_hub.view",
    source: winnieBridgeRegistry.teamHub.source,
    read: () => winnieBridgeRegistry.teamHub.getTeamStatus(),
  });
}
