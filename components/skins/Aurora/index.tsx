"use client";

import { cases, philosophy, profile } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./Aurora.module.css";

interface AuroraSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accentA: string;
  accentB: string;
  caseStudy?: Case;
}

const PALETTES: Array<[string, string]> = [
  ["#7df9ff", "#a06bff"],
  ["#ff7ad9", "#62d1ff"],
  ["#62ffb6", "#5d7dff"],
  ["#ffd86b", "#ff5d8f"],
];

function buildSlides(): AuroraSlide[] {
  const intro: AuroraSlide = {
    id: "intro",
    eyebrow: `${profile.location} · ${profile.availability.message}`,
    title: profile.name,
    body: profile.tagline,
    accentA: "#7df9ff",
    accentB: "#a06bff",
  };

  const caseSlides: AuroraSlide[] = cases.map((c, idx) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    const palette = PALETTES[(idx + 1) % PALETTES.length]!;
    return {
      id: c.id,
      eyebrow: `Case 0${c.number} · ${c.meta.year}`,
      title: c.title,
      body: bet,
      accentA: c.brand?.primary ?? palette[0],
      accentB: palette[1],
      caseStudy: c,
    };
  });

  const closing: AuroraSlide[] = [
    {
      id: "philosophy",
      eyebrow: "Operating principle",
      title: philosophy.quote[0] ?? "Make the bet.",
      body: philosophy.quote.slice(1).join(" "),
      accentA: "#ffd86b",
      accentB: "#ff5d8f",
    },
    {
      id: "contact",
      eyebrow: "Available",
      title: "Let's talk.",
      body: profile.availability.message,
      accentA: "#a06bff",
      accentB: "#7df9ff",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function Aurora() {
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
          camera={{ position: [0, 0, 4.6], fov: 52 }}
        >
          <color attach="background" args={["#04060f"]} />
          <fog attach="fog" args={["#04060f", 6, 28]} />
          <Suspense fallback={null}>
            <ProgressDamper rawRef={progressRef} smoothedRef={smoothedRef} />
            <Stars
              radius={60}
              depth={40}
              count={isMobile ? 1400 : 2400}
              factor={2.4}
              saturation={0}
              fade
              speed={0.3}
            />
            <AuroraField smoothedRef={smoothedRef} />
            <DustField count={isMobile ? 220 : 480} />
            <CameraDrift smoothedRef={smoothedRef} />
          </Suspense>
        </Canvas>
      </div>

      <section
        className={styles.hud}
        style={
          {
            "--accentA": slide.accentA,
            "--accentB": slide.accentB,
          } as CSSProperties
        }
      >
        <header className={styles.hudHead}>
          <p className={styles.brandKicker}>
            <span className={styles.brandDot} /> Aurora Drift
          </p>
          <p className={styles.brandRight}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </p>
        </header>

        <article className={styles.readout} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.2, 0.6, 0.2, 1] }}
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

        <footer className={styles.dots}>
          {SLIDES.map((s, idx) => (
            <span
              key={s.id}
              className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`}
              style={{ "--signal": s.accentA } as CSSProperties}
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

/* ─────────── progress damper ─────────── */

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

/* ─────────── camera (parallax + scroll drift) ─────────── */

function CameraDrift({
  smoothedRef,
}: Readonly<{ smoothedRef: RefObject<number> }>) {
  useFrame((state, delta) => {
    const p = smoothedRef.current;
    // Scroll-driven vertical drift + horizontal sway
    const baseY = (p - 0.5) * 0.8;
    const baseX = Math.sin(p * Math.PI * 2) * 0.4;
    // Cursor parallax — gentle
    const targetX = baseX + state.pointer.x * 0.4;
    const targetY = baseY + state.pointer.y * 0.25;
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, targetX, 3, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetY, 3, delta);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────── aurora curtains ─────────── */

const AURORA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURORA_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uSeed;
  uniform float uIntensity;

  // hash + noise (Inigo Quilez style)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float t = uTime * 0.18 + uSeed;
    vec2 p = vUv;
    // horizontal flowing waves
    float wave = fbm(vec2(p.x * 1.4 + t, p.y * 2.2 - t * 0.6));
    float wave2 = fbm(vec2(p.x * 3.0 - t * 0.4, p.y * 4.0 + t * 0.3));
    float curtain = wave * 0.7 + wave2 * 0.4;

    // band — fade top + bottom
    float bandY = smoothstep(0.0, 0.35, p.y) * (1.0 - smoothstep(0.65, 1.0, p.y));
    // sweep across horizontally
    float sweep = smoothstep(0.0, 0.18, p.x) * (1.0 - smoothstep(0.82, 1.0, p.x));

    float alpha = bandY * sweep * (0.35 + curtain * 0.9) * uIntensity;
    alpha = clamp(alpha, 0.0, 0.95);

    vec3 color = mix(uColorA, uColorB, curtain);
    // glow boost
    color += pow(curtain, 3.0) * 0.6;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface CurtainLayer {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  seed: number;
  intensity: number;
}

const CURTAINS: CurtainLayer[] = [
  {
    position: [0, 0, -3.6],
    rotation: [0, 0, 0],
    scale: [16, 7, 1],
    seed: 0,
    intensity: 1,
  },
  {
    position: [-2.2, 0.3, -2.4],
    rotation: [0, 0.18, 0.05],
    scale: [12, 6, 1],
    seed: 1.7,
    intensity: 0.8,
  },
  {
    position: [2.4, -0.2, -1.4],
    rotation: [0, -0.22, -0.04],
    scale: [11, 5.6, 1],
    seed: 3.2,
    intensity: 0.7,
  },
];

function AuroraField({
  smoothedRef,
}: Readonly<{ smoothedRef: RefObject<number> }>) {
  const colorA = useRef(new THREE.Color("#7df9ff"));
  const colorB = useRef(new THREE.Color("#a06bff"));
  const targetA = useRef(new THREE.Color("#7df9ff"));
  const targetB = useRef(new THREE.Color("#a06bff"));
  const groupRef = useRef<THREE.Group>(null);

  const materials = useMemo(
    () =>
      CURTAINS.map(
        (curtain) =>
          new THREE.ShaderMaterial({
            vertexShader: AURORA_VERTEX,
            fragmentShader: AURORA_FRAGMENT,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
              uTime: { value: 0 },
              uColorA: { value: new THREE.Color("#7df9ff") },
              uColorB: { value: new THREE.Color("#a06bff") },
              uSeed: { value: curtain.seed },
              uIntensity: { value: curtain.intensity },
            },
          }),
      ),
    [],
  );

  useFrame((state, delta) => {
    const p = smoothedRef.current;
    const continuous = p * (SLIDES.length - 1);
    const idx = Math.min(SLIDES.length - 1, Math.round(continuous));
    const slide = SLIDES[idx]!;
    targetA.current.set(slide.accentA);
    targetB.current.set(slide.accentB);
    const lerpAmt = Math.min(1, delta * 2.2);
    colorA.current.lerp(targetA.current, lerpAmt);
    colorB.current.lerp(targetB.current, lerpAmt);

    // Subtle pulsing intensity that swells between slides + cursor parallax
    const sub = continuous - Math.floor(continuous);
    const swell = 0.9 + Math.sin(sub * Math.PI) * 0.35;

    materials.forEach((mat, i) => {
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      (mat.uniforms.uColorA.value as THREE.Color).copy(colorA.current);
      (mat.uniforms.uColorB.value as THREE.Color).copy(colorB.current);
      mat.uniforms.uIntensity.value = (CURTAINS[i]?.intensity ?? 1) * swell;
    });

    // Cursor-driven parallax on the curtain group
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        state.pointer.x * 0.6,
        2.5,
        delta,
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        state.pointer.y * 0.3,
        2.5,
        delta,
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.08,
        2.5,
        delta,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {CURTAINS.map((curtain, idx) => (
        <mesh
          key={idx}
          position={curtain.position}
          rotation={curtain.rotation}
          scale={curtain.scale}
          material={materials[idx]}
        >
          <planeGeometry args={[1, 1, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────── particle dust ─────────── */

// Deterministic pseudo-random in [0, 1) — pure function, no Math.random.
function hash01(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function DustField({ count }: Readonly<{ count: number }>) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (hash01(i + 1) - 0.5) * 18;
      positions[i * 3 + 1] = (hash01(i + 101) - 0.5) * 10;
      positions[i * 3 + 2] = (hash01(i + 211) - 0.5) * 8 - 2;
      speeds[i] = 0.1 + hash01(i + 331) * 0.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));
    const mat = new THREE.PointsMaterial({
      size: 0.025,
      color: "#cfe9ff",
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const speed = geometry.getAttribute("speed") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1;
      let y = pos.array[idx] as number;
      y += (speed.array[i] as number) * delta * 0.5;
      if (y > 5) y = -5;
      (pos.array as Float32Array)[idx] = y;
      // gentle horizontal drift
      const xIdx = i * 3 + 0;
      (pos.array as Float32Array)[xIdx] =
        ((pos.array[xIdx] as number) + Math.sin(y + i) * delta * 0.02 + 9) %
          18 -
        9;
    }
    pos.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
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
