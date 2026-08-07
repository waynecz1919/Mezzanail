import type { Metadata } from "next";

import { WinnieSessionProvider } from "@/components/winnie/session-provider";

export const metadata: Metadata = {
  title: "Winnie AI Manager",
  description: "Mezzanail internal management system.",
  robots: { index: false, follow: false },
};

export default function ManagerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <WinnieSessionProvider>{children}</WinnieSessionProvider>;
}
