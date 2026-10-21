import { redirect } from "next/navigation";
import { StaffLoginForm } from "@/components/redeem/staff-login-form";
import { getStaffSession } from "@/lib/redeem/auth";

export const dynamic = "force-dynamic";

export default async function JackpotLoginPage() {
  const session = await getStaffSession();
  if (session) redirect("/anniversary-jackpot/staff");
  return (
    <StaffLoginForm
      redirectTo="/anniversary-jackpot/staff"
      title="Anniversary Jackpot"
      subtitle="Owner, Admin & Staff Login"
    />
  );
}
