import "server-only";

import { randomBytes } from "node:crypto";
import { codePrefix } from "@/lib/redeem/core";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCodeSuffix() {
  const bytes = randomBytes(4);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function createRedeemCode(voucherType: string) {
  return `MN-${codePrefix(voucherType)}-${randomCodeSuffix()}`;
}
