import { ImageResponse } from "next/og";
import { profile } from "@/content";

// Generated OG/social-card image. Replaces the previously-referenced (and
// missing) /og-image.png — this is created at build time, no asset needed.
export const alt = `${profile.name} — portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b10",
          color: "#f5f5f7",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: "#3C3B6F",
            }}
          />
          <div style={{ fontSize: 26, letterSpacing: 2, color: "#9f9fc2" }}>
            DECISION LOG
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 38,
              lineHeight: 1.3,
              color: "#c5c5da",
              maxWidth: 900,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#7878a6" }}>
          {profile.currentRole}
        </div>
      </div>
    ),
    size,
  );
}
