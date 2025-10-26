import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/collection-return";
import { withDefaultPragma } from "../testUtil/optionsUtil";

await run({
  name: "collection-return",
  rule,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  valid: [
    "R.forEach(arr, function(a) { console.log(a)})",
    "R.map(arr, function(a) { return a*a})",
    "R.map(arr, a => a + 1)",
    "R.map(arr, function(a) {return a.some(function(x) {})})",
    "function x(a) {return a;}",
    "R.map(a, x => f(x).then(() => {g()}))",
    { code: "R.map(x, async t => {})", parserOptions: { ecmaVersion: 8 } },
    { code: "R.map(x, function*(t) {})", parserOptions: { ecmaVersion: 6 } },
  ].map(withDefaultPragma),
  invalid: [
    {
      code: "R.map(arr, function(a) {console.log(a)})",
      errors: [
        {
          message: "Do not use R.map without returning a value",
        },
      ],
    },
    {
      code: "R.every(arr, function(a){f(a)})",
      errors: [{ message: "Do not use R.every without returning a value" }],
    },
    {
      code: "R.map(arr, function(a){ a.every(function(b) {return b})})",
      errors: [{ message: "Do not use R.map without returning a value" }],
    },
    {
      code: "R.reduce(arr, a => {f(a)})",
      errors: [{ message: "Do not use R.reduce without returning a value" }],
      settings: { remeda: { pragma: "R" } },
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: "R.map(arr, function x(a) {arr2.push(a)})",
      errors: [{ message: "Do not use R.map without returning a value" }],
    },
  ].map(withDefaultPragma),
});
