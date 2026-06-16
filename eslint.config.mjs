import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from 'eslint-config-next/core-web-vitals.js';
import nextTs from "eslint-config-next/typescript.js";  // add .js here

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;