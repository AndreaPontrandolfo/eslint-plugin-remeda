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
      "func-style": 0,
      "import/no-default-export": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
    },
  },
]);
