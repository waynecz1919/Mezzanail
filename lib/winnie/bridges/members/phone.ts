const MALAYSIAN_PHONE_PATTERN = /^60\d{8,13}$/;

/**
 * Normalizes common Malaysian phone input for lookup only.
 * It never changes the authoritative phone stored by Member Center.
 */
export function normalizeMalaysianPhone(value: string): string | null {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const hasSupportedPrefix = raw.startsWith("+")
    ? raw.startsWith("+60")
    : raw.startsWith("60") || raw.startsWith("0") || raw.startsWith("0060");
  if (!hasSupportedPrefix) return null;

  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `60${digits.slice(1)}`;
  if (!MALAYSIAN_PHONE_PATTERN.test(digits)) return null;
  return digits;
}

export function normalizeMemberSearchQuery(value: string): string {
  const query = String(value || "").trim();
  return normalizeMalaysianPhone(query) || query;
}
