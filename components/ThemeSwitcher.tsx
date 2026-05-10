"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES, THEME_ORDER } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import styles from "./ThemeSwitcher.module.css";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
      }
      const candidate = THEME_ORDER.find((id) => THEMES[id].shortcut === event.key);
      if (candidate && candidate !== theme) {
        setTheme(candidate);
      }
      if (event.key === "Escape" && open) setOpen(false);
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [theme, setTheme, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!panelRef.current || !buttonRef.current) return;
      if (
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    globalThis.addEventListener("mousedown", handler);
    return () => globalThis.removeEventListener("mousedown", handler);
  }, [open]);

  const current = THEMES[theme];

  return (
    <div className={styles.root} aria-live="polite">
      <button
        ref={buttonRef}
        className={styles.trigger}
        type="button"
        aria-label={`Theme switcher. Current theme: ${current.name}`}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={styles.swatchDot}
          style={{
            background: current.swatch.background,
            color: current.swatch.foreground,
            borderColor: current.swatch.accent,
          }}
        >
          <span aria-hidden="true">{current.shortcut}</span>
        </span>
      </button>
      {open ? (
        <div
          ref={panelRef}
          role="menu"
          className={styles.panel}
          aria-label="Choose a skin"
        >
          <p className={styles.panelHeader}>Six skins, same content</p>
          <ul className={styles.themeList}>
            {THEME_ORDER.map((id) => {
              const t = THEMES[id];
              const isActive = id === theme;
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    className={`${styles.themeButton} ${isActive ? styles.themeButtonActive : ""}`}
                    onClick={() => {
                      setTheme(id);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={styles.swatch}
                      style={{
                        background: t.swatch.background,
                        borderColor: t.swatch.accent,
                      }}
                      aria-hidden="true"
                    >
                      <span style={{ color: t.swatch.foreground }}>{t.shortcut}</span>
                    </span>
                    <span className={styles.themeLabel}>
                      <span className={styles.themeName}>{t.name}</span>
                      <span className={styles.themeDescription}>{t.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className={styles.panelHint}>
            Press <kbd>1</kbd>–<kbd>6</kbd> to switch.
          </p>
        </div>
      ) : null}
    </div>
  );
}

