"use client";

import { useTheme } from "./ThemeProvider";
import { DecisionLog } from "./skins/DecisionLog";
import { SkinPlaceholder } from "./skins/SkinPlaceholder";
import { THEMES } from "@/lib/themes";

export function Portfolio() {
  const { theme } = useTheme();
  switch (theme) {
    case "decisionlog":
      return <DecisionLog />;
    case "editorial":
    case "twocolumn":
    case "changelog":
    case "terminal":
    case "readingroom":
      return <SkinPlaceholder skin={THEMES[theme]} />;
    default:
      return <DecisionLog />;
  }
}
