"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-is-nil");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
const toErrorObject = fromMessage(
  "Prefer isNil over checking for undefined or null.",
);
ruleTester.run("prefer-is-nil", rule, {
  valid: [
    "if (x === undefined) {}",
    "if (x === null) {}",
    "var t = _.isNullish(x)",
  ].map(withDefaultPragma),
  // .concat([
  //   'const get = require("lodash/get"); module.exports = "foo" || "bar"',
  // ]),
  invalid: [
    "var t = x === undefined || x === null",
    "var t = undefined === x || x === null",
    'var t = typeof x !== "undefined" && null !== x',
  ]
    .map(withDefaultPragma)
    // .concat([
    //   {
    //     code: 'import iu from "lodash/isUndefined"; import inu from "lodash/isNull"; var t = iu(x) || inu(x)',
    //     parserOptions: {
    //       sourceType: "module",
    //     },
    //   },
    // ])
    .map(toErrorObject),
});
