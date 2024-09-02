import { run } from "eslint-vitest-rule-tester";
import rule from "../../../src/rules/prefer-do-nothing";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toErrorObject = fromMessage(
  "Prefer R.doNothing() or R.constant(undefined) over an empty function",
);

run({
  name: "prefer-do-nothing",
  rule,
  valid: [
    "x = function() { return 2}",
    "x = function(x) {return x}",
    "x = a => a.b",
    "class A { m() {}}",
    "var x = function * () {}",
    { code: "var x = async function () {}", parserOptions: { ecmaVersion: 8 } },
  ].map(withDefaultPragma),
  invalid: [
    "functionWithCb(function() {})",
    "x = function(){/* */}",
    "CallCb(()=> {})",
  ]
    .map(toErrorObject)
    .map(withDefaultPragma),
});
