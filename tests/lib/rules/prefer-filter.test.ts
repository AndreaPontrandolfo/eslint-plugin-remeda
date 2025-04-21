import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-filter";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-filter"]);

await run({
  name: "prefer-filter",
  rule,
  valid: [
    "var x = R.filter(arr, function(x) {return x + 7})",
    "R.forEach(arr, function(x) { if (x.a) {} else {}})",
    "R.forEach(arr, function(x) {if (y) {}})",
    "R.forEach(arr, function(x, y) { if (x){} })",
    "R.forEach(arr, f)",
  ].map(withDefaultPragma),
  invalid: [
    "R.forEach(arr, function(x) { if (x.a.b.c === d) {}})",
    "R.forEach(arr, function(x) { if (x.a.b.c !== d) {}})",
    "R.forEach(arr, function(x) { if (!x.a.b.c) {}})",
  ]
    .map(withDefaultPragma)
    // .concat([
    //   {
    //     code: 'import f from "lodash/forEach"; f(arr, (x) => { if (x) {}})',
    //     parserOptions: {
    //       sourceType: "module",
    //     },
    //   },
    // ])
    .map(toErrorObject),
});
