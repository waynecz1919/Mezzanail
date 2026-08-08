import type { WinnieBridgeResult } from "../contracts";
import type { WinnieAppointment } from "./contracts";

export interface AppointmentBridge {
  readonly source: "appointment-system";
  getTodayAppointments(): Promise<
    WinnieBridgeResult<readonly WinnieAppointment[], "appointment-system">
  >;
  getAppointmentSummary(
    appointmentId: string,
  ): Promise<WinnieBridgeResult<WinnieAppointment, "appointment-system">>;
}
