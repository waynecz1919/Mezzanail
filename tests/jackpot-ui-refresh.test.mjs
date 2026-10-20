import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const css = read("app/anniversary-jackpot/jackpot.css");
const consoleSource = read("components/jackpot/jackpot-console.tsx");
const cssRules = (selector) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, header]) => header.trim() === selector)
  .map(([, , declarations]) => declarations)
  .join("\n");

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

test("wordmarks preserve the full 3:1 logo in fullscreen", () => {
  assert.match(css, /\.jackpot-wordmark\s*\{\s*width:\s*212px/);
  const liveWordmark = cssRules(".jackpot-live-shell .jackpot-live-wordmark");
  assert.match(liveWordmark, /width:\s*auto/);
  assert.match(liveWordmark, /height:\s*clamp\(44px, 7\.5vh, 76px\)/);
  assert.match(liveWordmark, /aspect-ratio:\s*3\s*\/\s*1/);
  assert.match(liveWordmark, /object-fit:\s*contain/);
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

test("anniversary medallion, gloss, rim and bulbs are static siblings outside the rotating face", () => {
  assert.match(consoleSource, /<div className="jackpot-wheel-frame">[\s\S]*?<div\s+key=\{spinning \? activeWinner\?\.resultToken \|\| "spinning" : "idle"\}[\s\S]*?className=\{`jackpot-wheel/);
  assert.match(consoleSource, /<div className="jackpot-wheel-gloss" aria-hidden="true"\s*\/>\s*<Image\s+className="jackpot-wheel-medallion"\s+src="\/campaigns\/7th-anniversary\/jackpot-medallion\.svg"\s+alt="Mezzanail 7th anniversary medallion"/);
  assert.match(consoleSource, /className="jackpot-wheel-bulbs" aria-hidden="true">\s*\{Array\.from\(\{ length: 24 \}/);
  assert.match(consoleSource, /jackpot-wheel-bulbs[\s\S]*?className=\{`jackpot-wheel/);
  assert.match(css, /\.jackpot-wheel-frame\s*\{[^}]*container-type:\s*inline-size/s);
  assert.match(css, /\.jackpot-wheel-gloss\s*\{[^}]*position:\s*absolute[^}]*z-index:\s*3/s);
  assert.match(css, /\.jackpot-wheel-medallion\s*\{[^}]*z-index:\s*8[^}]*width:\s*42%[^}]*transform:\s*translate\(-50%, -50%\)/s);
  assert.match(css, /\.jackpot-wheel-bulbs span:nth-child\(3n\)\s*\{[^}]*width:\s*2\.15cqi/);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-name\s*\{[^}]*rotate\(var\(--name-angle\)\) translateY\(-30cqi\);/s);
});

test("anniversary medallion matches the Owner-provided SVG exactly", () => {
  const asset = readFileSync(new URL("../public/campaigns/7th-anniversary/jackpot-medallion.svg", import.meta.url), "utf8");
  const sha256 = createHash("sha256").update(asset.replace(/\r\n/g, "\n")).digest("hex").toUpperCase();

  assert.equal(sha256, "019CA4E01C4611BCF6C439F6039D7BE3BFB19DF810AB1ABC3E0084E09DEA6BC8");
  assert.doesNotMatch(consoleSource, /jackpot-wheel-center" aria-hidden/);
});

test("fullscreen layout pins the logo and keeps top-right status within the frame", () => {
  assert.match(css, /\.jackpot-live-shell \.jackpot-live-wordmark\s*\{\s*left:\s*50vw;\s*transform:\s*translateX\(-50%\);/);
  assert.match(css, /\.jackpot-live-shell \.jackpot-live-meta\s*\{[^}]*right:\s*clamp\(48px, 3\.645833vw, 70px\)/s);
  assert.match(css, /html:has\(\.jackpot-root\.is-live\) \{ overflow-x: clip; \}/);
  assert.match(css, /\.jackpot-root\.is-live \{[^}]*width:\s*100%;[^}]*max-width:\s*100vw[^}]*overflow:\s*clip/s);
});

