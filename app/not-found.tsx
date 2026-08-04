import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OfficialFrame } from "@/components/official-site";

export default function NotFound() {
  return (
    <OfficialFrame>
      <section className="page-hero">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">404 · PAGE NOT FOUND</p>
            <h1 className="display mt-6">This page is no longer here.</h1>
            <p className="lead mt-7 max-w-2xl">
              Return to the Mezzanail homepage or explore our current nail care
              services in Melaka.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn btn-dark" href="/">
                Return home
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="btn btn-ghost" href="/services">
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </OfficialFrame>
  );
}
