"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { animate, stagger } from "animejs";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./FieldReport.module.css";

type OpStatus = "SHIPPED" | "LIVE" | "TESTING" | "MAINTAINED";

interface Operation {
  id: string;
  code: string;
  title: string;
  status: OpStatus;
  before: string;
  after: string;
  metric?: { value: string; label: string };
  caseStudy: Case;
}

function buildOps(): Operation[] {
  const SHIPPED_HINTS = ["ship", "running", "active"];
  return cases.map((c, idx) => {
    const status: OpStatus = SHIPPED_HINTS.some((h) => c.meta.status.toLowerCase().includes(h))
      ? "LIVE"
      : c.meta.status.toLowerCase().includes("test")
        ? "TESTING"
        : c.meta.status.toLowerCase().includes("maintain")
          ? "MAINTAINED"
          : "SHIPPED";
    const chosen = c.options.find((option) => option.selected);
    const rejection = chosen?.audience === "both"
      ? chosen.voices.product.rejection ?? ""
      : (chosen && "product" in chosen.voices ? chosen.voices.product.rejection : (chosen && "tech" in chosen.voices ? chosen.voices.tech.rejection : ""));
    const after = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      code: `O${idx + 1}`,
      title: c.title,
      status,
      before: rejection || c.summary,
      after,
      metric: c.outcome.metrics?.[0],
      caseStudy: c,
    };
  });
}

const OPS = buildOps();

export function FieldReport() {
  return (
    <main className={styles.root}>
      <Header />
      <Brief />
      <Operations />
      <Doctrine />
      <Equipment />
      <Closing />
      <DataRibbon />
    </main>
  );
}

