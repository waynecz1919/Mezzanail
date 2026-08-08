import { bridgeConfigurationMissing } from "../result";
import type { AppointmentBridge } from "./bridge";

export class UnconfiguredAppointmentBridge implements AppointmentBridge {
  readonly source = "appointment-system" as const;

  async getTodayAppointments() {
    return bridgeConfigurationMissing(this.source);
  }

  async getAppointmentSummary(_appointmentId: string) {
    return bridgeConfigurationMissing(this.source);
  }
}
