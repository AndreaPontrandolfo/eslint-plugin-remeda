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
  "Prefer _.some over findIndex comparison to -1",
);
ruleTester.run("prefer-some", rule, {
  valid: [
    "if(_.some(a, b)) {}",
    "x = _.findIndex(a, b) <= 0",
    "x = _.findIndex(a, b) > 0",
    "x = _.findIndex(a, b) >= 1",
    "if(_.findIndex(a, b) === 0) {}",
  ].map(withDefaultPragma),
  invalid: [
    "x = _.findIndex(a, b) >= 0",
    "x = _.findIndex(a, b) === -1",
    "x = _.findIndex(a, b) !== -1",
    "x = -1 !== _.findIndex(a, b)",
    "x = _.findIndex(a, b) > -1",
    "x = _.findIndex(a, b) < 0",
    "x = 0 > _.findIndex(a, b)",
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
