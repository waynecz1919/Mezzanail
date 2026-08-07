import "server-only";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth/config";
import { hasPermission, isWinnieRole, type Permission, type WinnieRole } from "@/lib/auth/permissions";
import { toWinnieSession, type WinnieSession } from "@/lib/auth/session";

export async function getWinnieSession(): Promise<WinnieSession | null> {
  try {
    return toWinnieSession(await getServerSession(authOptions));
  } catch {
    return null;
  }
}

export async function requireWinnieAuth() {
  const session = await getWinnieSession();
  if (!session) redirect("/manager/login");
  return session;
}

export async function requireWinniePermission(permission: Permission) {
  const session = await requireWinnieAuth();
  if (!hasPermission(session.user.permissions, permission)) {
    redirect(`/manager/restricted?permission=${encodeURIComponent(permission)}`);
  }
  return session;
}

export async function requireWinnieRole(roles: WinnieRole | readonly WinnieRole[]) {
  const session = await requireWinnieAuth();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!isWinnieRole(session.user.role) || !allowedRoles.includes(session.user.role)) {
    redirect("/manager/restricted");
  }
  return session;
}

export async function authorizeWinnieApi(permission?: Permission) {
  const session = await getWinnieSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    } as const;
  }
  if (permission && !hasPermission(session.user.permissions, permission)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Access restricted." }, { status: 403 }),
    } as const;
  }
  return { session, response: null } as const;
}
