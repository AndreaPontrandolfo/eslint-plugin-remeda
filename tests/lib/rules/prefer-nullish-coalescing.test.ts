import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-nullish-coalescing";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  rule.meta.messages["prefer-nullish-coalescing"],
);

await run({
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
    "const myExpression = isNullish(myVar) ? myOtherVar : myVar;",
    "const myExpression = !isNullish(myVar) ? myVar : myVar;",
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
    {
      code: "const myExpression = !isNullish(myVar.prop) ? myVar.prop : myOtherVar;",
      output: "const myExpression = myVar.prop ?? myOtherVar;",
    },
    {
      code: "const myExpression = !isNullish(myVar[0]) ? myVar[0] : myOtherVar;",
      output: "const myExpression = myVar[0] ?? myOtherVar;",
    },
    {
      code: "const myExpression = !isNullish(myVar?.prop) ? myVar?.prop : myOtherVar;",
      output: "const myExpression = myVar?.prop ?? myOtherVar;",
    },
    {
      code: "const myExpression = !isNullish(myVar()) ? myVar() : myOtherVar;",
      output: "const myExpression = myVar() ?? myOtherVar;",
    },
  ]
    .map(withDefaultPragma)
    .map(toErrorObject),
});
