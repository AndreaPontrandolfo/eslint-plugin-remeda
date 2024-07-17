"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-nullish-coalescing");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { withDefaultPragma, fromMessage } = require("../testUtil/optionsUtil");
const toErrorObject = fromMessage(
  "Prefer nullish coalescing over checking a ternary with !isNullish.",
);
ruleTester.run("prefer-nullish-coalescing", rule, {
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
