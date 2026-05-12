"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./LiquidChrome.module.css";

interface ChromeSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  distort: number;
  caseStudy?: Case;
}

function buildSlides(): ChromeSlide[] {
  const intro: ChromeSlide = {
    id: "intro",
    eyebrow: profile.location,
    title: profile.name,
    body: profile.tagline,
    accent: "#c0c0d4",
    distort: 0.32,
  };

  const caseSlides: ChromeSlide[] = cases.map((c, idx) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      eyebrow: `Case 0${c.number} · ${c.meta.year}`,
      title: c.title,
      body: bet,
      accent: c.brand?.primary ?? ["#ff6e6e", "#62d1ff", "#a0ff9d"][idx % 3] ?? "#c0c0d4",
      distort: 0.42 + idx * 0.06,
      caseStudy: c,
    };
  });

  const closing: ChromeSlide[] = [
    {
      id: "philosophy",
      eyebrow: "Operating principle",
      title: philosophy.quote[0] ?? "",
      body: philosophy.quote.slice(1).join(" "),
      accent: "#ffa56b",
      distort: 0.58,
    },
    {
      id: "contact",
      eyebrow: "Available",
      title: profile.availability.message,
      body: profile.email,
      accent: "#a78bfa",
      distort: 0.28,
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function LiquidChrome() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const activeIndex = Math.min(
    SLIDES.length - 1,
    Math.round(progress * (SLIDES.length - 1)),
  );
  const activeSlide = SLIDES[activeIndex] ?? SLIDES[0]!;

  return (
    <main className={styles.root}>
      <div className={styles.canvasWrap}>
        <Canvas
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0.2, 4.6], fov: 36 }}
        >
          <color attach="background" args={["#0a0a10"]} />
          <Suspense fallback={null}>
            <ChromeEnvironment activeAccent={activeSlide.accent} />
            <ambientLight intensity={0.1} />
            <ChromeBlob progressRef={progressRef} />
            <FloorReflection />
          </Suspense>
        </Canvas>
      </div>

      <section
        className={styles.hud}
        style={{ "--accent": activeSlide.accent } as CSSProperties}
      >
        <header className={styles.hudHead}>
          <p className={styles.brandKicker}>
            <span className={styles.brandDot} /> Liquid Chrome
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

        <footer className={styles.dots}>
          {SLIDES.map((slide, idx) => (
            <span
              key={slide.id}
              className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
              style={{ "--signal": slide.accent } as CSSProperties}
              aria-hidden="true"
            />
          ))}
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

function ChromeEnvironment({ activeAccent }: Readonly<{ activeAccent: string }>) {
  return (
    <Environment frames={Infinity} resolution={256}>
      {/* Top key light — broad warm panel */}
      <Lightformer
        form="rect"
        intensity={2.6}
        position={[0, 4, -6]}
        scale={[14, 5, 1]}
        color="#fafafa"
      />
      {/* Left accent panel — picks up the active case's color */}
      <Lightformer
        form="rect"
        intensity={3.4}
        position={[-5, 0.5, 2]}
        rotation={[0, Math.PI / 2.4, 0]}
        scale={[6, 8, 1]}
        color={activeAccent}
      />
      {/* Right cool panel — separation light */}
      <Lightformer
        form="rect"
        intensity={1.8}
        position={[5, -1, 1.5]}
        rotation={[0, -Math.PI / 2.4, 0]}
        scale={[5, 6, 1]}
        color="#5a6ad6"
      />
      {/* Floor bounce — keeps the underside from going pitch black */}
      <Lightformer
        form="rect"
        intensity={0.9}
        position={[0, -3, 3]}
        rotation={[Math.PI / 2.2, 0, 0]}
        scale={[10, 6, 1]}
        color="#1a1c2a"
      />
    </Environment>
  );
}

function ChromeBlob({
  progressRef,
}: Readonly<{ progressRef: RefObject<number> }>) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const targetColor = useRef(new THREE.Color("#c0c0d4"));
  const currentColor = useRef(new THREE.Color("#c0c0d4"));
  const distortRef = useRef(0.32);

  useFrame((state, delta) => {
    const continuous = progressRef.current * (SLIDES.length - 1);
    const idx = Math.min(SLIDES.length - 1, Math.round(continuous));
    const slide = SLIDES[idx]!;
    targetColor.current.set(slide.accent);
    currentColor.current.lerp(targetColor.current, Math.min(1, delta * 2.4));
    distortRef.current = THREE.MathUtils.damp(
      distortRef.current,
      slide.distort,
      3.2,
      delta,
    );

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.16;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.18;
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        Math.sin(continuous * 0.5) * 0.12,
        3,
        delta,
      );
    }

    if (meshRef.current) {
      const material = meshRef.current
        .material as unknown as THREE.MeshStandardMaterial & {
        distort?: number;
        speed?: number;
      };
      material.color.copy(currentColor.current);
      material.emissive.copy(currentColor.current).multiplyScalar(0.18);
      if (typeof material.distort === "number") {
        material.distort = distortRef.current;
      }
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 64]} />
          <MeshDistortMaterial
            color="#c0c0d4"
            roughness={0.05}
            metalness={1}
            distort={0.32}
            speed={2.4}
            envMapIntensity={1.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloorReflection() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial
        color="#0a0a10"
        roughness={0.42}
        metalness={0.7}
        envMapIntensity={0.4}
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
