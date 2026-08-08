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
  customerId: string | number,
) {
  return runAuthorizedBridgeRead({
    session,
    permission: "customer_profile.view",
    source: winnieBridgeRegistry.members.source,
    read: () => winnieBridgeRegistry.members.getMemberSummary(customerId),
  });
}

export function searchMembersForWinnie(session: WinnieSession, query: string, limit?: number) {
  return runAuthorizedBridgeRead({
    session,
    permission: "customer_profile.view",
    source: winnieBridgeRegistry.members.source,
    read: () => winnieBridgeRegistry.members.searchMembers(query, limit),
  });
}

export function getMemberByMemberNoForWinnie(session: WinnieSession, memberNo: string) {
  return runAuthorizedBridgeRead({
    session,
    permission: "customer_profile.view",
    source: winnieBridgeRegistry.members.source,
    read: () => winnieBridgeRegistry.members.getMemberByMemberNo(memberNo),
  });
}

export function getMemberByPhoneForWinnie(session: WinnieSession, normalizedPhone: string) {
  return runAuthorizedBridgeRead({
    session,
    permission: "customer_profile.view",
    source: winnieBridgeRegistry.members.source,
    read: () => winnieBridgeRegistry.members.getMemberByPhone(normalizedPhone),
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
