import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDirectory = path.join(root, "public", "tv");

const assets = [
  ["public/gallery/minimal-manicure.jpg", "minimalist-nails"],
  ["public/gallery/extension-silver.jpg", "silver-sculpture"],
  ["public/gallery/editorial-black.jpg", "editorial-black"],
  ["public/gallery/chrome-neutral.jpg", "chrome-neutral"],
  ["public/services/homepage/hand-care.png", "hand-care"],
  ["public/services/homepage/foot-care.png", "foot-care"],
  ["public/services/homepage/callus-removal-before-after-4x3.png", "foot-treatment"],
  ["public/campaigns/7th-anniversary/banner-desktop.webp", "anniversary-campaign"],
];

await mkdir(outputDirectory, { recursive: true });

for (const [source, name] of assets) {
  const input = path.join(root, source);
  const pipeline = sharp(input).rotate().resize({
    width: 2160,
    withoutEnlargement: false,
    kernel: sharp.kernel.lanczos3,
  });

  await pipeline
    .clone()
    .webp({ quality: 88, smartSubsample: true })
    .toFile(path.join(outputDirectory, `${name}.webp`));

  await pipeline
    .clone()
    .avif({ quality: 68, effort: 5, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputDirectory, `${name}.avif`));
}

console.log(`Prepared ${assets.length * 2} TV display image assets in public/tv.`);
