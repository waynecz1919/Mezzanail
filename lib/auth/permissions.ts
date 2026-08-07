export type WinnieRole = "ADMIN" | "MANAGER" | "STAFF" | "COUNTER";

export type Permission =
  | "dashboard.view"
  | "voice_notes.view"
  | "tasks.view"
  | "winnie_ai.basic"
  | "customer_tasks.view"
  | "customer_profile.view"
  | "appointments.view"
  | "appointments.manage"
  | "appointments.delete"
  | "member_credit.view"
  | "member_credit.manage"
  | "member_credit.adjust"
  | "member_credit.transfer"
  | "member_credit.family_sharing"
  | "member_credit.delete_transaction"
  | "family_sharing.approve"
  | "whatsapp.view"
  | "whatsapp.send"
  | "whatsapp.customer_service"
  | "whatsapp.broadcast"
  | "team_hub.view"
  | "team_hub.manage"
  | "inventory.view"
  | "inventory.manage"
  | "finance.view"
  | "finance.manage"
  | "reminders.view"
  | "reminders.manage"
  | "settings.manage"
  | "roles.manage"
  | "permissions.manage"
  | "audit.manage";

export const allPermissions = [
  "dashboard.view",
  "voice_notes.view",
  "tasks.view",
  "winnie_ai.basic",
  "customer_tasks.view",
  "customer_profile.view",
  "appointments.view",
  "appointments.manage",
  "appointments.delete",
  "member_credit.view",
  "member_credit.manage",
  "member_credit.adjust",
  "member_credit.transfer",
  "member_credit.family_sharing",
  "member_credit.delete_transaction",
  "family_sharing.approve",
  "whatsapp.view",
  "whatsapp.send",
  "whatsapp.customer_service",
  "whatsapp.broadcast",
  "team_hub.view",
  "team_hub.manage",
  "inventory.view",
  "inventory.manage",
  "finance.view",
  "finance.manage",
  "reminders.view",
  "reminders.manage",
  "settings.manage",
  "roles.manage",
  "permissions.manage",
  "audit.manage",
] as const satisfies readonly Permission[];

export const rolePermissions: Record<WinnieRole, readonly Permission[]> = {
  ADMIN: allPermissions,
  MANAGER: [
    "dashboard.view",
    "winnie_ai.basic",
    "appointments.view",
    "appointments.manage",
    "member_credit.view",
    "whatsapp.view",
    "whatsapp.send",
    "team_hub.view",
    "customer_tasks.view",
    "customer_profile.view",
    "inventory.view",
  ],
  STAFF: [
    "dashboard.view",
    "winnie_ai.basic",
    "voice_notes.view",
    "tasks.view",
    "customer_tasks.view",
    "appointments.view",
    "team_hub.view",
  ],
  COUNTER: [
    "dashboard.view",
    "winnie_ai.basic",
    "appointments.view",
    "appointments.manage",
    "customer_profile.view",
    "member_credit.view",
    "team_hub.view",
    "reminders.view",
    "reminders.manage",
    "whatsapp.customer_service",
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
  return value === "ADMIN" || value === "MANAGER" || value === "STAFF" || value === "COUNTER";
}

export function roleLabel(role: WinnieRole) {
  return role === "ADMIN" ? "Administrator" : role === "MANAGER" ? "Manager" : role === "COUNTER" ? "Counter" : "Staff";
}
