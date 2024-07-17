"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-do-nothing");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
const toErrorObject = fromMessage(
  "Prefer R.doNothing() or R.constant(undefined) over an empty function",
);

ruleTester.run("prefer-do-nothing", rule, {
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
