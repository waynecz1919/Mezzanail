"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Award, CalendarDays, Check, ChevronDown, Clock3, Copy, Crown, Gift,
  Globe2, Home, MapPin, Menu, MessageCircle, Moon, ShieldCheck, Sparkles, Star,
  Sun, User, Users, WalletCards, X, Zap
} from "lucide-react";
import { useLanguage } from "@/components/providers";
import { HoverCard, Reveal, RippleButton } from "@/components/hyperframe/motion";
import { Locale } from "@/lib/i18n";
import { getWhatsappUrl, siteConfig } from "@/lib/site";

const benefitIcons = [CalendarDays, Gift, Crown, WalletCards, Users, Clock3];

function LanguageMenu() {
  const { locale, setLocale, localeNames } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="flex h-10 items-center gap-2 rounded-xl border border-[var(--line)] px-3 text-xs font-bold" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Change language">
        <Globe2 size={15} aria-hidden="true" /> {localeNames[locale]} <ChevronDown size={13} />
      </button>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="card absolute right-0 top-12 z-50 min-w-32 overflow-hidden p-1.5">
          {(Object.keys(localeNames) as Locale[]).map((item) => <button key={item} onClick={() => { setLocale(item); setOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-bold ${locale === item ? "bg-[var(--surface)] gold-text" : "hover:bg-[var(--surface)]"}`}>{item === "en" ? "English" : item === "zh" ? "简体中文" : "Bahasa Melayu"}</button>)}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return <button className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)]" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle colour mode">{resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>;
}

function Navigation() {
  const { dict } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="glass fixed inset-x-0 top-0 z-40 border-x-0 border-t-0">
      <div className="shell flex h-18 items-center justify-between">
        <Link href="#top" className="flex items-center gap-3" aria-label={`${siteConfig.brandName} Rewards home`}><Image src={siteConfig.logoPath} alt={`${siteConfig.brandName} official logo`} width={3456} height={1152} className="official-wordmark h-auto w-[118px] object-contain sm:w-[142px]"/><span className="hidden text-xs font-extrabold tracking-[.14em] md:inline">REWARDS</span></Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          <a className="nav-link" href="#benefits">{dict.nav.benefits}</a><a className="nav-link" href="#rewards">{dict.nav.rewards}</a><a className="nav-link" href="#birthday">{dict.nav.birthday}</a><a className="nav-link" href="#referral">{dict.nav.referral}</a><a className="nav-link" href="#faq">{dict.nav.faq}</a>
        </nav>
        <div className="flex items-center gap-2"><LanguageMenu /><ThemeToggle /><Link href="/login" className="btn btn-gold hidden h-10 min-h-0 px-4 sm:inline-flex">{dict.nav.login}</Link><button className="hidden h-10 w-10 place-items-center rounded-xl border border-[var(--line)] sm:grid lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open navigation">{mobileOpen ? <X size={17} /> : <Menu size={17} />}</button></div>
      </div>
      <AnimatePresence>{mobileOpen && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="shell overflow-hidden lg:hidden"><div className="grid gap-1 pb-4 pt-1"><a href="#benefits" className="rounded-xl px-3 py-3 text-sm" onClick={() => setMobileOpen(false)}>{dict.nav.benefits}</a><a href="#rewards" className="rounded-xl px-3 py-3 text-sm" onClick={() => setMobileOpen(false)}>{dict.nav.rewards}</a><a href="#birthday" className="rounded-xl px-3 py-3 text-sm" onClick={() => setMobileOpen(false)}>{dict.nav.birthday}</a><a href="#faq" className="rounded-xl px-3 py-3 text-sm" onClick={() => setMobileOpen(false)}>{dict.nav.faq}</a><Link href="/login" className="rounded-xl px-3 py-3 text-sm font-bold gold-text">{dict.nav.login}</Link></div></motion.nav>}</AnimatePresence>
    </header>
  );
}

function MemberCard() {
  const { dict } = useLanguage();
  return (
    <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .65 }} className="relative aspect-[1.58/1] overflow-hidden rounded-[20px] bg-[#080808] p-7 text-white shadow-2xl sm:p-9">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#c8a96b]/30" /><div className="absolute -right-7 -top-10 h-40 w-40 rounded-full border border-[#c8a96b]/18" />
      <div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><div><div className="text-[10px] font-bold tracking-[.2em] text-[#c8a96b]">{dict.card.label}</div><div className="mt-2 text-xl font-medium tracking-tight">{dict.card.tier}</div></div><div className="flex items-center gap-1.5 rounded-full border border-[#c8a96b]/45 px-3 py-1.5 text-[9px] font-bold tracking-[.12em] text-[#ddc17e]"><Crown size={12} /> VIP</div></div><div><div className="numbers text-4xl font-light tracking-tight">{dict.card.points}</div><div className="mt-1 text-[9px] font-bold tracking-[.18em] text-white/48">{dict.card.pointsLabel}</div><div className="mt-5 flex items-center justify-between text-[10px] text-white/52"><span>{dict.card.member}</span><span className="flex items-center gap-1.5 text-[#d8ba75]"><span className="h-1.5 w-1.5 rounded-full bg-[#d8ba75]" />{dict.card.status}</span></div></div></div>
    </motion.div>
  );
}

function Hero() {
  const { dict } = useLanguage();
  return (
    <section id="top" className="relative overflow-hidden pt-18"><div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(200,169,107,.13),transparent_30%)]" />
      <div className="shell relative grid min-h-[760px] items-center gap-14 py-24 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div className="min-w-0" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, ease: [0.22,1,0.36,1] }}><div className="eyebrow">{dict.hero.eyebrow}</div><h1 className="display mt-7 max-w-3xl">{dict.hero.title}</h1><p className="lead mt-8 max-w-2xl">{dict.hero.body}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/login" className="btn btn-gold">{dict.hero.primary}<ArrowRight size={16} /></Link><a href="#benefits" className="btn btn-ghost">{dict.hero.secondary}</a></div><div className="mt-8 flex items-center gap-2 text-xs text-[var(--muted)]"><ShieldCheck size={15} className="gold-text" />{dict.hero.note}</div></motion.div>
        <div className="mx-auto w-full max-w-xl"><MemberCard /></div>
      </div>
    </section>
  );
}

function Stats() {
  const { dict } = useLanguage();
  const data = [["3,200+", dict.stats.members], ["18K", dict.stats.rewards], ["4.9/5", dict.stats.rating], ["92%", dict.stats.retention]];
  return <section className="border-y border-[var(--line)]"><div className="shell grid grid-cols-2 divide-x divide-y divide-[var(--line)] md:grid-cols-4 md:divide-y-0">{data.map(([value,label]) => <div key={label} className="px-5 py-8 text-center"><div className="numbers text-3xl font-light tracking-tight sm:text-4xl">{value}</div><div className="mt-2 text-[11px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">{label}</div></div>)}</div></section>;
}

function Benefits() {
  const { dict } = useLanguage();
  return <section id="benefits" className="section surface"><div className="shell"><Reveal><div className="eyebrow">{dict.benefits.eyebrow}</div><div className="mt-5 grid gap-6 lg:grid-cols-2"><h2 className="h2">{dict.benefits.title}</h2><p className="lead max-w-xl lg:justify-self-end">{dict.benefits.body}</p></div></Reveal><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{dict.benefits.items.map(([title,body],i) => {const Icon=benefitIcons[i];return <HoverCard key={title} className="card min-h-56 p-7"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)] gold-text"><Icon size={20}/></div><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p></HoverCard>})}</div></div></section>;
}

function Rewards() {
  const { dict } = useLanguage();
  return <section id="rewards" className="section"><div className="shell"><Reveal className="max-w-3xl"><div className="eyebrow">{dict.rewards.eyebrow}</div><h2 className="h2 mt-5">{dict.rewards.title}</h2><p className="lead mt-6">{dict.rewards.body}</p></Reveal><div className="mt-12 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[20px] bg-[#070707] p-8 text-white"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.13em] text-white/55">{dict.rewards.available}</span><Award className="text-[#c8a96b]" size={22}/></div><div className="numbers mt-20 text-6xl font-light">2,480</div><div className="mt-3 text-xs text-white/52">{dict.card.pointsLabel}</div><div className="mt-12 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: .9 }} className="h-full rounded-full bg-[#c8a96b]" /></div></div><div className="grid gap-4">{dict.rewards.cards.map(([title,points,cta]) => <HoverCard key={title} className="card flex items-center gap-4 p-5"><div className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[var(--surface)]"><Gift size={20} className="gold-text"/></div><div className="min-w-0 flex-1"><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs text-[var(--muted)]">{points}</p></div><button className="rounded-xl border border-[var(--line)] px-4 py-2 text-xs font-bold">{cta}</button></HoverCard>)}</div></div></div></section>;
}

function Timeline() {
  const { dict } = useLanguage();
  return <section className="section surface"><div className="shell"><Reveal><div className="eyebrow">{dict.timeline.eyebrow}</div><h2 className="h2 mt-5">{dict.timeline.title}</h2></Reveal><div className="mt-14 grid gap-0 md:grid-cols-4">{dict.timeline.steps.map(([number,title,body],i) => <Reveal key={number} delay={i*.08} className="relative border-l border-[var(--line)] px-7 py-5 first:border-l-0 md:min-h-52"><div className="numbers text-sm font-bold gold-text">{number}</div><h3 className="mt-12 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{body}</p></Reveal>)}</div></div></section>;
}

function EditorialOffers() {
  const { dict } = useLanguage();
  return <section id="birthday" className="section"><div className="shell grid gap-5 lg:grid-cols-2"><Reveal className="relative min-h-[490px] overflow-hidden rounded-[20px] bg-[#080808] p-9 text-white sm:p-12"><div className="absolute -right-20 bottom-0 text-[340px] font-light leading-none text-white/[.035]">7</div><div className="relative flex h-full flex-col"><div className="eyebrow">{dict.birthday.eyebrow}</div><h2 className="mt-8 max-w-lg text-4xl font-light leading-tight tracking-[-.04em] sm:text-5xl">{dict.birthday.title}</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/60">{dict.birthday.body}</p><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#d7b873]">{dict.birthday.cta}<ArrowRight size={16}/></a></div></Reveal><Reveal delay={.1} className="flex min-h-[490px] flex-col rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-9 sm:p-12"><div className="eyebrow">{dict.monthly.eyebrow}</div><div className="mt-10 grid h-14 w-14 place-items-center rounded-[18px] bg-[var(--bg)] shadow-sm"><Sparkles className="gold-text" size={23}/></div><h2 className="mt-8 text-4xl font-light tracking-[-.04em]">{dict.monthly.title}</h2><div className="mt-auto border-t border-[var(--line)] pt-7"><h3 className="text-xl font-bold">{dict.monthly.offer}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{dict.monthly.detail}</p><div className="mt-6 flex flex-wrap items-center justify-between gap-4"><span className="text-xs text-[var(--muted)]">{dict.monthly.terms}</span><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">{dict.monthly.cta}</a></div></div></Reveal></div></section>;
}

function Referral() {
  const { dict } = useLanguage();
  const [copied,setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText("https://rewards.mezzanail.com/join?ref=member"); setCopied(true); setTimeout(()=>setCopied(false),1800); };
  return <section id="referral" className="section surface"><div className="shell"><Reveal className="grid items-center gap-12 lg:grid-cols-2"><div><div className="eyebrow">{dict.referral.eyebrow}</div><h2 className="h2 mt-5">{dict.referral.title}</h2><p className="lead mt-6 max-w-xl">{dict.referral.body}</p><RippleButton className="btn btn-dark mt-8" onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? dict.referral.copied : dict.referral.cta}</RippleButton></div><div className="card relative min-h-80 overflow-hidden p-9"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,169,107,.22),transparent_36%)]"/><div className="relative"><Users size={30} className="gold-text"/><div className="mt-20 text-[11px] font-bold tracking-[.16em] text-[var(--muted)]">MEMBER REFERRAL</div><div className="mt-3 flex items-end justify-between"><div><div className="numbers text-5xl font-light">RM25</div><div className="mt-2 text-xs text-[var(--muted)]">REWARD CREDIT EACH</div></div><Zap className="gold-text" size={28}/></div></div></div></Reveal></div></section>;
}

function Testimonials() {
  const { dict } = useLanguage();
  return <section className="section"><div className="shell"><Reveal><div className="eyebrow">{dict.testimonials.eyebrow}</div><h2 className="h2 mt-5 max-w-4xl">{dict.testimonials.title}</h2></Reveal><div className="mt-12 grid gap-4 lg:grid-cols-3">{dict.testimonials.cards.map(([quote,name,tier])=><HoverCard key={name} className="card p-7"><div className="flex gap-1 text-[#c8a96b]" aria-label="5 out of 5 stars">{[0,1,2,3,4].map(i=><Star key={i} size={14} fill="currentColor"/>)}</div><blockquote className="mt-8 min-h-24 text-lg leading-8">“{quote}”</blockquote><div className="mt-8 border-t border-[var(--line)] pt-5"><div className="text-sm font-bold">{name}</div><div className="mt-1 text-xs text-[var(--muted)]">{tier}</div></div></HoverCard>)}</div></div></section>;
}

function FAQ() {
  const { dict } = useLanguage();
  const [open,setOpen] = useState(0);
  return <section id="faq" className="section surface"><div className="shell grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><Reveal><div className="eyebrow">{dict.faq.eyebrow}</div><h2 className="h2 mt-5">{dict.faq.title}</h2></Reveal><div>{dict.faq.items.map(([question,answer],i)=><div key={question} className="border-b border-[var(--line)]"><button className="flex w-full items-center justify-between gap-5 py-6 text-left font-bold" onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}>{question}<motion.span animate={{rotate:open===i?180:0}}><ChevronDown size={18}/></motion.span></button><AnimatePresence initial={false}>{open===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><p className="max-w-2xl pb-6 text-sm leading-7 text-[var(--muted)]">{answer}</p></motion.div>}</AnimatePresence></div>)}</div></div></section>;
}

function FinalCTA() {
  const { dict, locale } = useLanguage();
  return <section id="contact" className="section"><div className="shell"><Reveal className="overflow-hidden rounded-[20px] bg-[#070707] px-7 py-16 text-center text-white sm:px-14 sm:py-24"><div className="eyebrow">{dict.cta.eyebrow}</div><h2 className="mx-auto mt-6 max-w-4xl text-4xl font-light leading-tight tracking-[-.045em] sm:text-6xl">{dict.cta.title}</h2><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login" className="btn btn-gold">{dict.cta.primary}<ArrowRight size={16}/></Link><a href={getWhatsappUrl(locale)} className="btn border-white/20 bg-white/5 text-white" target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/>{dict.cta.secondary}</a></div></Reveal></div></section>;
}

function Footer() {
  const { dict, locale } = useLanguage();
  return <footer className="border-t border-[var(--line)] pb-26 pt-14 md:pb-10"><div className="shell grid gap-10 md:grid-cols-2 lg:grid-cols-4"><div className="lg:col-span-2"><div className="flex items-center gap-3"><Image src={siteConfig.logoPath} alt={`${siteConfig.brandName} official logo`} width={3456} height={1152} className="official-wordmark h-auto w-[190px] object-contain"/><span className="text-xs font-extrabold tracking-[.14em]">REWARDS</span></div><p className="mt-5 max-w-sm text-sm leading-6 text-[var(--muted)]">{dict.footer.statement}</p></div><div><div className="text-xs font-bold uppercase tracking-[.15em]">{dict.footer.platform}</div><div className="mt-5 grid gap-3 text-sm text-[var(--muted)]"><a href="#rewards">{dict.nav.rewards}</a><a href="#benefits">{dict.nav.benefits}</a><Link href="/login">{dict.nav.login}</Link></div></div><div><div className="text-xs font-bold uppercase tracking-[.15em]">{dict.footer.support}</div><div className="mt-5 grid gap-3 text-sm text-[var(--muted)]"><a href={getWhatsappUrl(locale)} target="_blank" rel="noopener noreferrer">{dict.footer.contact}</a><a href={siteConfig.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">{dict.footer.location}</a><Link href="/contact">{dict.footer.legal}</Link><Link href="/contact">{dict.footer.terms}</Link></div></div></div><div className="shell mt-12 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">© 2026 {siteConfig.brandName}. All rights reserved.</div></footer>;
}

function MobileNav() {
  const { dict, locale } = useLanguage();
  return <nav aria-label="Mobile navigation" className="glass fixed inset-x-3 bottom-3 z-50 grid h-16 grid-cols-4 rounded-[20px] px-2 md:hidden"><a href="#top" className="flex flex-col items-center justify-center gap-1 text-[10px]"><Home size={18}/>{dict.mobile.home}</a><a href="#rewards" className="flex flex-col items-center justify-center gap-1 text-[10px]"><Gift size={18}/>{dict.mobile.rewards}</a><Link href="/login" className="flex flex-col items-center justify-center gap-1 text-[10px]"><User size={18}/>{dict.mobile.member}</Link><a href={getWhatsappUrl(locale)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 text-[10px]"><MessageCircle size={18}/>{dict.mobile.contact}</a></nav>;
}

export function RewardsSite() { return <><Navigation/><main><Hero/><Stats/><Benefits/><Rewards/><Timeline/><EditorialOffers/><Referral/><Testimonials/><FAQ/><FinalCTA/></main><Footer/><MobileNav/></>; }
