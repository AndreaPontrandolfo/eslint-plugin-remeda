import * as rule from "../../../src/rules/prefer-constant";
import { withDefaultPragma, fromMessage } from "../testUtil/optionsUtil";
import { run } from "eslint-vitest-rule-tester";

const toErrorObject = fromMessage(
  "Prefer R.constant over a function returning a literal",
);

run({
  name: "prefer-constant",
  rule,
  valid: [
    "var x = function() { return f();}",
    "var x = function() {return [y]}",
    "var x = function() {return {a: y}}",
    "var x = function() {return y ? 1 : 2}",
    "var x = function() {return true ? 1 : x}",
    "var x = function() { return {[y]: 1}}",
    { code: "var x = () => 1", options: [false] },
    "function one() { return 1; }",
  ].map(withDefaultPragma),
  invalid: [
    "var x = function() { return 1; }",
    "var x = function() { return 1 + 1; }",
    "var x = function() { return typeof 1; }",
    {
      code: "var x = () => 1",
      options: [true],
    },
    {
      code: "function one() { return 1; }",
      options: [true, true],
    },
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
