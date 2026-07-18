"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight, CalendarCheck, Check, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Facebook, Gift,
  Globe2, Home, Instagram, MapPin, Menu, MessageCircle, Moon, Phone, ShieldCheck,
  Sparkles, Star, Sun, X,
} from "lucide-react";
import { IconBandage, IconBottle, IconFootsteps, IconHandFinger, IconRazor } from "@tabler/icons-react";
import { HoverCard, Reveal } from "@/components/hyperframe/motion";
import { useLanguage } from "@/components/providers";
import { ServicesCatalog } from "@/components/services-catalog";
import type { Locale } from "@/lib/i18n";
import { officialMessages } from "@/lib/official-i18n";
import { getWhatsappUrl, isConfiguredUrl, siteConfig } from "@/lib/site";

const galleryImages = [
  "/gallery/signature-white.jpg", "/gallery/extension-silver.jpg", "/gallery/editorial-black.jpg",
  "/gallery/chrome-neutral.jpg", "/gallery/signature-campaign.jpg", "/gallery/minimal-manicure.jpg",
];

const appCopy = {
  en: { eyebrow: "MEMBERSHIP APP", title: "Download Our Membership App", body: "Manage your membership, rewards and appointments conveniently from your phone.", pending: "Official link coming soon" },
  zh: { eyebrow: "会员专属 APP", title: "下载会员专属 App", body: "通过手机轻松管理会员资料、奖励与预约。", pending: "官方链接即将提供" },
  ms: { eyebrow: "APLIKASI KEAHLIAN", title: "Muat Turun Aplikasi Keahlian", body: "Urus keahlian, ganjaran dan janji temu dengan mudah melalui telefon anda.", pending: "Pautan rasmi akan datang" },
} as const;

const contactCopy = {
  en: { directions: "Get Directions", call: "Call Us", whatsapp: "WhatsApp Us", social: "Official channels", qr: "Scan to WhatsApp", xhs: "Xiaohongshu", account: "Account ID", pending: "Official profile link pending" },
  zh: { directions: "导航到店", call: "致电我们", whatsapp: "WhatsApp 联系", social: "官方平台", qr: "扫码 WhatsApp", xhs: "小红书", account: "小红书号", pending: "官方主页链接待补" },
  ms: { directions: "Dapatkan Arah", call: "Hubungi Kami", whatsapp: "WhatsApp Kami", social: "Saluran rasmi", qr: "Imbas untuk WhatsApp", xhs: "Xiaohongshu", account: "ID akaun", pending: "Pautan profil rasmi belum tersedia" },
} as const;

const downloadNav = { en: "Download App", zh: "下载 App", ms: "Muat Turun App" } as const;

const philosophyCopy = {
  en: {
    eyebrow: "OUR APPROACH",
    items: [
      ["Purpose", "To make professional nail care feel considered, trusted and genuinely personal."],
      ["Vision", "To elevate modern nail care through precision, comfort and lasting confidence."],
      ["Promise", "Thoughtful consultation, careful technique and a refined result at every visit."],
    ],
  },
  zh: {
    eyebrow: "我们的理念",
    items: [
      ["初心", "让专业美甲护理更细致、更值得信赖，也更贴近每位顾客。"],
      ["愿景", "以精准技术、舒适体验与持久自信，提升现代美甲护理。"],
      ["承诺", "每次到店都享有认真咨询、细致技术与精致完成效果。"],
    ],
  },
  ms: {
    eyebrow: "PENDEKATAN KAMI",
    items: [
      ["Tujuan", "Menjadikan penjagaan kuku profesional lebih teliti, dipercayai dan peribadi."],
      ["Visi", "Meningkatkan penjagaan kuku moden melalui ketepatan, keselesaan dan keyakinan."],
      ["Janji", "Konsultasi teliti, teknik cermat dan hasil kemas pada setiap kunjungan."],
    ],
  },
} as const;

function useOfficial() {
  const { locale, setLocale } = useLanguage();
  return { locale, setLocale, t: officialMessages[locale] };
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

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  return <button className="utility-button icon-only" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle colour mode">{isDark ? <Sun size={16}/> : <Moon size={16}/>}</button>;
}

