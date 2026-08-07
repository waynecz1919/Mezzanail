import "server-only";

import type { WinnieRole } from "@/lib/auth/permissions";

/**
 * Company access is intentionally empty by default. Production owners must
 * configure these values as server-only environment variables before enabling
 * Google sign-in; no real account is committed to the repository.
 */
const DEFAULT_ROLE: WinnieRole = "STAFF";

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
      entries.filter((entry) => ["ADMIN", "MANAGER", "STAFF"].includes(entry[1])),
    ) as Record<string, WinnieRole>;
  } catch {
    return {} as Record<string, WinnieRole>;
  }
}

export const companyAccessConfig = {
  allowedDomains: listFromEnv(process.env.WINNIE_AUTH_ALLOWED_DOMAINS),
  allowedEmails: listFromEnv(process.env.WINNIE_AUTH_ALLOWED_EMAILS),
  roleByEmail: roleMapFromEnv(process.env.WINNIE_AUTH_ROLE_MAP_JSON),
} as const;

export function isCompanyAccessConfigured() {
  return companyAccessConfig.allowedDomains.length > 0 ||
    companyAccessConfig.allowedEmails.length > 0 ||
    Object.keys(companyAccessConfig.roleByEmail).length > 0;
}

export function isCompanyAccountAllowed(email: string | null | undefined) {
  if (!email || !isCompanyAccessConfigured()) return false;
  const normalized = email.trim().toLowerCase();
  const domain = normalized.split("@")[1] ?? "";
  const mappedEmails = Object.keys(companyAccessConfig.roleByEmail);
  return companyAccessConfig.allowedEmails.includes(normalized) ||
    mappedEmails.includes(normalized) ||
    companyAccessConfig.allowedDomains.includes(domain);
}

export function roleForCompanyAccount(email: string | null | undefined): WinnieRole {
  if (!email) return DEFAULT_ROLE;
  return companyAccessConfig.roleByEmail[email.trim().toLowerCase()] ?? DEFAULT_ROLE;
}
