import type { BrandColor, BrandGradient } from "./types";

/** Convert a structured BrandGradient to a CSS linear-gradient() string. */
export function gradientToCss(gradient: BrandGradient): string {
  const stops = gradient.stops
    .map((s) => `${s.color} ${s.offset}%`)
    .join(", ");
  return `linear-gradient(${gradient.direction}deg, ${stops})`;
}

/** Return the brand primary color, or a fallback if no brand is set. */
export function brandAccent(
  brand: BrandColor | undefined,
  fallback: string,
): string {
  return brand?.primary ?? fallback;
}

/** Return a CSS gradient string for the brand, or a fallback color/gradient. */
export function brandGradientCss(
  brand: BrandColor | undefined,
  fallback: string,
): string {
  if (!brand?.gradient) return fallback;
  return gradientToCss(brand.gradient);
}

/**
 * Pick a contrasting accent from a brand:
 * - If a secondary scale exists, use Secondary 200 (works as a soft pop)
 * - Else if scale exists, use Scale 200 (light tint)
 * - Else return the primary itself (caller may need its own fallback)
 */
export function brandSoftAccent(
  brand: BrandColor | undefined,
): string | undefined {
  if (brand?.secondary) return brand.secondary[200];
  if (brand?.scale) return brand.scale[200];
  return brand?.primary;
}

export type BrandMode = "default" | "light" | "dark";

export interface BrandStyle {
  /** Full CSS background (gradient string or solid color) */
  background: string;
  /** Text color appropriate for the background */
  ink: string;
  /** Accent for UI elements (option borders, eyebrows, etc) */
  accent: string;
}

/**
 * Derive mode-aware styling from a brand. Centralizes per-case visual logic
 * for skins that want to render brand-themed sections.
 */
export function brandStyle(brand: BrandColor, mode: BrandMode): BrandStyle {
  const direction = brand.gradient?.direction ?? 165;

  if (mode === "light") {
    // Designer-provided Secondary palette → use it as the pastel gradient
    if (brand.secondary) {
      const stops = [
        brand.secondary[100],
        brand.secondary[200],
        brand.secondary[300],
      ];
      return {
        background: `linear-gradient(${direction}deg, ${stops[0]} 0%, ${stops[1]} 50%, ${stops[2]} 100%)`,
        ink: brand.primary,
        accent: brand.primary,
      };
    }
    // Scale-only brand (no Secondary) — derive brand-tinted paper.
    // Scale 100→300 stops get too dark for legibility (Scale 300 is medium-saturation).
    // Mix primary with white at low percentages → subtle, branded paper with pop.
    const paper = (pct: number) =>
      `color-mix(in srgb, ${brand.primary} ${pct}%, white)`;
    return {
      background: `linear-gradient(${direction}deg, ${paper(8)} 0%, ${paper(14)} 50%, ${paper(22)} 100%)`,
      ink: brand.primary,
      accent: brand.primary,
    };
  }

  if (mode === "dark") {
    if (brand.scale) {
      const stops = [brand.scale[500], brand.scale[400], brand.scale[300]];
      return {
        background: `linear-gradient(${direction}deg, ${stops[0]} 0%, ${stops[1]} 50%, ${stops[2]} 100%)`,
        ink: "#ffffff",
        accent: brand.secondary?.[300] ?? brand.scale[200],
      };
    }
    return { background: brand.primary, ink: "#ffffff", accent: brand.primary };
  }

  // default: prefer the official gradient if provided
  if (brand.gradient) {
    return {
      background: gradientToCss(brand.gradient),
      ink: "#ffffff",
      accent: brand.secondary?.[200] ?? brand.scale?.[200] ?? "#ffffff",
    };
  }
  if (brand.scale) {
    const stops = [brand.scale[400], brand.scale[500], brand.scale[500]];
    return {
      background: `linear-gradient(${direction}deg, ${stops[0]} 0%, ${stops[1]} 50%, ${stops[2]} 100%)`,
      ink: "#ffffff",
      accent: brand.scale[200],
    };
  }
  return { background: brand.primary, ink: "#ffffff", accent: brand.primary };
}

