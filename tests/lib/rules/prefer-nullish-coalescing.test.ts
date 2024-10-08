import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-nullish-coalescing";
import { fromMessage,withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer nullish coalescing over checking a ternary with !isNullish.",
);

run({
  name: "prefer-nullish-coalescing",
  rule,
  valid: [
    "const myExpression = myVar ?? myOtherVar;",
    "const myExpression = !isNullish(myVar) ? mySecondVar : myThirdVar;",
    "const myExpression = myOtherVar ? myVar : !isNullish(myVar);",
    "const myExpression = myOtherVar ? !isNullish(myVar) : myVar;",
    "const myExpression = (myVar ?? myOtherVar) ? doThis() : doThat();",
    "const myExpression = (myVar?.thisProp ?? myOtherVar[thatProp]) ? doThis() : doThat();",
    "myVar ?? myOtherVar;",
  ].map(withDefaultPragma),
  invalid: [
    {
      code: "const myExpression = !isNullish(myVar) ? myVar : myOtherVar;",
      output: "const myExpression = myVar ?? myOtherVar;",
    },
    {
      code: "!isNullish(myVar) ? myVar : myOtherVar;",
      output: "myVar ?? myOtherVar;",
    },
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
