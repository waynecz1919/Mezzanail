import type { Session } from "next-auth";

import type { Permission, WinnieRole } from "@/lib/auth/permissions";

export type WinnieUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: WinnieRole;
  permissions: Permission[];
};

export type WinnieSession = {
  user: WinnieUser;
  expires: string;
};

export function toWinnieSession(session: Session | null): WinnieSession | null {
  if (!session?.user?.email || !session.user.role || !session.user.permissions) return null;
  return {
    expires: session.expires,
    user: {
      id: session.user.id,
      name: session.user.name ?? session.user.email,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
      permissions: session.user.permissions,
    },
  };
}
