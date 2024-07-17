"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/collection-method-value");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
ruleTester.run("collection-method-value", rule, {
  valid: [
    "x = R.map(arr, f)",
    "R.forEach(arr, g)",
    "if (R.some(arr, h)) {i()}",
  ].map(withDefaultPragma),
  invalid: ["x = R.forEach(arr, g)"]
    .map(withDefaultPragma)
    .map(fromMessage("Do not use value returned from R.forEach"))
    .concat(
      [
        "R.map(arr, f)",
        {
          code: 'import f from "remeda/map"; f(x, g)',
          parserOptions: {
            sourceType: "module",
          },
        },
      ]
        .map(withDefaultPragma)
        .map(fromMessage("Use value returned from R.map")),
    ),
});
