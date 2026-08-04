# TV slideshow cleanup record — 2026-08-04

This record captures the slideshow entries matched before removal so they can be restored if needed.

## Sources audited

- Bundled slideshow data: `public/data/slideshow.json`
- Presentation-only anniversary slide: `config/slideshow-display.ts`
- Client cache and preloading: `lib/tv-slideshow.ts`, `components/tv/tv-slideshow.tsx`
- Offline manifest/cache: `public/sw-tv-slide.js`
- Production environment: no `NEXT_PUBLIC_SLIDESHOW_DATA_URL` override is configured.
- API/database: no slideshow API route, database table, migration, or database-backed slideshow record exists in this project.

## Removed entries

| Slide ID | Slide name | Match | Image files | Physical file action |
| --- | --- | --- | --- | --- |
| `membership` | More Beauty in Every Visit | Displays RM199, RM399 and RM599 membership plans | None | None required |
| `member-centre-qr` | Your Mezzanail Membership, In One Place | Generates an old Member Centre QR slide | None | None required |
| `nail-gallery-qr` | Find Your Next Nail Inspiration | Generates an old Nail Gallery/Instagram QR slide | None | None required |
| `brand-thank-you` | Thank You for Being Part of Our Story | Generates an Instagram QR on the closing slide | `/brand/mezzanail-nail-studio-wordmark.png`; fallback `/brand/mezzanail-nail-studio-logo.jpg` | Retained because both files are shared with `brand-welcome`, site branding, promotion UI, and offline shell caching |

## Image audit result

All configured primary, AVIF/WebP, and fallback images used by the remaining brand, artwork, anniversary campaign, services, and presentation-only anniversary slides were visually inspected. None contains a QR code or an RM199/RM399/RM599 membership package comparison.

## Fixed elements explicitly retained

- Right-side Member Center QR: `https://member.mezzanail.com/member-credits`
- Bottom benefit: `RM80 BONUS CREDIT / RM199 Nail Package`
