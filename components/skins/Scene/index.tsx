"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";
import { Float, Html, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Scene.module.css";

/**
 * Scene — real WebGL 3D skin via Three.js + R3F + drei.
 * Page scroll drives camera Z position through floating panels.
 */

interface PanelDef {
  key: string;
  position: [number, number, number];
  rotationY: number;
  glow: string;
  body: React.ReactNode;
}

const ACCENTS = [
  "#a78bfa", // hero
  "#ff8c42", // case 1
  "#6ea5f5", // case 2
  "#6ce29b", // case 3
  "#ffd166", // philosophy
  "#f472b6", // toolkit
  "#a78bfa", // contact
];

// Panel positions: alternate left/right of camera axis, equally spaced along Z.
// IMPORTANT: every panel has a non-zero X so the camera (which travels along the
// central axis) never intersects a panel. Panels swing past the camera into view.
const STEP = 7; // distance between panels along Z
const SIDE_X = 2.6; // distance from center axis
const PANELS: PanelDef[] = [
  {
    key: "hero",
    position: [-SIDE_X, 0, 0],
    rotationY: 0.22, // tilt toward camera path (+x)
    glow: ACCENTS[0],
    body: <HeroCard />,
  },
  ...cases.map(
    (c, i) =>
      ({
        key: c.id,
        position: [
          i % 2 === 0 ? SIDE_X : -SIDE_X,
          i % 2 === 0 ? 0.4 : -0.3,
          -(i + 1) * STEP,
        ],
        rotationY: i % 2 === 0 ? -0.22 : 0.22,
        // Use the case's brand primary for the panel glow (falls back to the
        // arbitrary ACCENTS palette if a case has no brand color).
        glow: c.brand?.primary ?? ACCENTS[i + 1],
        body: <CaseCard caseStudy={c} />,
      }) satisfies PanelDef,
  ),
  {
    key: "philosophy",
    position: [SIDE_X, 0, -4 * STEP],
    rotationY: -0.22,
    glow: ACCENTS[4],
    body: <PhilosophyCard />,
  },
  {
    key: "toolkit",
    position: [-SIDE_X, 0, -5 * STEP],
    rotationY: 0.22,
    glow: ACCENTS[5],
    body: <ToolkitCard />,
  },
  {
    key: "contact",
    position: [SIDE_X, 0, -6 * STEP],
    rotationY: -0.22,
    glow: ACCENTS[6],
    body: <ContactCard />,
  },
];

// Camera "viewpoints" — one per panel, positioned 4 units in front of the panel
// and biased 40% toward the panel's X. Camera path = smoothly lerped viewpoints.
const VIEW_OFFSET_Z = 5; // distance camera sits in front of each panel
const VIEW_X_BIAS = 0.4; // how much camera leans toward panel's X (0 = stay center, 1 = right at panel)
function viewpoint(i: number): [number, number, number] {
  const p = PANELS[i]?.position ?? [0, 0, 0];
  return [p[0] * VIEW_X_BIAS, p[1] * VIEW_X_BIAS, p[2] + VIEW_OFFSET_Z];
}
const SPACER_HEIGHT_VH = PANELS.length * 100; // each panel = 1 viewport of scroll

/* ─────────── Top-level ─────────── */

export function Scene() {
  const [scrollRef, progress] = useScrollProgress<HTMLDivElement>("pin");
  const progressRef = useRef(0);
  const isMobile = useMediaQuery("(max-width: 720px)");
  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Active panel index (for HUD)
  const activeIndex = Math.min(
    PANELS.length - 1,
    Math.round(progress * (PANELS.length - 1)),
  );

  // Mobile: narrower FOV panels, lower DPR cap for performance.
  // Height is generous (~520) so longer cards (case studies w/ metrics) don't
  // clip from the bottom inside the Html transform clip-rect.
  const panelWidth = isMobile ? 340 : 560;
  const panelHeight = isMobile ? 520 : 360;
  const distanceFactor = isMobile ? 2.8 : 5;
  const fov = isMobile ? 68 : 55;

  return (
    <div className={styles.root}>
      <div className={styles.canvasWrap}>
        <Canvas
          className={styles.canvas}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: viewpoint(0), fov, near: 0.1, far: 100 }}
        >
          <color attach="background" args={["#06061a"]} />
          <fog attach="fog" args={["#06061a", 12, 50]} />

          <Suspense fallback={null}>
            <ambientLight intensity={0.35} />
            <hemisphereLight
              args={["#a78bfa", "#1a1a3a", 0.4]}
              position={[0, 10, 0]}
            />

            <Stars
              radius={80}
              depth={50}
              count={2200}
              factor={3.5}
              saturation={0}
              fade
              speed={0.5}
            />

            <Camera progressRef={progressRef} />
            <Panels
              progressRef={progressRef}
              panelWidth={panelWidth}
              panelHeight={panelHeight}
              distanceFactor={distanceFactor}
            />
          </Suspense>
        </Canvas>
      </div>

      <div
        ref={scrollRef}
        className={styles.scrollSpacer}
        style={{ height: `${SPACER_HEIGHT_VH}vh` }}
        aria-hidden="true"
      />

      <Hud activeIndex={activeIndex} total={PANELS.length} />
    </div>
  );
}

