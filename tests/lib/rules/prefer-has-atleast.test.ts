import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-has-atleast";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer R.hasAtLeast over array.length comparison",
);

run({
  name: "prefer-has-atleast",
  rule,
  parserOptions: {
    sourceType: "module",
  },
  valid: [
    "R.hasAtLeast(arr, 3)",
    "arr.length === 3",
    "arr.length < 3",
    "arr.length <= 3",
    "arr.length !== 3",
    "arr.length == 3",
    "arr.length != 3",
    "3 > arr.length",
    "3 === arr.length",
    "otherValue >= 3",
  ].map(withDefaultPragma),
  invalid: [
    "arr.length >= 3",
    "arr.length > 2",
    "3 <= arr.length",
    "2 < arr.length",
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
