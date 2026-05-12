"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { animate, stagger } from "animejs";
import { motion, useScroll, useTransform } from "motion/react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import styles from "./Keynote.module.css";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function Keynote() {
  // Smooth in-page anchor jumps for the duration of this skin's mount.
  useEffect(() => {
    if (globalThis.document === undefined) return;
    const html = globalThis.document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

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

/* ─────────── reveal primitives ─────────── */

function RevealWords({
  text,
  className,
  delayStart = 0,
  charDelay = 26,
  asElement: As = "span",
}: Readonly<{
  text: string;
  className?: string;
  delayStart?: number;
  charDelay?: number;
  asElement?: "span" | "h1" | "h2" | "p";
}>) {
  const ref = useRef<HTMLElement | null>(null);
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLSpanElement>("[data-word]");
    if (targets.length === 0) return;
    targets.forEach((t) => {
      t.style.transform = "translateY(110%) rotate(2deg)";
      t.style.opacity = "0";
    });
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          animate(targets, {
            opacity: [0, 1],
            translateY: ["110%", "0%"],
            rotate: ["2deg", "0deg"],
            duration: 900,
            delay: stagger(charDelay, { start: delayStart }),
            ease: "out(4)",
          });
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, delayStart, charDelay]);

  const refSetter = (node: HTMLElement | null) => {
    ref.current = node;
  };

  const content = words.map((w, i) =>
    /^\s+$/.test(w) ? (
      <span key={i}>{w}</span>
    ) : (
      <span key={i} className={styles.wordOuter}>
        <span data-word className={styles.wordInner}>
          {w}
        </span>
      </span>
    ),
  );

  if (As === "h1")
    return (
      <h1 ref={refSetter as React.Ref<HTMLHeadingElement>} className={className}>
        {content}
      </h1>
    );
  if (As === "h2")
    return (
      <h2 ref={refSetter as React.Ref<HTMLHeadingElement>} className={className}>
        {content}
      </h2>
    );
  if (As === "p")
    return (
      <p ref={refSetter as React.Ref<HTMLParagraphElement>} className={className}>
        {content}
      </p>
    );
  return (
    <span ref={refSetter as React.Ref<HTMLSpanElement>} className={className}>
      {content}
    </span>
  );
}

function CountUp({
  value,
  className,
}: Readonly<{ value: string; className?: string }>) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Parse leading number; if none, just display as-is with fade
    const match = /^([+-]?[\d,.]+)(.*)$/.exec(value);
    if (!match) return;
    const numStr = match[1]!.replace(/,/g, "");
    const suffix = match[2] ?? "";
    const target = Number(numStr);
    if (!Number.isFinite(target)) return;
    const decimals = (numStr.split(".")[1] ?? "").length;

    el.textContent = `0${suffix}`;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const obj = { n: 0 };
          animate(obj, {
            n: target,
            duration: 1400,
            ease: "out(3)",
            onUpdate: () => {
              const v =
                decimals > 0 ? obj.n.toFixed(decimals) : Math.round(obj.n).toString();
              el.textContent = `${v}${suffix}`;
            },
          });
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/* ─────────── top bar ─────────── */

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
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>{section.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ─────────── hero — parallax orb + word reveals + cursor tilt ─────────── */

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Orb dives down + scales as you scroll past hero
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const orbRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const productY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Cursor tilt — gentle parallax on hero
  const productRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (globalThis.window === undefined) return;
    if (globalThis.matchMedia?.("(hover: none)").matches) return;
    const el = productRef.current;
    if (!el) return;
    let rafId: number | null = null;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      tx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      ty = (e.clientY - rect.top - rect.height / 2) / rect.height;
      rafId ??= requestAnimationFrame(tick);
    };
    const tick = () => {
      rafId = null;
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty("--tilt-x", `${cy * -6}deg`);
      el.style.setProperty("--tilt-y", `${cx * 6}deg`);
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        rafId = requestAnimationFrame(tick);
      }
    };
    globalThis.addEventListener("mousemove", onMove);
    return () => {
      globalThis.removeEventListener("mousemove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <motion.p
        className={styles.eyebrow}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      >
        Made by hand, in Mumbai.
      </motion.p>

      <h1 className={styles.heroTitle}>
        <span className={styles.heroLine}>
          <RevealWords text="Hassan Ansari." asElement="span" charDelay={36} delayStart={100} />
        </span>
        <span className={`${styles.heroLine} ${styles.heroAccent}`}>
          <RevealWords text="Same person, different lens." asElement="span" charDelay={36} delayStart={420} />
        </span>
      </h1>

      <motion.p
        className={styles.heroSub}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.9 }}
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        className={styles.heroCtas}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 1.1 }}
      >
        <a href="#case-infophone" className={styles.ctaPrimary}>
          Watch the case studies →
        </a>
        <a href="#closer" className={styles.ctaQuiet}>
          Get in touch
        </a>
      </motion.div>

      <motion.div
        ref={productRef}
        className={styles.heroProductShot}
        style={{ y: productY }}
        aria-hidden="true"
      >
        <div className={styles.productGlass}>
          <div className={styles.productGlassInner}>
            <p className={styles.productSpec}>Currently</p>
            <p className={styles.productSpecValue}>{profile.currentRole.split(",")[0]}</p>
            <p className={styles.productSpecMeta}>{profile.location}</p>
          </div>
        </div>
        <motion.div
          className={styles.heroOrb}
          style={{ y: orbY, scale: orbScale, rotate: orbRotate }}
        />
      </motion.div>
    </section>
  );
}

