import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-constant";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-constant"]);

await run({
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