/* ─────────── Camera (drives along Z based on scroll) ─────────── */

function Camera({ progressRef }: Readonly<{ progressRef: RefObject<number> }>) {
  useFrame((state, delta) => {
    const offset = progressRef.current; // 0..1
    const last = PANELS.length - 1;
    const continuous = offset * last;
    const lower = Math.max(0, Math.min(last - 1, Math.floor(continuous)));
    const t = continuous - lower;

    // Camera position: smoothly lerped between adjacent panels' viewpoints
    const v0 = viewpoint(lower);
    const v1 = viewpoint(lower + 1);
    const targetCamX = THREE.MathUtils.lerp(v0[0], v1[0], t);
    const targetCamY = THREE.MathUtils.lerp(v0[1], v1[1], t);
    const targetCamZ = THREE.MathUtils.lerp(v0[2], v1[2], t);

    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, targetCamX, 4, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetCamY, 4, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetCamZ, 4, delta);

    // LookAt: smoothly lerped between adjacent panels' actual positions.
    // This puts the active panel head-on in viewport.
    const p0 = PANELS[lower].position;
    const p1 = PANELS[lower + 1].position;
    const lookX = THREE.MathUtils.lerp(p0[0], p1[0], t);
    const lookY = THREE.MathUtils.lerp(p0[1], p1[1], t);
    const lookZ = THREE.MathUtils.lerp(p0[2], p1[2], t);
    cam.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

/* ─────────── Panels ─────────── */

function Panels({
  progressRef,
  panelWidth,
  panelHeight,
  distanceFactor,
}: Readonly<{
  progressRef: RefObject<number>;
  panelWidth: number;
  panelHeight: number;
  distanceFactor: number;
}>) {
  return (
    <group>
      {PANELS.map((p, i) => (
        <PanelMesh
          key={p.key}
          panel={p}
          index={i}
          progressRef={progressRef}
          panelWidth={panelWidth}
          panelHeight={panelHeight}
          distanceFactor={distanceFactor}
        />
      ))}
    </group>
  );
}

function PanelMesh({
  panel,
  index,
  progressRef,
  panelWidth,
  panelHeight,
  distanceFactor,
}: Readonly<{
  panel: PanelDef;
  index: number;
  progressRef: RefObject<number>;
  panelWidth: number;
  panelHeight: number;
  distanceFactor: number;
}>) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const offset = progressRef.current;
    // Continuous distance to active position (no discrete snapping)
    const continuousIndex = offset * (PANELS.length - 1);
    const dist = Math.abs(continuousIndex - index);
    // Smoothly fade scale from 1.08 (right at panel) to 0.85 (1.5+ panels away)
    const t = Math.min(1, dist / 1.5);
    const targetScale = THREE.MathUtils.lerp(1.08, 0.85, t);
    const s = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 4, delta);
    ref.current.scale.set(s, s, s);
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.05}
      floatIntensity={0.25}
      floatingRange={[-0.12, 0.12]}
    >
      <group
        ref={ref}
        position={panel.position}
        rotation={[0, panel.rotationY, 0]}
      >
        {/* Outer glow plate */}
        <mesh position={[0, 0, -0.5]}>
          <planeGeometry args={[7, 4.8]} />
          <meshBasicMaterial
            color={panel.glow}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Point light */}
        <pointLight
          position={[0, 0, 1.5]}
          color={panel.glow}
          intensity={2}
          distance={8}
          decay={1.5}
        />
        {/* Frame plate */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[5.8, 3.8]} />
          <meshStandardMaterial
            color="#0f0f24"
            metalness={0.3}
            roughness={0.6}
            emissive={panel.glow}
            emissiveIntensity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* HTML overlay */}
        <Html
          transform
          distanceFactor={distanceFactor}
          position={[0, 0, 0.02]}
          style={
            {
              width: `${panelWidth}px`,
              height: `${panelHeight}px`,
              "--panel-accent": panel.glow,
              pointerEvents: "auto",
            } as React.CSSProperties
          }
          wrapperClass={styles.htmlWrapper}
        >
          <div
            className={styles.panel}
            style={{ width: `${panelWidth}px`, height: `${panelHeight}px` }}
          >
            {panel.body}
          </div>
        </Html>
      </group>
    </Float>
  );
}

