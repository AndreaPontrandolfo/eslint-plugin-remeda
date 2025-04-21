import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-do-nothing";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(rule.meta.messages["prefer-do-nothing"]);

await run({
  name: "prefer-do-nothing",
  rule,
  valid: [
    { code: "x = function() { return 2}" },
    { code: "x = function(x) {return x}" },
    { code: "x = a => a.b" },
    { code: "class A { m() {}}" },
    { code: "var x = function * () {}" },
    { code: "var x = async function () {}", parserOptions: { ecmaVersion: 8 } },
  ].map(withDefaultPragma),
  invalid: [
    { code: "functionWithCb(function() {})" },
    { code: "x = function(){/* */}" },
    { code: "CallCb(()=> {})" },
  ]
    .map(toErrorObject)
    .map(withDefaultPragma),
});
