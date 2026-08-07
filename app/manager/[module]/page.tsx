import { notFound } from "next/navigation";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { ModulePlaceholder } from "@/components/winnie/module-placeholder";
import { winnieNavigationItems } from "@/config/winnie-navigation";
import { requireWinniePermission } from "@/lib/auth/guards";

type ModulePageProps = { params: Promise<{ module: string }> };

export default async function ManagerModulePage({ params }: ModulePageProps) {
  const { module } = await params;
  const item = winnieNavigationItems.find((candidate) => candidate.id === module && candidate.id !== "dashboard");
  if (!item) notFound();
  const session = await requireWinniePermission(item.permission);
  return <ManagerShell user={session.user}><ModulePlaceholder item={item} user={session.user} /></ManagerShell>;
}
