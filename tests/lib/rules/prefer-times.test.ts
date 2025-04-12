import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-times";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-times"]);

run({
  name: "prefer-times",
  rule,
  valid: [
    "var a = R.map(arr, function(x) {return x + 1});",
    "R.forEach(arr, function() {f(g(r)); })",
    "var results = R.times(arr.length, function() {return Math.random();})",
    'var x = R.map(a, "prop");',
    "var x = R.map(arr, function(a) {return R.map(a, function(b) {return b + 1});});",
    "var x = arr.map(function () {return str; }).join('')",
    "var x = R.map(a, ({x}) => x);",
    "var x = R.map(a, ({f: x}) => x);",
    "var x = R.map(a, ({f: {x}}) => x);",
    "R.map(a, x => R.map(b, y => x.f(y)))",
    "R.map(arr, function(a, c = 1) {return b})",
  ].map(withDefaultPragma),
  invalid: ["R.map(arr, function() {return Math.random()});"]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
