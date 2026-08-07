import "server-only";

import type { WinnieRole } from "@/lib/auth/permissions";

/**
 * Initial company access is intentionally centralized here so the first OAuth
 * smoke test cannot drift between route guards and UI components. This list is
 * a temporary code-owned allowlist; it can later be replaced by an admin- or
 * database-managed source without changing the authentication callbacks.
 */
const DEFAULT_ROLE: WinnieRole = "STAFF";

export const companyUsers = {
  ADMIN: [
    "joannlau8@gmail.com",
    "waynecz1919@gmail.com",
    "winnielau48@gmail.com",
  ],
  STAFF: [
    "joyilovesungmin@gmail.com",
    "tanziling517@gmail.com",
  ],
  COUNTER: [
    "mezzanailstudio@gmail.com",
  ],
} as const;

const initialRoleByEmail = Object.fromEntries([
  ...companyUsers.ADMIN.map((email) => [email, "ADMIN"]),
  ...companyUsers.STAFF.map((email) => [email, "STAFF"]),
  ...companyUsers.COUNTER.map((email) => [email, "COUNTER"]),
]) as Record<string, WinnieRole>;

function listFromEnv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function roleMapFromEnv(value: string | undefined) {
  if (!value) return {} as Record<string, WinnieRole>;
  try {
    const parsed = JSON.parse(value) as Record<string, string>;
    const entries = Object.entries(parsed).map(
      ([email, role]) => [email.trim().toLowerCase(), role.toUpperCase()] as const,
    );
    return Object.fromEntries(
      entries.filter((entry) => ["ADMIN", "MANAGER", "STAFF", "COUNTER"].includes(entry[1])),
    ) as Record<string, WinnieRole>;
  } catch {
    return {} as Record<string, WinnieRole>;
  }
}

const environmentRoleByEmail = roleMapFromEnv(process.env.WINNIE_AUTH_ROLE_MAP_JSON);
const configuredEmails = listFromEnv(process.env.WINNIE_AUTH_ALLOWED_EMAILS);

export const companyAccessConfig = {
  // Keep domains available for the future externalized configuration, but use
  // exact email matching during the initial six-account activation.
  allowedDomains: listFromEnv(process.env.WINNIE_AUTH_ALLOWED_DOMAINS),
  allowedEmails: Array.from(new Set([
    ...Object.keys(initialRoleByEmail),
    ...configuredEmails,
    ...Object.keys(environmentRoleByEmail),
  ])),
  roleByEmail: { ...initialRoleByEmail, ...environmentRoleByEmail },
} as const;

export function isCompanyAccessConfigured() {
  return companyAccessConfig.allowedEmails.length > 0;
}

export function isCompanyAccountAllowed(email: string | null | undefined) {
  if (!email || !isCompanyAccessConfigured()) return false;
  const normalized = email.trim().toLowerCase();
  return companyAccessConfig.allowedEmails.includes(normalized);
}

export function roleForCompanyAccount(email: string | null | undefined): WinnieRole {
  if (!email) return DEFAULT_ROLE;
  return companyAccessConfig.roleByEmail[email.trim().toLowerCase()] ?? DEFAULT_ROLE;
}
