"use client";

import { useTheme } from "./ThemeProvider";
import { DecisionLog } from "./skins/DecisionLog";
import { Editorial } from "./skins/Editorial";
import { TwoColumns } from "./skins/TwoColumns";
import { SkinPlaceholder } from "./skins/SkinPlaceholder";
import { THEMES } from "@/lib/themes";

export function Portfolio() {
  const { theme } = useTheme();
  switch (theme) {
    case "decisionlog":
      return <DecisionLog />;
    case "editorial":
      return <Editorial />;
    case "twocolumn":
      return <TwoColumns />;
    case "changelog":
    case "terminal":
    case "readingroom":
      return <SkinPlaceholder skin={THEMES[theme]} />;
    default:
      return <DecisionLog />;
  }
}
