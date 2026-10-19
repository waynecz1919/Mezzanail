import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const css = read("app/anniversary-jackpot/jackpot.css");
const consoleSource = read("components/jackpot/jackpot-console.tsx");

test("jackpot palette contains none of the retired rose and wine colours", () => {
  const retiredColours = [
    "#ad514e", "#4a2824", "#dc8d87", "#e9aaa3", "#b45754", "#98413f",
    "#cf7772", "#c76461", "#e99b94", "#edaaa2", "#cb706b", "#a84f4d",
    "#97413f", "#a53b4f", "#35131d", "#190b10", "#2a1018", "#6b2637",
    "#541b2a", "#925064",
  ];

  for (const colour of retiredColours) {
    assert.equal(css.toLowerCase().includes(colour), false, colour + " must be removed");
  }
});

test("jackpot console typography does not declare text smaller than 11px", () => {
  const declarations = [...css.matchAll(/font-size\s*:\s*([^;}]+)/g)];
  assert.ok(declarations.length > 0, "console font sizes must be explicit and auditable");

  for (const [, value] of declarations) {
    const pixelSizes = [...value.matchAll(/(\d+(?:\.\d+)?)px/g)].map((match) => Number(match[1]));
    assert.ok(pixelSizes.every((size) => size >= 11), "font-size below 11px found: " + value.trim());
  }
});

test("control room and fullscreen render the official wordmark with accessible text", () => {
  assert.match(
    consoleSource,
    /<Image\s+className="jackpot-wordmark"\s+src="\/brand\/mezzanail-nail-studio-wordmark\.png"\s+alt="Mezzanail Nail Studio"[\s\S]*?\/>/,
  );
  assert.match(
    consoleSource,
    /<Image\s+className="jackpot-live-wordmark"\s+src="\/brand\/mezzanail-nail-studio-wordmark\.png"\s+alt="Mezzanail Nail Studio"[\s\S]*?\/>/,
  );
  assert.doesNotMatch(consoleSource, /jackpot-monogram/);
});

test("disabled SPIN explains the existing condition without changing the action", () => {
  assert.match(consoleSource, /Lock the participant list to enable SPIN/);
  assert.match(consoleSource, /Confirm or redraw the current winner first/);
  assert.match(consoleSource, /Add a prize to begin/);
  assert.match(consoleSource, /onClick=\{spin\}/);
});

test("fullscreen winner name shows first name and last initial", () => {
  const helper = consoleSource.match(/export function formatLiveWinnerName\(name: string\) \{([\s\S]*?)\n\}/);
  assert.ok(helper, "fullscreen name formatter must be present");
  const formatLiveWinnerName = new Function("name", helper[1]);

  assert.equal(formatLiveWinnerName("Alicia Tan"), "Alicia T.");
  assert.equal(formatLiveWinnerName("Siti"), "Siti");
});

test("salon fullscreen background matches the Owner-approved attachment and replaces silk", () => {
  const asset = readFileSync(new URL("../public/campaigns/7th-anniversary/jackpot-bg-salon.jpg", import.meta.url));
  const sha256 = createHash("sha256").update(asset).digest("hex").toUpperCase();

  assert.equal(sha256, "BF56EDE301C0BE6B75B9C26EBD5999D9B849A0F544C512ABA5B8EA0AE4D31625");
  assert.match(css, /jackpot-bg-salon\.jpg/);
  assert.doesNotMatch(css, /jackpot-bg-silk\.jpg/);
  assert.equal(existsSync(new URL("../public/campaigns/7th-anniversary/jackpot-bg-silk.jpg", import.meta.url)), false);
});

test("fullscreen recording view includes local clock, audit marker and private winner formatting", () => {
  assert.match(consoleSource, /formatLocalLiveDateTime\(liveClock\)/);
  assert.match(consoleSource, /DRAW \{completedUnits \+ 1\} · AUDIT RECORDED/);
  assert.match(consoleSource, /formatLiveWinnerName\(activeWinner\.displayName\)/);
  assert.match(consoleSource, /READY FOR THE NEXT DRAW/);
});

