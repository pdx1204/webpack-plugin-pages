/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "./src/index.ts",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "dist/index.mjs", format: "es" },
  ],
  external: ["fs/promises", "path", "util", "child_process"],
  plugins: [typescript(), commonjs(), json()],
};
