"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Edges, Line, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useCallback, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Constellation.module.css";

type DeckSlide =
  | {
      kind: "intro";
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
    }
  | {
      kind: "philosophy" | "toolkit" | "contact";
      key: string;
      eyebrow: string;
      title: string;
      body: string;
      accent: string;
      meta: string;
    };

const CASE_ACCENTS = ["#ff8c42", "#6ea5f5", "#6ce29b"];

const SLIDES: DeckSlide[] = [
  {
    kind: "intro",
    key: "intro",
    eyebrow: profile.currentRole,
    title: profile.name,
    body: profile.intro,
    accent: "#f3d36b",
    meta: profile.location,
  },
  ...cases.map((caseStudy, index) => {
    const chosen = caseStudy.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
    return {
      kind: "case" as const,
      key: caseStudy.id,
      eyebrow: `Case ${String(caseStudy.number).padStart(2, "0")}`,
      title: caseStudy.title,
      body: bet,
      accent: caseStudy.brand?.primary ?? CASE_ACCENTS[index] ?? "#f3d36b",
      meta: caseStudy.meta.status,
      caseStudy,
    };
  }),
  {
    kind: "philosophy",
    key: "philosophy",
    eyebrow: "Philosophy",
    title: philosophy.quote.join(" "),
    body: "The operating principle behind the shipped work.",
    accent: "#ef6f6c",
    meta: "How I think",
  },
  {
    kind: "toolkit",
    key: "toolkit",
    eyebrow: "Toolkit",
    title: "Systems, speed, product judgment.",
    body: toolkit.engineering
      .slice(0, 4)
      .map((group) => `${group.category}: ${group.items.slice(0, 4).join(", ")}`)
      .join(" / "),
    accent: "#4ee1c1",
    meta: "What I reach for",
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

export function Constellation() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
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
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 1.4, 8.8], fov: 43, near: 0.1, far: 80 }}
        >
          <color attach="background" args={["#080a10"]} />
          <fog attach="fog" args={["#080a10", 9, 28]} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.38} />
            <spotLight
              position={[0, 7, 6]}
              angle={0.5}
              penumbra={0.65}
              intensity={7}
              color={activeSlide.accent}
            />
            <pointLight position={[-4, 2, 4]} intensity={4} color="#6ea5f5" />
            <Stars radius={70} depth={36} count={950} factor={2.4} saturation={0} fade speed={0.25} />
            <DeckScene progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>

      <section
        className={styles.interface}
        style={{ "--active": activeSlide.accent } as CSSProperties}
      >
        <header className={styles.brand}>
          <p>{profile.location}</p>
          <h1>Signal Deck</h1>
        </header>

        <article className={styles.dossier} aria-live="polite">
          <p className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </p>
          <p className={styles.eyebrow}>{activeSlide.eyebrow}</p>
          <h2>{activeSlide.title}</h2>
          <p className={styles.body}>{activeSlide.body}</p>
          {activeSlide.kind === "case" ? <CaseReadout caseStudy={activeSlide.caseStudy} /> : null}
          {activeSlide.kind === "contact" ? (
            <a className={styles.email} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          ) : null}
          <p className={styles.meta}>{activeSlide.meta}</p>
        </article>

        <nav className={styles.deckNav} aria-label="Signal Deck sections">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              className={`${styles.navItem} ${index === activeIndex ? styles.navItemActive : ""}`}
              style={{ "--signal": slide.accent } as CSSProperties}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => jumpTo(index)}
            >
              <span className={styles.navIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.navLabel}>{slide.eyebrow}</span>
            </button>
          ))}
        </nav>
      </section>

      <div
        ref={setSpacerRef}
        className={styles.scrollSpace}
        style={{ height: `${SLIDES.length * 110}vh` }}
        aria-hidden="true"
      />
    </main>
  );
}

