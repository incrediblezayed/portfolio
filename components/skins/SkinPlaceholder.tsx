import { profile } from "@/content";
import type { ThemeRegistryEntry } from "@/lib/types";
import styles from "./SkinPlaceholder.module.css";

export function SkinPlaceholder({ skin }: Readonly<{ skin: ThemeRegistryEntry }>) {
  return (
    <div className={styles.root}>
      <div
        className={styles.card}
        style={{
          background: skin.swatch.background,
          color: skin.swatch.foreground,
          borderColor: skin.swatch.accent,
        }}
      >
        <p className={styles.eyebrow} style={{ color: skin.swatch.accent }}>
          Skin {skin.shortcut}
        </p>
        <h1 className={styles.title}>{skin.name}</h1>
        <p className={styles.description}>{skin.description}</p>
        <p className={styles.body}>
          This skin is under construction. The same content from the Decision Log will land here in
          the voice this skin is built for. Switch back with the floating button or press{" "}
          <kbd>1</kbd> to read the canonical version.
        </p>
        <p className={styles.signoff}>
          — {profile.name}, mid-build.
        </p>
      </div>
    </div>
  );
}
