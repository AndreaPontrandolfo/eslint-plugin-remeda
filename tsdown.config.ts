import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  skipNodeModulesBundle: true,
  shims: true,
  publint: { strict: true },
  dts: true,
});