function DeckScene({
  progressRef,
}: Readonly<{ progressRef: RefObject<number> }>) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const progress = progressRef.current;
    const continuous = progress * (SLIDES.length - 1);
    if (rigRef.current) {
      rigRef.current.rotation.y = THREE.MathUtils.damp(
        rigRef.current.rotation.y,
        -0.34 + progress * 0.68,
        4,
        delta,
      );
      rigRef.current.position.y = THREE.MathUtils.damp(
        rigRef.current.position.y,
        Math.sin(progress * Math.PI) * 0.28,
        4,
        delta,
      );
    }
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      Math.sin(continuous * 0.7) * 0.45,
      3.2,
      delta,
    );
    state.camera.lookAt(0, 0.25, 0);
  });

  return (
    <group ref={rigRef}>
      <DeckFloor />
      <ActiveHalo progressRef={progressRef} />
      {SLIDES.map((slide, index) => (
        <CasePrism key={slide.key} slide={slide} index={index} progressRef={progressRef} />
      ))}
    </group>
  );
}

function DeckFloor() {
  const lines = [];
  for (let i = -5; i <= 5; i += 1) {
    lines.push(
      <Line
        key={`x-${i}`}
        points={[
          [-5.5, -1.8, i],
          [5.5, -1.8, i],
        ]}
        color="#f3d36b"
        transparent
        opacity={i === 0 ? 0.26 : 0.08}
        lineWidth={1}
      />,
      <Line
        key={`z-${i}`}
        points={[
          [i, -1.8, -5.5],
          [i, -1.8, 5.5],
        ]}
        color="#f3d36b"
        transparent
        opacity={i === 0 ? 0.26 : 0.08}
        lineWidth={1}
      />,
    );
  }
  return <group>{lines}</group>;
}

function ActiveHalo({ progressRef }: Readonly<{ progressRef: RefObject<number> }>) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.18;
    const continuous = progressRef.current * (SLIDES.length - 1);
    ref.current.position.x = THREE.MathUtils.damp(
      ref.current.position.x,
      prismPosition(continuous)[0],
      4,
      delta,
    );
    ref.current.position.z = THREE.MathUtils.damp(
      ref.current.position.z,
      prismPosition(continuous)[2],
      4,
      delta,
    );
    if (materialRef.current) {
      materialRef.current.opacity = 0.2 + Math.sin(globalThis.performance.now() * 0.002) * 0.04;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.42, 0]}>
      <torusGeometry args={[0.92, 0.01, 8, 120]} />
      <meshBasicMaterial ref={materialRef} color="#f3d36b" transparent opacity={0.22} />
    </mesh>
  );
}

function CasePrism({
  slide,
  index,
  progressRef,
}: Readonly<{
  slide: DeckSlide;
  index: number;
  progressRef: RefObject<number>;
}>) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const base = prismPosition(index);

  useFrame((_, delta) => {
    const continuous = progressRef.current * (SLIDES.length - 1);
    const distance = Math.abs(continuous - index);
    const focus = 1 - Math.min(1, distance);
    const lift = THREE.MathUtils.lerp(0, 0.7, focus);
    const scale = THREE.MathUtils.lerp(0.76, 1.18, focus);
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, base[0], 4, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, base[1] + lift, 4, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, base[2] - focus * 0.8, 4, delta);
      groupRef.current.rotation.y += delta * (0.18 + focus * 0.16);
      groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, scale, 5, delta));
    }
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        materialRef.current.emissiveIntensity,
        0.1 + focus * 0.55,
        5,
        delta,
      );
      materialRef.current.opacity = THREE.MathUtils.damp(
        materialRef.current.opacity,
        0.42 + focus * 0.42,
        5,
        delta,
      );
    }
  });

  const height = slide.kind === "case" ? 1.65 : 1.25;

  return (
    <group ref={groupRef} position={base} rotation={[0, -0.35 + index * 0.16, 0]}>
      <mesh>
        <boxGeometry args={[0.72, height, 0.72]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#151923"
          emissive={slide.accent}
          emissiveIntensity={0.16}
          transparent
          opacity={0.56}
          roughness={0.42}
          metalness={0.52}
        />
        <Edges color={slide.accent} />
      </mesh>
      <pointLight color={slide.accent} intensity={1.2} distance={3.4} position={[0, 0.5, 0.2]} />
    </group>
  );
}

function prismPosition(index: number): [number, number, number] {
  const center = (SLIDES.length - 1) / 2;
  const offset = index - center;
  return [offset * 1.22, -0.45 + Math.cos(index * 0.8) * 0.15, Math.abs(offset) * 0.34];
}

function CaseReadout({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;
  const metrics = caseStudy.outcome.metrics ?? [];

  return (
    <div className={styles.caseReadout}>
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
