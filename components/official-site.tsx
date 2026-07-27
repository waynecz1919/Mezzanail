"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, CalendarCheck, ChevronDown, ExternalLink, Facebook, Gift,
  Globe2, Home, Instagram, MapPin, Menu, MessageCircle, Phone, Sparkles, X,
} from "lucide-react";
import { Reveal } from "@/components/hyperframe/motion";
import { CurrentCampaignBanner } from "@/components/home/CurrentCampaignBanner";
import { GoogleReviewsPreview } from "@/components/home/GoogleReviewsPreview";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { SelectedNailWork } from "@/components/home/SelectedNailWork";
import { SignatureServices } from "@/components/home/SignatureServices";
import { StudioLocationBooking } from "@/components/home/StudioLocationBooking";
import { WhyMezzanail } from "@/components/home/WhyMezzanail";
import { useLanguage } from "@/components/providers";
import { ServicesCatalog } from "@/components/services-catalog";
import { primaryNavigation } from "@/config/navigation";
import type { Locale } from "@/lib/i18n";
import { officialMessages } from "@/lib/official-i18n";
import { getWhatsappUrl, isConfiguredUrl, siteConfig } from "@/lib/site";

const contactCopy = {
  en: { directions: "Get Directions", call: "Call Us", whatsapp: "WhatsApp Us", social: "Official channels", qr: "Scan to WhatsApp", xhs: "Xiaohongshu", account: "Account ID", pending: "Official profile link pending" },
  zh: { directions: "导航到店", call: "致电我们", whatsapp: "WhatsApp 联系", social: "官方平台", qr: "扫码 WhatsApp", xhs: "小红书", account: "小红书号", pending: "官方主页链接待补" },
  ms: { directions: "Dapatkan Arah", call: "Hubungi Kami", whatsapp: "WhatsApp Kami", social: "Saluran rasmi", qr: "Imbas untuk WhatsApp", xhs: "Xiaohongshu", account: "ID akaun", pending: "Pautan profil rasmi belum tersedia" },
} as const;

function trackPublicAction(event: string, destination: string, contentLabel: string) {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as Window & {
    gtag?: (...args: unknown[]) => void;
  };
  analyticsWindow.gtag?.("event", event, {
    destination,
    content_label: contentLabel,
  });
}

function useOfficial() {
  const { locale, setLocale } = useLanguage();
  return {
    locale,
    setLocale,
    t: officialMessages[locale],
  };
}

function BrandLogo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return <span className={`brand-logo ${compact ? "is-compact" : ""} ${inverse ? "is-inverse" : ""}`}>
    <span className="brand-wordmark" aria-label={siteConfig.brandName}>Mezzanail</span>
  </span>;
}

function ExternalOrPending({ href, children, className = "", ariaLabel }: { href: string; children: React.ReactNode; className?: string; ariaLabel: string }) {
  if (!isConfiguredUrl(href)) return <span className={`${className} is-pending`} aria-disabled="true" aria-label={`${ariaLabel} — link pending`}>{children}</span>;
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>{children}</a>;
}

function LanguageMenu() {
  const { locale, setLocale } = useOfficial();
  const [open, setOpen] = useState(false);
  const labels: Record<Locale, string> = { en: "English", zh: "中文", ms: "BM" };
  return <div className="relative">
    <button className="utility-button" onClick={() => setOpen(!open)} aria-label="Change language" aria-expanded={open}><Globe2 size={15}/><span>{labels[locale]}</span><ChevronDown size={13}/></button>
    <AnimatePresence>{open && <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} className="official-menu">
      {(Object.keys(labels) as Locale[]).map(item => <button key={item} onClick={() => {setLocale(item);setOpen(false)}} className={locale === item ? "is-active" : ""}>{labels[item]}</button>)}
    </motion.div>}</AnimatePresence>
  </div>;
}

