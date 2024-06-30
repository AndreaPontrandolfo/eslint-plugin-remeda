"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-flat-map");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
const toErrorObject = fromMessage(
  "Prefer _.flatMap over consecutive map and flatten.",
);
ruleTester.run("prefer-flat-map", rule, {
  valid: ["t = _.map(a, f);", "t = _.flat(a);", "t = _.flatMap(a, f);"].map(
    withDefaultPragma,
  ),
  invalid: [
    "t = _.flat(_.map(a, f));",
    // "t = R.pipe(arr, R.map(f), R.flat(1))", // TODO: make this pass
    // "t = pipe(arr, map(f), flat(1))", // TODO: make this pass
  ]
    .map(withDefaultPragma)
    .concat([
      {
        code: 'import f from "remeda/flat"; import m from "remeda/map"; f(m(x, g))',
        parserOptions: {
          sourceType: "module",
        },
      },
    ])
    .map(toErrorObject),
});
