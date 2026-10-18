import { redirect } from "next/navigation";

// Seasonal short link → the current offers page (temporary: reused each year).
export default function DeepavaliRedirect() {
  redirect("/promotion#current-offer");
}
