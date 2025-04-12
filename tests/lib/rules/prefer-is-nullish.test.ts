import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-is-nullish";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-is-nullish"]);

await run({
  name: "prefer-is-nullish",
  rule,
  valid: [
    "if (x === undefined) {}",
    "if (x === null) {}",
    "var t = _.isNullish(x)",
    "if (_.isNullish(x)) {}",
    "const result = _.isNullish(someValue)",
    "function test() { return _.isNullish(input); }",
    "while (!_.isNullish(value)) {}",
    "const isNullish = _.isNullish",
    "const check = isNullish => _.isNullish(isNullish)",
  ].map(withDefaultPragma),
  invalid: [
    "var t = x === undefined || x === null",
    "var t = undefined === x || x === null",
    'var t = typeof x !== "undefined" && null !== x',
    "if (x === null || x === undefined) {}",
    "const isValid = value !== null && value !== undefined",
    "function test() { return x === undefined || x === null; }",
    "while (x !== null && x !== undefined) {}",
    "const check = x => x === null || x === undefined",
    "const isNullish = x => x === null || x === undefined",
    "const result = input === null || input === undefined ? defaultValue : input",
    "if (x !== null && x !== undefined) {}",
    "if (typeof x !== 'undefined' && x !== null) {}",
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