test("round five scales the gold rim in both layouts and keeps bulbs centred on its band", () => {
  assert.match(css, /\.jackpot-wheel-frame\s*\{[^}]*border:\s*2\.5px solid #6E5A32[^}]*linear-gradient\(135deg, #F1E2BC 0%, #C9AE77 42%, #B69B68 72%, #86703F 100%\)/s);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel,\s*\.jackpot-live-shell \.jackpot-wheel-frame \.jackpot-wheel\s*\{\s*inset:\s*4\.5cqi;/);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-rim\s*\{\s*inset:\s*4\.5cqi;[^}]*border:\s*1\.5px solid #FBF8EF/s);
  assert.match(css, /\.jackpot-wheel-frame::after\s*\{\s*inset:\s*calc\(4\.5cqi - 2px\);/);
  assert.match(css, /\.jackpot-wheel-bulbs span\s*\{[^}]*translateY\(-47\.7cqi\)/s);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-nail-tip\s*\{\s*transform:\s*translate\(-50%, -50%\) rotate\(var\(--name-angle\)\) translateY\(-41\.3cqi\);/);
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-name\s*\{[^}]*rotate\(var\(--name-angle\)\) translateY\(-30cqi\);/s);
  assert.match(css, /\.jackpot-wheel-bulbs span:nth-child\(3n\)\s*\{[^}]*width:\s*2\.15cqi/);
  assert.match(consoleSource, /state\.participants\.filter\(\(participant\) => participant\.eligible\)\.slice\(0, 8\)/);
  assert.match(consoleSource, /wheelNames\.map\(\(participant, index\) => \([\s\S]*?className="jackpot-wheel-nail-tip"[\s\S]*?wheelNailAssets\[index % wheelNailAssets\.length\][\s\S]*?style=\{\{ "--name-angle": `\$\{index \* 45\}deg` \} as React\.CSSProperties\}[\s\S]*?className="jackpot-wheel-name"[\s\S]*?style=\{\{ "--name-angle": `\$\{index \* 45\}deg` \} as React\.CSSProperties\}[\s\S]*?\{initials\(participant\.customer_name\)\}/);
});

test("fullscreen header gains ten pixels below the wordmark at review viewports", () => {
  assert.match(css, /@media screen and \(min-width: 761px\)\s*\{\s*\.jackpot-live-shell \.jackpot-stage-header\s*\{\s*top:\s*calc\(14\.3vh \+ 10px\);/);
  assert.match(css, /@media screen and \(min-width: 761px\) and \(max-height: 800px\)\s*\{\s*\.jackpot-live-shell \.jackpot-stage-header\s*\{\s*top:\s*calc\(16vh \+ 10px\);/);
});

test("winner card uses a gold four-point sparkle in its ink medallion", () => {
  assert.match(consoleSource, /<div className="jackpot-winner-medal" aria-hidden="true">\s*<svg viewBox="0 0 24 24" width=\{36\} height=\{36\} focusable="false">\s*<path d="M12 2\.48l2\.72 6\.8 6\.8 2\.72-6\.8 2\.72-2\.72 6\.8-2\.72-6\.8-6\.8-2\.72 6\.8-2\.72z" fill="currentColor" \/>/);
  assert.match(css, /\.jackpot-winner-medal\s*\{[^}]*background:\s*var\(--jp-ink\)[^}]*color:\s*var\(--jp-gold-light\)/s);
  assert.doesNotMatch(consoleSource, /<Medal size=\{36\}/);
});

test("drawing button keeps its ink fill and uses a reduced-motion-aware gold shimmer", () => {
  assert.match(consoleSource, /className=\{`jackpot-spin-button \$\{spinning \? "is-spinning" : ""\}`\}/);
  assert.match(consoleSource, /spinning \? "DRAWING…"/);
  assert.match(css, /\.jackpot-spin-button\.is-spinning:disabled[\s\S]*?background:\s*var\(--jp-ink\)/);
  assert.match(css, /\.jackpot-spin-button\.is-spinning::after[\s\S]*?animation:\s*jackpot-button-shimmer 3\.8s ease-in-out infinite/);
  assert.match(css, /\.jackpot-spin-button\.is-spinning::after\s*\{\s*background:\s*linear-gradient\(90deg, transparent, rgba\(226, 211, 176, \.35\), transparent\);/);
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
  assert.match(css, /\.jackpot-wheel-frame \.jackpot-wheel-nail-tip\s*\{[^}]*width:\s*4\.5cqi;[^}]*height:\s*8\.1667cqi;[^}]*translateY\(-41\.3cqi\)/s);
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
  assert.match(consoleSource, /<div className="jackpot-winner-medal" aria-hidden="true">\s*<svg viewBox="0 0 24 24" width=\{36\} height=\{36\} focusable="false">/);
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
  assert.match(css, /\.jackpot-live-shell \.jackpot-prize-card h3\s*\{[^}]*font-size:\s*clamp\(36px, min\(5\.6vh, 3\.2vw\), 66px\)/s);
  assert.match(css, /\.jackpot-live-progress\s*\{[^}]*margin-top:\s*clamp\(8px, 1\.85vh, 20px\)/s);
  assert.match(css, /@media screen and \(max-height: 800px\) and \(min-height: 761px\) and \(min-width: 761px\)\s*\{[^}]*jackpot-stage-header \{ top: 16vh/s);
  assert.match(css, /\.jackpot-brand h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.jackpot-brand p\s*\{\s*display:\s*none/);
  assert.match(css, /\.jackpot-preview-badge\s*\{[^}]*font-size:\s*11px/s);
});

test("round six synchronizes browser fullscreen with live mode and fits the requested viewport heights", () => {
  assert.match(consoleSource, /await document\.documentElement\.requestFullscreen\(\)/);
  assert.match(consoleSource, /document\.addEventListener\("fullscreenchange"/);
  assert.match(consoleSource, /if \(!document\.fullscreenElement\) setLiveMode\(false\)/);
  assert.match(consoleSource, /function exitLiveMode\(\)[\s\S]*?setLiveMode\(false\)[\s\S]*?document\.exitFullscreen\(\)/);
  assert.match(consoleSource, /aria-label="Exit Full Screen"/);
  assert.match(css, /\.jackpot-live-wordmark\s*\{\s*top:\s*clamp\(20px, 3\.2vh, 38px\)/);
  assert.match(css, /\.jackpot-root\.is-live\s*\{\s*height:\s*100dvh;\s*min-height:\s*0;\s*overflow:\s*hidden;/);
  const prizeCard = cssRules(".jackpot-live-shell .jackpot-prize-card");
  assert.match(prizeCard, /top:\s*47\.5926vh/);
  assert.match(prizeCard, /height:\s*auto/);
  assert.match(prizeCard, /min-height:\s*0/);
  assert.match(prizeCard, /transform:\s*translateY\(-50%\)/);
  assert.match(prizeCard, /overflow:\s*visible/);
  assert.doesNotMatch(css, /min-height:\s*clamp\(460px, 59vh, 640px\)/);
});

test("round seven keeps fullscreen branding clear and prize card content-sized", () => {
  const liveWordmark = cssRules(".jackpot-live-shell .jackpot-live-wordmark");
  const prizeCard = cssRules(".jackpot-live-shell .jackpot-prize-card");
  assert.match(liveWordmark, /object-fit:\s*contain/);
  assert.match(liveWordmark, /aspect-ratio:\s*3\s*\/\s*1/);
  assert.match(liveWordmark, /height:\s*clamp\(44px, 7\.5vh, 76px\)/);
  assert.match(prizeCard, /height:\s*auto/);
  assert.match(prizeCard, /top:\s*47\.5926vh/);
  assert.match(prizeCard, /transform:\s*translateY\(-50%\)/);

  for (const height of [585, 636, 768]) {
    const logoTop = Math.max(20, Math.min(height * 0.032, 38));
    const logoHeight = Math.max(44, Math.min(height * 0.075, 76));
    const kickerTop = height <= 800 ? height * 0.16 + 10 : height * 0.143 + 10;
    assert.ok(logoTop + logoHeight < kickerTop, `wordmark overlaps the kicker at ${height}px`);
  }
});

test("round five Web Audio sounds have an accessible remembered toggle and no campaign audio files", () => {
  const audioExtensions = /\.(?:mp3|wav|ogg|m4a|aac|flac|weba)$/i;
  const campaignDir = new URL("../public/campaigns/7th-anniversary/", import.meta.url);
  const collectFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = new URL(entry.name, `file://${directory.pathname.replaceAll("\\", "/")}${directory.pathname.endsWith("/") ? "" : "/"}`);
    return entry.isDirectory() ? collectFiles(path) : [path.pathname];
  });

  assert.deepEqual(collectFiles(campaignDir).filter((path) => audioExtensions.test(path)), []);
  assert.match(consoleSource, /new window\.AudioContext\(\)/);
  assert.match(consoleSource, /context\.resume\(\)/);
  assert.match(consoleSource, /window\.getComputedStyle\(wheel\)\.transform/);
  assert.match(consoleSource, /window\.requestAnimationFrame\(trackBoundaries\)/);
  assert.match(consoleSource, /timestamp - lastTickAt >= 40/);
  assert.match(consoleSource, /const notes = \[1046\.5, 1318\.5, 1568, 2093\]/);
  assert.match(consoleSource, /aria-label=\{`Sound \$\{enabled \? "on" : "off"\}`\}/);
  assert.match(consoleSource, /window\.localStorage\.getItem\(soundPreferenceKey\)/);
  assert.match(consoleSource, /window\.localStorage\.setItem\(soundPreferenceKey/);
  assert.match(consoleSource, /function spin\(\)[\s\S]*?prepareAudioFromSpinGesture\(\)/);
  assert.doesNotMatch(consoleSource, /<audio\b|new Audio\(/i);
});

test("Live Draw and Full Screen hide participant and ticket totals", () => {
  const liveDrawCard = consoleSource.match(/<aside className="jackpot-prize-card">([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(liveDrawCard, "Live Draw prize card markup should exist");
  assert.doesNotMatch(liveDrawCard, /Participants|Tickets|eligibleParticipants|remainingTickets/i);
  assert.match(liveDrawCard, /!liveMode && \([\s\S]*?<dt>Remaining<\/dt>[\s\S]*?<dt>Progress<\/dt>[\s\S]*?\)/);
  assert.match(liveDrawCard, /liveMode && currentPrize && \([\s\S]*?currentPrize\.remaining_quantity\} remaining/);
  assert.match(css, /\.jackpot-live-shell \.jackpot-live-remaining\s*\{[^}]*color:\s*var\(--jp-gold-text\)[^}]*font-size:\s*14px[^}]*letter-spacing:\s*\.2em[^}]*text-transform:\s*uppercase/s);
});

test("cookie consent is hidden only on Jackpot pages", () => {
  assert.match(css, /body:has\(\.jackpot-root\) \.analytics-consent\s*\{\s*display:\s*none !important;\s*\}/);
  assert.doesNotMatch(css, /body:has\(\.public-site\) \.analytics-consent\s*\{\s*display:\s*none/);
});
