"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { isThemeId } from "@/lib/themes";
import type { ThemeId } from "@/lib/types";

const STORAGE_KEY = "portfolio.theme";
const COLOR_MODE_KEY = "portfolio.colorMode";
const URL_PARAM = "theme";

export type ColorMode = "default" | "light" | "dark";
const COLOR_MODES: ColorMode[] = ["default", "light", "dark"];

function isColorMode(value: string | null | undefined): value is ColorMode {
  return value === "default" || value === "light" || value === "dark";
}

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (next: ThemeId) => void;
  colorMode: ColorMode;
  setColorMode: (next: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyAll(): void {
  listeners.forEach((listener) => listener());
}

function readBrowserTheme(): ThemeId | null {
  if (globalThis.window === undefined) return null;
  const url = new URL(globalThis.location.href);
  const fromUrl = url.searchParams.get(URL_PARAM);
  if (isThemeId(fromUrl)) return fromUrl;
  const fromStorage = globalThis.localStorage.getItem(STORAGE_KEY);
  if (isThemeId(fromStorage)) return fromStorage;
  return null;
}

function readBrowserColorMode(): ColorMode | null {
  if (globalThis.window === undefined) return null;
  const stored = globalThis.localStorage.getItem(COLOR_MODE_KEY);
  return isColorMode(stored) ? stored : null;
}

export function ThemeProvider({
  children,
  defaultTheme,
}: Readonly<{
  children: ReactNode;
  defaultTheme: ThemeId;
}>) {
  const theme = useSyncExternalStore<ThemeId>(
    subscribe,
    () => readBrowserTheme() ?? defaultTheme,
    () => defaultTheme,
  );

  const colorMode = useSyncExternalStore<ColorMode>(
    subscribe,
    () => readBrowserColorMode() ?? "default",
    () => "default",
  );

  const setTheme = useCallback((next: ThemeId) => {
    if (globalThis.window === undefined) return;
    globalThis.localStorage.setItem(STORAGE_KEY, next);
    const url = new URL(globalThis.location.href);
    url.searchParams.set(URL_PARAM, next);
    globalThis.history.replaceState({}, "", url.toString());
    // Reset scroll to top so the new skin opens at its hero/start — different
    // skins have different scroll lengths and pin points; stale scroll position
    // lands you mid-content with no context.
    globalThis.scrollTo({ top: 0, left: 0, behavior: "instant" });
    notifyAll();
  }, []);

  const setColorMode = useCallback((next: ColorMode) => {
    if (globalThis.window === undefined) return;
    globalThis.localStorage.setItem(COLOR_MODE_KEY, next);
    notifyAll();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, colorMode, setColorMode }),
    [theme, setTheme, colorMode, setColorMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} data-color-mode={colorMode}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}

export { COLOR_MODES };
