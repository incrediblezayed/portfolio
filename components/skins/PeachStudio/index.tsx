"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { CSSProperties } from "react";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./PeachStudio.module.css";

const STAGES = ["Plan", "Build", "Ship", "Iterate"];

export function PeachStudio() {
  const [focus, setFocus] = useState(0);
  const focused = cases[focus] ?? cases[0];
  const accent = focused?.brand?.primary ?? "#a78bfa";

  return (
    <main className={styles.root} style={{ "--accent": accent } as CSSProperties}>
      <TopBar />
      <Hero focus={focus} setFocus={setFocus} focused={focused} accent={accent} />
      <Stages />
      <Gallery focus={focus} setFocus={setFocus} />
      <Philosophy />
      <Practice />
      <Contact />
      <Foot />
    </main>
  );
}

function TopBar() {
  return (
    <header className={styles.topbar}>
      <a href="#top" className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          ◆
        </span>
        {profile.name}
      </a>
      <nav className={styles.nav}>
        <a href="#works">Works</a>
        <a href="#practice">Practice</a>
        <a href="#talk">Talk</a>
      </nav>
      <a className={styles.topCta} href={`mailto:${profile.email}`}>
        Book a call <span aria-hidden="true">→</span>
      </a>
    </header>
  );
}

function Hero({
  focus,
  setFocus,
  focused,
  accent,
}: Readonly<{
  focus: number;
  setFocus: (idx: number) => void;
  focused: Case | undefined;
  accent: string;
}>) {
  if (!focused) return null;
  const chosen = focused.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : focused.summary;

  return (
    <section className={styles.hero} id="top">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} /> {profile.availability.message}
        </p>
        <h1 className={styles.headline}>
          Build things <em>people use</em>
          <br />
          every day.
        </h1>
        <p className={styles.lede}>{profile.intro}</p>
        <div className={styles.ctaRow}>
          <a href={`mailto:${profile.email}`} className={styles.ctaPrimary}>
            Start a project <span aria-hidden="true">→</span>
          </a>
          <a href="#works" className={styles.ctaQuiet}>
            See the work
          </a>
        </div>
      </div>

      <div className={styles.heroPreview}>
        <div className={styles.previewCanvas}>
          <Canvas
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0.6, 4.6], fov: 38 }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.35} />
              <directionalLight position={[3, 4, 5]} intensity={1.2} color="#f0ecff" />
              <pointLight position={[-3, -2, 2]} intensity={3.4} color={accent} />
              <FocusBlob accent={accent} focus={focus} />
              <Halo accent={accent} />
            </Suspense>
          </Canvas>
          <div className={styles.previewChrome} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.previewMeta}>
          <p className={styles.previewMetaLabel}>Now showing</p>
          <p className={styles.previewMetaTitle}>{focused.title}</p>
          <p className={styles.previewMetaBody}>{bet}</p>
          <ul className={styles.previewDots}>
            {cases.map((c, idx) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setFocus(idx)}
                  className={`${styles.previewDot} ${
                    idx === focus ? styles.previewDotActive : ""
                  }`}
                  style={{
                    "--dot": c.brand?.primary ?? "#a78bfa",
                  } as CSSProperties}
                  aria-label={c.title}
                  aria-current={idx === focus ? "true" : undefined}
                >
                  <span>{String(idx + 1).padStart(2, "0")}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FocusBlob({ accent, focus }: Readonly<{ accent: string; focus: number }>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.32;
      groupRef.current.rotation.x = Math.sin(globalThis.performance.now() * 0.0006) * 0.18;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={groupRef} key={`shape-${focus % 3}-${accent}`}>
        {focus % 3 === 0 ? (
          <mesh>
            <icosahedronGeometry args={[1.05, 1]} />
            <MeshDistortMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.32}
              roughness={0.25}
              metalness={0.45}
              distort={0.42}
              speed={2.1}
            />
          </mesh>
        ) : focus % 3 === 1 ? (
          <mesh>
            <torusKnotGeometry args={[0.78, 0.26, 160, 28]} />
            <meshPhysicalMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.35}
              roughness={0.18}
              metalness={0.6}
              clearcoat={0.8}
            />
          </mesh>
        ) : (
          <RoundedBox args={[1.4, 1.4, 1.4]} radius={0.22} smoothness={4}>
            <meshPhysicalMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.28}
              roughness={0.32}
              metalness={0.4}
              clearcoat={0.6}
            />
          </RoundedBox>
        )}
      </group>
    </Float>
  );
}

function Halo({ accent }: Readonly<{ accent: string }>) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.18;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1.4]} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[1.85, 0.012, 6, 96]} />
      <meshBasicMaterial color={accent} transparent opacity={0.45} />
    </mesh>
  );
}

