import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-remeda-typecheck";
import { withDefaultPragma } from "../testUtil/optionsUtil";

const errors = {
  //   undefined: [{ message: "Prefer 'R.isUndefined' over 'typeof' comparison." }],
  typeof: [{ message: "Prefer 'R.isNumber' over 'typeof' comparison." }],
  instanceof: [{ message: "Prefer 'R.isArray' over 'instanceof Array'." }],
};

await run({
  name: "prefer-remeda-typecheck",
  rule,
  valid: [
    "var x = a instanceof B",
    "var x = a > b ? a : b",
    "var x = typeof a === typeof b",
    'var x = typeof y === "undefined"',
  ].map(withDefaultPragma),
  invalid: [
    {
      code: 'var x = typeof a === "number"',
      errors: errors.typeof,
    },
    {
      code: 'var x = "number" !== typeof a',
      errors: errors.typeof,
    },
    {
      code: "var x = a instanceof Array",
      errors: errors.instanceof,
    },
    // {
    //   code: 'var x = typeof a.b === "undefined"',
    //   errors: errors.undefined,
    // },
    // {
    //   code: 'var y; var x = typeof y === "undefined"',
    //   errors: errors.undefined,
    // },
  ].map(withDefaultPragma),
});
