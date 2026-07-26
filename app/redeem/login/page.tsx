import { redirect } from "next/navigation";
import { StaffLoginForm } from "@/components/redeem/staff-login-form";
import { getStaffSession } from "@/lib/redeem/auth";

export const dynamic = "force-dynamic";

export default async function RedeemLoginPage() {
  const session = await getStaffSession();
  if (session) redirect("/redeem");
  return <StaffLoginForm />;
}
