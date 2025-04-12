import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-has-atleast";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-has-atleast"]);
const toEmptyErrorObject = fromMessage(
  rule.meta.messages["prefer-has-atleast-over-negated-isempty"],
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
    ...[
      // Negated isEmpty patterns
      "!R.isEmpty(arr)",
      "R.isEmpty(arr) === false",
      "false === R.isEmpty(arr)",
      "R.isEmpty(arr) !== true",
      "true !== R.isEmpty(arr)",
    ]
      .map(withDefaultPragma)
      .map(toEmptyErrorObject),
  ],
});
