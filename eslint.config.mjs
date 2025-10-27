import { sheriff } from "eslint-config-sheriff";
import eslintPlugin from "eslint-plugin-eslint-plugin";

const sheriffOptions = {
  react: false,
  lodash: true,
  remeda: false,
  next: false,
  astro: false,
  playwright: false,
  storybook: false,
  jest: false,
  vitest: true,
};

export default [
  ...sheriff(sheriffOptions),
  eslintPlugin.configs["all-type-checked"],
  {
    rules: {
      "@typescript-eslint/no-this-alias": 0,
      "import/no-anonymous-default-export": 0,
      "no-restricted-syntax": 0,
      "func-style": 0,
      "sonarjs/no-duplicate-string": 0,
      "import/no-default-export": 0,
      "vitest/require-hook": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/naming-convention": 0,
      "@typescript-eslint/switch-exhaustiveness-check": 0,
      "@typescript-eslint/no-unnecessary-type-conversion": 0,
      "@typescript-eslint/no-unnecessary-condition": 0,
      "fsecond/prefer-destructured-optionals": 0,
      "fsecond/no-inline-interfaces": 0,
      "eslint-plugin/require-meta-docs-recommended": 0,
    },
  },
  { ignores: [".eslint-doc-generatorrc.mjs"] },
];
