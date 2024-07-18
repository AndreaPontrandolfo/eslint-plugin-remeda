import { run } from "eslint-vitest-rule-tester";
import * as rule from "../../../src/rules/prefer-find";
import { fromMessage, withDefaultPragma } from "../testUtil/optionsUtil";

const toFindError = fromMessage(
  "Prefer using `R.find` over selecting the first item of a filtered result",
);
const toFindLastError = fromMessage(
  "Prefer using `R.findLast` over selecting the last item of a filtered result",
);

run({
  name: "prefer-find",
  rule,
  valid: [
    "t = R.filter(arr, f)",
    "t = R.find(arr, f)",
    "t = R.first(arr)",
    "t = R.filter(arr, f)[2]",
  ].map(withDefaultPragma),
  invalid: [
    "t = R.filter(arr, f)[0]",
    // "t = R.filter(arr, f).first()", // TODO: make this pass
    // "t = R.first(R.filter(arr, f))", // TODO: make this pass
    // "t = R.first(R.filter(arr, f))", // TODO: make this pass
    // "t = R.pipe(arr, R.filter(f), first())", // TODO: make this pass
  ]
    .map(toFindError)
    .map(withDefaultPragma),

  // snippet taken from https://github.com/wix-incubator/eslint-plugin-lodash/blob/master/tests/lib/rules/prefer-find.js
  /*
  invalid: [
    ...[
      ...[
        "t = R.filter(arr, f)[0]",
        "t = R.first(R.filter(arr, f))",
        "t = R.first(R.filter(arr, f))",
        "t = R.filter(arr, f).first()",
      ].map(toFindError),
      // ...["t = R.last(R.filter(arr, f))", "t = R.filter(arr, f).last()"].map(
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
