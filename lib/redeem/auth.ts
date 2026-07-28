import "server-only";

import { createHash, createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mn_redeem_staff_session";
const SESSION_SECONDS = 8 * 60 * 60;

export type StaffRole = "owner" | "admin" | "staff";

export type StaffSession = {
  staffId: string;
  role: StaffRole;
  issuedAt: number;
  expiresAt: number;
};

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sessionSecret() {
  const value = process.env.REDEEM_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("REDEEM_AUTH_NOT_CONFIGURED");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function createStaffSession(staffId: string, role: StaffRole = "staff") {
  const now = Math.floor(Date.now() / 1000);
  const payload: StaffSession = {
    staffId,
    role,
    issuedAt: now,
    expiresAt: now + SESSION_SECONDS,
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyStaffSession(token: string | undefined | null): StaffSession | null {
  if (!token) return null;
  const [encoded, suppliedSignature, extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra) return null;
  const expectedSignature = sign(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as StaffSession;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.staffId || payload.expiresAt <= now || payload.issuedAt > now + 60) return null;
    return {
      ...payload,
      role: ["owner", "admin", "staff"].includes(payload.role) ? payload.role : "staff",
    };
  } catch {
    return null;
  }
}

export async function getStaffSession() {
  const cookieStore = await cookies();
  return verifyStaffSession(cookieStore.get(COOKIE_NAME)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: SESSION_SECONDS,
    },
  };
}

export function expiredSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

type StaffCredential = { id: string; salt: string; hash: string; role?: StaffRole };

function configuredUsers(): StaffCredential[] {
  const raw = process.env.REDEEM_STAFF_USERS;
  if (!raw) throw new Error("REDEEM_AUTH_NOT_CONFIGURED");
  const parsed = JSON.parse(raw) as StaffCredential[];
  if (!Array.isArray(parsed)) throw new Error("REDEEM_AUTH_NOT_CONFIGURED");
  return parsed.filter((item) => item?.id && item?.salt && item?.hash);
}

export function verifyStaffCredentials(staffId: string, password: string) {
  const normalizedId = staffId.trim().toLowerCase();
  const credential = configuredUsers().find((item) => item.id.toLowerCase() === normalizedId);
  if (!credential) {
    scryptSync(password, createHash("sha256").update("unknown-user").digest(), 32);
    return null;
  }
  const calculated = scryptSync(password, Buffer.from(credential.salt, "base64url"), 32);
  const expected = Buffer.from(credential.hash, "base64url");
  if (calculated.length !== expected.length || !timingSafeEqual(calculated, expected)) return null;
  return {
    staffId: credential.id,
    role: credential.role && ["owner", "admin", "staff"].includes(credential.role)
      ? credential.role
      : "staff",
  };
}

export { COOKIE_NAME };