function SiteHeader() {
  const { locale, t } = useOfficial();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = [["/",t.nav.home],["/about",t.nav.story],["/services",t.nav.services],["/rewards",t.nav.rewards],["/#app",downloadNav[locale]],["/contact",t.nav.contact]];
  return <>
    {siteConfig.announcement.enabled && <div className="announcement"><span>{t.announcement.label}</span><span className="announcement-date">{siteConfig.announcement.dates}</span><Link href="/#anniversary">{t.announcement.action}<ArrowRight size={13}/></Link></div>}
    <header className="official-header">
      <div className="official-header-main shell">
        <div className="official-header-left"><a href={siteConfig.bookingUrl} className="header-book" target="_blank" rel="noopener noreferrer">{t.nav.book}</a><button className="utility-button icon-only official-mobile-menu" onClick={() => setOpen(!open)} aria-label="Open menu">{open?<X size={17}/>:<Menu size={17}/>}</button></div>
        <Link href="/" className="official-header-brand" aria-label={`${siteConfig.brandName} home`}><BrandLogo compact/></Link>
        <div className="official-header-tools"><LanguageMenu/><ThemeButton/></div>
      </div>
      <nav className="official-desktop-nav" aria-label="Primary navigation">{nav.map(([href,label]) => <Link key={href} href={href} className={`nav-link ${pathname === href ? "is-current" : ""}`}>{label}</Link>)}</nav>
      <AnimatePresence>{open && <motion.nav initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="official-mobile-drawer"><div className="shell grid gap-1 py-4">{nav.map(([href,label])=><Link key={href} href={href} className="rounded-xl px-3 py-3 text-sm" onClick={()=>setOpen(false)}>{label}</Link>)}<a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[var(--gold)] px-3 py-3 text-sm font-bold text-white">{t.nav.book}</a><div className="px-3 pt-2"><ThemeButton/></div></div></motion.nav>}</AnimatePresence>
    </header>
  </>;
}

function SiteFooter() {
  const { locale, t } = useOfficial();
  const whatsapp = getWhatsappUrl(locale);
  return <footer className="official-footer"><div className="shell"><div className="grid gap-12 border-b border-white/15 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
    <div><BrandLogo inverse/><p className="mt-5 max-w-xs text-sm leading-7 text-white/55">{t.footer.line}</p></div>
    <div><h3>{t.footer.explore}</h3><Link href="/about">{t.nav.story}</Link><Link href="/services">{t.nav.services}</Link><Link href="/rewards">{t.nav.rewards}</Link><Link href="/#app">{downloadNav[locale]}</Link></div>
    <div><h3>{t.footer.connect}</h3><ExternalOrPending href={siteConfig.instagramUrl} ariaLabel={`${siteConfig.brandName} Instagram`}>Instagram</ExternalOrPending><ExternalOrPending href={siteConfig.facebookUrl} ariaLabel={`${siteConfig.brandName} Facebook`}>Facebook</ExternalOrPending><ExternalOrPending href={siteConfig.xiaohongshuUrl} ariaLabel={`${siteConfig.brandName} Xiaohongshu`}>Xiaohongshu</ExternalOrPending></div>
    <div><h3>{t.footer.studio}</h3><Link href="/contact">{t.nav.contact}</Link><a href={siteConfig.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">Google Maps</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={siteConfig.phoneLink}>{siteConfig.phoneDisplay}</a></div>
  </div><div className="flex flex-col gap-4 py-7 text-[11px] text-white/42 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 {siteConfig.brandName}. All rights reserved.</span><div className="flex gap-5"><span>{t.footer.privacy}</span><span>{t.footer.terms}</span></div></div></div></footer>;
}

function MobileNav() {
  const { t } = useOfficial();
  return <nav className="mobile-official-nav" aria-label="Mobile quick navigation"><Link href="/"><Home size={18}/><span>{t.nav.home}</span></Link><Link href="/services"><Sparkles size={18}/><span>{t.nav.services}</span></Link><Link href="/#anniversary"><Gift size={18}/><span>{t.nav.promo}</span></Link><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="mobile-book"><CalendarCheck size={18}/><span>{t.nav.book}</span></a></nav>;
}

function Frame({ children }: {children: React.ReactNode}) {
  const { locale } = useOfficial();
  return <><SiteHeader/><main>{children}</main><SiteFooter/><MobileNav/><a href={getWhatsappUrl(locale)} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label={`WhatsApp ${siteConfig.brandName}`}><MessageCircle size={22}/></a></>;
}

function Hero() {
  const { t } = useOfficial();
  const [active, setActive] = useState(0);
  const slides = [
    { image:"/gallery/signature-white.jpg", eyebrow:t.hero.eyebrow, title:t.hero.title, body:t.hero.body, label:t.hero.primary, href:siteConfig.bookingUrl, external:true },
    { image:"/gallery/signature-campaign.jpg", eyebrow:t.campaign.eyebrow, title:t.campaign.title, body:t.campaign.body, label:t.campaign.secondary, href:"/rewards", external:false },
    { image:"/gallery/chrome-neutral.jpg", eyebrow:t.services.eyebrow, title:t.services.title, body:t.services.body, label:t.services.viewAll, href:"/services", external:false },
  ];
  useEffect(() => { const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 6500); return () => window.clearInterval(timer); }, [slides.length]);
  const slide = slides[active];
  return <section className="official-hero">
    <AnimatePresence mode="wait"><motion.div key={slide.image} initial={{opacity:.3,scale:1.02}} animate={{opacity:1,scale:1}} exit={{opacity:.25}} transition={{duration:.65}} className="absolute inset-0"><Image src={slide.image} alt={`${siteConfig.brandName} nail studio campaign`} fill loading="eager" sizes="100vw" className="object-cover object-center"/></motion.div></AnimatePresence>
    <div className="hero-scrim"/>
    <div className="shell relative flex min-h-[620px] items-center py-16"><AnimatePresence mode="wait"><motion.div key={`${active}-${slide.title}`} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.5,ease:[.22,1,.36,1]}} className="hero-copy max-w-2xl"><div className="eyebrow">{slide.eyebrow}</div><h1 className="display mt-5">{slide.title}</h1><p className="mt-6 max-w-xl text-base leading-7">{slide.body}</p><div className="mt-8 flex flex-wrap gap-3">{slide.external?<a href={slide.href} target="_blank" rel="noopener noreferrer" className="btn btn-gold">{slide.label}<ArrowRight size={16}/></a>:<Link href={slide.href} className="btn btn-gold">{slide.label}<ArrowRight size={16}/></Link>}<Link href="/services" className="btn hero-secondary">{t.hero.secondary}</Link></div></motion.div></AnimatePresence></div>
    <button className="hero-arrow hero-prev" onClick={()=>setActive((active-1+slides.length)%slides.length)} aria-label="Previous slide"><ChevronLeft size={24}/></button><button className="hero-arrow hero-next" onClick={()=>setActive((active+1)%slides.length)} aria-label="Next slide"><ChevronRight size={24}/></button>
    <div className="hero-dots" aria-label="Campaign slides">{slides.map((item,index)=><button key={item.image} className={index===active?"is-active":""} onClick={()=>setActive(index)} aria-label={`Show slide ${index+1}`}/>)}</div>
  </section>;
}

