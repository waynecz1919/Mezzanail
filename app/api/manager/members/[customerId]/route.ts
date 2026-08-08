import { authorizeWinnieApi } from "@/lib/auth/guards";
import { getMemberSummaryForWinnie } from "@/lib/winnie/bridges";
import { memberBridgeResponse } from "@/lib/winnie/bridges/members/http";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ customerId: string }> },
) {
  const access = await authorizeWinnieApi("customer_profile.view");
  if (!access.session) return access.response;
  const { customerId } = await context.params;
  return memberBridgeResponse(await getMemberSummaryForWinnie(access.session, customerId));
}
