import type { Metadata } from "next";
import { epPutkityot as client } from "@/content/clients/ep-putkityot";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "EP Putkityöt — verkkosivuehdotus | Virella Helsinki" },
  description: "EP Putkityöt: verkkosivun esittelydemo. Ei yrityksen virallinen sivusto.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

function PipeIllustration() {
  return (
    <svg viewBox="0 0 480 520" fill="none" aria-hidden="true" className={styles.pipes}>
      <defs><pattern id="ep-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" stroke="#fff" strokeOpacity=".08" /></pattern></defs>
      <rect width="480" height="520" fill="url(#ep-grid)" />
      <path d="M-30 145H235Q290 145 290 200V340Q290 390 345 390H510" stroke="#111e29" strokeWidth="56" />
      <path d="M-30 145H235Q290 145 290 200V340Q290 390 345 390H510" stroke="#becacc" strokeWidth="38" />
      <path d="M-30 133H235Q278 133 278 200V340Q278 402 345 402H510" stroke="#edf0e9" strokeOpacity=".65" strokeWidth="4" />
      <path d="M110 550V315Q110 260 165 260H510" stroke="#111e29" strokeWidth="52" />
      <path d="M110 550V315Q110 260 165 260H510" stroke="#778d95" strokeWidth="34" />
      <path d="M99 550V315Q99 249 165 249H510" stroke="#d8e2e2" strokeOpacity=".65" strokeWidth="4" />
      <rect x="188" y="115" width="24" height="60" rx="5" fill="#edf0e9" />
      <rect x="261" y="305" width="58" height="24" rx="5" fill="#edf0e9" />
      <rect x="80" y="440" width="60" height="24" rx="5" fill="#adbec2" />
      <circle cx="290" cy="215" r="34" fill="#d9ee9a" />
      <circle cx="290" cy="215" r="18" stroke="#152c3b" strokeWidth="5" />
      <path d="M268 193L312 237M312 193L268 237" stroke="#152c3b" strokeWidth="6" />
      <path d="M350 75H418M384 41V109" stroke="#d9ee9a" strokeWidth="2" />
      <circle cx="384" cy="75" r="27" stroke="#d9ee9a" strokeOpacity=".4" />
    </svg>
  );
}

export default function EpPutkityotDemo() {
  return (
    <div className={styles.site}>
      <a className={styles.skip} href="#sisalto">Siirry sisältöön</a>
      <aside className={styles.demo}><strong>{client.demo.label}</strong><span>{client.demo.notice}</span></aside>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#alku" aria-label={`${client.name}, alkuun`}><span className={styles.monogram}>EP<span>↗</span></span><span>PUTKITYÖT<small>{client.city}</small></span></a>
        <nav aria-label="Päänavigaatio"><a className={styles.navlink} href="#ennen-puhelua">Ennen puhelua</a><a className={styles.headerCall} href={client.phoneHref}>{client.phone}<span aria-hidden="true"> ↗</span></a></nav>
      </header>
      <main id="sisalto">
        <section id="alku" className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>PUTKITYÖT / HELSINKI</p>
            <h1>{client.headline}</h1>
            <p className={styles.lead}>{client.intro}</p>
            <a className={styles.button} href={client.phoneHref}>{client.callLabel}<span aria-hidden="true">↗</span></a>
            <p className={styles.phoneLine}>{client.phone}</p>
          </div>
          <div className={styles.visual}><div className={styles.visualTop}><span>EP / PUTKITYÖT</span><span>HELSINKI</span></div><PipeIllustration /><div className={styles.visualBottom}><span>Yhteys suoraan<br />puhelimitse.</span><span className={styles.visualArrow} aria-hidden="true">↗</span></div></div>
        </section>
        <section id="ennen-puhelua" className={styles.preparation}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>ENNEN PUHELUA</p><h2>Kolme asiaa,<br />joista on hyvä aloittaa.</h2><p>Lyhyt kuvaus auttaa keskustelun alkuun. Tarkempi työn sisältö sovitaan yhdessä.</p></div>
          <div className={styles.steps}>{client.preparation.map(item => <article key={item.number}><span className={styles.number}>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </section>
        <section id="yhteys" className={styles.contact}><div><p className={styles.eyebrow}>OTA YHTEYTTÄ</p><h2>Kerro, mitä<br />kohteessa tarvitaan.</h2><p>Selvitä työn sopivuus, toimialue ja aikataulu puhelimitse.</p></div><a href={client.phoneHref} className={styles.contactPhone}><span>SOITA EP PUTKITÖILLE</span>{client.phone}<span aria-hidden="true" className={styles.contactArrow}>↗</span></a></section>
      </main>
      <footer className={styles.footer}><div><strong>{client.legalName}</strong><span>Y-tunnus {client.businessId} · {client.city}</span></div><p>Verkkosivuehdotus / Virella Helsinki<br />Ei yrityksen hyväksymä tai virallinen sivusto.</p></footer>
      <div className={styles.mobileCall}><a href={client.phoneHref}>{client.callLabel}<span>{client.phone} ↗</span></a></div>
    </div>
  );
}
