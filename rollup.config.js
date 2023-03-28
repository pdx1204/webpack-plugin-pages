/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import del from "rollup-plugin-delete";

export default {
  input: "./src/index.ts",
  output: [
    { file: "dist/index.cjs", format: "cjs" },
    { file: "dist/index.mjs", format: "es" },
  ],
  external: ["fs/promises", "path"],
  plugins: [typescript(), commonjs(), json(), del({ targets: "dist/*" })],
};
