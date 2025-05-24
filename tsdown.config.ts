import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  shims: true,
  publint: { strict: true },
  dts: true,
});
