import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-is-nullish";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-is-nullish"]);

run({
  name: "prefer-is-nullish",
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
