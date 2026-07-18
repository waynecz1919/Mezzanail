# Mezzanail Nail Studio Official Website

Mobile-first, multilingual official website and rewards platform for Mezzanail Nail Studio in Malaysia.

## Stack

- Next.js 16 App Router and React 19
- Tailwind CSS 4
- Framer Motion and Lucide Icons
- `next-themes` light/dark mode
- HyperFrames-inspired Velvet Precision visual and motion system

HyperFrames is a video-composition framework, so the site keeps interaction native to Next.js and Framer Motion while applying its visual-identity gate, modular composition discipline and restrained motion rules.

## Routes

- `/` — official brand homepage, anniversary campaign, booking, app, gallery and reviews
- `/services` — searchable service catalogue with verified durations
- `/about` — brand story and values
- `/contact` — studio information and direct booking
- `/rewards` — membership and rewards experience
- `/login` — member sign-in

## Central configuration

All external destinations live in `lib/site.ts`:

- Booking URL
- iOS and Android downloads
- Google Maps and Google Reviews
- WhatsApp, Instagram, Facebook and Xiaohongshu
- Announcement, studio contact details and opening hours

The official booking, WhatsApp, App Store, Google Play and Google Maps destinations are configured. Facebook, Instagram, Xiaohongshu profile URL, Google Review URL/embed and email remain explicit placeholders until their official destinations are supplied.

## Service data

`lib/services.ts` is the single source for service names, prices, durations and descriptions. The 13 current service names and durations were verified against the official booking page on 17 July 2026. That page does not publish prices, so the website displays “Please enquire” instead of inventing amounts. Replace those values when the official full price list is supplied.

## Languages

- Official website copy: `lib/official-i18n.ts`
- Rewards copy: `lib/i18n.ts`
- Supported locales: English, Simplified Chinese and Bahasa Melayu
- Selection persists in local storage as `mezzanail-rewards-locale`

## Local development

```bash
pnpm install
pnpm dev
```

Production verification:

```bash
pnpm lint
pnpm build --webpack
pnpm start
```
