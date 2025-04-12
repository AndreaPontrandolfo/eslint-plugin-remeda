import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-map";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-map"]);

await run({
  name: "prefer-map",
  rule,
  valid: [
    "var x = R.map(arr, function(x) {return x + 7})",
    "R.forEach(arr, function(x) { if (x.a) {a.push(x)}})",
    "R.forEach(arr, function (x){ a.push(x); if (f(x)) {a.push(b)}});",
    "R.forEach(xs, (x, i) => {x.push(y[i])})",
    "R.forEach(xs, ({x}) => {x.push(1)})",
  ].map(withDefaultPragma),
  invalid: [
    "R.forEach(arr, function(x) { a.push(x)})",
    "R.forEach(arr, function(x) { a.push(f(x))})",
    "R.forEach(arr, x => a.push(f(x)))",
    // "forEach(arr, function(x) { a.push(x)})",
    // "forEach(arr, function(x) { a.push(f(x))})",
    // "forEach(arr, x => a.push(f(x)))",
    // "forEach(arr, x => a.push(x))",
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
