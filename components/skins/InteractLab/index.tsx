"use client";

import { MaskLine, useMaskReveal } from "@/components/MaskReveal";
import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./InteractLab.module.css";

export function InteractLab() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorVariant, setCursorVariant] = useState<"default" | "active" | "press">(
    "default",
  );

  useEffect(() => {
    if (globalThis.window === undefined) return;
    const matchesCoarse = globalThis.matchMedia("(hover: none)").matches;
    if (matchesCoarse) return;

    let x = globalThis.innerWidth / 2;
    let y = globalThis.innerHeight / 2;
    let tx = x;
    let ty = y;
    let rafId: number | null = null;

    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("[data-cursor]");
      if (interactive) {
        const variant =
          interactive.getAttribute("data-cursor") === "press"
            ? "press"
            : "active";
        setCursorVariant((prev) => (prev === variant ? prev : variant));
      } else {
        setCursorVariant((prev) => (prev === "default" ? prev : "default"));
      }
    };

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x - 12}px, ${y - 12}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    globalThis.addEventListener("mousemove", move);
    rafId = requestAnimationFrame(tick);
    return () => {
      globalThis.removeEventListener("mousemove", move);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className={styles.root}>
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${styles[`cursor_${cursorVariant}`] ?? ""}`}
        aria-hidden="true"
      />
      <TopBar />
      <Hero />
      <Cases />
      <Principle />
      <Toolkit />
      <Outro />
    </main>
  );
}

function TopBar() {
  return (
    <header className={styles.topbar}>
      <a href="#hero" className={styles.topLogo} data-cursor="active">
        <WiggleText>Hassan Ansari</WiggleText>
      </a>
      <nav className={styles.topNav}>
        <a href="#cases" data-cursor="active">
          <WiggleText>Cases</WiggleText>
        </a>
        <a href="#principle" data-cursor="active">
          <WiggleText>Principle</WiggleText>
        </a>
        <a href="#toolkit" data-cursor="active">
          <WiggleText>Tools</WiggleText>
        </a>
        <a href="#outro" data-cursor="active">
          <WiggleText>Talk</WiggleText>
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <p className={styles.heroKicker}>
        <span className={styles.dot} /> {profile.location} · {profile.availability.message}
      </p>
      <h1 className={styles.heroTitle}>
        <span className={styles.heroLine}>
          <WiggleText>Hassan,</WiggleText>
        </span>
        <span className={styles.heroLine}>
          builder of <em>things</em>
        </span>
        <span className={styles.heroLine}>
          <span className={styles.heroLight}>
            (and small interactions).
          </span>
        </span>
      </h1>
      <p className={styles.heroSub}>{profile.intro}</p>
      <div className={styles.heroCtas}>
        <MagneticBtn href={`mailto:${profile.email}`} variant="primary">
          Start a conversation
        </MagneticBtn>
        <MagneticBtn href="#cases" variant="quiet">
          See the work
        </MagneticBtn>
      </div>
    </section>
  );
}

function Cases() {
  return (
    <section className={styles.cases} id="cases">
      <p className={styles.eyebrow}>
        <WiggleText>Selected work</WiggleText>
      </p>
      <h2 className={styles.sectionTitle}>
        Three shipped <em>bets</em>.
      </h2>
      <ul className={styles.caseList}>
        {cases.map((c, idx) => (
          <CaseEntry key={c.id} caseStudy={c} index={idx} />
        ))}
      </ul>
    </section>
  );
}

function CaseEntry({
  caseStudy,
  index,
}: Readonly<{ caseStudy: Case; index: number }>) {
  const [open, setOpen] = useState(false);
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const outcomePara = caseStudy.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : caseStudy.summary;
  const accent = caseStudy.brand?.primary ?? "#ff5d3b";

  return (
    <li
      className={`${styles.case} ${open ? styles.caseOpen : ""}`}
      style={{ "--accent": accent } as CSSProperties}
    >
      <button
        type="button"
        className={styles.caseRow}
        onClick={() => setOpen((prev) => !prev)}
        data-cursor="press"
        aria-expanded={open}
      >
        <span className={styles.caseIndex}>0{index + 1}</span>
        <span className={styles.caseTitle}>
          <WiggleText>{caseStudy.title}</WiggleText>
        </span>
        <span className={styles.caseYear}>{caseStudy.meta.year}</span>
        <span className={styles.caseGlyph} aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div className={styles.caseDetail} aria-hidden={!open}>
        <div className={styles.caseGrid}>
          <article>
            <p className={styles.caseLabel}>The bet</p>
            <p className={styles.caseBody}>{bet}</p>
          </article>
          <article>
            <p className={styles.caseLabel}>The outcome</p>
            <p className={styles.caseBody}>{outcome}</p>
          </article>
          <article>
            <p className={styles.caseLabel}>Stack</p>
            <p className={styles.caseBody}>{caseStudy.meta.stack}</p>
          </article>
        </div>
        {caseStudy.outcome.metrics?.length ? (
          <ul className={styles.caseMetrics}>
            {caseStudy.outcome.metrics.slice(0, 4).map((metric) => (
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

function Principle() {
  return (
    <section className={styles.principle} id="principle">
      <p className={styles.eyebrow}>
        <WiggleText>Operating principle</WiggleText>
      </p>
      <blockquote className={styles.principleQuote}>
        {philosophy.quote.map((line, idx) => (
          <p key={line} className={styles.principleLine} data-index={idx}>
            {line}
          </p>
        ))}
      </blockquote>
    </section>
  );
}

function Toolkit() {
  const groups = toolkit.engineering.slice(0, 6);
  return (
    <section className={styles.toolkit} id="toolkit">
      <p className={styles.eyebrow}>
        <WiggleText>What I reach for</WiggleText>
      </p>
      <h2 className={styles.sectionTitle}>
        The <em>standard</em> library.
      </h2>
      <ul className={styles.toolkitList}>
        {groups.map((group) => (
          <li key={group.category} className={styles.toolkitRow}>
            <p className={styles.toolkitCat}>
              <WiggleText>{group.category}</WiggleText>
            </p>
            <p className={styles.toolkitItems}>{group.items.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Outro() {
  const titleRef = useMaskReveal<HTMLHeadingElement>();
  const footRef = useMaskReveal<HTMLElement>();
  return (
    <section className={styles.outro} id="outro">
      <p className={styles.eyebrow}>
        <WiggleText>Let&apos;s talk</WiggleText>
      </p>
      <h2 ref={titleRef} className={styles.outroTitle}>
        <MaskLine>Built things you&apos;d like to</MaskLine>
        <MaskLine>
          <em>talk about</em>?
        </MaskLine>
      </h2>
      <p className={styles.outroSub}>
        {profile.availability.message} Bring the constraint, the deadline, and the
        team you&apos;ve got.
      </p>
      <MagneticBtn href={`mailto:${profile.email}`} variant="primary">
        {profile.email}
      </MagneticBtn>
      <ul className={styles.outroLinks}>
        <li>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" data-cursor="active">
            <WiggleText>LinkedIn</WiggleText>
          </a>
        </li>
        <li>
          <a href={profile.socials.github} target="_blank" rel="noreferrer" data-cursor="active">
            <WiggleText>GitHub</WiggleText>
          </a>
        </li>
        <li>
          <a href={profile.socials.x} target="_blank" rel="noreferrer" data-cursor="active">
            <WiggleText>x.com</WiggleText>
          </a>
        </li>
        <li>
          <a href={profile.socials.pubdev} target="_blank" rel="noreferrer" data-cursor="active">
            <WiggleText>pub.dev</WiggleText>
          </a>
        </li>
      </ul>
      <footer ref={footRef} className={styles.outroFoot}>
        <p>
          <MaskLine>
            {profile.name} · {profile.location} · © {new Date().getFullYear()}
          </MaskLine>
        </p>
        <p>
          <MaskLine>Interaction Lab · same content, micro-tuned</MaskLine>
        </p>
      </footer>
    </section>
  );
}

/* ─────────── primitives ─────────── */

function WiggleText({ children }: Readonly<{ children: string }>) {
  const text = String(children);
  return (
    <span className={styles.wiggle}>
      {Array.from(text).map((char, idx) => (
        <span
          key={`${char}-${idx}`}
          className={styles.wiggleChar}
          style={{ "--i": idx } as CSSProperties}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

function MagneticBtn({
  href,
  variant,
  children,
}: Readonly<{
  href: string;
  variant: "primary" | "quiet";
  children: React.ReactNode;
}>) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const onMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (event.clientX - cx) * 0.25;
    const dy = (event.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      className={variant === "primary" ? styles.btnPrimary : styles.btnQuiet}
      data-cursor="press"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span>{children}</span>
    </a>
  );
}
