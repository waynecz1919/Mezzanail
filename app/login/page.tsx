import type { Metadata } from "next";
import { LoginPage } from "@/components/login-page";

export const metadata: Metadata = { title: "Member Sign In", robots: { index: false, follow: false } };
export default function Page(){ return <LoginPage/>; }
