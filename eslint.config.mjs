import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendor/tooling bundles (skill scripts) — not app code, and they
    // otherwise dominate the warning list (~95 of 98 warnings).
    ".agents/**",
  ]),
  {
    // The React Compiler is NOT enabled here (no babel-plugin-react-compiler,
    // no reactCompiler flag in next.config). These two rules flag patterns the
    // compiler *would* bail on — but several flagged spots are intentionally
    // correct without it (e.g. hydration-safe setState inside an effect). Keep
    // them visible as warnings instead of failing the lint as errors.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
]);

export default eslintConfig;
