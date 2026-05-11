"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export type ScrollMode =
  | "pin" // Pinned phase: top hits viewport top → bottom hits viewport bottom (only valid for elements taller than viewport)
  | "view" // Cover phase: bottom enters viewport bottom → top exits viewport top
  | "enter"; // Entry phase: bottom enters viewport bottom → top hits viewport top

export interface UseScrollProgressOptions {
  mode?: ScrollMode;
  enabled?: boolean;
}

/**
 * Tracks an element's progress through a scroll phase, returning a value in [0, 1].
 * JS-driven via requestAnimationFrame on scroll/resize. Works in every browser.
 *
 * Uses an external store + useSyncExternalStore so React doesn't re-render
 * the component on every scroll tick — only when progress actually changes.
 */
export function useScrollProgress<T extends HTMLElement>(
  modeOrOptions: ScrollMode | UseScrollProgressOptions = "view",
) {
  const opts: UseScrollProgressOptions =
    typeof modeOrOptions === "string"
      ? { mode: modeOrOptions, enabled: true }
      : { enabled: true, ...modeOrOptions };
  const mode = opts.mode ?? "view";
  const enabled = opts.enabled ?? true;

  const ref = useRef<T | null>(null);
  const progressRef = useRef(0);
  const listenersRef = useRef<Set<() => void>>(new Set());
  const [version, setVersion] = useState(0); // trigger re-subscription when ref changes

  // Note: setVersion(n+1) here is a render-callback (not effect), so it doesn't trip
  // the set-state-in-effect lint rule. We only call it when the underlying ref changes.
  const setRef = useCallback((node: T | null) => {
    if (ref.current !== node) {
      ref.current = node;
      setVersion((v) => v + 1);
    }
  }, []);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    if (!enabled) {
      progressRef.current = 0;
      listenersRef.current.forEach((cb) => cb());
      return;
    }
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const compute = (): number => {
      const rect = el.getBoundingClientRect();
      const vh = globalThis.innerHeight;

      if (mode === "pin") {
        const total = rect.height - vh;
        if (total <= 0) return 0;
        const scrolled = -rect.top;
        return clamp01(scrolled / total);
      }
      if (mode === "enter") {
        const total = Math.min(rect.height, vh);
        if (total <= 0) return 0;
        const scrolled = vh - rect.top;
        return clamp01(scrolled / total);
      }
      const total = vh + rect.height;
      const scrolled = vh - rect.top;
      return clamp01(scrolled / total);
    };

    const update = () => {
      rafId = null;
      const next = compute();
      if (Math.abs(progressRef.current - next) < 0.001) return;
      progressRef.current = next;
      listenersRef.current.forEach((cb) => cb());
    };

    const onScroll = () => {
      rafId ??= requestAnimationFrame(update);
    };

    update();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    globalThis.addEventListener("resize", onScroll);
    return () => {
      globalThis.removeEventListener("scroll", onScroll);
      globalThis.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [mode, enabled, version]);

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => {
      listenersRef.current.delete(cb);
    };
  }, []);

  const getSnapshot = useCallback(() => progressRef.current, []);
  const getServerSnapshot = useCallback(() => 0, []);

  const progress = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return [setRef, progress] as const;
}

/**
 * Tracks whether the viewport matches a media query.
 * Uses useSyncExternalStore so it's lint-clean and SSR-safe.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (globalThis.window === undefined) return () => {};
      const mq = globalThis.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (globalThis.window === undefined) return defaultValue;
    return globalThis.matchMedia(query).matches;
  }, [query, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

/**
 * Maps a value from one range to another, clamped.
 * mapRange(0.5, 0, 1, 0, 100) => 50
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  const t = clamp01((value - inMin) / (inMax - inMin));
  return outMin + (outMax - outMin) * t;
}
