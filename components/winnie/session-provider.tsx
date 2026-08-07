"use client";

import { SessionProvider } from "next-auth/react";

export function WinnieSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus refetchInterval={15 * 60}>
      {children}
    </SessionProvider>
  );
}
