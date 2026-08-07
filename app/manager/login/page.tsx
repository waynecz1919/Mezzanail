import type { Metadata } from "next";

import { ManagerLogin } from "@/components/winnie/manager-login";
import { isCompanyAccessConfigured } from "@/config/auth/company-access";
import { isGoogleAuthConfigured } from "@/lib/auth/config";

export const metadata: Metadata = { title: "Sign in | Winnie AI Manager", robots: { index: false, follow: false } };

export default function ManagerLoginPage() {
  return <ManagerLogin googleConfigured={isGoogleAuthConfigured()} accessConfigured={isCompanyAccessConfigured()} />;
}