test("wordmarks scale to the reviewed control-room and fullscreen widths", () => {
  assert.match(css, /\.jackpot-wordmark\s*\{\s*width:\s*212px/);
  assert.match(css, /\.jackpot-live-wordmark\s*\{\s*width:\s*339px/);
  assert.match(css, /filter:\s*brightness\(0\) invert\(\.2\)/);
});

test("wheel has the gold rim, ivory inner line, light ticks and segment separators", () => {
  assert.match(consoleSource, /className="jackpot-wheel-ring" aria-hidden="true"\s*\/>/);
  assert.match(css, /\.jackpot-wheel-ring\s*\{[^}]*linear-gradient\(135deg, #E6D3A6 0%, #B69B68 52%, #86703F 100%\)/s);
  assert.match(css, /#E6D3A6[^}]*#B69B68[^}]*#86703F/s);
  assert.match(css, /\.jackpot-wheel-rim\s*\{[^}]*border:\s*1px solid #FBF8EF/s);
  assert.match(css, /\.jackpot-wheel-ticks\s*\{[^}]*#FFF9EA/s);
  assert.match(css, /\.jackpot-wheel-separators\s*\{[^}]*#C9B183[^}]*\.18deg/s);
  assert.match(css, /\.jackpot-wheel-stage \.jackpot-pointer::after\s*\{\s*content:\s*none;/);
  assert.match(css, /\.jackpot-pointer > i\s*\{[^}]*background:\s*#343434/s);
});

test("wheel spin rotation and timing stay unchanged", () => {
  assert.match(css, /\.jackpot-wheel\.is-spinning\s*\{\s*animation:\s*jackpot-wheel-spin 12\.8s cubic-bezier\(\.12, \.66, \.08, 1\) forwards;\s*\}/);
  assert.match(css, /@keyframes jackpot-wheel-spin\s*\{\s*from\s*\{\s*transform:\s*rotate\(0\);\s*\}\s*to\s*\{\s*transform:\s*rotate\(var\(--jackpot-stop\)\);\s*\}\s*\}/);
  assert.match(consoleSource, /"--jackpot-stop": `\$\{activeWinner \? winnerAngle\(activeWinner\.winnerParticipantId\) : 1800\}deg`/);
});

test("wheel center and gloss are static siblings outside the rotating face", () => {
  assert.match(consoleSource, /<div className="jackpot-wheel-frame">[\s\S]*?<div\s+key=\{spinning \? activeWinner\?\.resultToken \|\| "spinning" : "idle"\}[\s\S]*?className=\{`jackpot-wheel/);
  assert.match(consoleSource, /<div className="jackpot-wheel-gloss" aria-hidden="true"\s*\/>\s*<div className="jackpot-wheel-center" aria-hidden="true">[\s\S]*?jackpot-wheel-center-sparkle/);
  assert.match(css, /\.jackpot-wheel-frame\s*\{[^}]*container-type:\s*inline-size/s);
  assert.match(css, /\.jackpot-wheel-gloss\s*\{[^}]*position:\s*absolute[^}]*z-index:\s*3/s);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-center\s*\{[^}]*z-index:\s*5/s);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-name\s*\{[^}]*rotate\(var\(--name-angle\)\) translateY\(-35\.5cqi\);/s);
});

test("drawing button keeps its ink fill and uses a reduced-motion-aware gold shimmer", () => {
  assert.match(consoleSource, /className=\{`jackpot-spin-button \$\{spinning \? "is-spinning" : ""\}`\}/);
  assert.match(consoleSource, /spinning \? "DRAWING…"/);
  assert.match(css, /\.jackpot-spin-button\.is-spinning:disabled[\s\S]*?background:\s*var\(--jp-ink\)/);
  assert.match(css, /\.jackpot-spin-button\.is-spinning::after[\s\S]*?animation:\s*jackpot-button-shimmer 3\.8s ease-in-out infinite/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.jackpot-spin-button\.is-spinning::after\s*\{\s*animation:\s*none;/);
});

test("wheel initials remain visible in radial ink serif styling at control and live sizes", () => {
  assert.match(consoleSource, /wheelNames\.map\(\(participant, index\) => \([\s\S]*?\{initials\(participant\.customer_name\)\}/);
  assert.match(css, /\.jackpot-wheel-name\s*\{[^}]*color:\s*var\(--jp-ink\)[^}]*font-family:\s*var\(--font-beauty\), Georgia, serif[^}]*font-size:\s*18px/s);
  assert.match(css, /\.jackpot-live-shell \.jackpot-wheel-name\s*\{[^}]*font-size:\s*24px/s);
  assert.match(css, /@media screen and \(max-width: 760px\)\s*\{[^}]*\.jackpot-live-shell \.jackpot-wheel-name\s*\{\s*font-size:\s*18px/s);
});

test("salon wheel uses four cycling nail assets inside the rotating face", () => {
  assert.match(consoleSource, /const wheelNailAssets = \[[\s\S]*?jackpot-nail-pink\.webp[\s\S]*?jackpot-nail-nude\.webp[\s\S]*?jackpot-nail-french\.webp[\s\S]*?jackpot-nail-rose-gold\.webp/);
  assert.match(consoleSource, /className="jackpot-wheel-nail-tip"[\s\S]*?wheelNailAssets\[index % wheelNailAssets\.length\]/);
  assert.match(consoleSource, /className=\{`jackpot-wheel \$\{spinning \? "is-spinning" : ""\}`\}[\s\S]*?className="jackpot-wheel-nail-tip"[\s\S]*?className="jackpot-wheel-name"/);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel\s*\{[^}]*radial-gradient\(circle, #FFFFFF 35%, #F6EFE3 100%\)/s);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel::before\s*\{[^}]*radial-gradient\(circle, #F8E8EB 35%, #EBCFD5 100%\)[^}]*mask:\s*repeating-conic-gradient/s);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-nail-tip\s*\{[^}]*width:\s*4\.5cqi;[^}]*height:\s*8\.1667cqi;[^}]*translateY\(-44cqi\)/s);
});

test("salon stand, contact shadow, brush pointer and polish eyebrow are static", () => {
  assert.match(consoleSource, /className="jackpot-wheel-stage"[\s\S]*?className="jackpot-pointer"[\s\S]*?jackpot-pointer-handle[\s\S]*?jackpot-pointer-ferrule[\s\S]*?jackpot-pointer-brush[\s\S]*?jackpot-wheel-contact-shadow[\s\S]*?jackpot-wheel-stand[\s\S]*?className="jackpot-wheel-frame"/);
  assert.match(consoleSource, /<PillBottle className="jackpot-prize-eyebrow-icon"/);
  assert.match(consoleSource, /className="jackpot-winner-nail-burst"[\s\S]*?wheelNailAssets\.map/);
  assert.match(css, /\.jackpot-wheel-stand\s*\{[^}]*top:\s*calc\(100% - \.7cqi\)[^}]*z-index:\s*1/s);
  assert.match(css, /\.jackpot-wheel-contact-shadow\s*\{[^}]*radial-gradient\(ellipse/s);
  assert.match(css, /\.jackpot-root:not\(\.is-live\) \.jackpot-wheel-stand,[\s\S]*?\.jackpot-root:not\(\.is-live\) \.jackpot-wheel-contact-shadow \{ display: none;/);
  assert.match(css, /\.jackpot-live-shell \.jackpot-wheel-panel\s*\{[^}]*top:\s*47\.5926vh;[^}]*left:\s*26\.40625vw;[^}]*width:\s*min\(55\.5556vw, 55\.5556vh\)/s);
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card\s*\{[^}]*top:\s*23\.1482vh;[^}]*left:\s*57\.8125vw;[^}]*width:\s*min\(32\.292vw, 620px\)[^}]*background:\s*rgba\(255, 253, 249, \.78\)[^}]*blur\(8px\)/s);
  assert.match(css, /\.jackpot-live-progress i\s*\{[^}]*border-radius:\s*50% 50% 50% 50% \/ 62% 62% 38% 38%/s);
});

test("fullscreen stats wrap labels, use lining tabular numerals, and keep ready status spaced", () => {
  assert.match(css, /font-feature-settings:\s*"lnum" 1, "tnum" 1/);
  assert.match(css, /@media screen and \(max-width: 1599px\)\s*\{[\s\S]*?font-size:\s*12px;[\s\S]*?letter-spacing:\s*\.12em;[\s\S]*?white-space:\s*normal;[\s\S]*?overflow-wrap:\s*anywhere/s);
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card > p\.jackpot-live-ready\s*\{[^}]*margin-top:\s*18px;/s);
  assert.match(consoleSource, /<div className="jackpot-winner-medal"><Medal size=\{36\} \/><\/div>/);
  assert.match(consoleSource, /<div><dt>Member ID<\/dt><dd>\{activeWinner\.memberIdMasked\}<\/dd><\/div>/);
  assert.match(consoleSource, /<div><dt>Phone<\/dt><dd>\*\*\*\*\{activeWinner\.phoneLast4\}<\/dd><\/div>/);
});

test("stats put lining tabular numbers above readable labels", () => {
  assert.match(consoleSource, /<div><dd>\{currentPrize\?\.remaining_quantity \?\? 0\}<\/dd><dt>Remaining<\/dt><\/div>/);
  assert.match(css, /\.jackpot-prize-card dd\s*\{[^}]*font-size:\s*32px[^}]*font-variant-numeric:\s*lining-nums tabular-nums/s);
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card dd\s*\{[^}]*font-size:\s*clamp\(32px, 4\.45vh, 48px\)[^}]*font-variant-numeric:\s*lining-nums tabular-nums/s);
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card dt\s*\{[^}]*font-size:\s*13px[^}]*letter-spacing:\s*\.24em/s);
});

test("fairness copy is readable and the ready status keeps tracked caps", () => {
  assert.match(css, /\.jackpot-fairness,[\s\S]*?font-size:\s*14px;[\s\S]*?font-weight:\s*400;[\s\S]*?letter-spacing:\s*0;[\s\S]*?line-height:\s*1\.7;/);
  assert.match(css, /\.jackpot-live-shell \.jackpot-live-ready\s*\{[^}]*letter-spacing:\s*\.18em/s);
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card > p\.jackpot-live-fairness\s*\{[^}]*font-weight:\s*400[^}]*letter-spacing:\s*0/s);
});

test("fullscreen placard fits short viewports and mobile control title stays on one line", () => {
  assert.match(css, /min-height:\s*clamp\(460px, 59vh, 640px\)/);
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card h3\s*\{[^}]*font-size:\s*clamp\(36px, min\(5\.6vh, 3\.2vw\), 66px\)/s);
  assert.match(css, /\.jackpot-live-progress\s*\{[^}]*margin-top:\s*clamp\(8px, 1\.85vh, 20px\)/s);
  assert.match(css, /@media screen and \(max-height: 800px\) and \(min-height: 761px\) and \(min-width: 761px\)\s*\{[^}]*jackpot-stage-header \{ top: 16vh/s);
  assert.match(css, /\.jackpot-brand h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.jackpot-brand p\s*\{\s*display:\s*none/);
  assert.match(css, /\.jackpot-preview-badge\s*\{[^}]*font-size:\s*11px/s);
});

test("cookie consent is hidden only on Jackpot pages", () => {
  assert.match(css, /body:has\(\.jackpot-root\) \.analytics-consent\s*\{\s*display:\s*none !important;\s*\}/);
  assert.doesNotMatch(css, /body:has\(\.public-site\) \.analytics-consent\s*\{\s*display:\s*none/);
});
