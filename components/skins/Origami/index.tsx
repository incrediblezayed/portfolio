"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Canvas, useFrame } from "@react-three/fiber";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Origami.module.css";

interface FoldSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  paperTone: string;
  caseStudy?: Case;
}

function buildSlides(): FoldSlide[] {
  const intro: FoldSlide = {
    id: "intro",
    eyebrow: profile.location,
    title: profile.name,
    body: profile.tagline,
    accent: "#c1462a",
    paperTone: "#f8efde",
  };

  const caseSlides: FoldSlide[] = cases.map((c) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      eyebrow: `Folio ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
      title: c.title,
      body: bet,
      accent: c.brand?.primary ?? "#c1462a",
      paperTone: c.number % 2 === 0 ? "#f1e8d2" : "#f8efde",
      caseStudy: c,
    };
  });

  const closing: FoldSlide[] = [
    {
      id: "philosophy",
      eyebrow: "Marginalia",
      title: philosophy.quote[0] ?? "",
      body: philosophy.quote.slice(1).join(" "),
      accent: "#8a5a2a",
      paperTone: "#ede2c8",
    },
    {
      id: "contact",
      eyebrow: "Standing invitation",
      title: profile.availability.message,
      body: `Write to ${profile.email}. Bring the constraint, the deadline, and the team you have.`,
      accent: "#a23b1c",
      paperTone: "#f5ecd8",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();
const SPACING = 4.4;

export function Origami() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const continuous = progress * (SLIDES.length - 1);
  const activeIndex = Math.min(SLIDES.length - 1, Math.round(continuous));
  const activeSlide = SLIDES[activeIndex] ?? SLIDES[0]!;

  return (
    <main className={styles.root}>
      <div className={styles.canvasWrap}>
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0.2, 6.2], fov: 36 }}
        >
          <color attach="background" args={["#f4ede0"]} />
          <fog attach="fog" args={["#f4ede0", 14, 28]} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 6, 5]} intensity={1.2} color="#fff5d8" castShadow />
            <directionalLight position={[-3, -2, 2]} intensity={0.34} color="#c1462a" />
            <FoldScene progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>

      <section
        className={styles.hud}
        style={{ "--accent": activeSlide.accent } as CSSProperties}
      >
        <header className={styles.hudHead}>
          <p className={styles.brandKicker}>
            <span className={styles.brandDot} /> Origami Folio
          </p>
          <p className={styles.brandRight}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </p>
        </header>

        <article className={styles.readout} aria-live="polite">
          <p className={styles.eyebrow}>{activeSlide.eyebrow}</p>
          <h1 className={styles.title}>{activeSlide.title}</h1>
          <p className={styles.body}>{activeSlide.body}</p>
          {activeSlide.caseStudy ? (
            <CaseMetrics caseStudy={activeSlide.caseStudy} />
          ) : null}
          {activeSlide.id === "contact" ? (
            <a className={styles.cta} href={`mailto:${profile.email}`}>
              {profile.email} →
            </a>
          ) : null}
        </article>

        <footer className={styles.hudFoot}>
          <p>Scroll to unfold the next page</p>
          <span className={styles.scrollHint} aria-hidden="true">
            ↓
          </span>
        </footer>
      </section>

      <div
        ref={scrollRef}
        className={styles.scrollSpace}
        style={{ height: `${SLIDES.length * 105}vh` }}
        aria-hidden="true"
      />
    </main>
  );
}

function FoldScene({
  progressRef,
}: Readonly<{ progressRef: RefObject<number> }>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const continuous = progressRef.current * (SLIDES.length - 1);
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        -continuous * SPACING,
        2.8,
        delta,
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        Math.sin(continuous * 0.6) * 0.18,
        3,
        delta,
      );
    }
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      0.2 + Math.sin(continuous * 0.7) * 0.12,
      2.8,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {SLIDES.map((slide, idx) => (
        <Folio key={slide.id} slide={slide} index={idx} progressRef={progressRef} />
      ))}
      <Floor />
    </group>
  );
}

function Folio({
  slide,
  index,
  progressRef,
}: Readonly<{ slide: FoldSlide; index: number; progressRef: RefObject<number> }>) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const baseX = index * SPACING;

  useFrame((_, delta) => {
    const continuous = progressRef.current * (SLIDES.length - 1);
    const distance = continuous - index;
    const focus = THREE.MathUtils.clamp(1 - Math.abs(distance), 0, 1);
    const folded = 1 - focus;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        distance * -0.34,
        3,
        delta,
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        -Math.abs(distance) * 0.6,
        3,
        delta,
      );
    }

    if (leftRef.current) {
      leftRef.current.rotation.y = THREE.MathUtils.damp(
        leftRef.current.rotation.y,
        (Math.PI / 2) * folded,
        3.2,
        delta,
      );
    }
    if (rightRef.current) {
      rightRef.current.rotation.y = THREE.MathUtils.damp(
        rightRef.current.rotation.y,
        -(Math.PI / 2) * folded,
        3.2,
        delta,
      );
    }
    if (topRef.current) {
      topRef.current.rotation.x = THREE.MathUtils.damp(
        topRef.current.rotation.x,
        -(Math.PI / 2) * folded * 0.6,
        3.2,
        delta,
      );
    }
  });

  return (
    <group ref={groupRef} position={[baseX, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshStandardMaterial
          color={slide.paperTone}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={leftRef} position={[-1.2, 0, 0]}>
        <planeGeometry args={[1.2, 3.4]} />
        <meshStandardMaterial
          color={slide.paperTone}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={rightRef} position={[1.2, 0, 0]}>
        <planeGeometry args={[1.2, 3.4]} />
        <meshStandardMaterial
          color={slide.paperTone}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={topRef} position={[0, 1.7, 0]}>
        <planeGeometry args={[2.4, 0.8]} />
        <meshStandardMaterial
          color={slide.paperTone}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -1.74, 0.01]}>
        <planeGeometry args={[0.6, 0.04]} />
        <meshStandardMaterial color={slide.accent} roughness={0.6} />
      </mesh>
      <CreaseLines />
    </group>
  );
}

function CreaseLines() {
  return (
    <group position={[0, 0, 0.005]}>
      <mesh position={[-1.2, 0, 0]}>
        <planeGeometry args={[0.01, 3.4]} />
        <meshBasicMaterial color="#000" transparent opacity={0.08} />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <planeGeometry args={[0.01, 3.4]} />
        <meshBasicMaterial color="#000" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[2.4, 0.01]} />
        <meshBasicMaterial color="#000" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial
        color="#e8dcc2"
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

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
