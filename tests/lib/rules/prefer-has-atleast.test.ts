import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-has-atleast";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer R.hasAtLeast over array.length comparison",
);

const toEmptyErrorObject = fromMessage(
  "Prefer R.hasAtLeast(data, 1) over negated R.isEmpty for better type narrowing",
);

run({
  name: "prefer-has-atleast",
  rule,
  parserOptions: {
    sourceType: "module",
  },
  valid: [
    "R.hasAtLeast(arr, 3)",
    "R.hasAtLeast(arr, 1)",
    "arr.length === 3",
    "arr.length < 3",
    "arr.length <= 3",
    "arr.length !== 3",
    "arr.length == 3",
    "arr.length != 3",
    "3 > arr.length",
    "3 === arr.length",
    "otherValue >= 3",
    "R.isEmpty(arr)",
    "R.isEmpty(arr) === true",
    "R.isEmpty(arr) !== false",
  ].map(withDefaultPragma),
  invalid: [
    ...[
      // Array length comparisons
      "arr.length >= 3",
      "arr.length > 2",
      "3 <= arr.length",
      "2 < arr.length",
    ]
      .map(withDefaultPragma)
      .map(toErrorObject),
    // Negated isEmpty patterns
    {
      code: withDefaultPragma("!R.isEmpty(arr)"),
      errors: [{ messageId: "prefer-has-atleast-over-negated-isempty" }],
      output: withDefaultPragma("R.hasAtLeast(arr, 1)"),
    },
    {
      code: withDefaultPragma("R.isEmpty(arr) === false"),
      errors: [{ messageId: "prefer-has-atleast-over-negated-isempty" }],
      output: withDefaultPragma("R.hasAtLeast(arr, 1)"),
    },
    {
      code: withDefaultPragma("false === R.isEmpty(arr)"),
      errors: [{ messageId: "prefer-has-atleast-over-negated-isempty" }],
      output: withDefaultPragma("R.hasAtLeast(arr, 1)"),
    },
    {
      code: withDefaultPragma("R.isEmpty(arr) !== true"),
      errors: [{ messageId: "prefer-has-atleast-over-negated-isempty" }],
      output: withDefaultPragma("R.hasAtLeast(arr, 1)"),
    },
    {
      code: withDefaultPragma("true !== R.isEmpty(arr)"),
      errors: [{ messageId: "prefer-has-atleast-over-negated-isempty" }],
      output: withDefaultPragma("R.hasAtLeast(arr, 1)"),
    },
  ],
});
