import "server-only";

import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

import {
  isCompanyAccountAllowed,
  roleForCompanyAccount,
} from "@/config/auth/company-access";
import {
  isWinnieRole,
  permissionsForRole,
  type WinnieRole,
} from "@/lib/auth/permissions";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export function isGoogleAuthConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET);
}

const googleProvider = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
  ? GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
  : null;

export const authOptions: NextAuthOptions = {
  providers: googleProvider ? [googleProvider] : [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/manager/login",
    error: "/manager/login",
  },
  callbacks: {
    async signIn({ user }) {
      return isCompanyAccountAllowed(user.email);
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (email) {
        const role = roleForCompanyAccount(email);
        token.id = user?.id ?? token.sub ?? email;
        token.role = role;
        token.permissions = permissionsForRole(role);
      }
      return token;
    },
    async session({ session, token }) {
      const role: WinnieRole = isWinnieRole(token.role) ? token.role : "STAFF";
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = role;
        session.user.permissions = permissionsForRole(role);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Fall through to the safe internal destination.
      }
      return `${baseUrl}/manager`;
    },
  },
};
