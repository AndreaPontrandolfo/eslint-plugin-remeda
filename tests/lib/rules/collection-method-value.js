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
    "x = _.map(arr, f)",
    "_.forEach(arr, g)",
    "if (_.some(arr, h)) {i()}",
  ].map(withDefaultPragma),
  invalid: ["x = _.forEach(arr, g)"]
    .map(withDefaultPragma)
    .map(fromMessage("Do not use value returned from _.forEach"))
    .concat(
      [
        "_.map(arr, f)",
        {
          code: 'import f from "remeda/map"; f(x, g)',
          parserOptions: {
            sourceType: "module",
          },
        },
      ]
        .map(withDefaultPragma)
        .map(fromMessage("Use value returned from _.map")),
    ),
});