function Header() {
  const reportId = `OPS-${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  return (
    <header className={styles.header}>
      <div className={styles.headerRow}>
        <span className={styles.markerLabel}>FIELD REPORT</span>
        <span className={styles.markerLabel}>{reportId}</span>
        <span className={styles.markerLabel}>RESTRICTED · WORKING DRAFT</span>
      </div>
      <div className={styles.headerRule} aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className={styles.headerMeta}>
        <div>
          <p className={styles.headerLabel}>SUBJECT</p>
          <p className={styles.headerValue}>{profile.name}</p>
        </div>
        <div>
          <p className={styles.headerLabel}>POSITION</p>
          <p className={styles.headerValue}>{profile.currentRole.split(",")[0]}</p>
        </div>
        <div>
          <p className={styles.headerLabel}>STATION</p>
          <p className={styles.headerValue}>{profile.location}</p>
        </div>
        <div>
          <p className={styles.headerLabel}>STATUS</p>
          <p className={styles.headerValue}>
            <span className={styles.statusDot} />
            {profile.availability.signal.toUpperCase()} TO ENGAGEMENT
          </p>
        </div>
      </div>
    </header>
  );
}

function Brief() {
  const briefRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = briefRef.current;
    if (!el || globalThis.window === undefined) return;
    const lines = el.querySelectorAll(`.${styles.briefLine}`);
    if (lines.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(lines, {
              opacity: [0, 1],
              translateY: [16, 0],
              duration: 720,
              delay: stagger(80),
              ease: "out(2)",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={briefRef} className={styles.brief}>
      <p className={styles.sectionTag}>§ BRIEF</p>
      <h1 className={styles.briefHead}>
        <span className={styles.briefLine} style={{ opacity: 0 }}>
          Six years of shipped Flutter,
        </span>
        <span className={styles.briefLine} style={{ opacity: 0 }}>
          one rebuild <em>scrapped</em>
        </span>
        <span className={styles.briefLine} style={{ opacity: 0 }}>
          before sunk cost
        </span>
        <span className={styles.briefLine} style={{ opacity: 0 }}>
          killed the platform.
        </span>
      </h1>
      <p className={styles.briefBody}>{profile.intro}</p>
    </section>
  );
}

function Operations() {
  return (
    <section className={styles.ops}>
      <p className={styles.sectionTag}>§ OPERATIONS</p>
      <h2 className={styles.sectionHead}>Active calls on file.</h2>
      <ol className={styles.opList}>
        {OPS.map((op) => (
          <OperationRow key={op.id} op={op} />
        ))}
      </ol>
    </section>
  );
}

function OperationRow({ op }: Readonly<{ op: Operation }>) {
  const accent = op.caseStudy.brand?.primary ?? "#7ad9ff";
  const outcomePara = op.caseStudy.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : op.caseStudy.summary;
  const metrics = op.caseStudy.outcome.metrics?.slice(0, 4) ?? [];

  return (
    <li
      className={styles.opItem}
      style={{ "--accent": accent } as CSSProperties}
    >
      <div className={styles.opHead}>
        <span className={styles.opCode}>{op.code}</span>
        <span className={styles.opTitle}>{op.title}</span>
        <span className={styles.opStatus} data-status={op.status}>
          {op.status}
        </span>
        <span className={styles.opYear}>{op.caseStudy.meta.year}</span>
      </div>
      <p className={styles.opSummary}>{op.caseStudy.summary}</p>
      <div className={styles.compare}>
        <article className={styles.compareSide}>
          <p className={styles.compareLabel}>BEFORE</p>
          <p className={styles.compareBody}>{op.before}</p>
        </article>
        <span className={styles.compareArrow} aria-hidden="true">→</span>
        <article className={styles.compareSide}>
          <p className={styles.compareLabel}>AFTER</p>
          <p className={styles.compareBody}>{op.after}</p>
        </article>
      </div>
      <div className={styles.opFoot}>
        <p className={styles.opOutcome}>{outcome}</p>
        {metrics.length > 0 ? (
          <ul className={styles.opMetrics}>
            {metrics.map((metric) => (
              <li key={metric.label}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function Doctrine() {
  return (
    <section className={styles.doctrine}>
      <p className={styles.sectionTag}>§ DOCTRINE</p>
      <h2 className={styles.sectionHead}>Operating principle.</h2>
      <ol className={styles.doctrineList}>
        {philosophy.quote.map((line, idx) => (
          <li key={line}>
            <span className={styles.doctrineNum}>P{idx + 1}</span>
            <span className={styles.doctrineLine}>{line}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Equipment() {
  const groups = toolkit.engineering.slice(0, 7);
  return (
    <section className={styles.equipment}>
      <p className={styles.sectionTag}>§ EQUIPMENT</p>
      <h2 className={styles.sectionHead}>Loadout.</h2>
      <ul className={styles.equipList}>
        {groups.map((group, idx) => (
          <li key={group.category}>
            <span className={styles.equipNum}>E{String(idx + 1).padStart(2, "0")}</span>
            <span className={styles.equipCat}>{group.category}</span>
            <span className={styles.equipItems}>{group.items.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Closing() {
  return (
    <section className={styles.closing}>
      <p className={styles.sectionTag}>§ CLOSING</p>
      <h2 className={styles.closingHead}>
        Standing line is <em>open</em>.
      </h2>
      <p className={styles.closingBody}>{profile.availability.message}</p>
      <div className={styles.closingActions}>
        <a className={styles.closingCta} href={`mailto:${profile.email}`}>
          {profile.email} →
        </a>
        <a className={styles.closingQuiet} href={profile.socials.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className={styles.closingQuiet} href={profile.socials.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className={styles.closingQuiet} href={profile.socials.pubdev} target="_blank" rel="noreferrer">
          pub.dev
        </a>
      </div>
      <p className={styles.closingSign}>
        — {profile.name} · {profile.location}
      </p>
    </section>
  );
}

function DataRibbon() {
  const [now, setNow] = useState(() => new Date());
  const [pressure, setPressure] = useState(1013);
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const tick = globalThis.setInterval(() => {
      setNow(new Date());
      setPressure((prev) => Math.round((prev + (Math.random() - 0.5) * 0.6) * 10) / 10);
      setLatency((prev) =>
        Math.max(12, Math.min(96, Math.round(prev + (Math.random() - 0.5) * 6))),
      );
    }, 1100);
    return () => globalThis.clearInterval(tick);
  }, []);

  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  const date = now.toISOString().slice(0, 10);

  return (
    <footer className={styles.ribbon} aria-label="Live data ribbon">
      <DataChip label="LAT" value="19.0760°N" />
      <DataChip label="LON" value="72.8777°E" />
      <DataChip label="TIME" value={`${time} IST`} />
      <DataChip label="DATE" value={date} />
      <DataChip label="PSI" value={`${pressure} hPa`} />
      <DataChip label="LATENCY" value={`${latency}ms`} />
      <DataChip label="UPTIME" value="6y" />
      <DataChip label="LINK" value="STABLE" status="ok" />
    </footer>
  );
}

function DataChip({
  label,
  value,
  status,
}: Readonly<{ label: string; value: string; status?: "ok" }>) {
  return (
    <div className={styles.dataChip}>
      <span className={styles.dataLabel}>{label}</span>
      <span className={`${styles.dataValue} ${status === "ok" ? styles.dataOk : ""}`}>
        {status === "ok" ? <span className={styles.dataPulse} /> : null}
        {value}
      </span>
    </div>
  );
}
