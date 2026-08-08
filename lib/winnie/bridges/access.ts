import "server-only";

import { hasPermission, type Permission } from "@/lib/auth/permissions";
import type { WinnieSession } from "@/lib/auth/session";

import type { WinnieBridgeResult, WinnieBridgeSource } from "./contracts";
import { bridgePermissionDenied, bridgeUpstreamUnavailable } from "./result";

type BridgeReadOptions<Data, Source extends WinnieBridgeSource> = Readonly<{
  session: WinnieSession;
  permission: Permission;
  source: Source;
  read: () => Promise<WinnieBridgeResult<Data, Source>>;
}>;

export async function runAuthorizedBridgeRead<
  Data,
  Source extends WinnieBridgeSource,
>({ session, permission, source, read }: BridgeReadOptions<Data, Source>) {
  if (!hasPermission(session.user.permissions, permission)) {
    return bridgePermissionDenied(source);
  }

  try {
    return await read();
  } catch {
    return bridgeUpstreamUnavailable(source);
  }
}
