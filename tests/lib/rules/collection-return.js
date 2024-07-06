"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/collection-return");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { withDefaultPragma } = require("../testUtil/optionsUtil");
ruleTester.run("collection-return", rule, {
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
      errors: [{ message: "Do not use R.map without returning a value" }],
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
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: "R.map(arr, function x(a) {arr2.push(a)})",
      errors: [{ message: "Do not use R.map without returning a value" }],
    },
  ].map(withDefaultPragma),
  // .concat([
  //   {
  //     code: 'import m from "remeda/map"; m(arr, x => {})',
  //     errors: [{ message: "Do not use _.map without returning a value" }],
  //     parserOptions: {
  //       sourceType: "module",
  //     },
  //   },
  // ]),
});
