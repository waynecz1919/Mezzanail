const REDEEM_CODE_PATTERN = /^MN-[A-Z0-9]{2,8}-[A-Z0-9]{4}$/;

const voucherPrefixes: Record<string, string> = {
  "wake up": "WAKE",
  birthday: "BDAY",
  loyalty: "LOYAL",
  "service recovery": "CARE",
  gift: "GIFT",
};

export function codePrefix(voucherType: string) {
  const normalized = voucherType.trim().toLowerCase();
  const mapped = voucherPrefixes[normalized];
  if (mapped) return mapped;
  const compact = voucherType.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (compact || "VCHR").slice(0, 8).padEnd(2, "X");
}

export function normalizeRedeemCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function isRedeemCode(value: string) {
  return REDEEM_CODE_PATTERN.test(normalizeRedeemCode(value));
}

export function normalizeWhatsAppPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `60${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppMessage(input: {
  customerName: string;
  voucherDescription: string;
  redeemCode: string;
  expiryDate: string;
}) {
  const name = input.customerName.trim();
  return [
    `Hi ${name}, this is your exclusive Mezzanail Redeem Voucher.`,
    "",
    `Voucher: ${input.voucherDescription.trim()}.`,
    "",
    `Redeem Code: ${normalizeRedeemCode(input.redeemCode)}.`,
    "",
    `Valid until: ${input.expiryDate}.`,
    "",
    "Please show this code to our staff when you visit Mezzanail.",
    "",
    "*Term & Conditions Apply",
    "",
    "Thank you.",
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}
