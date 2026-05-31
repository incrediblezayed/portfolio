"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { animate, createTimer, stagger, utils } from "animejs";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./InkFlow.module.css";

interface InkSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  path: string;
  caseStudy?: Case;
}

const SHAPES = [
  "M 250 80 C 380 60, 460 160, 440 280 C 420 400, 320 460, 220 440 C 120 420, 60 320, 80 220 C 100 120, 180 100, 250 80 Z",
  "M 260 60 C 410 70, 470 200, 440 320 C 410 440, 270 470, 170 430 C 70 390, 50 260, 110 160 C 170 60, 240 60, 260 60 Z",
  "M 240 90 C 360 80, 470 130, 460 250 C 450 370, 360 460, 240 450 C 120 440, 60 350, 70 240 C 80 130, 160 100, 240 90 Z",
  "M 240 70 C 390 60, 480 170, 450 290 C 420 410, 300 470, 190 440 C 80 410, 40 290, 80 180 C 120 70, 210 70, 240 70 Z",
  "M 250 100 C 360 90, 460 170, 440 290 C 420 410, 300 470, 200 440 C 100 410, 50 290, 90 190 C 130 90, 220 100, 250 100 Z",
  "M 250 80 C 380 60, 460 160, 440 280 C 420 400, 320 460, 220 440 C 120 420, 60 320, 80 220 C 100 120, 180 100, 250 80 Z",
];

