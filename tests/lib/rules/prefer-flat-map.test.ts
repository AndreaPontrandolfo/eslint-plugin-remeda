import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-flat-map";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer R.flatMap over consecutive R.map and R.flat.",
);

run({
  name: "prefer-flat-map",
  rule,
  valid: ["t = R.map(a, f);", "t = R.flat(a);", "t = R.flatMap(a, f);"].map(
    withDefaultPragma,
  ),
  invalid: [
    "t = R.flat(R.map(a, f));",
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
