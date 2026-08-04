# Homepage Signature Service Images — Design QA

**Source visual truth**

- Callus Removal: `D:\Downloads\Purple & Cream Minimalist Sales Report Graph (2).png`
- Waxing: `C:\Users\mezza\AppData\Local\Temp\codex-clipboard-53726e9d-b6ce-471f-9589-83202ca5dd77.png`
- Hand Care: `D:\Downloads\Purple & Cream Minimalist Sales Report Graph.png`
- Foot Care: `D:\Downloads\Purple & Cream Minimalist Sales Report Graph (1).png`

**Rendered implementation**

- Desktop capture: `C:\Users\mezza\Documents\Codex\2026-07-27\files-mentioned-by-the-user-mezzanail\work\service-image-qa\test-results\homepage-desktop.png`
- Mobile capture: `C:\Users\mezza\Documents\Codex\2026-07-27\files-mentioned-by-the-user-mezzanail\work\service-image-qa\test-results\homepage-mobile.png`
- Focused desktop section: `C:\Users\mezza\Documents\Codex\2026-07-27\files-mentioned-by-the-user-mezzanail\work\service-image-qa\service-section-desktop.png`
- Combined source/render comparison: `C:\Users\mezza\Documents\Codex\2026-07-27\files-mentioned-by-the-user-mezzanail\work\service-image-qa\service-images-comparison.png`
- Viewports: desktop 1536 × 1024, tablet 1024 × 1366 and mobile 390 × 844 at device scale factor 1.
- State: homepage Signature Services section, default state, English locale.

**Full-view comparison evidence**

- The four supplied images appear in the requested service categories.
- The existing asymmetric two-featured-plus-three-supporting service grid is unchanged.
- Desktop, tablet and mobile captures have zero page-level horizontal overflow and CLS 0.

**Focused region comparison evidence**

- The source images and browser-rendered service section are shown together in `service-images-comparison.png`.
- Hand Care and Foot Care retain their primary subjects within the featured 3:2 desktop crop.
- Waxing retains the treatment action and client leg.
- Callus Removal uses the new 4:3 source and fills the card while keeping both feet and the Before / After labels visible.

**Required fidelity surfaces**

- Fonts and typography: section headings, service titles and supporting copy are unchanged.
- Spacing and layout rhythm: card dimensions, gaps, radii and content baselines remain consistent.
- Colors and visual tokens: supplied warm-neutral imagery sits within the existing cream and wine design system.
- Image quality and asset fidelity: exact supplied PNG files are served through `next/image`; no generated substitutes or text recreation were used.
- Copy and content: service names, descriptions, links and ordering are unchanged.

**Findings**

- No actionable P0, P1 or P2 differences.
- No remaining P3 visual differences were identified.

**Comparison history**

- Pass 1: the earlier square Callus Removal image required side margins to retain its Before / After labels.
- Fix: replaced it with the supplied 4:3 version and changed the card to `cover`.
- Pass 2: desktop and mobile captures confirm a full-width image with both labels visible and no layout regression.

**Implementation checklist**

- Exact four supplied images installed.
- Correct category mapping applied.
- Accurate alt text added.
- Responsive desktop, tablet and mobile captures completed.
- Lint, TypeScript, 28 tests and production build passed.

final result: passed

---

# Anniversary Jackpot Campaign Palette — Design QA

**Source visual truth**

- `D:\Downloads\Untitled design (4).png`
- Source pixels: 1600 × 1600.
- Palette target: pearl cream, blossom pink, coral rose, rose gold, champagne gold and deep chocolate.

**Rendered implementation**

- Local route: `http://127.0.0.1:3022/anniversary-jackpot/preview`
- Intended viewports: desktop 1440 × 1000 and mobile 390 × 844 at device scale factor 1.
- State: Jackpot preview, Live Draw tab, default pre-spin state.
- Implementation screenshot: unavailable because both the in-app Browser control and the supported Chrome control runtime were unavailable in this session.

**Full-view comparison evidence**

- Blocked: no browser-rendered implementation screenshot could be captured through an approved browser surface.

**Focused region comparison evidence**

- Blocked: the wheel, prize card and primary-action contrast could not be compared in a browser-rendered capture.

**Required fidelity surfaces**

- Fonts and typography: unchanged by this palette-only update.
- Spacing and layout rhythm: unchanged by this palette-only update.
- Colors and visual tokens: CSS tokens now map to the supplied campaign palette; small white button labels use a deeper rose with a measured contrast ratio above 4.5:1.
- Image quality and asset fidelity: the supplied campaign artwork was used as visual color reference only; no source imagery was replaced.
- Copy and content: unchanged.

**Findings**

