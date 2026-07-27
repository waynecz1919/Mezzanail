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
