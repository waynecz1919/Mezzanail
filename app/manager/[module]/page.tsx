import { notFound } from "next/navigation";

import { AppointmentReadModule } from "@/components/winnie/appointment-read-module";
import { ManagerShell } from "@/components/winnie/manager-shell";
import { ModulePlaceholder } from "@/components/winnie/module-placeholder";
import { winnieNavigationItems } from "@/config/winnie-navigation";
import { requireWinniePermission } from "@/lib/auth/guards";
import { getTodayAppointmentsForWinnie } from "@/lib/winnie/bridges";

type ModulePageProps = { params: Promise<{ module: string }> };

export default async function ManagerModulePage({ params }: ModulePageProps) {
  const { module } = await params;
  const item = winnieNavigationItems.find((candidate) => candidate.id === module && candidate.id !== "dashboard");
  if (!item) notFound();
  const session = await requireWinniePermission(item.permission);
  if (module === "appointments") {
    const result = await getTodayAppointmentsForWinnie(session);
    return <ManagerShell user={session.user}><AppointmentReadModule result={result} /></ManagerShell>;
  }
  return <ManagerShell user={session.user}><ModulePlaceholder item={item} user={session.user} /></ManagerShell>;
}
