"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-some");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
const toErrorObject = fromMessage(
  "Prefer R.some over findIndex comparison to -1",
);
ruleTester.run("prefer-some", rule, {
  valid: [
    "if(R.some(a, b)) {}",
    "x = R.findIndex(a, b) <= 0",
    "x = R.findIndex(a, b) > 0",
    "x = R.findIndex(a, b) >= 1",
    "if(R.findIndex(a, b) === 0) {}",
  ].map(withDefaultPragma),
  invalid: [
    "x = R.findIndex(a, b) >= 0",
    "x = R.findIndex(a, b) === -1",
    "x = R.findIndex(a, b) !== -1",
    "x = -1 !== R.findIndex(a, b)",
    "x = R.findIndex(a, b) > -1",
    "x = R.findIndex(a, b) < 0",
    "x = 0 > R.findIndex(a, b)",
  ]
    .map(withDefaultPragma)
    .concat([
      {
        code: 'import io from "remeda/findIndex"; x = io(a) !== -1',
        parserOptions: {
          sourceType: "module",
        },
      },
    ])
    .map(toErrorObject),
});
