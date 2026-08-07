import type { DefaultSession } from "next-auth";
import type { Permission, WinnieRole } from "@/lib/auth/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: WinnieRole;
      permissions: Permission[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: WinnieRole;
    permissions?: Permission[];
  }
}