/* ─────────── Cards ─────────── */

function HeroCard() {
  return (
    <div className={styles.heroCard}>
      <p className={styles.cardEyebrow}>{profile.currentRole}</p>
      <h1 className={styles.cardTitle}>{profile.name}</h1>
      <p className={styles.cardTagline}>{profile.tagline}</p>
      <p className={styles.cardBody}>{profile.intro}</p>
      <p className={styles.cardEmail}>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
    </div>
  );
}

function CaseCard({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const number = String(caseStudy.number).padStart(2, "0");
  const chosen = caseStudy.options.find((o) => o.selected);
  const chosenLabel = chosen ? readOptionCanonical(chosen).label : "";
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcomeLede = firstOutcome ? readCanonical(firstOutcome) : "";
  const metrics = caseStudy.outcome.metrics ?? [];
  return (
    <div className={styles.caseCard}>
      <p className={styles.cardEyebrow}>Case {number}</p>
      <h2 className={styles.cardTitle}>{caseStudy.title}</h2>
      <p className={styles.cardSummary}>{caseStudy.summary}</p>
      {chosenLabel ? (
        <div className={styles.betBlock}>
          <p className={styles.betEyebrow}>The Bet</p>
          <p className={styles.betLabel}>{chosenLabel}</p>
        </div>
      ) : null}
      <div className={styles.outcomeBlock}>
        <p className={styles.outcomeEyebrow}>Outcome</p>
        <p className={styles.outcomeLede}>{outcomeLede}</p>
        {metrics.length > 0 ? (
          <ul className={styles.metricsRow}>
            {metrics.slice(0, 3).map((m) => (
              <li key={m.label}>
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function PhilosophyCard() {
  return (
    <div className={styles.philosophyCard}>
      <p className={styles.cardEyebrow}>Philosophy</p>
      {philosophy.quote.map((line, i) => (
        <p
          key={line}
          className={
            i === 1 ? styles.philosophyLineAccent : styles.philosophyLine
          }
        >
          {line}
        </p>
      ))}
      <p className={styles.cardAttribution}>— {profile.name}</p>
    </div>
  );
}

function ToolkitCard() {
  return (
    <div className={styles.toolkitCard}>
      <p className={styles.cardEyebrow}>Toolkit · Engineering</p>
      <ul className={styles.toolkitList}>
        {toolkit.engineering.map((g) => (
          <li key={g.category}>
            <span className={styles.toolkitCategory}>{g.category}</span>
            <span className={styles.toolkitItems}>
              {g.items.join(" · ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard() {
  return (
    <div className={styles.contactCard}>
      <p className={styles.cardEyebrow}>End scene.</p>
      <h2 className={styles.cardTitle}>Let&apos;s talk.</h2>
      <p className={styles.contactEmail}>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <ul className={styles.contactSocials}>
        <li>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </li>
        <li>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            github
          </a>
        </li>
        <li>
          <a href={profile.socials.x} target="_blank" rel="noreferrer">
            x
          </a>
        </li>
      </ul>
    </div>
  );
}

/* ─────────── HUD (fixed overlays outside canvas) ─────────── */

function Hud({
  activeIndex,
  total,
}: Readonly<{ activeIndex: number; total: number }>) {
  const labels = [
    "Intro",
    ...cases.map((c) => c.title),
    "Philosophy",
    "Toolkit",
    "Contact",
  ];
  return (
    <>
      <div className={styles.brandTag}>
        <span className={styles.brandName}>{profile.name}</span>
        <span className={styles.brandRole}>{profile.currentRole}</span>
      </div>
      <div className={styles.counter} aria-live="polite">
        <span className={styles.counterIndex}>
          {String(activeIndex + 1).padStart(2, "0")} ·{" "}
          {String(total).padStart(2, "0")}
        </span>
        <span className={styles.counterLabel}>{labels[activeIndex]}</span>
      </div>
      <p className={styles.scrollPrompt} aria-hidden="true">
        scroll ↓ glide forward
      </p>
    </>
  );
}
