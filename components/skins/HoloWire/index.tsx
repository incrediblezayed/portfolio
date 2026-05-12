"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Canvas, useFrame } from "@react-three/fiber";
import { animate, stagger } from "animejs";
import { motion } from "motion/react";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./HoloWire.module.css";

interface HoloSlide {
  id: string;
  signal: string;
  title: string;
  body: string;
  geometry: "torus" | "icos" | "octa" | "dodec" | "knot" | "box";
  caseStudy?: Case;
}

function buildSlides(): HoloSlide[] {
  const intro: HoloSlide = {
    id: "intro",
    signal: "INIT // hassan_ansari",
    title: profile.name,
    body: profile.tagline,
    geometry: "icos",
  };

  const caseSlides: HoloSlide[] = cases.map((c, idx) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    const geoms: Array<HoloSlide["geometry"]> = ["torus", "knot", "dodec", "octa", "box"];
    return {
      id: c.id,
      signal: `CASE_0${c.number} // ${c.meta.year}`,
      title: c.title,
      body: bet,
      geometry: geoms[idx % geoms.length]!,
      caseStudy: c,
    };
  });

  const closing: HoloSlide[] = [
    {
      id: "philosophy",
      signal: "DIRECTIVE // operating_principle",
      title: philosophy.quote[0] ?? "Make the bet.",
      body: philosophy.quote.slice(1).join(" "),
      geometry: "torus",
    },
    {
      id: "contact",
      signal: "TRANSMIT // open_channel",
      title: "Let's talk.",
      body: profile.availability.message,
      geometry: "octa",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function HoloWire() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const activeIndex = Math.min(
    SLIDES.length - 1,
    Math.round(progress * (SLIDES.length - 1)),
  );
  const slide = SLIDES[activeIndex] ?? SLIDES[0]!;

  return (
    <main className={styles.root}>
      <div className={styles.gridFloor} aria-hidden="true" />
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.canvasWrap}>
        <Canvas
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 4], fov: 38 }}
        >
          <Suspense fallback={null}>
            <WireScene slide={slide} progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>

      <section className={styles.frame}>
        <header className={styles.frameHead}>
          <div className={styles.brandKicker}>
            <span className={styles.brandDot} /> HOLO_WIRE //
            <span className={styles.signal} key={slide.id}>
              {slide.signal}
            </span>
          </div>
          <div className={styles.headRight}>
            <span className={styles.headPill}>
              {String(activeIndex + 1).padStart(2, "0")} /
              {String(SLIDES.length).padStart(2, "0")}
            </span>
            <span className={styles.headBar}>
              <span
                className={styles.headBarFill}
                style={
                  {
                    width: `${(activeIndex / (SLIDES.length - 1)) * 100}%`,
                  } as CSSProperties
                }
              />
            </span>
          </div>
        </header>

        <div className={styles.cornerTL} aria-hidden="true" />
        <div className={styles.cornerTR} aria-hidden="true" />
        <div className={styles.cornerBL} aria-hidden="true" />
        <div className={styles.cornerBR} aria-hidden="true" />

        <article className={styles.readout} aria-live="polite">
          <motion.p
            key={`${slide.id}-eyebrow`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className={styles.eyebrow}
          >
            &gt; signal acquired
          </motion.p>
          <TypewriterTitle text={slide.title} keyId={slide.id} />
          <Typewriter
            text={slide.body}
            keyId={slide.id}
            className={styles.body}
            charDelay={9}
          />
          {slide.caseStudy ? (
            <CaseMetrics caseStudy={slide.caseStudy} keyId={slide.id} />
          ) : null}
          {slide.id === "contact" ? (
            <a className={styles.cta} href={`mailto:${profile.email}`}>
              &gt; transmit {profile.email}
            </a>
          ) : null}
        </article>

        <footer className={styles.frameFoot}>
          <span>HUD.v1 · scroll to advance</span>
          <span className={styles.foreFlicker}>● REC</span>
        </footer>
      </section>

      <div
        ref={scrollRef}
        className={styles.scrollSpace}
        style={{ height: `${SLIDES.length * 110}vh` }}
        aria-hidden="true"
      />
    </main>
  );
}

/* ─────────── typewriter (animejs char-by-char) ─────────── */

