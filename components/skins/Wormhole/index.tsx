"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./Wormhole.module.css";

interface PortalSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  caseStudy?: Case;
}

const ACCENTS = [
  "#ff5dff",
  "#5dffe0",
  "#ffd86b",
  "#a06bff",
  "#62d1ff",
  "#ff7a59",
];

function buildSlides(): PortalSlide[] {
  const intro: PortalSlide = {
    id: "intro",
    eyebrow: `${profile.location} · entering tunnel`,
    title: profile.name,
    body: profile.tagline,
    accent: ACCENTS[0]!,
  };

  const caseSlides: PortalSlide[] = cases.map((c, idx) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      eyebrow: `Case 0${c.number} · portal ${String(idx + 1).padStart(2, "0")}`,
      title: c.title,
      body: bet,
      accent: c.brand?.primary ?? ACCENTS[(idx + 1) % ACCENTS.length]!,
      caseStudy: c,
    };
  });

  const closing: PortalSlide[] = [
    {
      id: "philosophy",
      eyebrow: "Operating principle",
      title: philosophy.quote[0] ?? "Make the bet.",
      body: philosophy.quote.slice(1).join(" "),
      accent: "#ffd86b",
    },
    {
      id: "contact",
      eyebrow: "Exit · available",
      title: "Let's talk.",
      body: profile.availability.message,
      accent: "#7df9ff",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function Wormhole() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const progressRef = useRef(0);
  const smoothedRef = useRef(0);
  const isMobile = useMediaQuery("(max-width: 760px)");

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
      <div className={styles.canvasWrap}>
        <Canvas
          dpr={isMobile ? [1, 1.4] : [1, 1.8]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0, 0], fov: 78, near: 0.05, far: 80 }}
        >
          <color attach="background" args={["#05050d"]} />
          <fog attach="fog" args={["#05050d", 6, 26]} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <ProgressDamper rawRef={progressRef} smoothedRef={smoothedRef} />
            <Tunnel
              smoothedRef={smoothedRef}
              ringCount={isMobile ? 36 : 56}
            />
            <Streaks count={isMobile ? 90 : 180} smoothedRef={smoothedRef} />
            <PortalArch smoothedRef={smoothedRef} />
          </Suspense>
        </Canvas>
      </div>

      <div
        className={styles.vignette}
        style={{ "--accent": slide.accent } as CSSProperties}
        aria-hidden="true"
      />

      <section
        className={styles.hud}
        style={{ "--accent": slide.accent } as CSSProperties}
      >
        <header className={styles.hudHead}>
          <p className={styles.brandKicker}>
            <span className={styles.brandDot} /> Wormhole · velocity 1.0c
          </p>
          <p className={styles.brandRight}>
            portal {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </p>
        </header>

        <article className={styles.readout} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
              className={styles.readoutInner}
            >
              <p className={styles.eyebrow}>{slide.eyebrow}</p>
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.body}>{slide.body}</p>
              {slide.caseStudy ? <CaseMetrics caseStudy={slide.caseStudy} /> : null}
              {slide.id === "contact" ? (
                <a className={styles.cta} href={`mailto:${profile.email}`}>
                  {profile.email} →
                </a>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </article>

        <footer className={styles.hudFoot}>
          <p>scroll ↓ fly forward</p>
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

/* ─────────── progress damper — buttery scroll ─────────── */

function ProgressDamper({
  rawRef,
  smoothedRef,
}: Readonly<{ rawRef: RefObject<number>; smoothedRef: RefObject<number> }>) {
  useFrame((_, delta) => {
    smoothedRef.current = THREE.MathUtils.damp(
      smoothedRef.current,
      rawRef.current,
      5.5,
      delta,
    );
  });
  return null;
}

/* ─────────── tunnel: rotating rings translated toward camera ─────────── */

const RING_SPACING = 0.8;
const RING_RADIUS = 2.0;
// Travel covers many tunnel lengths across the scroll
const SCROLL_TRAVEL_PER_UNIT = 9; // units of Z travel per unit of progress per slide
const STREAK_LENGTH = 50;

// Deterministic pseudo-random in [0, 1) — pure function.
function hash01(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface RingDatum {
  baseZ: number;
  rot: number;
  spin: number;
  /** Hue offset 0..1 for per-ring color variation */
  hueOffset: number;
}

function Tunnel({
  smoothedRef,
  ringCount,
}: Readonly<{ smoothedRef: RefObject<number>; ringCount: number }>) {
  const groupRef = useRef<THREE.Group>(null);

  const ringData = useMemo<RingDatum[]>(
    () =>
      Array.from({ length: ringCount }).map((_, i) => ({
        baseZ: -i * RING_SPACING,
        rot: hash01(i + 7) * Math.PI * 2,
        spin: (hash01(i + 41) - 0.5) * 0.4,
        hueOffset: hash01(i + 113) * 0.18 - 0.09,
      })),
    [ringCount],
  );

  const ringGeo = useMemo(
    () => new THREE.TorusGeometry(RING_RADIUS, 0.012, 8, 64),
    [],
  );

  // Tunnel length in world units. Rings live in z ∈ [-span, 0].
  const span = ringCount * RING_SPACING;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {ringData.map((data, i) => (
        <Ring
          key={i}
          data={data}
          geometry={ringGeo}
          smoothedRef={smoothedRef}
          span={span}
        />
      ))}
    </group>
  );
}

function Ring({
  data,
  geometry,
  smoothedRef,
  span,
}: Readonly<{
  data: RingDatum;
  geometry: THREE.BufferGeometry;
  smoothedRef: RefObject<number>;
  span: number;
}>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetColor = useRef(new THREE.Color("#ff5dff"));
  const baseColor = useRef(new THREE.Color("#ff5dff"));

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const p = smoothedRef.current;
    // travel grows continuously with scroll — many tunnel-lengths across page
    const travel = p * SCROLL_TRAVEL_PER_UNIT * SLIDES.length;
    // Wrap z into [-span, 0). Modulo math is continuous; teleport is hidden by opacity.
    let z = data.baseZ + travel;
    z = ((z % span) + span) % span - span;
    mesh.position.z = z;
    mesh.rotation.z = data.rot + state.clock.elapsedTime * data.spin;

    // Proximity scale — rings near camera puff up slightly
    const dCam = -z; // distance from camera (always ≥ 0)
    const proximity = Math.max(0, 1 - dCam / 5);
    const s = 1 + proximity * 0.18;
    mesh.scale.set(s, s, 1);

    // Opacity fade near boundaries so the modulo teleport is invisible.
    // Fade in: z ∈ [-span, -span + fadeIn]
    // Fade out: z ∈ [-fadeOut, 0]
    const fadeIn = 6;
    const fadeOut = 1.4;
    const fadeInOpacity = THREE.MathUtils.smoothstep(z, -span, -span + fadeIn);
    const fadeOutOpacity = 1 - THREE.MathUtils.smoothstep(z, -fadeOut, 0);
    const boundaryAlpha = Math.min(fadeInOpacity, fadeOutOpacity);

    // Color lerp toward active accent + per-ring hue shift
    const continuous = p * (SLIDES.length - 1);
    const idx = Math.min(SLIDES.length - 1, Math.round(continuous));
    targetColor.current.set(SLIDES[idx]!.accent);
    // shift hue slightly per ring for variation
    const hsl = { h: 0, s: 0, l: 0 };
    targetColor.current.getHSL(hsl);
    targetColor.current.setHSL(
      (hsl.h + data.hueOffset + 1) % 1,
      hsl.s,
      hsl.l,
    );
    baseColor.current.lerp(targetColor.current, Math.min(1, delta * 2.4));

    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.color.copy(baseColor.current);
    const sub = continuous - Math.floor(continuous);
    const pulse = 1 + Math.sin(sub * Math.PI) * 0.18;
    mat.opacity = boundaryAlpha * 0.85 * pulse;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, data.baseZ]}>
      <meshBasicMaterial
        color="#ff5dff"
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ─────────── radial streaks (motion-blur stars) ─────────── */

function Streaks({
  count,
  smoothedRef,
}: Readonly<{ count: number; smoothedRef: RefObject<number> }>) {
  const pointsRef = useRef<THREE.Points>(null);
  const lastProgress = useRef(0);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = hash01(i + 13) * Math.PI * 2;
      const r = 0.3 + hash01(i + 71) * (RING_RADIUS - 0.4);
      positions[i * 3 + 0] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = -hash01(i + 199) * STREAK_LENGTH;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.04,
      color: "#ffffff",
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((_, delta) => {
    const p = smoothedRef.current;
    // Velocity from scroll-derived progress change → smooth speed
    const dp = p - lastProgress.current;
    lastProgress.current = p;
    // baseline speed + scroll-driven boost (both smoothed by progress damping)
    const speed = 6 + Math.abs(dp) * 800;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 2;
      let z = arr[idx]! + speed * delta;
      if (z > 1) {
        z = -STREAK_LENGTH;
        // Deterministic respawn position based on index + cycle for stable look
        const angle = hash01(i * 0.13 + z) * Math.PI * 2;
        const r = 0.3 + hash01(i * 0.31 + z * 0.5) * (RING_RADIUS - 0.4);
        arr[i * 3 + 0] = Math.cos(angle) * r;
        arr[i * 3 + 1] = Math.sin(angle) * r;
      }
      arr[idx] = z;
    }
    pos.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/* ─────────── portal arch — bigger glowing torus at active slide ─────────── */

function PortalArch({
  smoothedRef,
}: Readonly<{ smoothedRef: RefObject<number> }>) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const colorTarget = useRef(new THREE.Color("#ff5dff"));
  const colorCurrent = useRef(new THREE.Color("#ff5dff"));

  useFrame((state, delta) => {
    const p = smoothedRef.current;
    const continuous = p * (SLIDES.length - 1);
    const sub = continuous - Math.floor(continuous);
    const idx = Math.min(SLIDES.length - 1, Math.round(continuous));
    colorTarget.current.set(SLIDES[idx]!.accent);
    colorCurrent.current.lerp(colorTarget.current, Math.min(1, delta * 2.4));

    if (ref.current) {
      // arch sweeps from -6 to +1 as sub goes 0→1 (mimics entering portal)
      ref.current.position.z = THREE.MathUtils.lerp(-6, 1.2, sub);
      const distFromCam = Math.abs(ref.current.position.z + 1.5);
      const scale = 1 + Math.max(0, 1 - distFromCam / 3) * 0.4;
      ref.current.scale.set(scale, scale, 1);
      ref.current.rotation.z += delta * 0.4;
    }

    if (matRef.current) {
      matRef.current.color.copy(colorCurrent.current);
      // dim when far, bright when crossing
      const dist = ref.current ? Math.abs(ref.current.position.z + 1.5) : 4;
      matRef.current.opacity = THREE.MathUtils.clamp(1 - dist / 5, 0.15, 1);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <torusGeometry args={[RING_RADIUS + 0.05, 0.05, 12, 96]} />
      <meshBasicMaterial
        ref={matRef}
        color="#ff5dff"
        transparent
        opacity={0.95}
        toneMapped={false}
      />
    </mesh>
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