function AnniversaryCampaign() {
  const { t } = useOfficial();
  return <section id="anniversary" className="anniversary-campaign"><div className="anniversary-seven" aria-hidden="true">7</div><div className="shell relative flex min-h-[720px] items-center justify-center py-20 text-center"><Reveal className="max-w-4xl"><div className="eyebrow text-[#dec27e]">{t.campaign.eyebrow}</div><h2 className="mt-7 text-5xl font-light leading-[.98] tracking-[-.055em] text-white sm:text-8xl">{t.campaign.title}</h2><p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/58">{t.campaign.body}</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">{t.campaign.primary}<ArrowRight size={16}/></a><Link href="/rewards" className="btn border-white/20 bg-white/5 text-white">{t.campaign.secondary}</Link></div></Reveal></div></section>;
}

function BookingSection() {
  const { locale, t } = useOfficial();
  return <section className="section"><div className="shell grid items-center gap-14 lg:grid-cols-[1fr_.82fr]"><Reveal><div className="eyebrow">{t.booking.eyebrow}</div><h2 className="h2 mt-5">{t.booking.title}</h2><p className="lead mt-6 max-w-2xl">{t.booking.body}</p><div className="mt-8 grid gap-3">{t.booking.points.map(point=><div key={point} className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface)] gold-text"><Check size={14}/></span>{point}</div>)}</div><div className="mt-9 flex flex-wrap gap-3"><a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">{t.booking.primary}<ArrowRight size={16}/></a><a href={getWhatsappUrl(locale)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{t.booking.secondary}</a></div></Reveal><Reveal delay={.1} className="booking-card"><div className="eyebrow text-[#d7b873]">{siteConfig.brandName}</div><div className="mt-20 text-4xl font-light leading-tight tracking-[-.04em] text-white">Private care.<br/>Professional precision.</div><div className="mt-16 flex items-center justify-between border-t border-white/15 pt-6 text-xs text-white/50"><span>DIRECT BOOKING</span><CalendarCheck className="text-[#d7b873]" size={22}/></div></Reveal></div></section>;
}

function ServicesPreview() {
  const { t } = useOfficial();
  const icons = [IconBottle, IconFootsteps, IconHandFinger, IconBandage, IconRazor];
  return <section className="service-showcase"><div className="shell"><Reveal className="service-showcase-heading"><div><div className="eyebrow">{t.services.eyebrow}</div><h2 className="h2 mt-4">{t.services.title}</h2></div><div><p className="lead max-w-xl">{t.services.body}</p><Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-bold gold-text">{t.services.viewAll}<ArrowRight size={16}/></Link></div></Reveal><div className="service-icon-grid">{t.services.items.map(([title,body],i)=>{const Icon=icons[i];return <Link href="/services" key={title} className="service-icon-item"><span className="service-icon-box"><Icon size={38} stroke={1.35}/></span><h3>{title}</h3><p>{body}</p></Link>})}</div></div></section>;
}

function Philosophy() {
  const { locale } = useOfficial();
  const copy = philosophyCopy[locale];
  return <section className="philosophy-section"><div className="shell"><div className="eyebrow text-center text-[#d9bb75]">{copy.eyebrow}</div><div className="philosophy-grid">{copy.items.map(([title,body],i)=><Reveal key={title} delay={i*.07} className="philosophy-item"><h2>{title}</h2><p>{body}</p></Reveal>)}</div></div></section>;
}

function AppDownloadLinks({ locale }: { locale: Locale }) {
  const [device, setDevice] = useState<"desktop"|"android"|"ios">("desktop");
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const agent = navigator.userAgent.toLowerCase();
      setDevice(agent.includes("android") ? "android" : /iphone|ipad|ipod/.test(agent) ? "ios" : "desktop");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const items = [
    { id:"ios", href:siteConfig.appStoreUrl, src:"/badges/download-on-app-store.svg", alt:"Download on the App Store" },
    { id:"android", href:siteConfig.googlePlayUrl, src:"/badges/get-it-on-google-play-trimmed.png", alt:"Get it on Google Play" },
  ].sort((a,b) => device === "android" ? (a.id === "android" ? -1 : 1) : device === "ios" ? (a.id === "ios" ? -1 : 1) : 0);
  return <div className="app-badges">{items.map(item => {
    const imageSize = item.id === "ios" ? { width: 120, height: 40 } : { width: 168, height: 50 };
    return isConfiguredUrl(item.href) ? <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.alt}><Image src={item.src} alt={item.alt} {...imageSize}/></a> : <span key={item.id} className="app-badge-pending" aria-disabled="true"><Image src={item.src} alt={item.alt} {...imageSize}/><small>{appCopy[locale].pending}</small></span>;
  })}</div>;
}

