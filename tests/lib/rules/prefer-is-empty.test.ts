import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-is-empty";
import { fromMessage,withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer isEmpty over manually checking for length value.",
);

run({
  name: "prefer-is-empty",
  rule,
  valid: [
    "const myLengthEqualZero = !isEmpty(myVar);",
    "const myLengthEqualZero = isEmpty(myVar);",
    "const myLengthEqualZero = myVar.length == 0;",
    "const myLengthEqualZero = myVar?.length == 0;",
    "const myLengthEqualZero = myVar.length;",
    "const myLengthEqualZero = myVar;",
  ].map(withDefaultPragma),
  invalid: [
    {
      code: "const myLengthEqualZero = myVar.length === 0;",
      output: "const myLengthEqualZero = isEmpty(myVar);",
    },
    {
      code: "const myLengthEqualZero = myVar.length > 0;",
      output: "const myLengthEqualZero = !isEmpty(myVar);",
    },
    {
      code: 'const myLengthEqualZero = myVar.length > 0 ? "first" : "second";',
      output: 'const myLengthEqualZero = !isEmpty(myVar) ? "first" : "second";',
    },
    {
      code: "const myLengthEqualZero = myVar.myProp.mySecondProp.length === 0;",
      output: "const myLengthEqualZero = isEmpty(myVar.myProp.mySecondProp);",
    },
    {
      code: "const myLengthEqualZero = myVar.myProp.mySecondProp.length > 0;",
      output: "const myLengthEqualZero = !isEmpty(myVar.myProp.mySecondProp);",
    },
    {
      code: "const myLengthEqualZero = myVar?.myProp.mySecondProp.length > 0;",
      output: "const myLengthEqualZero = !isEmpty(myVar?.myProp.mySecondProp);",
    },
    {
      code: "const myLengthEqualZero = myVar[myProp].mySecondProp.length > 0;",
      output: "const myLengthEqualZero = !isEmpty(myVar[myProp].mySecondProp);",
    },
    {
      code: `
        const xprop = "x"
        const yprop = "y"
        const myLengthWithOCWithProp = myvar[xprop].mySecondprop.myThirdProp[yprop].length > 0;
        `,
      output: `
        const xprop = "x"
        const yprop = "y"
        const myLengthWithOCWithProp = !isEmpty(myvar[xprop].mySecondprop.myThirdProp[yprop]);
        `,
    },
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