function SiteHeader() {
  const { t } = useOfficial();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const nav = primaryNavigation.map((item) => ({
    href: item.href,
    label: item.labelKey === "rewards" ? (t.nav.rewards === "Rewards" ? "Membership" : t.nav.rewards) : t.nav[item.labelKey],
  }));
  return <>
    {!isHome && siteConfig.announcement.enabled && <div className="announcement"><span>{t.announcement.label}</span><span className="announcement-date">{siteConfig.announcement.dates}</span><Link href="/promotion">{t.announcement.action}<ArrowRight size={13}/></Link></div>}
    <header className="official-header">
      <div className="official-header-main shell">
        <button className="utility-button icon-only official-mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open?<X size={18}/>:<Menu size={18}/>}</button>
        <Link href="/" className="official-header-brand" aria-label={`${siteConfig.brandName} home`}>
          {isHome ? <h1><BrandLogo compact/></h1> : <BrandLogo compact/>}
        </Link>
        <nav className="official-desktop-nav" aria-label="Primary navigation">{nav.map(({href,label}) => <Link key={href} href={href} className={`nav-link ${pathname === href ? "is-current" : ""}`}>{label}</Link>)}</nav>
        <div className="official-header-tools"><LanguageMenu/><a href={siteConfig.bookingUrl} className="header-book" target="_blank" rel="noopener noreferrer" onClick={() => trackPublicAction("book_appointment_click", siteConfig.bookingUrl, "header")}>{t.nav.book}</a></div>
      </div>
      <AnimatePresence>{open && <motion.nav initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="official-mobile-drawer"><div className="shell grid gap-1 py-4"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="mobile-drawer-book" onClick={()=>{trackPublicAction("book_appointment_click", siteConfig.bookingUrl, "mobile_drawer");setOpen(false)}}>{t.nav.book}<ArrowRight size={16}/></a>{nav.map(({href,label})=><Link key={href} href={href} className="mobile-drawer-link" onClick={()=>setOpen(false)}>{label}</Link>)}</div></motion.nav>}</AnimatePresence>
    </header>
  </>;
}

