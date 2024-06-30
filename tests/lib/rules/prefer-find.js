"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require("../../../src/rules/prefer-find");
const ruleTesterUtil = require("../testUtil/ruleTesterUtil");

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester();
const { fromMessage, withDefaultPragma } = require("../testUtil/optionsUtil");
const toFindError = fromMessage(
  "Prefer using `_.find` over selecting the first item of a filtered result",
);
const toFindLastError = fromMessage(
  "Prefer using `_.findLast` over selecting the last item of a filtered result",
);

ruleTester.run("prefer-find", rule, {
  valid: [
    "t = _.filter(arr, f)",
    "t = _.find(arr, f)",
    "t = _.first(arr)",
    "t = _.filter(arr, f)[2]",
  ].map(withDefaultPragma),
  invalid: [
    "t = _.filter(arr, f)[0]",
    // "t = _.filter(arr, f).first()", // TODO: make this pass
    // "t = _.first(_.filter(arr, f))", // TODO: make this pass
    // "t = _.first(_.filter(arr, f))", // TODO: make this pass
    // "t = _.pipe(arr, _.filter(f), first())", // TODO: make this pass
  ]
    .map(toFindError)
    .map(withDefaultPragma),

  // snippet taken from https://github.com/wix-incubator/eslint-plugin-lodash/blob/master/tests/lib/rules/prefer-find.js
  /*
  invalid: [
    ...[
      ...[
        "t = _.filter(arr, f)[0]",
        "t = _.first(_.filter(arr, f))",
        "t = _.first(_.filter(arr, f))",
        "t = _.filter(arr, f).first()",
      ].map(toFindError),
      // ...["t = _.last(_.filter(arr, f))", "t = _.filter(arr, f).last()"].map(
      //   toFindLastError,
      // ),
    ].map(withDefaultPragma),
    toFindError({
      code: 'import first from "remeda/first"; import filter from "remeda/filter"; const x = first(filter(x, f))',
      parserOptions: {
        sourceType: "module",
      },
    }),
  ],
  */
});
