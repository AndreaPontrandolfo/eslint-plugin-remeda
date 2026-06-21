import { defineConfig } from "tsdown";

export default defineConfig({
  shims: true,
  publint: { strict: true, level: "error" },
  attw: { level: "error", profile: "esm-only" },
});
