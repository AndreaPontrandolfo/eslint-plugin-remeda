import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-map";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer R.map over a R.forEach with a push to an array inside",
);

run({
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
  ]
    .map(withDefaultPragma)
    // .concat([
    //   {
    //     code: 'import fe from "remeda/forEach"; fe(arr, x => {a.push(x)})',
    //     parserOptions: {
    //       sourceType: "module",
    //     },
    //   },
    // ])
    .map(toErrorObject),
});
