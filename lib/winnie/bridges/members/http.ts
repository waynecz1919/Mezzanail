import "server-only";

import { NextResponse } from "next/server";

import type { WinnieBridgeResult } from "../contracts";
import type { WinnieMember } from "./contracts";

export function memberBridgeResponse(
  result: WinnieBridgeResult<WinnieMember | readonly WinnieMember[], "member-center">,
) {
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
