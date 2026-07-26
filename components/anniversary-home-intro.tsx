import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, Sparkles } from "lucide-react";
import styles from "./anniversary-home-intro.module.css";
import { anniversaryCampaign } from "@/lib/promotion/campaign-config";

export function AnniversaryHomeIntro() {
  return (
    <section className={styles.section} aria-labelledby="anniversary-home-title">
      <Image
        src={anniversaryCampaign.banner.png}
        alt="Mezzanail 7th Anniversary Lucky Draw Campaign"
        fill
        priority
        sizes="100vw"
        className={styles.background}
        unoptimized
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.sparkles} aria-hidden="true">
        <Sparkles size={22} />
        <Sparkles size={16} />
        <Sparkles size={18} />
      </div>
      <div className={styles.content}>
        <div className={styles.badge}>
          <Gift size={16} /> 7TH ANNIVERSARY
        </div>
        <p className={styles.kicker}>MEZZANAIL NAIL STUDIO</p>
        <h1 id="anniversary-home-title">
          Seven years of beauty.
          <br />
          One celebration made for you.
        </h1>
        <p className={styles.lead}>
          Join our anniversary lucky draw, discover member-only rewards and
          celebrate with us throughout the campaign.
        </p>
        <div className={styles.date}>
          <CalendarDays size={18} /> {anniversaryCampaign.displayDates}
        </div>
        <div className={styles.actions}>
          <Link href="/promotion" className={styles.primary}>
            Explore the Lucky Draw <ArrowRight size={17} />
          </Link>
          <a
            href={anniversaryCampaign.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