function SiteFooter() {
  const { locale, t } = useOfficial();
  const whatsapp = getWhatsappUrl(locale);
  return <footer className="official-footer"><div className="shell"><div className="grid gap-12 border-b border-white/15 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
    <div><BrandLogo inverse/><p className="mt-5 max-w-xs text-sm leading-7 text-white/55">{t.footer.line}</p></div>
    <div><h3>{t.footer.explore}</h3><Link href="/about">{t.nav.story}</Link><Link href="/services">{t.nav.services}</Link><Link href="/promotion">{t.nav.promo}</Link><Link href="/rewards">{t.nav.rewards === "Rewards" ? "Membership" : t.nav.rewards}</Link><Link href="/job">{t.nav.jobs}</Link></div>
    <div><h3>{t.footer.connect}</h3><ExternalOrPending href={siteConfig.instagramUrl} ariaLabel={`${siteConfig.brandName} Instagram`}>Instagram</ExternalOrPending><ExternalOrPending href={siteConfig.facebookUrl} ariaLabel={`${siteConfig.brandName} Facebook`}>Facebook</ExternalOrPending><ExternalOrPending href={siteConfig.xiaohongshuUrl} ariaLabel={`${siteConfig.brandName} Xiaohongshu`}>Xiaohongshu</ExternalOrPending></div>
    <div><h3>{t.footer.studio}</h3><Link href="/contact">{t.nav.contact}</Link><a href={siteConfig.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">Google Maps</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={siteConfig.phoneLink}>{siteConfig.phoneDisplay}</a></div>
  </div><div className="flex flex-col gap-4 py-7 text-[11px] text-white/42 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 {siteConfig.brandName}. All rights reserved.</span><div className="flex gap-5"><Link href="/privacy">{t.footer.privacy}</Link><Link href="/terms">{t.footer.terms}</Link></div></div></div></footer>;
}

function MobileNav() {
  const { t } = useOfficial();
  return <nav className="mobile-official-nav" aria-label="Mobile quick navigation"><Link href="/"><Home size={18}/><span>{t.nav.home}</span></Link><Link href="/services"><Sparkles size={18}/><span>{t.nav.services}</span></Link><Link href="/promotion"><Gift size={18}/><span>{t.nav.promo}</span></Link><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="mobile-book" onClick={() => trackPublicAction("book_appointment_click", siteConfig.bookingUrl, "mobile_quick_nav")}><CalendarCheck size={18}/><span>{t.nav.book}</span></a></nav>;
}

export function OfficialFrame({ children }: {children: React.ReactNode}) {
  const { locale } = useOfficial();
  const whatsappUrl = getWhatsappUrl(locale);
  return <><SiteHeader/><main>{children}</main><SiteFooter/><MobileNav/><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label={`WhatsApp ${siteConfig.brandName}`} onClick={() => trackPublicAction("whatsapp_click", whatsappUrl, "floating_action")}><MessageCircle size={22}/></a></>;
}

function StoryPreview() {
  const { t } = useOfficial();
  return <section className="section surface"><div className="shell grid items-stretch gap-5 lg:grid-cols-[.85fr_1.15fr]"><Reveal className="relative min-h-[500px] overflow-hidden rounded-[20px]"><Image src="/gallery/editorial-black.jpg" alt={`${siteConfig.brandName} editorial manicure`} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover"/></Reveal><Reveal delay={.08} className="flex flex-col justify-center rounded-[20px] border border-[var(--line)] bg-[var(--bg)] p-8 sm:p-14"><div className="eyebrow">{t.story.eyebrow}</div><h2 className="h2 mt-6">{t.story.title}</h2><p className="lead mt-7">{t.story.body}</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/about" className="btn btn-dark">{t.story.primary}<ArrowRight size={16}/></Link><Link href="/contact" className="btn btn-ghost">{t.story.secondary}</Link></div></Reveal></div></section>;
}

function ContactPanel() {
  const { locale, t } = useOfficial();
  return <section className="section"><div className="shell"><Reveal className="contact-panel"><div><div className="eyebrow text-[#dec27e]">{t.contact.eyebrow}</div><h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-[-.045em] text-white sm:text-6xl">{t.contact.title}</h2><p className="mt-6 max-w-xl text-sm leading-7 text-white/55">{t.contact.body}</p><div className="mt-9 flex flex-wrap gap-3"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">{t.contact.book}</a><a href={getWhatsappUrl(locale)} target="_blank" rel="noopener noreferrer" className="btn border-white/20 bg-transparent text-white">{t.contact.whatsapp}</a></div></div><div className="contact-details"><div><span>{t.contact.address}</span><p>{siteConfig.address.singleLine}</p></div><div><span>{t.contact.hours}</span><p>{siteConfig.businessHours}</p></div><div><span>{t.contact.phone}</span><p>{siteConfig.phoneDisplay}<br/>{siteConfig.mobileDisplay}</p></div><a href={siteConfig.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">{t.contact.map}<MapPin size={16}/></a></div></Reveal></div></section>;
}

function PageHero({eyebrow,title,body}:{eyebrow:string;title:string;body:string}) { return <section className="page-hero"><div className="shell"><motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} className="max-w-4xl"><div className="eyebrow">{eyebrow}</div><h1 className="display mt-6">{title}</h1><p className="lead mt-7 max-w-2xl">{body}</p></motion.div></div></section>; }

function ContactVisitSection() {
  const { locale, t } = useOfficial();
  const c = contactCopy[locale];
  return <section className="section surface"><div className="shell">
    <div className="contact-visit-grid">
      <Reveal className="card p-7 sm:p-9"><BrandLogo/><h2 className="mt-8 text-3xl font-semibold tracking-[-.04em]">Contact & Visit Us</h2><div className="mt-8 grid gap-6 text-sm leading-7"><div><span className="eyebrow">{t.contact.address}</span><p className="mt-2">{siteConfig.address.lines.map(line=><span className="block" key={line}>{line}</span>)}</p></div><div><span className="eyebrow">{t.contact.hours}</span><p className="mt-2">{siteConfig.businessHours}</p></div><div><span className="eyebrow">{t.contact.phone}</span><p className="mt-2"><a href={siteConfig.phoneLink}>{siteConfig.phoneDisplay}</a><br/><a href={siteConfig.mobileLink}>{siteConfig.mobileDisplay}</a></p></div></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><a href={siteConfig.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><MapPin size={16}/>{c.directions}</a><a href={siteConfig.phoneLink} className="btn btn-ghost"><Phone size={16}/>{c.call}</a><a href={getWhatsappUrl(locale)} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><MessageCircle size={16}/>{c.whatsapp}</a></div></Reveal>
      <Reveal delay={.06} className="map-frame"><iframe src={siteConfig.googleMapsEmbedUrl} title={`${siteConfig.brandName} location on Google Maps`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><a href={siteConfig.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="map-action">{c.directions}<ExternalLink size={15}/></a></Reveal>
    </div>
    <Reveal className="mt-6 card p-7 sm:p-9"><div className="eyebrow">{c.social}</div><div className="social-contact-grid mt-7">
      <ExternalOrPending href={siteConfig.facebookUrl} className="social-action" ariaLabel={`${siteConfig.brandName} Facebook`}><Facebook size={20}/><span>Facebook</span></ExternalOrPending>
      <ExternalOrPending href={siteConfig.instagramUrl} className="social-action" ariaLabel={`${siteConfig.brandName} Instagram`}><Instagram size={20}/><span>Instagram</span></ExternalOrPending>
      <ExternalOrPending href={siteConfig.xiaohongshuUrl} className="social-action" ariaLabel={`${siteConfig.brandName} Xiaohongshu`}><span className="red-mark">RED</span><span>{c.xhs}</span></ExternalOrPending>
    </div></Reveal>
  </div></section>;
}

export function OfficialHome() {
  const { locale } = useOfficial();
  return <OfficialFrame><div className="homepage-quiet">
    <CurrentCampaignBanner/>
    <SignatureServices locale={locale}/>
    <SelectedNailWork locale={locale}/>
    <WhyMezzanail locale={locale}/>
    <GoogleReviewsPreview locale={locale}/>
    <MembershipBanner locale={locale}/>
    <StudioLocationBooking locale={locale}/>
  </div></OfficialFrame>;
}
export function ServicesPage() { const {t}=useOfficial(); return <OfficialFrame><PageHero eyebrow={t.pages.services.eyebrow} title={t.pages.services.title} body={t.pages.services.body}/><ServicesCatalog/><ContactPanel/></OfficialFrame>; }
export function AboutPage() { const {t}=useOfficial(); return <OfficialFrame><PageHero eyebrow={`${siteConfig.brandName} · Malaysia`} title={t.pages.about.title} body={t.pages.about.body}/><section className="section surface"><div className="shell grid gap-5 lg:grid-cols-3">{t.pages.about.values.map(([title,body],i)=><Reveal key={title} delay={i*.08} className="card min-h-72 p-8"><span className="numbers text-xs font-bold gold-text">0{i+1}</span><h2 className="mt-20 text-2xl font-bold">{title}</h2><p className="mt-4 text-sm leading-7 text-[var(--muted)]">{body}</p></Reveal>)}</div></section><StoryPreview/><ContactPanel/></OfficialFrame>; }
export function ContactPage() { const {t}=useOfficial(); return <OfficialFrame><PageHero eyebrow={t.pages.contact.eyebrow} title={t.pages.contact.title} body={t.pages.contact.body}/><ContactVisitSection/></OfficialFrame>; }
export function LegalPage({ kind }: { kind: "privacy" | "terms" }) { const title=kind==="privacy"?"Privacy Policy":"Terms of Use"; return <OfficialFrame><section className="page-hero"><div className="shell"><div className="eyebrow">LEGAL</div><h1 className="display mt-6">{title}</h1><p className="lead mt-7 max-w-2xl">Draft placeholder for final business and legal review.</p></div></section><section className="section surface"><div className="shell"><div className="card max-w-3xl p-8 sm:p-12"><h2 className="text-2xl font-semibold">Business review required</h2><p className="mt-5 leading-7 text-[var(--muted)]">This page intentionally does not state any legal commitments yet. Mezzanail Nail Studio should approve the final wording before publication.</p><Link href="/contact" className="btn btn-dark mt-8">Contact the studio</Link></div></div></section></OfficialFrame>; }
