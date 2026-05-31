"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";
import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./Origami.module.css";

/**
 * Origami Folio — the "secretive reveal" version.
 *
 * Per slide, a small origami silhouette (paper plane, crane, boat, lotus,
 * butterfly, star) flies in from off-screen, tumbling. At centre it
 * "unfolds" — the silhouette dissolves and the readable letter scales in.
 * On scroll past, the letter folds back into the next silhouette and that
 * one flies off in the exit direction. Each slide has a DIFFERENT shape so
 * the reveal stays curious.
 */

type ShapeKind = "plane" | "crane" | "boat" | "lotus" | "butterfly" | "star";

interface FoldSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  paperTone: string;
  inkTone: string;
  shape: ShapeKind;
  caseStudy?: Case;
}

function buildSlides(): FoldSlide[] {
  const intro: FoldSlide = {
    id: "intro",
    eyebrow: profile.location.toUpperCase(),
    title: profile.name,
    body: profile.tagline,
    accent: "#c1462a",
    paperTone: "#fbf3df",
    inkTone: "#1e1a14",
    shape: "plane",
  };

  const tones = ["#fbf3df", "#f3e6c4", "#f6ead2", "#efe1c0"];
  const caseShapes: ShapeKind[] = ["crane", "boat", "butterfly"];
  const caseSlides: FoldSlide[] = cases.map((c, i) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      eyebrow: `FOLIO ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
      title: c.title,
      body: bet,
      accent: c.brand?.primary ?? "#c1462a",
      paperTone: tones[i % tones.length]!,
      inkTone: "#1e1a14",
      shape: caseShapes[i % caseShapes.length]!,
      caseStudy: c,
    };
  });

  const closing: FoldSlide[] = [
    {
      id: "philosophy",
      eyebrow: "MARGINALIA",
      title: philosophy.quote[0] ?? "Make the bet.",
      body: philosophy.quote.slice(1).join(" "),
      accent: "#8a5a2a",
      paperTone: "#ede2c8",
      inkTone: "#231e16",
      shape: "lotus",
    },
    {
      id: "contact",
      eyebrow: "STANDING INVITATION",
      title: "Let's fold something new.",
      body: profile.availability.message,
      accent: "#a23b1c",
      paperTone: "#f5ecd8",
      inkTone: "#1e1a14",
      shape: "star",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function Origami() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const progressRef = useRef(0);
  const smoothedRef = useRef(0);
  const isMobile = useMediaQuery("(max-width: 760px)");

  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const continuous = progress * (SLIDES.length - 1);
  const activeIndex = Math.min(SLIDES.length - 1, Math.round(continuous));
  const slide = SLIDES[activeIndex] ?? SLIDES[0]!;
  // Sub-progress 0..1 within this slide's "owning" window
  const sub = continuous - activeIndex; // can be negative if not at floor
  // Phase: 0 = flying in (folded), 0.5 = letter visible (unfolded), 1 = flying out (folded)
  const phase = THREE.MathUtils.clamp(Math.abs(sub) * 2, 0, 1);
  const letterVisible = phase < 0.4;

  return (
    <main className={styles.root}>
      <div className={styles.warmWash} aria-hidden="true" />
      <div className={styles.canvasWrap}>
        <Canvas
          dpr={[1.5, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          shadows
          camera={{ position: [0, 0.4, 5.2], fov: 38 }}
        >
          <color attach="background" args={["#f4ede0"]} />
          <fog attach="fog" args={["#f4ede0", 9, 18]} />
          <Suspense fallback={null}>
            <ProgressDamper rawRef={progressRef} smoothedRef={smoothedRef} />
            <Lights />
            <FlyingShapes smoothedRef={smoothedRef} />
            <ContactShadows
              position={[0, -1.4, 0]}
              opacity={0.42}
              scale={9}
              blur={2.8}
              far={3.2}
              color="#3a2c14"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* The readable letter lives in the DOM (not Html-in-Canvas) so it can't
          stack/overlap or fight z-order with the 3D origami. It only renders
          when the active slide is in its "unfolded" phase. */}
      <AnimatePresence mode="wait">
        {letterVisible ? (
          <LetterCard
            key={slide.id}
            slide={slide}
            phase={phase}
          />
        ) : null}
      </AnimatePresence>

      <section className={styles.hud}>
        <header className={styles.hudHead}>
          <p className={styles.brandKicker}>
            <span
              className={styles.brandDot}
              style={{ background: slide.accent }}
            />{" "}
            ORIGAMI · <span className={styles.brandShape}>{slide.shape}</span>
          </p>
          <p className={styles.brandRight}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </p>
        </header>

        <footer className={styles.hudFoot}>
          <p>scroll ↓ unfold</p>
          <div className={styles.progressBar} aria-hidden="true">
            <span
              className={styles.progressFill}
              style={{
                width: `${(activeIndex / (SLIDES.length - 1)) * 100}%`,
                background: slide.accent,
              }}
            />
          </div>
        </footer>
      </section>

      <div
        ref={scrollRef}
        className={styles.scrollSpace}
        style={{ height: `${SLIDES.length * 130}vh` }}
        aria-hidden="true"
      />

      {isMobile ? null : null}
    </main>
  );
}

/* ─────────── DOM letter card (reveals when origami unfolds) ─────────── */

function LetterCard({
  slide,
  phase,
}: Readonly<{ slide: FoldSlide; phase: number }>) {
  const caseStudy = slide.caseStudy;
  const firstOutcome = caseStudy?.outcome.paragraphs[0];
  const outcome = caseStudy
    ? firstOutcome
      ? readCanonical(firstOutcome)
      : caseStudy.summary
    : null;
  const metrics = caseStudy?.outcome.metrics ?? [];

  // Reveal animation responds to how "open" we are
  const open = 1 - phase * 2.5;
  const opacity = THREE.MathUtils.clamp(open, 0, 1);

  return (
    <motion.article
      key={slide.id}
      className={styles.letter}
      style={
        {
          "--accent": slide.accent,
          "--ink": slide.inkTone,
          "--paper": slide.paperTone,
          opacity,
        } as CSSProperties
      }
      initial={{ opacity: 0, scale: 0.86, y: 18, rotate: -3 }}
      animate={{ opacity, scale: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.86, y: -18, rotate: 3 }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className={styles.letterPaper}>
        <header className={styles.letterHead}>
          <p className={styles.letterEyebrow}>{slide.eyebrow}</p>
          <span className={styles.letterRule} aria-hidden="true" />
        </header>
        <h2 className={styles.letterTitle}>{slide.title}</h2>
        <p className={styles.letterBody}>{slide.body}</p>
        {caseStudy ? (
          <footer className={styles.letterFoot}>
            <p className={styles.letterOutcome}>{outcome}</p>
            {metrics.length > 0 ? (
              <ul className={styles.letterMetrics}>
                {metrics.slice(0, 3).map((metric) => (
                  <li key={metric.label}>
                    <span className={styles.letterMetricValue}>{metric.value}</span>
                    <span className={styles.letterMetricLabel}>{metric.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </footer>
        ) : null}
        {slide.id === "contact" ? (
          <a
            className={styles.letterCta}
            href={`mailto:${profile.email}`}
          >
            {profile.email} →
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

/* ─────────── damper ─────────── */

function ProgressDamper({
  rawRef,
  smoothedRef,
}: Readonly<{ rawRef: RefObject<number>; smoothedRef: RefObject<number> }>) {
  useFrame((_, delta) => {
    smoothedRef.current = THREE.MathUtils.damp(
      smoothedRef.current,
      rawRef.current,
      6,
      delta,
    );
  });
  return null;
}

/* ─────────── lights ─────────── */

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        color="#fff5d8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[-3, 1, 2]} intensity={0.4} color="#c1462a" />
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#ffd9a8" />
    </>
  );
}

/* ─────────── flying origami shapes ─────────── */

function FlyingShapes({
  smoothedRef,
}: Readonly<{ smoothedRef: RefObject<number> }>) {
  return (
    <group>
      {SLIDES.map((slide, i) => (
        <FlyingShape
          key={slide.id}
          slide={slide}
          index={i}
          smoothedRef={smoothedRef}
        />
      ))}
    </group>
  );
}

function FlyingShape({
  slide,
  index,
  smoothedRef,
}: Readonly<{
  slide: FoldSlide;
  index: number;
  smoothedRef: RefObject<number>;
}>) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const shapeGeometry = useMemo(() => makeShapeGeometry(slide.shape), [slide.shape]);

  // Per-slide arc params — alternates direction so shapes fly in/out across the screen.
  const fromLeft = index % 2 === 0;
  const arcSign = fromLeft ? -1 : 1;
  // Entry vector (off-screen)
  const entryX = arcSign * 9;
  const entryY = 4 + (index % 3) * -0.5;
  const exitX = -arcSign * 9;
  const exitY = -3 + (index % 3) * 0.4;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const p = smoothedRef.current;
    const continuous = p * (SLIDES.length - 1);
    const distance = continuous - index;
    const absD = Math.abs(distance);

    // Visibility window: shape is alive between |d| ≤ 0.6
    const visible = absD < 0.6;
    group.visible = visible;
    if (!visible) return;

    // Phase based on absolute distance: 0 = at centre (unfolded), 1 = at edge of window (flying)
    const phase = THREE.MathUtils.clamp(absD / 0.5, 0, 1);
    // Easing
    const eased = phase * phase * (3 - 2 * phase);

    // Position along an arc: at d=0, centre. At d>0, moving toward exitX/Y. At d<0, coming from entryX/Y.
    const isEntering = distance < 0;
    const targetX = isEntering
      ? THREE.MathUtils.lerp(0, entryX, eased)
      : THREE.MathUtils.lerp(0, exitX, eased);
    const targetY = isEntering
      ? THREE.MathUtils.lerp(0, entryY, eased)
      : THREE.MathUtils.lerp(0, exitY, eased);
    // Arc lift — peak in mid-phase
    const lift = Math.sin((1 - phase) * Math.PI) * 0.6;
    const targetZ = THREE.MathUtils.lerp(0, -1.5, eased);

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 6, delta);
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      targetY + lift,
      6,
      delta,
    );
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 6, delta);

    // Tumble: more spin while flying, settled at centre
    const tumbleAmt = eased; // 0 at centre, 1 at edge
    const baseSpin = state.clock.elapsedTime * 0.4 * (isEntering ? 1 : -1);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      tumbleAmt * baseSpin * 0.8 + Math.sin(state.clock.elapsedTime * 0.6) * 0.05 * (1 - eased),
      4,
      delta,
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      tumbleAmt * baseSpin + (1 - eased) * Math.sin(state.clock.elapsedTime * 0.5) * 0.15,
      4,
      delta,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      tumbleAmt * baseSpin * 0.5 * (isEntering ? 1 : -1),
      4,
      delta,
    );

    // Scale: small while flying, larger at centre
    const scale = THREE.MathUtils.lerp(0.55, 1.05, 1 - eased);
    group.scale.setScalar(scale);

    // Fade silhouette OUT when at centre (revealing the DOM letter card) and IN when flying.
    // The letter is most visible when this is most invisible.
    if (matRef.current) {
      const alpha = THREE.MathUtils.smoothstep(eased, 0.18, 0.5);
      matRef.current.opacity = alpha;
      matRef.current.transparent = alpha < 0.99;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={shapeGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={matRef}
          color={slide.paperTone}
          roughness={0.94}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      {/* Accent ink stripe so the silhouette has identity */}
      <mesh geometry={shapeGeometry} position={[0, 0, 0.002]}>
        <meshBasicMaterial
          color={slide.accent}
          transparent
          opacity={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─────────── shape geometry — flat Shape extruded for tiny thickness ─────────── */

function makeShapeGeometry(kind: ShapeKind): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const W = 1.6; // base size

  switch (kind) {
    case "plane": {
      // Dart silhouette — pointed nose, swept-back wings
      shape.moveTo(0, W * 0.62); // nose
      shape.lineTo(W * 0.55, -W * 0.45); // right wingtip back
      shape.lineTo(W * 0.18, -W * 0.18); // right inner notch
      shape.lineTo(0, -W * 0.55); // tail
      shape.lineTo(-W * 0.18, -W * 0.18); // left inner notch
      shape.lineTo(-W * 0.55, -W * 0.45); // left wingtip back
      shape.closePath();
      break;
    }
    case "crane": {
      // Stylised crane — long neck, wings, tail
      shape.moveTo(0, W * 0.7); // head
      shape.lineTo(W * 0.08, W * 0.42); // neck right
      shape.lineTo(W * 0.5, W * 0.12); // right wing tip
      shape.lineTo(W * 0.62, -W * 0.05); // right wing back
      shape.lineTo(W * 0.22, -W * 0.18); // body right
      shape.lineTo(W * 0.45, -W * 0.55); // tail tip right
      shape.lineTo(0, -W * 0.35); // tail bottom
      shape.lineTo(-W * 0.45, -W * 0.55);
      shape.lineTo(-W * 0.22, -W * 0.18);
      shape.lineTo(-W * 0.62, -W * 0.05);
      shape.lineTo(-W * 0.5, W * 0.12);
      shape.lineTo(-W * 0.08, W * 0.42);
      shape.closePath();
      break;
    }
    case "boat": {
      // Origami boat — trapezoidal hull + triangular sail
      shape.moveTo(-W * 0.6, -W * 0.3);
      shape.lineTo(W * 0.6, -W * 0.3);
      shape.lineTo(W * 0.4, 0);
      shape.lineTo(W * 0.05, 0);
      shape.lineTo(W * 0.05, W * 0.65); // sail top
      shape.lineTo(-W * 0.42, 0); // sail base left
      shape.lineTo(-W * 0.4, 0);
      shape.closePath();
      break;
    }
    case "lotus": {
      // Lotus — 6 overlapping petals approximated as a rounded star
      const points: [number, number][] = [];
      const petals = 6;
      const inner = W * 0.32;
      const outer = W * 0.62;
      for (let i = 0; i < petals * 2; i++) {
        const a = (i / (petals * 2)) * Math.PI * 2 + Math.PI / 2;
        const r = i % 2 === 0 ? outer : inner;
        points.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
      shape.moveTo(points[0]![0], points[0]![1]);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i]![0], points[i]![1]);
      }
      shape.closePath();
      break;
    }
    case "butterfly": {
      // Two-wing silhouette
      shape.moveTo(0, W * 0.3); // top centre
      shape.lineTo(W * 0.62, W * 0.55); // right upper wing tip
      shape.lineTo(W * 0.7, W * 0.05); // right wing edge
      shape.lineTo(W * 0.35, -W * 0.1);
      shape.lineTo(W * 0.6, -W * 0.55); // right lower wing tip
      shape.lineTo(W * 0.12, -W * 0.18);
      shape.lineTo(0, -W * 0.35); // bottom
      shape.lineTo(-W * 0.12, -W * 0.18);
      shape.lineTo(-W * 0.6, -W * 0.55);
      shape.lineTo(-W * 0.35, -W * 0.1);
      shape.lineTo(-W * 0.7, W * 0.05);
      shape.lineTo(-W * 0.62, W * 0.55);
      shape.closePath();
      break;
    }
    case "star": {
      // 5-point star
      const points: [number, number][] = [];
      const spikes = 5;
      const inner = W * 0.28;
      const outer = W * 0.66;
      for (let i = 0; i < spikes * 2; i++) {
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? outer : inner;
        points.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
      shape.moveTo(points[0]![0], points[0]![1]);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i]![0], points[i]![1]);
      }
      shape.closePath();
      break;
    }
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 12,
  });
  // Centre the geometry
  geo.center();
  return geo;
}