function Typewriter({
  text,
  keyId,
  className,
  charDelay = 14,
}: Readonly<{ text: string; keyId: string; className?: string; charDelay?: number }>) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const chars = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLSpanElement>("[data-char]");
    spans.forEach((s) => {
      s.style.opacity = "0";
    });
    const handle = animate(spans, {
      opacity: [0, 1],
      duration: 1,
      delay: stagger(charDelay),
      ease: "linear",
    });
    return () => {
      handle.pause();
    };
  }, [keyId, charDelay]);

  return (
    <p ref={ref} className={className} key={keyId}>
      {chars.map((c, i) => (
        <span
          key={`${keyId}-${i}`}
          data-char
          style={{ display: c === " " ? "inline" : "inline-block" }}
        >
          {c}
        </span>
      ))}
    </p>
  );
}

function TypewriterTitle({
  text,
  keyId,
}: Readonly<{ text: string; keyId: string }>) {
  return (
    <h1 className={styles.title} key={keyId}>
      <Typewriter
        text={text}
        keyId={`${keyId}-title`}
        className={styles.titleInner}
        charDelay={28}
      />
    </h1>
  );
}

/* ─────────── wireframe scene ─────────── */

function WireScene({
  slide,
  progressRef,
}: Readonly<{ slide: HoloSlide; progressRef: RefObject<number> }>) {
  return (
    <>
      <WireMesh geometry={slide.geometry} key={slide.id} />
      <SatelliteRing progressRef={progressRef} />
    </>
  );
}

function WireMesh({ geometry }: Readonly<{ geometry: HoloSlide["geometry"] }>) {
  const ref = useRef<THREE.LineSegments>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const wireGeo = useMemo(() => {
    const base = makeGeometry(geometry);
    return new THREE.WireframeGeometry(base);
  }, [geometry]);

  const fillGeo = useMemo(() => makeGeometry(geometry), [geometry]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.25;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = (ref.current?.rotation.y ?? 0) * 0.6;
      innerRef.current.rotation.x = (ref.current?.rotation.x ?? 0) * 0.6;
    }
  });

  return (
    <group>
      {/* Glow fill — translucent inner */}
      <mesh ref={innerRef} geometry={fillGeo}>
        <meshBasicMaterial
          color="#42ffb4"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Wireframe */}
      <lineSegments ref={ref} geometry={wireGeo}>
        <lineBasicMaterial
          color="#42ffb4"
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

function makeGeometry(kind: HoloSlide["geometry"]): THREE.BufferGeometry {
  switch (kind) {
    case "torus":
      return new THREE.TorusGeometry(1.1, 0.42, 16, 80);
    case "icos":
      return new THREE.IcosahedronGeometry(1.25, 1);
    case "octa":
      return new THREE.OctahedronGeometry(1.3, 0);
    case "dodec":
      return new THREE.DodecahedronGeometry(1.25, 0);
    case "knot":
      return new THREE.TorusKnotGeometry(0.9, 0.3, 100, 16);
    case "box":
      return new THREE.BoxGeometry(1.8, 1.8, 1.8, 4, 4, 4);
  }
}

function SatelliteRing({
  progressRef,
}: Readonly<{ progressRef: RefObject<number> }>) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.3;
      ref.current.rotation.x = Math.PI / 2 + progressRef.current * 0.4;
    }
  });

  const dots = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => {
        const a = (i / 32) * Math.PI * 2;
        return [Math.cos(a) * 2.4, Math.sin(a) * 2.4, 0] as [number, number, number];
      }),
    [],
  );

  return (
    <group ref={ref}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial
            color="#42ffb4"
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────── case metrics with stagger ─────────── */

function CaseMetrics({
  caseStudy,
  keyId,
}: Readonly<{ caseStudy: Case; keyId: string }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;
  const metrics = caseStudy.outcome.metrics ?? [];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLLIElement>("[data-metric]");
    if (items.length === 0) return;
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(8px)";
    });
    const handle = animate(items, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 520,
      delay: stagger(80, { start: 320 }),
      ease: "out(2)",
    });
    return () => {
      handle.pause();
    };
  }, [keyId]);

  return (
    <div className={styles.caseExtra} ref={ref}>
      <Typewriter
        text={outcome}
        keyId={`${keyId}-out`}
        className={styles.outcomeLead}
        charDelay={6}
      />
      {metrics.length > 0 ? (
        <ul className={styles.metricList}>
          {metrics.slice(0, 3).map((metric) => (
            <li key={metric.label} data-metric>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
