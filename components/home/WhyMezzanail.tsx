import { homepageContent } from "@/config/homepage";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyMezzanail({ locale }: { locale: Locale }) {
  const copy = homepageContent[locale].why;

  return (
    <section className="home-why mn-home-section" aria-labelledby="why-mezzanail-title">
      <div className="mn-home-shell">
        <div id="why-mezzanail-title">
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            subtitle={copy.subtitle}
          />
        </div>
        <div className="why-mezzanail-grid">
          {copy.items.map((item) => (
            <article className="why-mezzanail-item" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