function Stages() {
  return (
    <section className={styles.stages} aria-label="Process">
      <p className={styles.stagesEyebrow}>How we work</p>
      <ol className={styles.stagesList}>
        {STAGES.map((stage, idx) => (
          <li key={stage} className={styles.stage}>
            <span className={styles.stageNum}>0{idx + 1}</span>
            <span className={styles.stageLabel}>{stage}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Gallery({
  focus,
  setFocus,
}: Readonly<{ focus: number; setFocus: (idx: number) => void }>) {
  return (
    <section className={styles.gallery} id="works">
      <header className={styles.galleryHead}>
        <p className={styles.eyebrow}>Selected bets</p>
        <h2 className={styles.galleryTitle}>
          Three calls,
          <br />
          on the record.
        </h2>
      </header>
      <ul className={styles.galleryGrid}>
        {cases.map((c, idx) => (
          <GalleryCard
            key={c.id}
            caseStudy={c}
            index={idx}
            isFocus={idx === focus}
            onSelect={() => setFocus(idx)}
          />
        ))}
      </ul>
    </section>
  );
}

function GalleryCard({
  caseStudy,
  index,
  isFocus,
  onSelect,
}: Readonly<{
  caseStudy: Case;
  index: number;
  isFocus: boolean;
  onSelect: () => void;
}>) {
  const accent = caseStudy.brand?.primary ?? "#a78bfa";
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const metric = caseStudy.outcome.metrics?.[0];

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`${styles.card} ${isFocus ? styles.cardFocus : ""}`}
        style={{ "--card-accent": accent } as CSSProperties}
        aria-pressed={isFocus}
      >
        <div className={styles.cardArt} aria-hidden="true">
          <span className={styles.cardOrb} />
          <span className={styles.cardOrbSm} />
          <span className={styles.cardGrid} />
        </div>
        <div className={styles.cardBody}>
          <p className={styles.cardNumber}>Case {String(caseStudy.number).padStart(2, "0")}</p>
          <h3 className={styles.cardTitle}>{caseStudy.title}</h3>
          <p className={styles.cardBet}>{bet}</p>
          <div className={styles.cardFoot}>
            <span className={styles.cardMeta}>{caseStudy.meta.year}</span>
            {metric ? (
              <span className={styles.cardMetric}>
                <strong>{metric.value}</strong> {metric.label}
              </span>
            ) : null}
            <span className={styles.cardArrow} aria-hidden="true">
              {String(index + 1).padStart(2, "0")} →
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

function Philosophy() {
  return (
    <section className={styles.philosophy}>
      <p className={styles.eyebrow}>Operating principle</p>
      <blockquote className={styles.philosophyQuote}>
        {philosophy.quote.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </blockquote>
    </section>
  );
}

function Practice() {
  const groups = toolkit.engineering.slice(0, 6);
  return (
    <section className={styles.practice} id="practice">
      <header className={styles.galleryHead}>
        <p className={styles.eyebrow}>Practice</p>
        <h2 className={styles.galleryTitle}>What we reach for.</h2>
      </header>
      <div className={styles.practiceGrid}>
        {groups.map((group) => (
          <div key={group.category} className={styles.practiceCell}>
            <p className={styles.practiceLabel}>{group.category}</p>
            <p className={styles.practiceItems}>{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const outcome = cases[0]?.outcome.paragraphs[0];
  const proof = outcome ? readCanonical(outcome) : profile.intro;

  return (
    <section className={styles.contact} id="talk">
      <div className={styles.contactLeft}>
        <p className={styles.eyebrow}>Let&apos;s talk</p>
        <h2 className={styles.contactHead}>
          One conversation,
          <br />
          one decision.
        </h2>
        <p className={styles.contactBody}>
          {profile.availability.message} Pitch the constraint, the deadline, and the
          team you&apos;ve got. I&apos;ll write down the options with you.
        </p>
        <a href={`mailto:${profile.email}`} className={styles.ctaPrimary}>
          {profile.email} <span aria-hidden="true">→</span>
        </a>
      </div>
      <aside className={styles.contactRight}>
        <p className={styles.proofLabel}>Recent outcome</p>
        <p className={styles.proofBody}>{proof}</p>
      </aside>
    </section>
  );
}

function Foot() {
  return (
    <footer className={styles.foot}>
      <p>
        {profile.name} <span className={styles.divider}>·</span> {profile.location}
        <span className={styles.divider}>·</span>
        Peach Studio
      </p>
      <p>© {new Date().getFullYear()} — All work shipped.</p>
    </footer>
  );
}
