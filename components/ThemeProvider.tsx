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
const URL_PARAM = "theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (next: ThemeId) => void;
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

  const setTheme = useCallback((next: ThemeId) => {
    if (globalThis.window === undefined) return;
    globalThis.localStorage.setItem(STORAGE_KEY, next);
    const url = new URL(globalThis.location.href);
    url.searchParams.set(URL_PARAM, next);
    globalThis.history.replaceState({}, "", url.toString());
    notifyAll();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme}>{children}</div>
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
