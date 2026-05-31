"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { animate, stagger } from "animejs";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Shockwave.module.css";

interface SwSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  glow: string;
  caseStudy?: Case;
}

function buildSlides(): SwSlide[] {
  const intro: SwSlide = {
    id: "intro",
    eyebrow: `${profile.location} · ${profile.availability.message}`,
    title: "HASSAN",
    body: profile.tagline,
    accent: "#ff3d3d",
    glow: "#ff8a3d",
  };

  const caseSlides: SwSlide[] = cases.map((c) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    const cleanTitle = c.title.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
    return {
      id: c.id,
      eyebrow: `CASE ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
      title: cleanTitle,
      body: bet,
      accent: c.brand?.primary ?? "#ff3d3d",
      glow: c.brand?.primary ?? "#ff8a3d",
      caseStudy: c,
    };
  });

  const closing: SwSlide[] = [
    {
      id: "philosophy",
      eyebrow: "OPERATING PRINCIPLE",
      title: "BETS",
      body: philosophy.quote.join(" "),
      accent: "#ffd86b",
      glow: "#ff8a3d",
    },
    {
      id: "contact",
      eyebrow: "AVAILABLE",
      title: "TALK",
      body: profile.availability.message,
      accent: "#7df9ff",
      glow: "#a06bff",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function Shockwave() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index] ?? SLIDES[0]!;

  useEffect(() => {
    if (globalThis.window === undefined) return;
    const onScroll = () => {
      const vh = globalThis.innerHeight;
      const scroll = globalThis.scrollY;
      const i = Math.min(
        SLIDES.length - 1,
        Math.max(0, Math.round(scroll / vh)),
      );
      setIndex((prev) => (prev === i ? prev : i));
    };
    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => globalThis.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className={styles.root}
      style={
        {
          "--accent": slide.accent,
          "--glow": slide.glow,
        } as CSSProperties
      }
    >
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.gradient} aria-hidden="true" />

      <header className={styles.hudHead}>
        <div className={styles.brandKicker}>
          <span className={styles.brandDot} /> SHOCKWAVE
        </div>
        <div className={styles.brandRight}>
          {String(index + 1).padStart(2, "0")} /
          {String(SLIDES.length).padStart(2, "0")}
        </div>
      </header>

      <section className={styles.stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className={styles.stageInner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className={styles.eyebrow}>{slide.eyebrow}</p>
            <ShockTitle text={slide.title} keyId={slide.id} />
            <p className={styles.body}>{slide.body}</p>
            {slide.caseStudy ? <CaseMetrics caseStudy={slide.caseStudy} /> : null}
            {slide.id === "contact" ? (
              <a className={styles.cta} href={`mailto:${profile.email}`}>
                {profile.email} →
              </a>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className={styles.hudFoot}>
        <p>cursor pulls · click shocks · scroll advances</p>
        <div className={styles.dots}>
          {SLIDES.map((s, i) => (
            <span
              key={s.id}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              style={{ "--signal": s.accent } as CSSProperties}
              aria-hidden="true"
            />
          ))}
        </div>
      </footer>

      {SLIDES.map((s) => (
        <div key={s.id} className={styles.snap} aria-hidden="true" />
      ))}
    </main>
  );
}

/* ─────────── shock title — magnetic letters + click explosion ───────────
   All animation channels go through CSS variables --mx --my --rot --o so
   entrance, magnetic pull, and shock don't fight over the same transform. */

function ShockTitle({
  text,
  keyId,
}: Readonly<{ text: string; keyId: string }>) {
  const rootRef = useRef<HTMLHeadingElement | null>(null);
  const letters = useMemo(() => Array.from(text), [text]);
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([]);
  const shocking = useRef(false);

  // entrance: stagger fade-in + drop-in
  useEffect(() => {
    const targets = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    if (targets.length === 0) return;
    targets.forEach((el) => {
      el.style.setProperty("--o", "0");
      el.style.setProperty("--my", "60px");
      el.style.setProperty("--rot", "10deg");
    });
    const handle = animate(targets, {
      "--o": [0, 1],
      "--my": ["60px", "0px"],
      "--rot": ["10deg", "0deg"],
      duration: 720,
      delay: stagger(40),
      ease: "out(3)",
    });
    return () => {
      handle.pause();
    };
  }, [keyId]);

  // magnetic pull — write directly to --mx/--my (skipped during shock)
  useEffect(() => {
    if (globalThis.window === undefined) return;
    if (globalThis.matchMedia?.("(hover: none)").matches) return;

    let rafId: number | null = null;
    let cx = 0;
    let cy = 0;
    let dirty = false;

    const onMove = (event: MouseEvent) => {
      cx = event.clientX;
      cy = event.clientY;
      dirty = true;
      rafId ??= requestAnimationFrame(tick);
    };

    const tick = () => {
      rafId = null;
      if (!dirty) return;
      dirty = false;
      if (shocking.current) return;
      for (const el of lettersRef.current) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const ex = rect.left + rect.width / 2;
        const ey = rect.top + rect.height / 2;
        const dx = cx - ex;
        const dy = cy - ey;
        const dist = Math.hypot(dx, dy);
        const radius = 240;
        if (dist > radius) {
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
          continue;
        }
        const pull = (1 - dist / radius) * 28;
        const ux = dx === 0 ? 0 : (dx / dist) * pull;
        const uy = dy === 0 ? 0 : (dy / dist) * pull;
        el.style.setProperty("--mx", `${ux}px`);
        el.style.setProperty("--my", `${uy}px`);
      }
    };

    globalThis.addEventListener("mousemove", onMove);
    return () => {
      globalThis.removeEventListener("mousemove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // shock: animejs animates --mx --my --rot outward then back to 0
  const fireShock = useCallback(
    (originX: number, originY: number) => {
      const targets = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
      if (targets.length === 0 || shocking.current) return;
      shocking.current = true;
      const rootRect = rootRef.current?.getBoundingClientRect();
      const ox = originX - (rootRect?.left ?? 0);
      const oy = originY - (rootRect?.top ?? 0);

      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        const lx = r.left - (rootRect?.left ?? 0) + r.width / 2;
        const ly = r.top - (rootRect?.top ?? 0) + r.height / 2;
        const dx = lx - ox;
        const dy = ly - oy;
        const dist = Math.hypot(dx, dy) || 1;
        const force = 260;
        const ix = (dx / dist) * force * (0.5 + Math.random() * 0.6);
        const iy = (dy / dist) * force * (0.5 + Math.random() * 0.6) - 30;
        const rot = (Math.random() - 0.5) * 60;
        animate(el, {
          "--mx": [
            { to: `${ix}px`, duration: 240, ease: "out(3)" },
            { to: "0px", duration: 760, ease: "out(5)" },
          ],
          "--my": [
            { to: `${iy}px`, duration: 240, ease: "out(3)" },
            { to: "0px", duration: 760, ease: "out(5)" },
          ],
          "--rot": [
            { to: `${rot}deg`, duration: 240, ease: "out(3)" },
            { to: "0deg", duration: 760, ease: "out(5)" },
          ],
        });
      });

      setTimeout(() => {
        shocking.current = false;
      }, 1100);
    },
    [],
  );

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLHeadingElement>) => {
      fireShock(event.clientX, event.clientY);
    },
    [fireShock],
  );

  return (
    <h1
      ref={rootRef}
      className={styles.title}
      key={keyId}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fireShock(globalThis.innerWidth / 2, globalThis.innerHeight / 2);
        }
      }}
    >
      {letters.map((c, i) => (
        <span
          key={`${keyId}-${i}`}
          ref={(el) => {
            lettersRef.current[i] = el;
          }}
          className={styles.letter}
          data-space={c === " " ? "true" : undefined}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </h1>
  );
}

/* ─────────── case metrics ─────────── */

function CaseMetrics({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;
  const metrics = caseStudy.outcome.metrics ?? [];

  return (
    <div className={styles.caseExtra}>
      <p className={styles.outcomeLead}>{outcome}</p>
      {metrics.length > 0 ? (
        <ul className={styles.metricList}>
          {metrics.slice(0, 3).map((metric) => (
            <li key={metric.label}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
