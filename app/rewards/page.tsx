import { permanentRedirect } from "next/navigation";
import { MEMBER_CENTER_URL } from "@/config/member-center";

export default function Page() {
  permanentRedirect(MEMBER_CENTER_URL);
}
