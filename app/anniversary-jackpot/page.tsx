import styles from "./landing.module.css";

export default function AnniversaryJackpotLandingPage() {
  return (
    <main className={styles.viewport}>
      <div
        className={styles.artboard}
        role="group"
        aria-label="Mezzanail 7th Anniversary final lucky draw"
      >
        <a
          className={styles.staffLogin}
          href="/anniversary-jackpot/login"
          aria-label="Staff login"
        >
          <span className={styles.screenReaderOnly}>Staff login</span>
        </a>
      </div>
    </main>
  );
}
