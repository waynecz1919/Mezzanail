import { authorizeWinnieApi } from "@/lib/auth/guards";
import { searchMembersForWinnie } from "@/lib/winnie/bridges";
import { memberBridgeResponse } from "@/lib/winnie/bridges/members/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await authorizeWinnieApi("customer_profile.view");
  if (!access.session) return access.response;

  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const rawLimit = url.searchParams.get("limit");
  const limit = rawLimit === null ? undefined : Number(rawLimit);
  return memberBridgeResponse(await searchMembersForWinnie(access.session, query, limit));
}
