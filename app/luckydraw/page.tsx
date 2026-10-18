import { permanentRedirect } from "next/navigation";

// Short link (printed QR codes, social posts) → the current offers page.
export default function ShortLinkRedirect() {
  permanentRedirect("/promotion");
}