function buildSlides(): InkSlide[] {
  const intro: InkSlide = {
    id: "intro",
    eyebrow: profile.location,
    title: profile.name,
    body: profile.tagline,
    accent: "#1a1a1a",
    path: SHAPES[0]!,
  };

  const caseSlides: InkSlide[] = cases.map((c, idx) => {
    const chosen = c.options.find((o) => o.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      eyebrow: `Case ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
      title: c.title,
      body: bet,
      accent: c.brand?.primary ?? "#1a1a1a",
      path: SHAPES[idx + 1] ?? SHAPES[0]!,
      caseStudy: c,
    };
  });

  const closing: InkSlide[] = [
    {
      id: "philosophy",
      eyebrow: "Operating principle",
      title: philosophy.quote[0] ?? "",
      body: philosophy.quote.slice(1).join(" "),
      accent: "#1a1a1a",
      path: SHAPES[4]!,
    },
    {
      id: "contact",
      eyebrow: "Standing invitation",
      title: profile.availability.message,
      body: profile.email,
      accent: "#1a1a1a",
      path: SHAPES[5]!,
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function InkFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SLIDES[activeIndex] ?? SLIDES[0]!;
  const pathRef = useRef<SVGPathElement | null>(null);
  const previousIndex = useRef(0);

  useEffect(() => {
    if (previousIndex.current === activeIndex) return;
    const el = pathRef.current;
    if (!el || globalThis.window === undefined) return;
    animate(el, {
      d: active.path,
      duration: 1100,
      ease: "inOut(3)",
    });
    previousIndex.current = activeIndex;
  }, [activeIndex, active.path]);

  // Idle wobble — the ink blob breathes
  useEffect(() => {
    const el = pathRef.current;
    if (!el || globalThis.window === undefined) return;
    const timer = createTimer({
      duration: 6000,
      loop: true,
      onUpdate: (self) => {
        const t = self.currentTime / 6000;
        const wobble = Math.sin(t * Math.PI * 2) * 4;
        utils.set(el, { translateX: wobble, translateY: -wobble * 0.6 });
      },
    });
    return () => {
      timer.cancel();
    };
  }, []);

  // Reveal each slide's text on activation
  const textRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = textRef.current;
    if (!el || globalThis.window === undefined) return;
    const targets = el.querySelectorAll(`[data-flow]`);
    if (targets.length === 0) return;
    animate(targets, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 720,
      delay: stagger(80),
      ease: "out(3)",
    });
  }, [activeIndex]);

  return (
    <main className={styles.root}>
      <InkCanvas />
      <div className={styles.stage}>
        <svg
          className={styles.blob}
          viewBox="0 0 520 540"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="ink-roughen" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="6" />
            </filter>
          </defs>
          <path
            ref={pathRef}
            d={SLIDES[0]!.path}
            fill={active.accent}
            filter="url(#ink-roughen)"
          />
        </svg>

        <section
          ref={textRef}
          className={styles.copy}
          style={{ "--accent": active.accent } as CSSProperties}
        >
          <p className={styles.eyebrow} data-flow>
            {active.eyebrow}
          </p>
          <h1 className={styles.title} data-flow>
            {active.title}
          </h1>
          <p className={styles.body} data-flow>
            {active.body}
          </p>
          {active.caseStudy ? (
            <CaseMetrics caseStudy={active.caseStudy} />
          ) : null}
          {active.id === "contact" ? (
            <a className={styles.cta} href={`mailto:${profile.email}`} data-flow>
              {profile.email} →
            </a>
          ) : null}
        </section>

        <SlideNav
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>
    </main>
  );
}

function CaseMetrics({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;
  const metrics = caseStudy.outcome.metrics ?? [];

  return (
    <div className={styles.metrics} data-flow>
      <p className={styles.outcomeLead}>{outcome}</p>
      {metrics.length > 0 ? (
        <ul>
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

function SlideNav({
  activeIndex,
  onSelect,
}: Readonly<{ activeIndex: number; onSelect: (idx: number) => void }>) {
  return (
    <nav className={styles.nav} aria-label="Ink flow sections">
      <button
        type="button"
        className={styles.navArrow}
        onClick={() => onSelect(Math.max(0, activeIndex - 1))}
        disabled={activeIndex === 0}
        aria-label="Previous"
      >
        ←
      </button>
      <ul>
        {SLIDES.map((slide, idx) => (
          <li key={slide.id}>
            <button
              type="button"
              className={`${styles.navDot} ${idx === activeIndex ? styles.navDotActive : ""}`}
              onClick={() => onSelect(idx)}
              aria-label={slide.eyebrow}
              aria-current={idx === activeIndex ? "true" : undefined}
            >
              <span>{String(idx + 1).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={styles.navArrow}
        onClick={() => onSelect(Math.min(SLIDES.length - 1, activeIndex + 1))}
        disabled={activeIndex === SLIDES.length - 1}
        aria-label="Next"
      >
        →
      </button>
    </nav>
  );
}

function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || globalThis.window === undefined) return;
    if (globalThis.matchMedia("(hover: none)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drops: { x: number; y: number; r: number; life: number }[] = [];
    let rafId: number | null = null;

    const resize = () => {
      canvas.width = globalThis.innerWidth * globalThis.devicePixelRatio;
      canvas.height = globalThis.innerHeight * globalThis.devicePixelRatio;
      canvas.style.width = `${globalThis.innerWidth}px`;
      canvas.style.height = `${globalThis.innerHeight}px`;
      ctx.scale(globalThis.devicePixelRatio, globalThis.devicePixelRatio);
    };
    resize();

    const onMove = (event: MouseEvent) => {
      drops.push({
        x: event.clientX,
        y: event.clientY,
        r: 4 + Math.random() * 8,
        life: 1,
      });
      if (drops.length > 60) drops.shift();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const drop = drops[i]!;
        drop.life -= 0.013;
        if (drop.life <= 0) {
          drops.splice(i, 1);
          continue;
        }
        const radius = drop.r * (0.4 + drop.life * 1.4);
        const opacity = Math.max(0, drop.life * 0.34);
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 20, 20, ${opacity})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(tick);
    };

    globalThis.addEventListener("mousemove", onMove);
    globalThis.addEventListener("resize", resize);
    rafId = requestAnimationFrame(tick);

    return () => {
      globalThis.removeEventListener("mousemove", onMove);
      globalThis.removeEventListener("resize", resize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
