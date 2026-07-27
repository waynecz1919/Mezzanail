# Homepage Studio Campaign Image — Design QA

**Source visual truth**

- `C:\Users\mezza\AppData\Local\Temp\codex-clipboard-0adb8384-d1ac-4101-93a2-94498a7ae686.png`
- Source pixels: 1600 × 1600.

**Rendered implementation**

- Full mobile capture: `C:\Users\mezza\Documents\Codex\2026-07-26\chon\work\Mezzanail\test-results\homepage-mobile.png`
- Focused mobile region: `C:\Users\mezza\Documents\Codex\2026-07-26\chon\work\Mezzanail\test-results\homepage-mobile-bottom-check.png`
- Side-by-side comparison: `C:\Users\mezza\Documents\Codex\2026-07-26\chon\work\Mezzanail\test-results\homepage-studio-comparison.png`
- Browser viewport: 390 × 844 CSS pixels at device scale factor 1.
- Full-page screenshot: 390 × 8829 pixels.
- Focused implementation poster crop: 354 × 356 pixels; compared against a 354 × 354 normalized copy of the source.
- State: homepage studio section, default state, English locale.

**Full-view comparison evidence**

- The campaign artwork replaces only the studio-section image; section order, copy, buttons, footer and mobile navigation remain unchanged.
- The square artwork fits the available column without page-level horizontal overflow.
- Desktop, tablet and mobile captures all report zero horizontal overflow and one H1.

**Focused region comparison evidence**

- The supplied source and browser-rendered poster are shown together in `homepage-studio-comparison.png`.
- The Mezzanail logo, 7th Anniversary title, date, prizes, nail art and lower benefit strip are all visible.
- The image is not stretched or cropped. Rounded corners are applied only by the existing studio image container.

**Required fidelity surfaces**

- Fonts and typography: campaign typography remains embedded in the supplied image; no HTML recreation or font substitution was introduced.
- Spacing and layout rhythm: the image container now uses the source's 1:1 ratio on desktop, tablet and mobile.
- Colors and visual tokens: the source pink/rose palette is preserved; the fallback surface uses the existing warm-neutral token.
- Image quality and asset fidelity: the exact supplied 1600 × 1600 PNG is served through `next/image` with responsive sizing.
- Copy and content: no campaign copy was altered, omitted or recreated.

**Findings**

- No actionable P0, P1 or P2 differences.
- P3: fine campaign text is naturally smaller on a 390px phone screen because the complete square artwork is intentionally preserved instead of cropped.

**Comparison history**

- Pass 1: no P0/P1/P2 findings. No visual correction loop was required after the first browser-rendered comparison.

**Implementation checklist**

- Exact supplied campaign image installed.
- Localized alt text updated.
- Square responsive container applied.
- Desktop, tablet and mobile captures completed.
- Lint, TypeScript, 28 tests and production build passed.

final result: passed
