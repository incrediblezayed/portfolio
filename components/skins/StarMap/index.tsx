"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readOptionCanonical } from "@/lib/caseVoice";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./StarMap.module.css";

interface MapNode {
  id: string;
  kind: "profile" | "case" | "philosophy" | "toolkit" | "contact";
  /** Position in world units (px before pan). Origin (0,0) is screen center on load. */
  x: number;
  y: number;
  /** Visual size of the star core (px). */
  size: number;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Optional metrics shown in the card. */
  metrics?: { label: string; value: string }[];
  /** Optional links shown at the card bottom. */
  href?: string;
  hrefLabel?: string;
}

const NODES: MapNode[] = (() => {
  const list: MapNode[] = [
    {
      id: "profile",
      kind: "profile",
      x: 0,
      y: 0,
      size: 22,
      accent: "#62d1ff",
      eyebrow: profile.location,
      title: profile.name,
      body: profile.intro,
    },
    ...cases.map((c, idx) => {
      const chosen = c.options.find((option) => option.selected);
      const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
      const angle = (-0.85 + idx * 0.95) * Math.PI * 0.5;
      const radius = 320;
      return {
        id: `case-${c.id}`,
        kind: "case" as const,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 16,
        accent: c.brand?.primary ?? "#a78bfa",
        eyebrow: `Case ${String(c.number).padStart(2, "0")} · ${c.meta.year}`,
        title: c.title,
        body: bet,
        metrics: c.outcome.metrics?.slice(0, 3).map((m) => ({
          label: m.label,
          value: m.value,
        })),
      };
    }),
    {
      id: "philosophy",
      kind: "philosophy",
      x: -480,
      y: -240,
      size: 14,
      accent: "#ff8c42",
      eyebrow: "Operating principle",
      title: "What we believe",
      body: philosophy.quote.join("  "),
    },
    {
      id: "toolkit",
      kind: "toolkit",
      x: 540,
      y: -120,
      size: 14,
      accent: "#6ce29b",
      eyebrow: "Toolkit",
      title: "What we reach for",
      body: toolkit.engineering
        .slice(0, 4)
        .map((g) => `${g.category}: ${g.items.slice(0, 3).join(", ")}`)
        .join("  ·  "),
    },
    {
      id: "contact",
      kind: "contact",
      x: 0,
      y: 360,
      size: 18,
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

const EDGES: [string, string][] = [
  ["profile", "case-infophone"],
  ["profile", "case-clickked"],
  ["profile", "case-file_saver"],
  ["philosophy", "profile"],
  ["case-infophone", "case-clickked"],
  ["case-clickked", "case-file_saver"],
  ["case-file_saver", "philosophy"],
  ["profile", "toolkit"],
  ["profile", "contact"],
  ["toolkit", "case-infophone"],
];

const STAR_FIELD = generateStars(220);

export function StarMap() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    pointerId: number;
    moved: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        panX: pan.x,
        panY: pan.y,
        pointerId: event.pointerId,
        moved: false,
      };
      (event.target as Element).setPointerCapture?.(event.pointerId);
      setIsDragging(true);
    },
    [pan.x, pan.y],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag?.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
      setPan({ x: drag.panX + dx, y: drag.panY + dy });
    },
    [],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    if (!drag.moved) setSelected(null);
    dragRef.current = null;
    setIsDragging(false);
  }, []);

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
      if (event.key === "0" && (event.ctrlKey || event.metaKey)) return;
      const step = event.shiftKey ? 120 : 60;
      if (event.key === "ArrowLeft") setPan((p) => ({ ...p, x: p.x + step }));
      else if (event.key === "ArrowRight") setPan((p) => ({ ...p, x: p.x - step }));
      else if (event.key === "ArrowUp") setPan((p) => ({ ...p, y: p.y + step }));
      else if (event.key === "ArrowDown") setPan((p) => ({ ...p, y: p.y - step }));
      else if (event.key.toLowerCase() === "c") setPan({ x: 0, y: 0 });
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
        role="application"
        aria-label="Drag to explore the case map. Hover or focus stars to read."
      >
        <StarField pan={pan} />
        <div
          className={styles.world}
          style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0)` }}
        >
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
            return (
              <button
                key={node.id}
                type="button"
                className={`${styles.node} ${isActive ? styles.nodeActive : ""} ${
                  styles[`node_${node.kind}`] ?? ""
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  "--accent": node.accent,
                  "--size": `${node.size}px`,
                } as CSSProperties}
                onPointerEnter={() => setHover(node.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(node.id)}
                onBlur={() => setHover(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected((prev) => (prev === node.id ? null : node.id));
                }}
                aria-label={`${node.eyebrow} — ${node.title}`}
                aria-pressed={selected === node.id}
              >
                <span className={styles.nodeCore} />
                <span className={styles.nodeHalo} />
                <span className={styles.nodeLabel}>{node.title}</span>
              </button>
            );
          })}

          {activeNode ? <NodeCard node={activeNode} /> : null}
        </div>

        <Compass pan={pan} onRecenter={() => setPan({ x: 0, y: 0 })} />
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
        <p className={styles.hudSub}>{profile.name} · {profile.currentRole}</p>
      </div>
      <div className={styles.hudRight}>
        <p className={styles.hudHint}>
          <kbd>drag</kbd> to pan · <kbd>hover</kbd> to read · <kbd>esc</kbd> to deselect ·{" "}
          <kbd>c</kbd> to recenter
        </p>
        <a
          href={`mailto:${profile.email}`}
          className={styles.hudCta}
        >
          Talk →
        </a>
      </div>
    </header>
  );
}

