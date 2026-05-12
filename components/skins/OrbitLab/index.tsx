"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";
import { Line, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useCallback, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./OrbitLab.module.css";

type OrbitSlide =
  | {
      kind: "intro" | "philosophy" | "toolkit" | "contact";
      key: string;
      eyebrow: string;
      title: string;
      body: string;
      accent: string;
      meta: string;
    }
  | {
      kind: "case";
      key: string;
      eyebrow: string;
      title: string;
      body: string;
      accent: string;
      meta: string;
      caseStudy: Case;
    };

const FALLBACK_CASE_ACCENTS = ["#ff7a59", "#57a8ff", "#62d88f"];

const SLIDES: OrbitSlide[] = [
  {
    kind: "intro",
    key: "intro",
    eyebrow: "Orbit Lab",
    title: profile.name,
    body: profile.tagline,
    accent: "#e8ff6a",
    meta: profile.currentRole,
  },
  ...cases.map((caseStudy, index) => {
    const selected = caseStudy.options.find((option) => option.selected);
    return {
      kind: "case" as const,
      key: caseStudy.id,
      eyebrow: `Case ${String(caseStudy.number).padStart(2, "0")}`,
      title: caseStudy.title,
      body: selected ? readOptionCanonical(selected).label : caseStudy.summary,
      accent: caseStudy.brand?.primary ?? FALLBACK_CASE_ACCENTS[index] ?? "#e8ff6a",
      meta: `${caseStudy.meta.duration} / ${caseStudy.meta.role}`,
      caseStudy,
    };
  }),
  {
    kind: "philosophy",
    key: "philosophy",
    eyebrow: "Philosophy",
    title: philosophy.quote.join(" "),
    body: "The working principle behind the decisions, tradeoffs, and shipped systems.",
    accent: "#ff5fa2",
    meta: "Operating system",
  },
  {
    kind: "toolkit",
    key: "toolkit",
    eyebrow: "Toolkit",
    title: "Fast systems, clean judgment.",
    body: toolkit.engineering
      .slice(0, 4)
      .map((group) => `${group.category}: ${group.items.slice(0, 4).join(", ")}`)
      .join(" / "),
    accent: "#50e3c2",
    meta: "Engineering + product",
  },
  {
    kind: "contact",
    key: "contact",
    eyebrow: "Contact",
    title: "Let's talk.",
    body: profile.availability.message,
    accent: "#a78bfa",
    meta: profile.email,
  },
];

export function OrbitLab() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const isMobile = useMediaQuery("(max-width: 760px)");
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const activeIndex = Math.min(
    SLIDES.length - 1,
    Math.round(progress * (SLIDES.length - 1)),
  );
  const activeSlide = SLIDES[activeIndex];

  const setSpacerRef = useCallback(
    (node: HTMLDivElement | null) => {
      spacerRef.current = node;
      scrollRef(node);
    },
    [scrollRef],
  );

  const jumpTo = (index: number) => {
    const el = spacerRef.current;
    if (!el || globalThis.window === undefined) return;
    const rect = el.getBoundingClientRect();
    const start = globalThis.scrollY + rect.top;
    const distance = Math.max(0, el.offsetHeight - globalThis.innerHeight);
    globalThis.scrollTo({
      top: start + (distance * index) / (SLIDES.length - 1),
      behavior: "smooth",
    });
  };

  return (
    <main className={styles.root}>
      <div className={styles.canvasWrap}>
        <Canvas
          className={styles.canvas}
          dpr={isMobile ? [1, 1.35] : [1, 1.8]}
          gl={{ antialias: true, alpha: false }}
          camera={{
            position: isMobile ? [0, 2.1, 10.8] : [0, 1.4, 8.8],
            fov: isMobile ? 58 : 46,
            near: 0.1,
            far: 80,
          }}
        >
          <color attach="background" args={["#05070d"]} />
          <fog attach="fog" args={["#05070d", 10, 34]} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.34} />
            <pointLight position={[0, 3.4, 4.8]} intensity={5.5} color={activeSlide.accent} />
            <pointLight position={[-5, -1, 2]} intensity={2.3} color="#57a8ff" />
            <Stars radius={80} depth={42} count={1300} factor={2.6} saturation={0} fade speed={0.28} />
            <OrbitScene progressRef={progressRef} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      <section
        className={styles.interface}
        style={{ "--active": activeSlide.accent } as CSSProperties}
      >
        <header className={styles.brand}>
          <p>{profile.location}</p>
          <h1>Orbit Lab</h1>
        </header>

        <article className={styles.readout} aria-live="polite">
          <p className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </p>
          <p className={styles.eyebrow}>{activeSlide.eyebrow}</p>
          <h2>{activeSlide.title}</h2>
          <p className={styles.body}>{activeSlide.body}</p>
          {activeSlide.kind === "case" ? <CaseSignal caseStudy={activeSlide.caseStudy} /> : null}
          {activeSlide.kind === "contact" ? (
            <a className={styles.email} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          ) : null}
          <p className={styles.meta}>{activeSlide.meta}</p>
        </article>

        <nav className={styles.dots} aria-label="Orbit Lab sections">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              style={{ "--signal": slide.accent } as CSSProperties}
              aria-label={slide.eyebrow}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => jumpTo(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </nav>
      </section>

      <div
        ref={setSpacerRef}
        className={styles.scrollSpace}
        style={{ height: `${SLIDES.length * 112}vh` }}
        aria-hidden="true"
      />
    </main>
  );
}

