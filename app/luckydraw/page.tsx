import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Short link (printed QR codes, social posts) → the current offers page.
export default function ShortLinkRedirect() {
  permanentRedirect("/promotion");
}