function NodeCard({ node }: Readonly<{ node: MapNode }>) {
  const offsetSign = node.x >= 0 ? -1 : 1;
  const cardX = node.x + offsetSign * (node.size + 60);
  const cardY = node.y - 10;
  return (
    <div
      className={styles.card}
      style={{
        left: `${cardX}px`,
        top: `${cardY}px`,
        transform: `translate(${offsetSign === 1 ? "0%" : "-100%"}, -50%)`,
        "--accent": node.accent,
      } as CSSProperties}
    >
      <p className={styles.cardEyebrow}>{node.eyebrow}</p>
      <h2 className={styles.cardTitle}>{node.title}</h2>
      <p className={styles.cardBody}>{node.body}</p>
      {node.metrics?.length ? (
        <ul className={styles.cardMetrics}>
          {node.metrics.map((metric) => (
            <li key={metric.label}>
              <span className={styles.cardMetricValue}>{metric.value}</span>
              <span className={styles.cardMetricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {node.href ? (
        <a className={styles.cardLink} href={node.href}>
          {node.hrefLabel ?? node.href} →
        </a>
      ) : null}
    </div>
  );
}

function StarField({ pan }: Readonly<{ pan: { x: number; y: number } }>) {
  return (
    <div
      className={styles.starField}
      style={{
        transform: `translate3d(${pan.x * 0.18}px, ${pan.y * 0.18}px, 0)`,
      }}
      aria-hidden="true"
    >
      {STAR_FIELD.map((star) => (
        <span
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            opacity: star.opacity,
            transform: `scale(${star.size})`,
          }}
        />
      ))}
    </div>
  );
}

function Compass({
  pan,
  onRecenter,
}: Readonly<{ pan: { x: number; y: number }; onRecenter: () => void }>) {
  const distance = Math.round(Math.hypot(pan.x, pan.y));
  return (
    <div className={styles.compass}>
      <p className={styles.compassLabel}>Drift</p>
      <p className={styles.compassValue}>{distance}px</p>
      <button type="button" onClick={onRecenter} className={styles.compassBtn}>
        Recenter
      </button>
    </div>
  );
}

function generateStars(count: number) {
  const stars: { id: string; x: number; y: number; size: number; opacity: number }[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i += 1) {
    stars.push({
      id: `s${i}`,
      x: (rand() - 0.5) * 2800,
      y: (rand() - 0.5) * 2000,
      size: 0.4 + rand() * 1.4,
      opacity: 0.15 + rand() * 0.55,
    });
  }
  return stars;
}