function AppPromo() {
  const { locale } = useOfficial();
  const copy = appCopy[locale];
  return <section id="app" className="section scroll-mt-24"><div className="shell"><Reveal className="app-promo"><div><div className="eyebrow text-[#ddc17e]">{copy.eyebrow}</div><h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-[-.04em] text-white sm:text-6xl">{copy.title}</h2><p className="mt-6 max-w-xl text-base leading-7 text-white/60">{copy.body}</p></div><AppDownloadLinks locale={locale}/></Reveal></div></section>;
}

function Gallery() {
  const { t } = useOfficial();
  return <section id="work" className="section surface"><div className="shell"><Reveal className="grid gap-6 lg:grid-cols-2"><div><div className="eyebrow">{t.gallery.eyebrow}</div><h2 className="h2 mt-5">{t.gallery.title}</h2></div><div className="lg:justify-self-end"><p className="lead max-w-xl">{t.gallery.body}</p><ExternalOrPending href={siteConfig.instagramUrl} className="mt-7 inline-flex items-center gap-2 text-sm font-bold gold-text" ariaLabel={`${siteConfig.brandName} Instagram`}>{t.gallery.cta}<ExternalLink size={15}/></ExternalOrPending></div></Reveal><div className="gallery-grid mt-14">{galleryImages.map((src,i)=><Reveal key={src} delay={(i%3)*.06} className={`gallery-item gallery-${i+1}`}><Image src={src} alt={`${siteConfig.brandName} — ${t.gallery.alts[i]}`} fill sizes="(max-width: 767px) 100vw, 40vw" className="object-cover" loading="lazy"/></Reveal>)}</div></div></section>;
}

