import "server-only";

import type { Permission } from "@/lib/auth/permissions";
import type { WinnieSession } from "@/lib/auth/session";

import { runBridgeReadWithPermissions } from "./access-core";
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
  return runBridgeReadWithPermissions({
    permissions: session.user.permissions,
    permission,
    read,
    permissionDenied: () => bridgePermissionDenied(source),
    upstreamUnavailable: () => bridgeUpstreamUnavailable(source),
  });
}
