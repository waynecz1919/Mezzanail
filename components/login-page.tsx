"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/providers";
import { LanguageMenuPlaceholder, ThemeTogglePlaceholder } from "./login-tools";
import { RippleButton } from "@/components/hyperframe/motion";
import { siteConfig } from "@/lib/site";

export function LoginPage() {
  const { dict } = useLanguage();
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#070707] p-12 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3"><Image src={siteConfig.logoPath} alt={`${siteConfig.brandName} official logo`} width={3456} height={1152} className="h-auto w-[190px] object-contain"/><span className="text-xs font-extrabold tracking-[.14em]">REWARDS</span></div>
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full border border-[#c8a96b]/20" /><div className="absolute -right-4 top-48 h-56 w-56 rounded-full border border-[#c8a96b]/12" />
        <div className="relative mt-auto max-w-xl pb-14"><div className="text-[11px] font-bold tracking-[.18em] text-[#c8a96b]">PRIVATE MEMBER ACCESS</div><h1 className="mt-7 text-6xl font-light leading-[1.04] tracking-[-.055em]">Every privilege.<br/>One considered space.</h1><div className="mt-10 flex items-center gap-2 text-xs text-white/55"><ShieldCheck size={16} className="text-[#c8a96b]"/>Protected member experience</div></div>
      </section>
      <section className="flex min-h-screen flex-col bg-[var(--bg)] p-5 sm:p-10 lg:p-14">
        <header className="flex items-center justify-between"><Link href="/" className="flex items-center gap-2 text-xs font-bold"><ArrowLeft size={15}/>{dict.login.back}</Link><div className="flex gap-2"><LanguageMenuPlaceholder/><ThemeTogglePlaceholder/></div></header>
        <div className="mx-auto my-auto w-full max-w-md py-16"><div className="eyebrow">{dict.login.eyebrow}</div><h1 className="mt-5 text-5xl font-light tracking-[-.05em]">{dict.login.title}</h1><p className="mt-5 text-sm leading-7 text-[var(--muted)]">{dict.login.body}</p>
          <form className="mt-10 grid gap-5" onSubmit={(e)=>e.preventDefault()}><label className="grid gap-2 text-xs font-bold"><span>{dict.login.email}</span><span className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"/><input type="email" autoComplete="email" required className="h-14 w-full rounded-2xl border border-[var(--line)] bg-transparent pl-11 pr-4 outline-none transition focus:border-[var(--gold)]"/></span></label><label className="grid gap-2 text-xs font-bold"><span>{dict.login.password}</span><span className="relative"><LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"/><input type="password" autoComplete="current-password" required className="h-14 w-full rounded-2xl border border-[var(--line)] bg-transparent pl-11 pr-4 outline-none transition focus:border-[var(--gold)]"/></span></label><div className="text-right"><button type="button" className="text-xs font-bold gold-text">{dict.login.forgot}</button></div><RippleButton type="submit" className="btn btn-gold w-full">{dict.login.submit}<ArrowRight size={16}/></RippleButton></form>
          <div className="mt-8 border-t border-[var(--line)] pt-7 text-center text-sm text-[var(--muted)]">{dict.login.new} <Link href="/#contact" className="font-bold text-[var(--ink)]">{dict.login.join}</Link></div><div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[var(--muted)]"><ShieldCheck size={14} className="gold-text"/>{dict.login.secure}</div>
        </div>
      </section>
    </main>
  );
}
