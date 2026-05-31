"use client";

import { cases, philosophy, profile } from "@/content";
import {
  readCanonical,
  readCanonicalParagraphs,
  readOptionCanonical,
} from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { CSSProperties, RefObject } from "react";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./MagneticType.module.css";

interface TypeSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  caseStudy?: Case;
}

function buildSlides(): TypeSlide[] {
  const intro: TypeSlide = {
    id: "intro",
    eyebrow: profile.location,
    title: "HASSAN",
    body: profile.tagline,
    accent: "#ffd84a",
  };

  const caseSlides: TypeSlide[] = cases.map((c) => {
    const chosen = c.options.find((option) => option.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    const title = c.title.toUpperCase().replace(/[^A-Z0-9_ ]/g, "");
    return {
      id: c.id,
      eyebrow: `Case ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
      title,
      body: bet,
      accent: c.brand?.primary ?? "#ffd84a",
      caseStudy: c,
    };
  });

  const closing: TypeSlide[] = [
    {
      id: "philosophy",
      eyebrow: "Operating principle",
      title: "BETS",
      body: philosophy.quote.join(" "),
      accent: "#7adcff",
    },
    {
      id: "contact",
      eyebrow: "Available",
      title: "TALK",
      body: profile.availability.message,
      accent: "#ff7a59",
    },
  ];

  return [intro, ...caseSlides, ...closing];
}

const SLIDES = buildSlides();

export function MagneticType() {
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
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 0, 6], fov: 38 }}
        >
          <color attach="background" args={["#0b0c12"]} />
          <fog attach="fog" args={["#0b0c12", 8, 20]} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.55} />
            <pointLight position={[0, 2, 4]} intensity={3.6} color={activeSlide.accent} />
            <pointLight position={[-3, -2, 2]} intensity={1.2} color="#7adcff" />
            <TypeScene activeSlide={activeSlide} progressRef={progressRef} />
            <Backdrop />
          </Suspense>
        </Canvas>
      </div>

      <section
        className={styles.hud}
        style={{ "--accent": activeSlide.accent } as CSSProperties}
      >
        <header className={styles.hudHead}>
          <p className={styles.brandKicker}>
            <span className={styles.brandDot} /> Magnetic Type
          </p>
          <p className={styles.brandRight}>
            {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </p>
        </header>

        <article className={styles.readout} aria-live="polite">
          <p className={styles.eyebrow}>{activeSlide.eyebrow}</p>
          <p className={styles.body}>{activeSlide.body}</p>
          {activeSlide.caseStudy ? (
            <CaseDetail caseStudy={activeSlide.caseStudy} />
          ) : null}
          {activeSlide.id === "philosophy" ? (
            <PhilosophyDetail />
          ) : null}
          {activeSlide.id === "contact" ? (
            <a className={styles.cta} href={`mailto:${profile.email}`}>
              {profile.email} →
            </a>
          ) : null}
        </article>

        <footer className={styles.hudFoot}>
          <p>Move the cursor · click to scatter</p>
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

function TypeScene({
  activeSlide,
  progressRef,
}: Readonly<{ activeSlide: TypeSlide; progressRef: RefObject<number> }>) {
  return (
    <>
      <FloatingLetters slide={activeSlide} key={activeSlide.id} />
      <AmbientShimmer progressRef={progressRef} />
    </>
  );
}

const LETTER_WIDTH = 0.92;

function FloatingLetters({ slide }: Readonly<{ slide: TypeSlide }>) {
  const letters = useMemo(() => Array.from(slide.title), [slide.title]);
  const totalWidth = letters.length * LETTER_WIDTH;
  const startX = -totalWidth / 2 + LETTER_WIDTH / 2;
  const groupRef = useRef<THREE.Group>(null);
  const scatterRef = useRef(0);
  const { viewport } = useThree();
  const cursor = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    cursor.current.set(
      state.pointer.x * viewport.width * 0.5,
      state.pointer.y * viewport.height * 0.5,
      0,
    );
    scatterRef.current = THREE.MathUtils.damp(
      scatterRef.current,
      0,
      1.6,
      delta,
    );
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.18,
        2.4,
        delta,
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.14,
        2.4,
        delta,
      );
    }
  });

  const onClick = () => {
    scatterRef.current = 1;
  };

  return (
    <group ref={groupRef} onClick={onClick}>
      {letters.map((char, idx) => (
        <FloatingLetter
          key={`${slide.id}-${idx}-${char}`}
          char={char}
          targetX={startX + idx * LETTER_WIDTH}
          accent={slide.accent}
          cursor={cursor}
          scatterRef={scatterRef}
          index={idx}
        />
      ))}
    </group>
  );
}

function FloatingLetter({
  char,
  targetX,
  accent,
  cursor,
  scatterRef,
  index,
}: Readonly<{
  char: string;
  targetX: number;
  accent: string;
  cursor: RefObject<THREE.Vector3>;
  scatterRef: RefObject<number>;
  index: number;
}>) {
  const meshRef = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3(targetX, 0, 0));
  const scatterTarget = useMemo(
    () =>
      new THREE.Vector3(
        (Math.sin(index * 12.7) * 0.5 + 0.5 - 0.5) * 6,
        (Math.cos(index * 9.3) * 0.5 + 0.5 - 0.5) * 4,
        (Math.sin(index * 5.1) * 0.5 + 0.5 - 0.5) * 3,
      ),
    [index],
  );
  const tmp = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const c = cursor.current ?? tmp.current;
    const scatter = scatterRef.current ?? 0;

    // pull strength based on cursor distance
    const distance = mesh.position.distanceTo(c);
    const pullStrength = Math.max(0, 0.6 - distance * 0.06);

    tmp.current.copy(target.current);
    tmp.current.x += (c.x - target.current.x) * pullStrength * 0.6;
    tmp.current.y += (c.y - target.current.y) * pullStrength * 0.5;
    tmp.current.z = Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.18;

    // blend scatter target
    tmp.current.lerp(scatterTarget, Math.min(1, scatter));

    mesh.position.lerp(tmp.current, Math.min(1, delta * 5.5));
    mesh.rotation.z = THREE.MathUtils.damp(
      mesh.rotation.z,
      (c.x - mesh.position.x) * 0.06 + Math.sin(state.clock.elapsedTime + index) * 0.04,
      4,
      delta,
    );
  });

  return (
    <group ref={meshRef} position={[targetX, 0, 0]}>
      <Text
        font={undefined}
        fontSize={1}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        outlineOpacity={0.7}
        color={accent}
        material-toneMapped={false}
      >
        {char === " " ? " " : char}
      </Text>
    </group>
  );
}

function AmbientShimmer({
  progressRef,
}: Readonly<{ progressRef: RefObject<number> }>) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.04;
      ref.current.position.x = THREE.MathUtils.damp(
        ref.current.position.x,
        Math.sin(progressRef.current * Math.PI) * 0.4,
        2,
        delta,
      );
    }
  });

  return (
    <group ref={ref} position={[0, 0, -3]}>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const r = 2.4;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffd84a" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

function Backdrop() {
  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[40, 28]} />
      <meshBasicMaterial color="#0b0c12" />
    </mesh>
  );
}

function CaseDetail({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const problemIntro = caseStudy.problem.intro
    ? readCanonical(caseStudy.problem.intro)
    : null;
  const problemItems = caseStudy.problem.items ?? [];
  const problemParagraphs =
    caseStudy.problem.paragraphs?.flatMap((p) => readCanonicalParagraphs(p)) ??
    [];
  const betIntro = caseStudy.bet.intro
    ? readCanonical(caseStudy.bet.intro)
    : null;
  const betSections = caseStudy.bet.sections ?? [];
  const outcomeParagraphs = caseStudy.outcome.paragraphs.flatMap((p) =>
    readCanonicalParagraphs(p),
  );
  const metrics = caseStudy.outcome.metrics ?? [];

  return (
    <div className={styles.caseExtra}>
      <p className={styles.outcomeLead}>{caseStudy.summary}</p>

      <ul className={styles.metaStrip}>
        <li>
          <span className={styles.metaKey}>year</span> {caseStudy.meta.year}
        </li>
        <li>
          <span className={styles.metaKey}>duration</span>{" "}
          {caseStudy.meta.duration}
        </li>
        <li>
          <span className={styles.metaKey}>role</span> {caseStudy.meta.role}
        </li>
        <li>
          <span className={styles.metaKey}>stack</span> {caseStudy.meta.stack}
        </li>
        <li>
          <span className={styles.metaKey}>status</span> {caseStudy.meta.status}
        </li>
        {caseStudy.meta.repoUrl ? (
          <li>
            <span className={styles.metaKey}>repo</span>{" "}
            <a
              className={styles.metaLink}
              href={caseStudy.meta.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              {caseStudy.meta.repoUrl.replace("https://", "")}
            </a>
          </li>
        ) : null}
      </ul>

      <section className={styles.section}>
        <h4 className={styles.sectionLabel}>Problem</h4>
        {problemIntro ? (
          <p className={styles.sectionPara}>{problemIntro}</p>
        ) : null}
        {problemItems.length > 0 ? (
          <ol className={styles.problemList}>
            {problemItems.map((item) => (
              <li key={item.label}>
                <strong>{item.label}.</strong> {readCanonical(item)}
              </li>
            ))}
          </ol>
        ) : null}
        {problemParagraphs.map((p) => (
          <p key={p} className={styles.sectionPara}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionLabel}>Options</h4>
        <ol className={styles.optionList}>
          {caseStudy.options.map((opt) => {
            const option = readOptionCanonical(opt);
            return (
              <li
                key={opt.letter}
                className={opt.selected ? styles.optionChosen : undefined}
              >
                <span className={styles.optionLetter}>{opt.letter}</span>
                <div className={styles.optionBody}>
                  <strong className={styles.optionLabel}>{option.label}</strong>
                  <span className={styles.optionRejection}>
                    {option.rejection}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionLabel}>Bet</h4>
        {betIntro ? (
          <p className={styles.betIntro}>{betIntro}</p>
        ) : null}
        {betSections.map((sec) => {
          const paras = readCanonicalParagraphs(sec);
          return (
            <div key={sec.heading} className={styles.betSection}>
              <h5 className={styles.betSectionHeading}>{sec.heading}</h5>
              {paras.length > 1 ? (
                <ul className={styles.betList}>
                  {paras.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : paras[0] ? (
                <p className={styles.sectionPara}>{paras[0]}</p>
              ) : null}
            </div>
          );
        })}
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionLabel}>Outcome</h4>
        {metrics.length > 0 ? (
          <ul className={styles.metricList}>
            {metrics.map((m) => (
              <li key={m.label}>
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {outcomeParagraphs.map((p) => (
          <p key={p} className={styles.sectionPara}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionLabel}>Reflection</h4>
        <blockquote className={styles.reflectionPrimary}>
          <p className={styles.reflectionLabel}>product · ownership</p>
          <p>{caseStudy.reflection.product}</p>
        </blockquote>
        <blockquote className={styles.reflectionSecondary}>
          <p className={styles.reflectionLabel}>engineering · process</p>
          <p>{caseStudy.reflection.engineering}</p>
        </blockquote>
      </section>
    </div>
  );
}

function PhilosophyDetail() {
  return (
    <div className={styles.caseExtra}>
      <blockquote className={styles.philosophyQuote}>
        {philosophy.quote.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </blockquote>
    </div>
  );
}