function OrbitScene({
  progressRef,
  isMobile,
}: Readonly<{ progressRef: RefObject<number>; isMobile: boolean }>) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const progress = progressRef.current;
    const continuous = progress * (SLIDES.length - 1);
    const activeAngle = angleForIndex(continuous);
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        -activeAngle + Math.PI / 2,
        3.8,
        delta,
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        isMobile ? -0.55 : 0,
        4,
        delta,
      );
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.04;
      ringRef.current.rotation.x = THREE.MathUtils.damp(
        ringRef.current.rotation.x,
        Math.PI / 2.55 + Math.sin(progress * Math.PI) * 0.08,
        4,
        delta,
      );
    }
    state.camera.lookAt(0, isMobile ? -0.2 : 0.1, 0);
  });

  return (
    <group ref={groupRef}>
      <group ref={ringRef}>
        <OrbitRing radius={3.6} color="#e8ff6a" opacity={0.2} />
        <OrbitRing radius={4.75} color="#57a8ff" opacity={0.13} />
        <OrbitRing radius={2.35} color="#50e3c2" opacity={0.14} />
      </group>
      {SLIDES.map((slide, index) => (
        <Planet key={slide.key} index={index} slide={slide} progressRef={progressRef} />
      ))}
      <Core progressRef={progressRef} />
    </group>
  );
}

function OrbitRing({
  radius,
  color,
  opacity,
}: Readonly<{ radius: number; color: string; opacity: number }>) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 160]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Core({ progressRef }: Readonly<{ progressRef: RefObject<number> }>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.28;
    meshRef.current.rotation.x += delta * 0.12;
    const pulse = 0.86 + Math.sin(progressRef.current * Math.PI * 2) * 0.08;
    meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, pulse, 4, delta));
    if (materialRef.current) {
      materialRef.current.emissiveIntensity =
        0.28 + Math.sin(progressRef.current * Math.PI) * 0.16;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.76, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#111827"
        emissive="#e8ff6a"
        emissiveIntensity={0.34}
        roughness={0.28}
        metalness={0.62}
      />
    </mesh>
  );
}

function Planet({
  index,
  slide,
  progressRef,
}: Readonly<{
  index: number;
  slide: OrbitSlide;
  progressRef: RefObject<number>;
}>) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const position = planetPosition(index);

  useFrame((_, delta) => {
    const continuous = progressRef.current * (SLIDES.length - 1);
    const distance = circularDistance(continuous, index, SLIDES.length);
    const focus = 1 - Math.min(1, distance);
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, position[0], 4, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, position[1] + focus * 0.56, 4, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, position[2], 4, delta);
      groupRef.current.rotation.y += delta * (0.18 + focus * 0.22);
      groupRef.current.scale.setScalar(
        THREE.MathUtils.damp(groupRef.current.scale.x, 0.76 + focus * 0.58, 5, delta),
      );
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        materialRef.current.emissiveIntensity,
        0.22 + focus * 0.9,
        5,
        delta,
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[planetRadius(slide), 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#172033"
          emissive={slide.accent}
          emissiveIntensity={0.34}
          roughness={0.26}
          metalness={0.44}
        />
      </mesh>
      <Line
        points={[
          [0, 0, 0],
          [0, -0.48, 0],
        ]}
        color={slide.accent}
        transparent
        opacity={0.5}
        lineWidth={1}
      />
      <pointLight color={slide.accent} intensity={1.25} distance={3.6} />
    </group>
  );
}

function planetRadius(slide: OrbitSlide): number {
  if (slide.kind === "case") return 0.34;
  if (slide.kind === "intro") return 0.42;
  return 0.28;
}

function angleForIndex(index: number): number {
  return (index / SLIDES.length) * Math.PI * 2;
}

function planetPosition(index: number): [number, number, number] {
  const radius = index % 2 === 0 ? 3.6 : 4.75;
  const angle = angleForIndex(index);
  return [
    Math.cos(angle) * radius,
    -0.22 + Math.sin(index * 1.3) * 0.36,
    Math.sin(angle) * radius,
  ];
}

function circularDistance(a: number, b: number, length: number): number {
  const direct = Math.abs(a - b);
  return Math.min(direct, length - direct);
}

function CaseSignal({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;
  const metrics = caseStudy.outcome.metrics ?? [];

  return (
    <div className={styles.caseSignal}>
      <p>{outcome}</p>
      {metrics.length > 0 ? (
        <ul>
          {metrics.slice(0, 3).map((metric) => (
            <li key={metric.label}>
              <span>{metric.value}</span>
              <span>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
