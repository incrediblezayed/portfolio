"use client";

import { animate, stagger } from "animejs";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MaskReveal.module.css";

export interface MaskLineProps {
  readonly children: ReactNode;
  readonly inline?: boolean;
  readonly className?: string;
}

/**
 * Wraps a logical line of typography in a clipped row whose inner content
 * starts translated below the clip. Pair with `useMaskReveal` on the
 * containing element to trigger the staggered rise on scroll-into-view.
 */
export function MaskLine({ children, inline, className }: MaskLineProps) {
  const clipClass = inline ? styles.clipInline : styles.clip;
  const lineClass = inline ? styles.lineInline : styles.line;
  return (
    <span className={`${clipClass}${className ? ` ${className}` : ""}`}>
      <span className={lineClass} data-mask-line>
        {children}
      </span>
    </span>
  );
}

export interface UseMaskRevealOptions {
  readonly duration?: number;
  readonly stagger?: number;
  readonly threshold?: number;
}

/**
 * Observes the returned ref for scroll-into-view, then animates every
 * `[data-mask-line]` descendant from translateY(110%) → translateY(0)
 * with a stagger. Honors prefers-reduced-motion (renders at rest).
 */
export function useMaskReveal<T extends HTMLElement = HTMLElement>(
  options: UseMaskRevealOptions = {},
) {
  const { duration = 900, stagger: staggerMs = 90, threshold = 0.25 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || globalThis.window === undefined) return;
    const lines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-mask-line]"),
    );
    if (lines.length === 0) return;

    const reduce = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      lines.forEach((l) => {
        l.style.transform = "translateY(0)";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          animate(lines, {
            translateY: ["110%", "0%"],
            duration,
            delay: stagger(staggerMs),
            ease: "out(3)",
          });
          io.disconnect();
          break;
        }
      },
      { threshold },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [duration, staggerMs, threshold]);

  return ref;
}
