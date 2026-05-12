"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { THEMES, THEME_GROUPS, THEME_ORDER } from "@/lib/themes";
import type { ThemeId } from "@/lib/types";
import { COLOR_MODES, useTheme } from "./ThemeProvider";
import type { ColorMode } from "./ThemeProvider";
import styles from "./ThemeSwitcher.module.css";

const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  default: "Default",
  light: "Light",
  dark: "Dark",
};

type PaletteItem = {
  type: "theme";
  id: ThemeId;
  groupLabel: string;
};

export function ThemeSwitcher() {
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Single-key shortcuts (1-9, letters) — still work even when palette is
     closed, exactly like before. When palette is open, those keys are
     captured by the search input instead. */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Ignore when typing in any input/textarea/contenteditable.
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }
      // Cmd/Ctrl+K — open palette.
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }
      // "/" — open palette (GitHub/Slack convention) only when palette closed.
      if (!open && event.key === "/" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
        return;
      }
      // While palette is closed, single-key skin shortcuts.
      if (!open && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const candidate = THEME_ORDER.find(
          (id) => THEMES[id].shortcut === event.key.toLowerCase(),
        );
        if (candidate && candidate !== theme) {
          setTheme(candidate);
        }
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [theme, setTheme, open]);

  /* Build the flat ranked list from groups, then filter by query. */
  const allItems = useMemo<PaletteItem[]>(() => {
    return THEME_GROUPS.flatMap((group) =>
      group.themes.map(
        (id): PaletteItem => ({ type: "theme", id, groupLabel: group.label }),
      ),
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => {
      const t = THEMES[item.id];
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        item.groupLabel.toLowerCase().includes(q)
      );
    });
  }, [allItems, query]);

  /* Reset highlight when the filtered list changes. */
  useLayoutEffect(() => {
    setHighlight((prev) => {
      if (filtered.length === 0) return 0;
      return Math.min(prev, filtered.length - 1);
    });
  }, [filtered.length]);

  /* When the palette opens: focus the search input, prime highlight to
     the current theme's position. We index against `allItems` (the full,
     unfiltered list) because we also reset the query to "" above —
     `filtered` from the previous render could be stale and not include
     the active theme, which would silently fall back to index 0. */
  useEffect(() => {
    if (open) {
      setQuery("");
      const found = allItems.findIndex((it) => it.id === theme);
      const idx = Math.max(found, 0);
      setHighlight(idx);
      // Defer focus + scroll so the input has mounted and the list has
      // re-rendered with the cleared query.
      const focusId = globalThis.setTimeout(() => inputRef.current?.focus(), 0);
      const scrollId = globalThis.setTimeout(() => {
        const el = listRef.current?.querySelector<HTMLElement>(
          `[data-index="${idx}"]`,
        );
        el?.scrollIntoView({ block: "center" });
      }, 16);
      return () => {
        globalThis.clearTimeout(focusId);
        globalThis.clearTimeout(scrollId);
      };
    }
    triggerRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Keep the highlighted row scrolled into view. */
  useLayoutEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${highlight}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const handleSubmit = useCallback(
    (idx: number) => {
      const item = filtered[idx];
      if (!item) return;
      setTheme(item.id);
      setOpen(false);
    },
    [filtered, setTheme],
  );

  const handleInputKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight((prev) =>
          filtered.length === 0 ? 0 : (prev + 1) % filtered.length,
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((prev) =>
          filtered.length === 0
            ? 0
            : (prev - 1 + filtered.length) % filtered.length,
        );
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit(highlight);
      }
    },
    [filtered.length, highlight, handleSubmit],
  );

  const current = THEMES[theme];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={`Switch skin. Current: ${current.name}. Cmd+K to open.`}
        aria-expanded={open}
        onClick={() => setOpen(true)}
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
        <Palette
          theme={theme}
          colorMode={colorMode}
          setColorMode={setColorMode}
          query={query}
          setQuery={setQuery}
          filtered={filtered}
          highlight={highlight}
          setHighlight={setHighlight}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          handleInputKey={handleInputKey}
          inputRef={inputRef}
          listRef={listRef}
        />
      ) : null}
    </>
  );
}

