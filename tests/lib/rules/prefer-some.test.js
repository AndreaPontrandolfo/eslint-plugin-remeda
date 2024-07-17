import * as rule from "../../../src/rules/prefer-some";
import optionsUtil from "../testUtil/optionsUtil";
import { run } from "eslint-vitest-rule-tester";

const { fromMessage, withDefaultPragma } = optionsUtil;
const toErrorObject = fromMessage(
  "Prefer R.some over findIndex comparison to -1",
);
run({
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
      },
    ])
    .map(toErrorObject),
});
