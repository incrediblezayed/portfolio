"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import styles from "./Keynote.module.css";

export function Keynote() {
  return (
    <main className={styles.root}>
      <TopBar />
      <Hero />
      {cases.map((c, idx) => (
        <CaseLaunch key={c.id} caseStudy={c} index={idx} />
      ))}
      <Operating />
      <Toolkit />
      <Closer />
    </main>
  );
}

function TopBar() {
  const sections = [
    { id: "hero", label: profile.name.split(" ")[0] ?? "Hassan" },
    ...cases.map((c) => ({ id: `case-${c.id}`, label: c.title })),
    { id: "operating", label: "Principles" },
    { id: "toolkit", label: "Toolkit" },
    { id: "closer", label: "Contact" },
  ];

  return (
    <nav className={styles.topbar} aria-label="Sections">
      <ul>
        {sections.map((section, idx) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{idx === 0 ? section.label : section.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <p className={styles.eyebrow}>Made by hand, in Mumbai.</p>
      <h1 className={styles.heroTitle}>
        Hassan Ansari.
        <br />
        <span className={styles.heroAccent}>Same person, different lens.</span>
      </h1>
      <p className={styles.heroSub}>{profile.tagline}</p>
      <div className={styles.heroCtas}>
        <a href="#case-infophone" className={styles.ctaPrimary}>
          Watch the case studies →
        </a>
        <a href="#closer" className={styles.ctaQuiet}>
          Get in touch
        </a>
      </div>
      <div className={styles.heroProductShot} aria-hidden="true">
        <div className={styles.productGlass}>
          <div className={styles.productGlassInner}>
            <p className={styles.productSpec}>Currently</p>
            <p className={styles.productSpecValue}>{profile.currentRole.split(",")[0]}</p>
            <p className={styles.productSpecMeta}>{profile.location}</p>
          </div>
        </div>
        <div className={styles.heroOrb} />
      </div>
    </section>
  );
}

function CaseLaunch({
  caseStudy,
  index,
}: Readonly<{ caseStudy: Case; index: number }>) {
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const outcomePara = caseStudy.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : caseStudy.summary;
  const accent = caseStudy.brand?.primary ?? "#0071e3";
  const metrics = caseStudy.outcome.metrics?.slice(0, 3) ?? [];
  const titleEnd = ["Native, again.", "Marketplace, expanded.", "Open source, maintained."][index] ?? "Now shipping.";

  return (
    <section
      className={styles.launch}
      id={`case-${caseStudy.id}`}
      style={{ "--launch-accent": accent } as CSSProperties}
    >
      <header className={styles.launchHead}>
        <p className={styles.launchEyebrow}>
          Case 0{caseStudy.number}
          <span className={styles.divider}>·</span>
          {caseStudy.meta.year}
        </p>
        <h2 className={styles.launchTitle}>
          {caseStudy.title}.
          <br />
          <span className={styles.launchAccent}>{titleEnd}</span>
        </h2>
        <p className={styles.launchSub}>{caseStudy.summary}</p>
      </header>

      <div className={styles.productShot} aria-hidden="true">
        <div className={styles.productCanvas}>
          <div className={styles.productLight} />
          <div className={styles.productGlow} />
          <span className={styles.productMonogram}>
            {caseStudy.title.charAt(0)}
          </span>
        </div>
      </div>

      <ul className={styles.specs}>
        <li>
          <p className={styles.specLabel}>The bet</p>
          <p className={styles.specBody}>{bet}</p>
        </li>
        <li>
          <p className={styles.specLabel}>The outcome</p>
          <p className={styles.specBody}>{outcome}</p>
        </li>
        <li>
          <p className={styles.specLabel}>The stack</p>
          <p className={styles.specBody}>{caseStudy.meta.stack}</p>
        </li>
      </ul>

      {metrics.length > 0 ? (
        <div className={styles.metricStrip}>
          {metrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <p className={styles.metricValue}>{metric.value}</p>
              <p className={styles.metricLabel}>{metric.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <footer className={styles.launchFoot}>
        <a href={`mailto:${profile.email}?subject=${encodeURIComponent(caseStudy.title)}`} className={styles.ctaPrimary}>
          Talk about {caseStudy.title} →
        </a>
        <p className={styles.launchAvailability}>{caseStudy.meta.status}</p>
      </footer>
    </section>
  );
}

function Operating() {
  return (
    <section className={styles.principle} id="operating">
      <p className={styles.eyebrow}>Operating principle</p>
      <h2 className={styles.principleQuote}>
        {philosophy.quote.map((line, idx) => (
          <span key={line} className={styles.principleLine} data-index={idx}>
            {line}
            {idx < philosophy.quote.length - 1 ? <br /> : null}
          </span>
        ))}
      </h2>
    </section>
  );
}

function Toolkit() {
  const groups = toolkit.engineering.slice(0, 6);
  return (
    <section className={styles.toolkit} id="toolkit">
      <header className={styles.toolkitHead}>
        <p className={styles.eyebrow}>Inside</p>
        <h2 className={styles.toolkitTitle}>What it&apos;s built with.</h2>
      </header>
      <ul className={styles.toolkitGrid}>
        {groups.map((group) => (
          <li key={group.category} className={styles.toolkitCard}>
            <p className={styles.toolkitCat}>{group.category}</p>
            <p className={styles.toolkitItems}>{group.items.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Closer() {
  return (
    <section className={styles.closer} id="closer">
      <h2 className={styles.closerTitle}>
        Have a hard call
        <br />
        on the table?
      </h2>
      <p className={styles.closerSub}>{profile.availability.message}</p>
      <a href={`mailto:${profile.email}`} className={styles.closerCta}>
        {profile.email} →
      </a>
      <ul className={styles.closerLinks}>
        <li>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href={profile.socials.x} target="_blank" rel="noreferrer">
            x.com
          </a>
        </li>
        <li>
          <a href={profile.socials.pubdev} target="_blank" rel="noreferrer">
            pub.dev
          </a>
        </li>
      </ul>
      <footer className={styles.closerFoot}>
        <p>© {new Date().getFullYear()} {profile.name} · Mumbai</p>
        <p>Keynote · same content, different stage</p>
      </footer>
    </section>
  );
}