function Reviews() {
  const { t } = useOfficial();
  return <section id="reviews" className="section"><div className="shell"><Reveal><div className="eyebrow">{t.reviews.eyebrow}</div><h2 className="h2 mt-5 max-w-3xl">{t.reviews.title}</h2><p className="lead mt-6 max-w-xl">{t.reviews.body}</p></Reveal>{isConfiguredUrl(siteConfig.googleReviewsEmbedUrl) ? <iframe src={siteConfig.googleReviewsEmbedUrl} title={`${siteConfig.brandName} Google Reviews`} loading="lazy" className="mt-12 h-[420px] w-full rounded-[20px] border border-[var(--line)]"/> : <div className="mt-12 grid gap-4 lg:grid-cols-3">{t.reviews.cards.map(([quote,name])=><HoverCard key={name} className="card flex min-h-64 flex-col p-7"><div className="flex gap-1 text-[#c8a96b]">{[1,2,3,4,5].map(i=><Star key={i} size={13} fill="currentColor"/>)}</div><blockquote className="mt-8 text-base leading-7">“{quote}”</blockquote><div className="mt-auto pt-8 text-xs font-bold">{name}</div></HoverCard>)}</div>}<div className="mt-8"><ExternalOrPending href={siteConfig.googleReviewUrl} className="btn btn-dark" ariaLabel={`${siteConfig.brandName} Google Reviews`}>{t.reviews.cta}<ExternalLink size={15}/></ExternalOrPending></div></div></section>;
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

export function OfficialHome() { return <Frame><Hero/><ServicesPreview/><Philosophy/><AnniversaryCampaign/><Gallery/><StoryPreview/><AppPromo/><Reviews/><ContactPanel/></Frame>; }
export function ServicesPage() { const {t}=useOfficial(); return <Frame><PageHero eyebrow={t.pages.services.eyebrow} title={t.pages.services.title} body={t.pages.services.body}/><ServicesCatalog/><ContactPanel/></Frame>; }
export function AboutPage() { const {t}=useOfficial(); return <Frame><PageHero eyebrow={`${siteConfig.brandName} · Malaysia`} title={t.pages.about.title} body={t.pages.about.body}/><section className="section surface"><div className="shell grid gap-5 lg:grid-cols-3">{t.pages.about.values.map(([title,body],i)=><Reveal key={title} delay={i*.08} className="card min-h-72 p-8"><span className="numbers text-xs font-bold gold-text">0{i+1}</span><h2 className="mt-20 text-2xl font-bold">{title}</h2><p className="mt-4 text-sm leading-7 text-[var(--muted)]">{body}</p></Reveal>)}</div></section><StoryPreview/><ContactPanel/></Frame>; }
export function ContactPage() { const {t}=useOfficial(); return <Frame><PageHero eyebrow={t.pages.contact.eyebrow} title={t.pages.contact.title} body={t.pages.contact.body}/><ContactVisitSection/><ContactPanel/></Frame>; }
