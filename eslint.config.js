import sheriff from "eslint-config-sheriff";
import { defineFlatConfig } from "eslint-define-config";
import eslintPlugin from "eslint-plugin-eslint-plugin";

const sheriffOptions = {
  react: false,
  lodash: true,
  next: false,
  astro: false,
  playwright: false,
  jest: false,
  vitest: true,
};

export default defineFlatConfig([
  ...sheriff(sheriffOptions),
  eslintPlugin.configs["flat/recommended"],
  {
    rules: {
      "eslint-plugin/require-meta-docs-url": 2,
      "eslint-plugin/require-meta-docs-description": 2,
      "@typescript-eslint/no-this-alias": 0,
      "import/no-anonymous-default-export": 0,
      "no-restricted-syntax": 0,
      "func-style": 0,
      "import/no-default-export": 0,
      "vitest/require-hook": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/naming-convention": 0,
      "fsecond/prefer-destructured-optionals": 0,
    },
  },
]);
