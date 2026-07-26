import { redirect } from "next/navigation";
import { RedeemCenter } from "@/components/redeem/redeem-center";
import { getStaffSession } from "@/lib/redeem/auth";

export const dynamic = "force-dynamic";

export default async function RedeemPage() {
  const session = await getStaffSession();
  if (!session) redirect("/redeem/login");
  return <RedeemCenter staffId={session.staffId} />;
}
