import { redirect } from "next/navigation";

import { ManagerShell } from "@/components/winnie/manager-shell";
import { RestrictedState } from "@/components/winnie/restricted-state";
import { getWinnieSession } from "@/lib/auth/guards";

export default async function ManagerRestrictedPage() {
  const session = await getWinnieSession();
  if (!session) redirect("/manager/login");
  return <ManagerShell user={session.user}><RestrictedState /></ManagerShell>;
}
