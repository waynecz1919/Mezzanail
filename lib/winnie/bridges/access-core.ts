type AuthorizedBridgeReadOptions<PermissionName extends string, Result> = Readonly<{
  permissions: readonly PermissionName[];
  permission: PermissionName;
  read: () => Promise<Result>;
  permissionDenied: () => Result;
  upstreamUnavailable: () => Result;
}>;

export async function runBridgeReadWithPermissions<PermissionName extends string, Result>({
  permissions,
  permission,
  read,
  permissionDenied,
  upstreamUnavailable,
}: AuthorizedBridgeReadOptions<PermissionName, Result>) {
  if (!permissions.includes(permission)) return permissionDenied();
  try {
    return await read();
  } catch {
    return upstreamUnavailable();
  }
}
