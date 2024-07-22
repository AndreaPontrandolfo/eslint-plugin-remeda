import { run } from "eslint-vitest-rule-tester";
import * as rule from "../../../src/rules/prefer-is-nil";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer isNil over checking for undefined or null.",
);
run({
  name: "prefer-is-nil",
  rule,
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
