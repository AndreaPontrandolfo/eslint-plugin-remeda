import sheriff from "eslint-config-sheriff";
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
  eslintPlugin.configs["flat/recommended"],
  {
    rules: {
      "eslint-plugin/require-meta-docs-url": 2,
      "eslint-plugin/require-meta-docs-description": 2,
      "eslint-plugin/meta-property-ordering": 2,
      "eslint-plugin/no-property-in-node": 2,
      "eslint-plugin/prefer-placeholders": 2,
      "eslint-plugin/prefer-replace-text": 2,
      "eslint-plugin/report-message-format": 2,
      "eslint-plugin/require-meta-default-options": 2,
      "eslint-plugin/require-meta-schema-description": 2,
      "eslint-plugin/consistent-output": 2,
      "eslint-plugin/test-case-property-ordering": 2,
      "@typescript-eslint/no-this-alias": 0,
      "import/no-anonymous-default-export": 0,
      "no-restricted-syntax": 0,
      "func-style": 0,
      "sonarjs/no-duplicate-string": 0,
      "import/no-default-export": 0,
      "lodash-f/matches-shorthand": 0,
      "lodash-f/matches-prop-shorthand": 0,
      "vitest/require-hook": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/naming-convention": 0,
      "fsecond/prefer-destructured-optionals": 0,
    },
  },
];
