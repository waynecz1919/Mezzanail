export type WinnieRole = "ADMIN" | "MANAGER" | "STAFF";

export type Permission =
  | "dashboard.view"
  | "voice_notes.view"
  | "tasks.view"
  | "customer_tasks.view"
  | "appointments.view"
  | "appointments.manage"
  | "appointments.delete"
  | "member_credit.view"
  | "member_credit.manage"
  | "member_credit.adjust"
  | "member_credit.transfer"
  | "member_credit.family_sharing"
  | "whatsapp.view"
  | "whatsapp.send"
  | "whatsapp.broadcast"
  | "team_hub.view"
  | "team_hub.manage"
  | "inventory.view"
  | "inventory.manage"
  | "finance.view"
  | "finance.manage"
  | "settings.manage"
  | "permissions.manage";

export const allPermissions = [
  "dashboard.view",
  "voice_notes.view",
  "tasks.view",
  "customer_tasks.view",
  "appointments.view",
  "appointments.manage",
  "appointments.delete",
  "member_credit.view",
  "member_credit.manage",
  "member_credit.adjust",
  "member_credit.transfer",
  "member_credit.family_sharing",
  "whatsapp.view",
  "whatsapp.send",
  "whatsapp.broadcast",
  "team_hub.view",
  "team_hub.manage",
  "inventory.view",
  "inventory.manage",
  "finance.view",
  "finance.manage",
  "settings.manage",
  "permissions.manage",
] as const satisfies readonly Permission[];

export const rolePermissions: Record<WinnieRole, readonly Permission[]> = {
  ADMIN: allPermissions,
  MANAGER: [
    "dashboard.view",
    "appointments.view",
    "appointments.manage",
    "member_credit.view",
    "whatsapp.view",
    "whatsapp.send",
    "team_hub.view",
    "customer_tasks.view",
    "inventory.view",
  ],
  STAFF: [
    "dashboard.view",
    "voice_notes.view",
    "tasks.view",
    "customer_tasks.view",
    "appointments.view",
    "team_hub.view",
  ],
};

export function permissionsForRole(role: WinnieRole) {
  return [...rolePermissions[role]];
}

export function hasPermission(
  permissions: readonly Permission[] | null | undefined,
  permission: Permission,
) {
  return Boolean(permissions?.includes(permission));
}

export function isWinnieRole(value: unknown): value is WinnieRole {
  return value === "ADMIN" || value === "MANAGER" || value === "STAFF";
}

export function roleLabel(role: WinnieRole) {
  return role === "ADMIN" ? "Administrator" : role === "MANAGER" ? "Manager" : "Staff";
}
