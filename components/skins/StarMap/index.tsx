"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import {
  readCanonical,
  readCanonicalParagraphs,
  readOptionCanonical,
} from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { AnimatePresence, motion } from "motion/react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./StarMap.module.css";

interface MapNode {
  id: string;
  kind: "profile" | "case" | "philosophy" | "toolkit" | "contact";
  x: number;
  y: number;
  size: number;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  metrics?: { label: string; value: string }[];
  href?: string;
  hrefLabel?: string;
  /** Optional full case reference — rendered as a complete case study panel. */
  caseStudy?: Case;
  /** Optional philosophy quote lines — rendered as a multi-line quote. */
  philosophyLines?: string[];
  /** Optional full toolkit — rendered as grouped categories. */
  toolkitFull?: typeof toolkit;
}

const NODES: MapNode[] = (() => {
  const list: MapNode[] = [
    {
      id: "profile",
      kind: "profile",
      x: 0,
      y: 0,
      size: 24,
      accent: "#62d1ff",
      eyebrow: profile.location,
      title: profile.name,
      body: profile.intro,
    },
    ...cases.map((c, idx) => {
      const chosen = c.options.find((option) => option.selected);
      const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
      const angle = (-0.85 + idx * 0.95) * Math.PI * 0.5;
      const radius = 340;
      return {
        id: `case-${c.id}`,
        kind: "case" as const,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 18,
        accent: c.brand?.primary ?? "#a78bfa",
        eyebrow: `Case ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
        title: c.title,
        body: bet,
        caseStudy: c,
      };
    }),
    {
      id: "philosophy",
      kind: "philosophy",
      x: -520,
      y: -260,
      size: 15,
      accent: "#ff8c42",
      eyebrow: "Operating principle",
      title: "What we believe",
      body: philosophy.quote[0] ?? "",
      philosophyLines: philosophy.quote,
    },
    {
      id: "toolkit",
      kind: "toolkit",
      x: 560,
      y: -140,
      size: 15,
      accent: "#6ce29b",
      eyebrow: "Toolkit",
      title: "What we reach for",
      body: "Engineering stack and product principles.",
      toolkitFull: toolkit,
    },
    {
      id: "contact",
      kind: "contact",
      x: 0,
      y: 380,
      size: 20,
      accent: "#f3d36b",
      eyebrow: "Talk",
      title: profile.availability.message,
      body: "Bring the constraint, the deadline, and the team you've got.",
      href: `mailto:${profile.email}`,
      hrefLabel: profile.email,
    },
  ];
  return list;
})();

// Derived from `cases` so edges never go stale when a case id changes or a
// 4th case is added: profile→each case, a chain between consecutive cases,
// last case→philosophy, and toolkit→first case.
const CASE_NODE_IDS = cases.map((c) => `case-${c.id}`);
const EDGES: [string, string][] = [
  ...CASE_NODE_IDS.map((id) => ["profile", id] as [string, string]),
  ["philosophy", "profile"],
  ...CASE_NODE_IDS.slice(0, -1).map(
    (id, i) => [id, CASE_NODE_IDS[i + 1]] as [string, string],
  ),
  ...(CASE_NODE_IDS.length
    ? [[CASE_NODE_IDS.at(-1)!, "philosophy"] as [string, string]]
    : []),
  ["profile", "toolkit"],
  ["profile", "contact"],
  ...(CASE_NODE_IDS.length
    ? [["toolkit", CASE_NODE_IDS[0]] as [string, string]]
    : []),
];

const STAR_FIELD = generateStars(260);
const MIN_SCALE = 0.45;
const MAX_SCALE = 2.4;

interface View {
  x: number;
  y: number;
  scale: number;
}

export function StarMap() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);

  // Current view (rendered) — mutable via ref + RAF loop
  const view = useRef<View>({ x: 0, y: 0, scale: 1 });
  // Target view (where we want to end up). useFrame-style damping animates toward it.
  const target = useRef<View>({ x: 0, y: 0, scale: 1 });
  // Pointer-drag velocity for inertia after release
  const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null);

  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [, forceRender] = useState(0); // re-render compass occasionally

  const dragRef = useRef<{
    startX: number;
    startY: number;
    viewX: number;
    viewY: number;
    pointerId: number;
    moved: boolean;
  } | null>(null);

  /* ─────── RAF loop: damp current view toward target ─────── */
  useEffect(() => {
    let rafId: number | null = null;
    let lastT = performance.now();
    let tickCount = 0;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      // Apply velocity if not dragging — inertia decay
      if (!dragRef.current && (velocity.current.x !== 0 || velocity.current.y !== 0)) {
        target.current.x += velocity.current.x * dt;
        target.current.y += velocity.current.y * dt;
        const friction = Math.exp(-3.2 * dt);
        velocity.current.x *= friction;
        velocity.current.y *= friction;
        if (
          Math.abs(velocity.current.x) < 0.5 &&
          Math.abs(velocity.current.y) < 0.5
        ) {
          velocity.current.x = 0;
          velocity.current.y = 0;
        }
      }

      // Damp current toward target
      const k = 1 - Math.exp(-8 * dt); // critically-damped lerp factor
      view.current.x += (target.current.x - view.current.x) * k;
      view.current.y += (target.current.y - view.current.y) * k;
      view.current.scale += (target.current.scale - view.current.scale) * k;

      // Apply transforms directly to DOM — no React re-render needed
      const world = worldRef.current;
      const stars = starsRef.current;
      if (world) {
        world.style.transform = `translate3d(${view.current.x}px, ${view.current.y}px, 0) scale(${view.current.scale})`;
      }
      if (stars) {
        stars.style.transform = `translate3d(${view.current.x * 0.18}px, ${view.current.y * 0.18}px, 0)`;
      }

      // Occasionally trigger a re-render so compass + selection-aware UI stays in sync
      tickCount++;
      if (tickCount % 30 === 0) forceRender((v) => v + 1);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  /* ─────── pointer drag ─────── */
  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        viewX: target.current.x,
        viewY: target.current.y,
        pointerId: event.pointerId,
        moved: false,
      };
      velocity.current.x = 0;
      velocity.current.y = 0;
      lastPointer.current = {
        x: event.clientX,
        y: event.clientY,
        t: performance.now(),
      };
      (event.target as Element).setPointerCapture?.(event.pointerId);
      setIsDragging(true);
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag?.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
      target.current.x = drag.viewX + dx;
      target.current.y = drag.viewY + dy;
      // sample velocity
      const last = lastPointer.current;
      const now = performance.now();
      if (last) {
        const dtMs = now - last.t;
        if (dtMs > 0) {
          velocity.current.x = ((event.clientX - last.x) / dtMs) * 1000;
          velocity.current.y = ((event.clientY - last.y) / dtMs) * 1000;
        }
      }
      lastPointer.current = { x: event.clientX, y: event.clientY, t: now };
    },
    [],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    if (!drag.moved) setSelected(null);
    dragRef.current = null;
    lastPointer.current = null;
    setIsDragging(false);
  }, []);

  /* ─────── wheel zoom (around cursor) ─────── */
  const onWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    // Pointer position in screen-center-relative coords
    const px = event.clientX - rect.left - rect.width / 2;
    const py = event.clientY - rect.top - rect.height / 2;

    const oldScale = target.current.scale;
    // Smooth zoom factor
    const factor = Math.exp(-event.deltaY * 0.0015);
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, oldScale * factor));

    // Zoom around cursor: keep world point under cursor stationary
    // worldPoint = (cursor - target) / oldScale → after zoom we want same worldPoint
    // newTarget = cursor - worldPoint * newScale
    const worldX = (px - target.current.x) / oldScale;
    const worldY = (py - target.current.y) / oldScale;
    target.current.scale = newScale;
    target.current.x = px - worldX * newScale;
    target.current.y = py - worldY * newScale;
  }, []);

  /* ─────── click-to-focus ─────── */
  const focusNode = useCallback((node: MapNode) => {
    const stage = stageRef.current;
    if (!stage) return;
    // Pan so node ends up roughly at horizontal center, slightly above middle
    // so the side card has room. We want world(node.x, node.y) to render at
    // screen-center-relative (-220, -40).
    const targetScreenX = window.innerWidth < 900 ? 0 : -200;
    const targetScreenY = -30;
    const newScale = 1.45;
    target.current.scale = newScale;
    target.current.x = targetScreenX - node.x * newScale;
    target.current.y = targetScreenY - node.y * newScale;
  }, []);

  const onNodeClick = useCallback(
    (node: MapNode) => {
      setSelected((prev) => {
        const next = prev === node.id ? null : node.id;
        if (next) focusNode(node);
        return next;
      });
    },
    [focusNode],
  );

  /* ─────── keyboard ─────── */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (event.key === "Escape") {
        setSelected(null);
        return;
      }
      const step = (event.shiftKey ? 240 : 100) / target.current.scale;
      if (event.key === "ArrowLeft") target.current.x += step;
      else if (event.key === "ArrowRight") target.current.x -= step;
      else if (event.key === "ArrowUp") target.current.y += step;
      else if (event.key === "ArrowDown") target.current.y -= step;
      else if (event.key === "+" || event.key === "=") {
        target.current.scale = Math.min(MAX_SCALE, target.current.scale * 1.18);
      } else if (event.key === "-" || event.key === "_") {
        target.current.scale = Math.max(MIN_SCALE, target.current.scale / 1.18);
      } else if (event.key.toLowerCase() === "c") {
        target.current = { x: 0, y: 0, scale: 1 };
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, []);

  const activeNodeId = selected ?? hover;
  const activeNode = useMemo(
    () => NODES.find((n) => n.id === activeNodeId) ?? null,
    [activeNodeId],
  );
  const lookup = useMemo(() => {
    const map = new Map<string, MapNode>();
    NODES.forEach((node) => map.set(node.id, node));
    return map;
  }, []);

  // Neighbors of the active node — highlighted edges/nodes
  const neighbors = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const s = new Set<string>();
    EDGES.forEach(([a, b]) => {
      if (a === activeNodeId) s.add(b);
      else if (b === activeNodeId) s.add(a);
    });
    return s;
  }, [activeNodeId]);

  return (
    <main className={styles.root}>
      <Hud />
      <div
        ref={stageRef}
        className={`${styles.stage} ${isDragging ? styles.stageDragging : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        role="application"
        aria-label="Drag to pan, scroll to zoom, click stars to focus."
      >
        <div className={styles.nebula} aria-hidden="true" />
        <div ref={starsRef} className={styles.starField} aria-hidden="true">
          {STAR_FIELD.map((star) => (
            <span
              key={star.id}
              className={styles.star}
              style={{
                left: `${star.x}px`,
                top: `${star.y}px`,
                opacity: star.opacity,
                transform: `scale(${star.size})`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.twinkle}s`,
              }}
            />
          ))}
        </div>

        <div ref={worldRef} className={styles.world}>
          <svg className={styles.edges} aria-hidden="true">
            {EDGES.map(([fromId, toId]) => {
              const from = lookup.get(fromId);
              const to = lookup.get(toId);
              if (!from || !to) return null;
              const isActive =
                activeNodeId === fromId || activeNodeId === toId;
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={`${styles.edge} ${isActive ? styles.edgeActive : ""}`}
                  style={{
                    stroke: isActive
                      ? from.accent
                      : "rgba(232, 232, 244, 0.16)",
                  }}
                />
              );
            })}
          </svg>

          {NODES.map((node) => {
            const isActive = node.id === activeNodeId;
            const isNeighbor = neighbors.has(node.id);
            return (
              <button
                key={node.id}
                type="button"
                className={`${styles.node} ${isActive ? styles.nodeActive : ""} ${
                  isNeighbor ? styles.nodeNeighbor : ""
                } ${styles[`node_${node.kind}`] ?? ""}`}
                style={
                  {
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    "--accent": node.accent,
                    "--size": `${node.size}px`,
                  } as CSSProperties
                }
                onPointerEnter={() => setHover(node.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(node.id)}
                onBlur={() => setHover(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  onNodeClick(node);
                }}
                aria-label={`${node.eyebrow} — ${node.title}`}
                aria-pressed={selected === node.id}
              >
                <span className={styles.nodeCore} />
                <span className={styles.nodeHalo} />
                <span className={styles.nodePulse} aria-hidden="true" />
                <span className={styles.nodeLabel}>{node.title}</span>
              </button>
            );
          })}
        </div>

        {/* Card lives in screen space, not world space, so zoom doesn't distort it */}
        <AnimatePresence mode="wait">
          {activeNode ? (
            <NodeCard key={activeNode.id} node={activeNode} />
          ) : null}
        </AnimatePresence>

        <Compass view={view} onRecenter={() => {
          target.current = { x: 0, y: 0, scale: 1 };
        }} />
        <ZoomChips
          onZoomIn={() => {
            target.current.scale = Math.min(MAX_SCALE, target.current.scale * 1.2);
          }}
          onZoomOut={() => {
            target.current.scale = Math.max(MIN_SCALE, target.current.scale / 1.2);
          }}
        />
      </div>
    </main>
  );
}

function Hud() {
  return (
    <header className={styles.hud}>
      <div className={styles.hudLeft}>
        <p className={styles.hudKicker}>
          <span className={styles.hudDot} /> {profile.location}
        </p>
        <h1 className={styles.hudTitle}>Star Map</h1>
        <p className={styles.hudSub}>
          {profile.name} · {profile.currentRole}
        </p>
      </div>
      <div className={styles.hudRight}>
        <p className={styles.hudHint}>
          <kbd>drag</kbd> pan · <kbd>scroll</kbd> zoom · <kbd>click</kbd> focus ·{" "}
          <kbd>c</kbd> recenter
        </p>
        <a href={`mailto:${profile.email}`} className={styles.hudCta}>
          Talk →
        </a>
      </div>
    </header>
  );
}

function NodeCard({ node }: Readonly<{ node: MapNode }>) {
  return (
    <motion.div
      className={styles.card}
      style={{ "--accent": node.accent } as CSSProperties}
      initial={{ opacity: 0, x: 30, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.42, ease: [0.2, 0.6, 0.2, 1] }}
    >
      <div className={styles.cardScroll}>
        <p className={styles.cardEyebrow}>{node.eyebrow}</p>
        <h2 className={styles.cardTitle}>{node.title}</h2>
        <p className={styles.cardBody}>{node.body}</p>

        {node.caseStudy ? <CaseDetail caseStudy={node.caseStudy} /> : null}
        {node.philosophyLines ? (
          <PhilosophyDetail lines={node.philosophyLines} />
        ) : null}
        {node.toolkitFull ? (
          <ToolkitDetail toolkitFull={node.toolkitFull} />
        ) : null}

        {!node.caseStudy && node.metrics?.length ? (
          <ul className={styles.cardMetrics}>
            {node.metrics.map((metric, i) => (
              <motion.li
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.08, duration: 0.4 }}
              >
                <span className={styles.cardMetricValue}>{metric.value}</span>
                <span className={styles.cardMetricLabel}>{metric.label}</span>
              </motion.li>
            ))}
          </ul>
        ) : null}

        {node.href ? (
          <a className={styles.cardLink} href={node.href}>
            {node.hrefLabel ?? node.href} →
          </a>
        ) : null}
      </div>
    </motion.div>
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
    <div className={styles.cardCase}>
      <p className={styles.cardSummary}>{caseStudy.summary}</p>

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

      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Problem</h4>
        {problemIntro ? (
          <p className={styles.cardPara}>{problemIntro}</p>
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
          <p key={p} className={styles.cardPara}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Options</h4>
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

      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Bet</h4>
        {betIntro ? <p className={styles.betIntro}>{betIntro}</p> : null}
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
                <p className={styles.cardPara}>{paras[0]}</p>
              ) : null}
            </div>
          );
        })}
      </section>

      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Outcome</h4>
        {metrics.length > 0 ? (
          <ul className={styles.cardMetrics}>
            {metrics.map((m) => (
              <li key={m.label}>
                <span className={styles.cardMetricValue}>{m.value}</span>
                <span className={styles.cardMetricLabel}>{m.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {outcomeParagraphs.map((p) => (
          <p key={p} className={styles.cardPara}>
            {p}
          </p>
        ))}
      </section>

      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Reflection</h4>
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

function PhilosophyDetail({ lines }: Readonly<{ lines: string[] }>) {
  return (
    <blockquote className={styles.philosophyQuote}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </blockquote>
  );
}

function ToolkitDetail({
  toolkitFull,
}: Readonly<{ toolkitFull: typeof toolkit }>) {
  return (
    <div className={styles.cardCase}>
      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Engineering</h4>
        <ul className={styles.toolkitList}>
          {toolkitFull.engineering.map((group) => (
            <li key={group.category}>
              <span className={styles.toolkitCategory}>{group.category}</span>
              <span className={styles.toolkitItems}>
                {group.items.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.cardSection}>
        <h4 className={styles.cardSectionLabel}>Product principles</h4>
        <ul className={styles.toolkitProductList}>
          {toolkitFull.product.map((entry) => (
            <li key={entry.category}>
              <p className={styles.toolkitProductHeadline}>{entry.headline}</p>
              <p className={styles.toolkitProductBody}>{entry.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Compass({
  view,
  onRecenter,
}: Readonly<{ view: React.RefObject<View>; onRecenter: () => void }>) {
  // Compass reads from the *current* view via ref. We re-render the parent
  // periodically (forceRender in StarMap) so this displays a fresh-ish value.
  const distance = Math.round(Math.hypot(view.current.x, view.current.y));
  const zoom = view.current.scale.toFixed(2);
  return (
    <div className={styles.compass}>
      <p className={styles.compassLabel}>Drift · Zoom</p>
      <p className={styles.compassValue}>
        {distance}px <span className={styles.compassSep}>·</span> {zoom}×
      </p>
      <button type="button" onClick={onRecenter} className={styles.compassBtn}>
        Recenter
      </button>
    </div>
  );
}

function ZoomChips({
  onZoomIn,
  onZoomOut,
}: Readonly<{ onZoomIn: () => void; onZoomOut: () => void }>) {
  return (
    <div className={styles.zoomChips}>
      <button type="button" className={styles.zoomChip} onClick={onZoomIn} aria-label="Zoom in">
        +
      </button>
      <button type="button" className={styles.zoomChip} onClick={onZoomOut} aria-label="Zoom out">
        −
      </button>
    </div>
  );
}

function generateStars(count: number) {
  const stars: {
    id: string;
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
    twinkle: number;
  }[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i += 1) {
    stars.push({
      id: `s${i}`,
      x: (rand() - 0.5) * 3200,
      y: (rand() - 0.5) * 2200,
      size: 0.4 + rand() * 1.6,
      opacity: 0.18 + rand() * 0.65,
      delay: rand() * 4,
      twinkle: 2.4 + rand() * 4,
    });
  }
  return stars;
}
