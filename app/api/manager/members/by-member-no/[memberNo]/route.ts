import { authorizeWinnieApi } from "@/lib/auth/guards";
import { getMemberByMemberNoForWinnie } from "@/lib/winnie/bridges";
import { memberBridgeResponse } from "@/lib/winnie/bridges/members/http";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ memberNo: string }> },
) {
  const access = await authorizeWinnieApi("customer_profile.view");
  if (!access.session) return access.response;
  const { memberNo } = await context.params;
  return memberBridgeResponse(await getMemberByMemberNoForWinnie(access.session, memberNo));
}
