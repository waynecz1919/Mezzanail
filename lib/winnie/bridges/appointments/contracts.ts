export type WinnieAppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "unknown";

export type WinnieAppointmentConfirmationStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "not_required"
  | "unknown";

export type WinnieAppointmentReminderStatus =
  | "not_due"
  | "pending"
  | "sent"
  | "failed"
  | "opted_out"
  | "unknown";

export type WinnieAppointment = Readonly<{
  id: string;
  customerId: string | null;
  customerName: string;
  startAt: string;
  endAt: string | null;
  serviceName: string;
  staffId: string | null;
  staffName: string | null;
  status: WinnieAppointmentStatus;
  confirmationStatus: WinnieAppointmentConfirmationStatus;
  reminderStatus: WinnieAppointmentReminderStatus;
}>;