- [P2] Browser-rendered visual comparison unavailable.
  Location: Anniversary Jackpot preview.
  Evidence: the route responds successfully and TypeScript/lint pass, but no approved browser screenshot could be captured.
  Impact: responsive color balance and browser rendering still require visual confirmation.
  Fix: inspect the live local preview at desktop and mobile width and capture both states.

**Comparison history**

- Pass 1: source artwork inspected at original resolution; the earlier dark wine stage was identified as visually inconsistent.
- Fix: replaced the stage and system tokens with pearl cream, blossom pink, rose gold and champagne; deepened interactive rose tones for readable white labels.
- Post-fix visual evidence: blocked by unavailable browser-control runtime.

**Implementation checklist**

- Campaign palette applied.
- Small-text contrast adjusted.
- Existing layout, typography and behavior preserved.
- TypeScript and lint passed.
- Local route returns HTTP 200.
- Desktop and mobile browser captures remain pending.

final result: blocked

---

# Mezzanail Slideshow Design QA

- Source visual truth: `C:\Users\mezza\OneDrive\Documents\Mezzanail OS\.codex-remote-attachments\019fcade-3387-7613-8849-4a7ceb04397f\b83d7650-d969-473c-b5fa-9d8c9c3c28d6\1-Photo-1.jpg`
- Source dimensions: 1376 × 768 px
- Primary implementation capture: `C:\Users\mezza\Documents\Codex\2026-08-04\mezzanail-url-https-www-mezzanail-com\outputs\mezzanail-slideshow-1920x1080.png`
- Responsive implementation capture: `C:\Users\mezza\Documents\Codex\2026-08-04\mezzanail-url-https-www-mezzanail-com\outputs\mezzanail-slideshow-1366x768.png`
- Full-view comparison: `C:\Users\mezza\Documents\Codex\2026-08-04\mezzanail-url-https-www-mezzanail-com\work\slideshow-qa\reference-vs-implementation.png`
- Primary CSS viewport: 1920 × 1080 at device scale factor 1
- Responsive CSS viewport: 1366 × 768 at device scale factor 1
- Density normalization: the 1376 × 768 source was resized with cover to 1920 × 1080; it was placed beside the 1920 × 1080 implementation without additional implementation scaling.
- State: static seventh-anniversary slide with live Asia/Kuala_Lumpur time and date.

## Full-view comparison evidence

The combined comparison shows the same warm ivory, blush, champagne and taupe art direction; a dominant manicure image; an editorial anniversary lockup; a fixed brand/time/member reminder/website sidebar; and a four-column benefit bar. The implementation intentionally follows the written 75/25 upper split and 11.5% footer requirement even though the supplied reference uses a slightly wider sidebar and thicker footer.

## Focused-region evidence

Separate focused crops were not required. Both original-size captures were opened and inspected at their native dimensions, where the right-panel date row, symbolic phone QR icon, website, four footer icons and all promotion copy remained clearly readable. Automated browser measurements also confirmed exact region proportions and equal footer-column widths.

## Required fidelity surfaces

- Fonts and typography: Cormorant Garamond and Manrope reuse the existing Mezzanail font system. Display weights, letter spacing, tabular clock numerals and italic slogan remain legible at both target viewports.
- Spacing and layout rhythm: 75% hero, 25% sidebar, 11.5% footer and four equal footer columns were measured in the browser. No horizontal or vertical overflow was present.
- Colors and visual tokens: warm ivory, soft blush, dusty rose, champagne gold and warm taupe match the reference without neon color or heavy shadow.
- Image quality and asset fidelity: the hero is a separate 1920 × 1280 AVIF/WebP/PNG photography asset with every nail visible; it is not the supplied preview rasterized as the page.
- Copy and content: all requested English copy is present, including `GET RM80 BONUS CREDIT`; WhatsApp, Instagram, a Website label and a scannable television QR are absent.

## Comparison history

1. Initial capture found a P2 development-toolbar badge in the lower-left and a P2 anniversary numeral that crowded the title. The slideshow-only CSS now hides the development portal, and the numeral size/spacing was reduced.
2. Post-fix captures at 1920 × 1080 and 1366 × 768 show no toolbar, no title collision, no site chrome, no cookie prompt, no overflow and no browser console errors.

## Findings

No actionable P0, P1 or P2 differences remain. The remaining proportional differences from the supplied preview are intentional and follow the user's explicit 75/25 and 11%–12% layout requirements.

## Open questions

None for this preview round.

## Implementation checklist

- [x] Preserve the existing Next.js App Router and brand fonts.
- [x] Use a real component layout rather than the preview as a full-page image.
- [x] Keep the static slide in a future-ready array configuration.
- [x] Update Malaysia time every minute without page refresh.
- [x] Verify 1920 × 1080 and 1366 × 768 output.
- [x] Keep the work local and undeployed.

## Follow-up polish

No P3 item is required before stakeholder review.

final result: passed
