import { copyFile, mkdir } from "node:fs/promises";

const assetDirectory = new URL("../public/pdf-assets/", import.meta.url);

await mkdir(assetDirectory, { recursive: true });
await Promise.all([
  copyFile(
    new URL(
      "../node_modules/@expo-google-fonts/noto-sans-sc/400Regular/NotoSansSC_400Regular.ttf",
      import.meta.url,
    ),
    new URL("NotoSansSC_400Regular.ttf", assetDirectory),
  ),
  copyFile(
    new URL("../public/brand/mezzanail-circle-logo.png", import.meta.url),
    new URL("mezzanail-circle-logo.png", assetDirectory),
  ),
]);

console.log("PDF runtime assets prepared.");
