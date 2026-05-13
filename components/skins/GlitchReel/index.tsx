"use client";

import { MaskLine, useMaskReveal } from "@/components/MaskReveal";
import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import styles from "./GlitchReel.module.css";

export function GlitchReel() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = globalThis.setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => globalThis.clearInterval(id);
  }, []);

  return (
    <main className={styles.root}>
      <Overlay time={time} />
      <Hero />
      {cases.map((c, idx) => (
        <Channel key={c.id} caseStudy={c} channel={idx + 2} />
      ))}
      <PrincipleChannel />
      <ToolkitChannel />
      <SignOff />
      <Scanlines />
      <Noise />
    </main>
  );
}

function Overlay({ time }: Readonly<{ time: string }>) {
  return (
    <header className={styles.overlay}>
      <div className={styles.overlayLeft}>
        <span className={styles.rec}>● REC</span>
        <span>HASSAN.TV</span>
      </div>
      <div className={styles.overlayCenter}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>
      <div className={styles.overlayRight}>
        <span>{profile.location.toUpperCase()}</span>
        <span className={styles.time}>{time}</span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className={styles.channel} data-channel="01">
      <p className={styles.channelTag}>CH 01 / IDENT</p>
      <h1 className={styles.heroHeadline}>
        <GlitchText>HASSAN</GlitchText>
        <br />
        <GlitchText>ANSARI</GlitchText>
      </h1>
      <p className={styles.heroTagline}>{profile.tagline}</p>
      <div className={styles.heroMeta}>
        <span>{"// "}{profile.currentRole.split(",")[0]}</span>
        <span>{"// "}{profile.availability.message}</span>
      </div>
      <div className={styles.signalStrip} aria-hidden="true">
        <span>SIGNAL</span>
        <span className={styles.signalBars}>
          <span /><span /><span /><span /><span />
        </span>
        <span>GOOD</span>
      </div>
    </section>
  );
}

function Channel({
  caseStudy,
  channel,
}: Readonly<{ caseStudy: Case; channel: number }>) {
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;
  const accent = caseStudy.brand?.primary ?? "#ff2e63";
  const metrics = caseStudy.outcome.metrics?.slice(0, 3) ?? [];

  return (
    <section
      className={styles.channel}
      data-channel={String(channel).padStart(2, "0")}
      style={{ "--accent": accent } as CSSProperties}
    >
      <div className={styles.switchFlash} aria-hidden="true" />

      <p className={styles.channelTag}>
        CH {String(channel).padStart(2, "0")} / {caseStudy.title.toUpperCase()}
      </p>

      <h2 className={styles.channelHeadline}>
        <GlitchText>{caseStudy.title.toUpperCase()}</GlitchText>
      </h2>

      <p className={styles.channelLede}>{caseStudy.summary}</p>

      <div className={styles.channelGrid}>
        <article>
          <p className={styles.channelLabel}>{"// THE BET"}</p>
          <p className={styles.channelBody}>{bet}</p>
        </article>
        <article>
          <p className={styles.channelLabel}>{"// THE OUTCOME"}</p>
          <p className={styles.channelBody}>{outcome}</p>
        </article>
        <article>
          <p className={styles.channelLabel}>{"// STACK"}</p>
          <p className={styles.channelBody}>{caseStudy.meta.stack}</p>
        </article>
      </div>

      {metrics.length > 0 ? (
        <ul className={styles.channelMetrics}>
          {metrics.map((metric) => (
            <li key={metric.label}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <footer className={styles.channelFoot}>
        <span>{caseStudy.meta.year}</span>
        <span>·</span>
        <span>{caseStudy.meta.status}</span>
      </footer>
    </section>
  );
}

function PrincipleChannel() {
  return (
    <section className={styles.channel} data-channel="PR">
      <div className={styles.switchFlash} aria-hidden="true" />
      <p className={styles.channelTag}>CH PR / TRANSMISSION</p>
      <blockquote className={styles.principle}>
        {philosophy.quote.map((line, idx) => (
          <p key={line} className={styles.principleLine} data-index={idx}>
            <GlitchText>{line.toUpperCase()}</GlitchText>
          </p>
        ))}
      </blockquote>
    </section>
  );
}

function ToolkitChannel() {
  const groups = toolkit.engineering.slice(0, 6);
  return (
    <section className={styles.channel} data-channel="TX">
      <div className={styles.switchFlash} aria-hidden="true" />
      <p className={styles.channelTag}>CH TX / CHANNEL GUIDE</p>
      <h2 className={styles.channelHeadline}>
        <GlitchText>TOOLKIT</GlitchText>
      </h2>
      <table className={styles.guide}>
        <thead>
          <tr>
            <th>CHAN</th>
            <th>STREAM</th>
            <th>FREQUENCY</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, idx) => (
            <tr key={group.category}>
              <td>{String(idx + 1).padStart(2, "0")}</td>
              <td>{group.category.toUpperCase()}</td>
              <td>{group.items.slice(0, 4).join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SignOff() {
  const ref = useMaskReveal<HTMLElement>();
  return (
    <section ref={ref} className={styles.signOff} data-channel="OFF">
      <div className={styles.switchFlash} aria-hidden="true" />
      <p className={styles.channelTag}>
        <MaskLine>END OF TRANSMISSION</MaskLine>
      </p>
      <h2 className={styles.signOffTitle}>
        <MaskLine>
          <GlitchText>STILL ON AIR.</GlitchText>
        </MaskLine>
      </h2>
      <p className={styles.signOffBody}>
        <MaskLine>{profile.availability.message}</MaskLine>
      </p>
      <a className={styles.signOffCta} href={`mailto:${profile.email}`}>
        <GlitchText>{profile.email}</GlitchText>
      </a>
      <p className={styles.signOffFoot}>
        <MaskLine>
          © {new Date().getFullYear()} {profile.name} · {profile.location} ·
          Glitch Showreel
        </MaskLine>
      </p>
    </section>
  );
}

function GlitchText({ children }: Readonly<{ children: React.ReactNode }>) {
  const text = String(children);
  return (
    <span className={styles.glitch} aria-label={text}>
      <span className={styles.glitchLayer} aria-hidden="true" data-layer="r">
        {text}
      </span>
      <span className={styles.glitchLayer} aria-hidden="true" data-layer="g">
        {text}
      </span>
      <span className={styles.glitchLayer} aria-hidden="true" data-layer="b">
        {text}
      </span>
      <span className={styles.glitchBase}>{text}</span>
    </span>
  );
}

function Scanlines() {
  return <div className={styles.scanlines} aria-hidden="true" />;
}

function Noise() {
  return <div className={styles.noise} aria-hidden="true" />;
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
