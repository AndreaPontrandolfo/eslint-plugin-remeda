import { run } from "eslint-vitest-rule-tester";
import * as rule from "../../../src/rules/collection-method-value";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

run({
  name: "collection-method-value",
  rule,
  valid: [
    "x = R.map(arr, f)",
    "R.forEach(arr, g)",
    "if (R.some(arr, h)) {i()}",
  ].map(withDefaultPragma),
  invalid: ["x = R.forEach(arr, g)"]
    .map(withDefaultPragma)
    .map(fromMessage("Do not use value returned from R.forEach"))
    .concat(
      [
        "R.map(arr, f)",
        {
          code: 'import f from "remeda/map"; f(x, g)',
          parserOptions: {
            sourceType: "module",
          },
        },
      ]
        .map(withDefaultPragma)
        .map(fromMessage("Use value returned from R.map")),
    ),
});
