import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-some";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-some"]);

await run({
  name: "prefer-some",
  rule,
  parserOptions: {
    sourceType: "module",
  },
  valid: [
    "if(R.some(a, b)) {}",
    "x = R.findIndex(a, b) <= 0",
    "x = R.findIndex(a, b) > 0",
    "x = R.findIndex(a, b) >= 1",
    "if(R.findIndex(a, b) === 0) {}",
  ].map(withDefaultPragma),
  invalid: [
    ...[
      "x = R.findIndex(a, b) >= 0",
      "x = R.findIndex(a, b) === -1",
      "x = R.findIndex(a, b) !== -1",
      "x = -1 !== R.findIndex(a, b)",
      "x = R.findIndex(a, b) > -1",
      "x = R.findIndex(a, b) < 0",
      "x = 0 > R.findIndex(a, b)",
    ].map(withDefaultPragma),
    {
      code: 'import io from "remeda/findIndex"; x = io(a) !== -1',
    },
  ].map(toErrorObject),
});