function Palette({
  theme,
  colorMode,
  setColorMode,
  query,
  setQuery,
  filtered,
  highlight,
  setHighlight,
  onClose,
  onSubmit,
  handleInputKey,
  inputRef,
  listRef,
}: Readonly<{
  theme: ThemeId;
  colorMode: ColorMode;
  setColorMode: (m: ColorMode) => void;
  query: string;
  setQuery: (s: string) => void;
  filtered: PaletteItem[];
  highlight: number;
  setHighlight: (n: number) => void;
  onClose: () => void;
  onSubmit: (idx: number) => void;
  handleInputKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}>) {
  /* Group the filtered items by their groupLabel — preserves the order
     groups appear in THEME_GROUPS. */
  const sections = useMemo(() => {
    const map = new Map<string, { groupLabel: string; items: { item: PaletteItem; index: number }[] }>();
    filtered.forEach((item, index) => {
      const bucket = map.get(item.groupLabel) ?? {
        groupLabel: item.groupLabel,
        items: [],
      };
      bucket.items.push({ item, index });
      map.set(item.groupLabel, bucket);
    });
    return Array.from(map.values());
  }, [filtered]);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.palette}
        role="dialog"
        aria-label="Skin palette"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.paletteHead}>
          <span className={styles.paletteIcon} aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKey}
            placeholder="Search skins by name, description, or group…"
            className={styles.searchInput}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Search skins"
          />
          <button
            type="button"
            className={styles.escBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ESC
          </button>
        </header>

        <div ref={listRef} className={styles.listScroll}>
          {filtered.length === 0 ? (
            <p className={styles.empty}>
              No skin matches &quot;{query}&quot;.
            </p>
          ) : (
            sections.map((section) => (
              <section
                key={section.groupLabel}
                className={styles.section}
                aria-label={section.groupLabel}
              >
                <p className={styles.sectionHead}>{section.groupLabel}</p>
                <ul className={styles.itemList}>
                  {section.items.map(({ item, index }) => {
                    const t = THEMES[item.id];
                    const isActive = item.id === theme;
                    const isHighlighted = index === highlight;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isHighlighted}
                          data-index={index}
                          className={`${styles.item} ${isHighlighted ? styles.itemHighlight : ""} ${isActive ? styles.itemActive : ""}`}
                          onClick={() => onSubmit(index)}
                          onMouseEnter={() => setHighlight(index)}
                        >
                          <span
                            className={styles.itemSwatch}
                            style={{
                              background: t.swatch.background,
                              borderColor: t.swatch.accent,
                            }}
                          >
                            <span style={{ color: t.swatch.foreground }}>
                              {t.shortcut}
                            </span>
                          </span>
                          <span className={styles.itemBody}>
                            <span className={styles.itemName}>
                              {t.name}
                              {isActive ? (
                                <span className={styles.activeChip}>● active</span>
                              ) : null}
                            </span>
                            <span className={styles.itemDesc}>{t.description}</span>
                          </span>
                          <span className={styles.itemKey}>
                            <kbd>{t.shortcut.toUpperCase()}</kbd>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        <footer className={styles.paletteFoot}>
          <div className={styles.modeBlock} role="radiogroup" aria-label="Color mode">
            <span className={styles.modeLabel}>Mode</span>
            <div className={styles.modeButtons}>
              {COLOR_MODES.map((mode) => {
                const isActive = mode === colorMode;
                return (
                  <button
                    key={mode}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`${styles.modeButton} ${isActive ? styles.modeButtonActive : ""}`}
                    onClick={() => setColorMode(mode)}
                  >
                    {COLOR_MODE_LABELS[mode]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={styles.hints}>
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> select
            </span>
            <span>
              <kbd>esc</kbd> close
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
