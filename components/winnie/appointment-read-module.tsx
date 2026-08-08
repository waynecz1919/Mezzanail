import { CalendarDays, Clock3 } from "lucide-react";

import type { WinnieBridgeResult } from "@/lib/winnie/bridges/contracts";
import type { WinnieAppointment } from "@/lib/winnie/bridges/appointments/contracts";

type AppointmentReadResult = WinnieBridgeResult<
  readonly WinnieAppointment[],
  "appointment-system"
>;

const salonTime = new Intl.DateTimeFormat("en-MY", {
  timeZone: "Asia/Kuala_Lumpur",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function label(value: string) {
  return value.replaceAll("_", " ");
}

function unavailableMessage(result: AppointmentReadResult) {
  if (result.status === "configuration_missing") return "Appointments are not connected in this environment.";
  if (result.status === "upstream_unavailable") return "Appointment data is temporarily unavailable.";
  if (result.status === "permission_denied") return "You do not have permission to view appointments.";
  return null;
}

export function AppointmentReadModule({ result }: { result: AppointmentReadResult }) {
  const unavailable = unavailableMessage(result);
  const appointments = result.status === "success" || result.status === "stale_data" ? result.data : [];

  return (
    <section className="winnie-page-card">
      <p className="winnie-page-eyebrow"><CalendarDays aria-hidden="true" className="mr-2 inline h-4 w-4" />Read-only connection</p>
      <h1>Today&apos;s Appointments</h1>
      <p>Live salon appointments from the Appointment System. Changes remain available only in the source system.</p>

      {unavailable ? (
        <div className="mt-6 rounded-2xl border border-[#e8e5f1] bg-[#faf9fc] p-5">
          <p className="font-semibold text-[#27324a]">{unavailable}</p>
          <p className="mt-1 text-sm text-[#69758b]">No appointment data has been fabricated or cached for display.</p>
        </div>
      ) : result.status === "no_data" ? (
        <div className="mt-6 rounded-2xl border border-[#dceee9] bg-[#f5fbf9] p-5">
          <p className="font-semibold text-[#27324a]">No appointments today</p>
          <p className="mt-1 text-sm text-[#69758b]">The connection succeeded and returned an empty day.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {result.status === "stale_data" && (
            <p className="rounded-xl border border-[#f0dcb8] bg-[#fffaf0] px-4 py-3 text-sm text-[#7f6535]">The available appointment data may be out of date.</p>
          )}
          {appointments.map((appointment) => (
            <article key={appointment.id} className="rounded-2xl border border-[#e8e5f1] bg-white p-4 shadow-[0_10px_28px_rgba(54,61,89,0.06)]">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#6558a6]"><Clock3 aria-hidden="true" className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#27324a]">{salonTime.format(new Date(appointment.startAt))} · {appointment.customerName || "Customer name unavailable"}</p>
                    <p className="mt-1 text-sm text-[#69758b]">{appointment.serviceName || "Service unavailable"}</p>
                    <p className="mt-1 text-xs text-[#8a94a8]">Staff: {appointment.staffName || appointment.staffId || "Not assigned"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold capitalize">
                  <span className="rounded-full bg-[#eef5ff] px-3 py-1.5 text-[#42658f]">{label(appointment.status)}</span>
                  <span className="rounded-full bg-[#f6f1ff] px-3 py-1.5 text-[#6558a6]">Reminder: {label(appointment.reminderStatus)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-[#8a94a8]">Source: Appointment System · Salon timezone: Asia/Kuala_Lumpur · Fetched: {result.fetchedAt}</p>
    </section>
  );
}
