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
  valid: ["t = _.map(a, f);", "t = _.flatMap(a, f);"].map(withDefaultPragma),
  invalid: ["_(a).map(f).flat().value", "t = _.flat(_.map(a, f));"]
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
