"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-filter");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
const toErrorObject = fromMessage(
  "Prefer R.filter or R.some over an if statement inside a R.forEach",
);

ruleTester.run("prefer-filter", rule, {
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