/* ─────────── case launch — sticky stage, scroll-driven text reveals ─────────── */

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
  const titleEnd =
    ["Native, again.", "Marketplace, expanded.", "Open source, maintained."][index] ??
    "Now shipping.";

  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Sticky pins between scrollProgress ≈ 0.33 → 0.67 (section 200vh + 100vh viewport).
  // Stage opens (card → full), holds while text reveals, then closes back into a card on exit.
  const stageWidth = useTransform(scrollYProgress, [0.1, 0.3, 0.6, 0.66], ["86%", "100%", "100%", "86%"]);
  const stageHeight = useTransform(scrollYProgress, [0.1, 0.3, 0.6, 0.66], ["72vh", "100vh", "100vh", "72vh"]);
  const stageRadius = useTransform(scrollYProgress, [0.1, 0.3, 0.6, 0.66], [28, 0, 0, 28]);
  const stageShadow = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.6, 0.66],
    [
      "0 32px 90px rgba(29,29,31,0.22), 0 0 0 1px rgba(0,0,0,0.04)",
      "0 0 0 rgba(0,0,0,0)",
      "0 0 0 rgba(0,0,0,0)",
      "0 32px 90px rgba(29,29,31,0.22), 0 0 0 1px rgba(0,0,0,0.04)",
    ],
  );

  // Content reveals piece by piece inside the pinned phase, then exits as one.
  const eyebrowO = useTransform(scrollYProgress, [0.28, 0.34], [0, 1]);
  const eyebrowY = useTransform(scrollYProgress, [0.28, 0.34], [16, 0]);
  const titleO = useTransform(scrollYProgress, [0.3, 0.38], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.3, 0.38], [40, 0]);
  const subO = useTransform(scrollYProgress, [0.36, 0.42], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.36, 0.42], [22, 0]);
  const specsO = useTransform(scrollYProgress, [0.4, 0.48], [0, 1]);
  const specsY = useTransform(scrollYProgress, [0.4, 0.48], [28, 0]);
  const metricsO = useTransform(scrollYProgress, [0.46, 0.54], [0, 1]);
  const metricsY = useTransform(scrollYProgress, [0.46, 0.54], [24, 0]);
  const footO = useTransform(scrollYProgress, [0.52, 0.58], [0, 1]);
  const footY = useTransform(scrollYProgress, [0.52, 0.58], [20, 0]);

  // Global exit fade — content as a block dissolves into the closing card.
  const contentExitO = useTransform(scrollYProgress, [0.58, 0.64], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className={styles.launch}
      id={`case-${caseStudy.id}`}
      style={{ "--launch-accent": accent } as CSSProperties}
    >
      <div className={styles.launchSticky}>
        <motion.div
          className={styles.launchStage}
          style={{
            width: stageWidth,
            height: stageHeight,
            borderRadius: stageRadius,
            boxShadow: stageShadow,
          }}
        >
          <span className={styles.stageMonogram} aria-hidden="true">
            Case 0{caseStudy.number} · {caseStudy.meta.year}
          </span>

          <motion.div className={styles.launchContent} style={{ opacity: contentExitO }}>
            <motion.p
              className={styles.launchEyebrow}
              style={{ opacity: eyebrowO, y: eyebrowY }}
            >
              {caseStudy.meta.role}
            </motion.p>

            <motion.h2
              className={styles.launchTitle}
              style={{ opacity: titleO, y: titleY }}
            >
              <span className={styles.launchLine}>{caseStudy.title}.</span>
              <span className={`${styles.launchLine} ${styles.launchAccent}`}>
                {titleEnd}
              </span>
            </motion.h2>

            <motion.p
              className={styles.launchSub}
              style={{ opacity: subO, y: subY }}
            >
              {caseStudy.summary}
            </motion.p>

            <motion.ul
              className={styles.specs}
              style={{ opacity: specsO, y: specsY }}
            >
              {[
                { label: "The bet", body: bet },
                { label: "The outcome", body: outcome },
                { label: "The stack", body: caseStudy.meta.stack },
              ].map((spec) => (
                <li key={spec.label}>
                  <p className={styles.specLabel}>{spec.label}</p>
                  <p className={styles.specBody}>{spec.body}</p>
                </li>
              ))}
            </motion.ul>

            {metrics.length > 0 ? (
              <motion.div
                className={styles.metricStrip}
                style={{ opacity: metricsO, y: metricsY }}
              >
                {metrics.map((metric) => (
                  <div key={metric.label} className={styles.metric}>
                    <p className={styles.metricValue}>
                      <CountUp value={metric.value} />
                    </p>
                    <p className={styles.metricLabel}>{metric.label}</p>
                  </div>
                ))}
              </motion.div>
            ) : null}

            <motion.footer
              className={styles.launchFoot}
              style={{ opacity: footO, y: footY }}
            >
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(caseStudy.title)}`}
                className={styles.ctaPrimary}
              >
                Talk about {caseStudy.title} →
              </a>
              <p className={styles.launchAvailability}>{caseStudy.meta.status}</p>
            </motion.footer>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── principle ─────────── */

function Operating() {
  return (
    <section className={styles.principle} id="operating">
      <motion.p
        className={styles.eyebrow}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        Operating principle
      </motion.p>
      <h2 className={styles.principleQuote}>
        {philosophy.quote.map((line, idx) => (
          <motion.span
            key={line}
            className={styles.principleLine}
            data-index={idx}
            initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{
              duration: 0.9,
              ease: EASE_OUT_EXPO,
              delay: idx * 0.18,
            }}
          >
            {line}
            {idx < philosophy.quote.length - 1 ? <br /> : null}
          </motion.span>
        ))}
      </h2>
    </section>
  );
}

/* ─────────── toolkit ─────────── */

function Toolkit() {
  const groups = toolkit.engineering.slice(0, 6);
  return (
    <section className={styles.toolkit} id="toolkit">
      <header className={styles.toolkitHead}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          Inside
        </motion.p>
        <h2 className={styles.toolkitTitle}>
          <RevealWords text="What it's built with." asElement="span" charDelay={32} />
        </h2>
      </header>
      <ul className={styles.toolkitGrid}>
        {groups.map((group, i) => (
          <motion.li
            key={group.category}
            className={styles.toolkitCard}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              ease: EASE_OUT_EXPO,
              delay: i * 0.08,
            }}
          >
            <p className={styles.toolkitCat}>{group.category}</p>
            <p className={styles.toolkitItems}>{group.items.join(" · ")}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────── closer ─────────── */

function Closer() {
  return (
    <section className={styles.closer} id="closer">
      <h2 className={styles.closerTitle}>
        <span className={styles.closerLine}>
          <RevealWords text="Have a hard call" asElement="span" charDelay={42} />
        </span>
        <span className={styles.closerLine}>
          <RevealWords text="on the table?" asElement="span" charDelay={42} delayStart={280} />
        </span>
      </h2>
      <motion.p
        className={styles.closerSub}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
      >
        {profile.availability.message}
      </motion.p>
      <motion.a
        href={`mailto:${profile.email}`}
        className={styles.closerCta}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.7 }}
        whileHover={{ scale: 1.04 }}
      >
        {profile.email} →
      </motion.a>
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
        <p>
          © {new Date().getFullYear()} {profile.name} · Mumbai
        </p>
        <p>Keynote · same content, different stage</p>
      </footer>
    </section>
  );
}
