import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    outputFile: "tests/vitest-ui-output/index.html",
    coverage: {
      enabled: true,
      reporter: ["html"],
      include: ["src/rules/**/*"],
      reportsDirectory: "tests/vitest-ui-output/coverage",
    },
    reporters: ["default", "html"],
  },
});
