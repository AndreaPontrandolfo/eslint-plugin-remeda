"use strict";
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const rules = fs
  .readdirSync(path.resolve(__dirname, "rules"))
  .map((f) => f.replace(/\.js$/, ""));
const recommended = {
  plugins: ["remeda"],
  rules: {
    "remeda/prefer-is-empty": 2,
    "remeda/prefer-is-nil": 2,
    "remeda/prefer-times": 2,
    "remeda/prefer-constant": 2,
    "remeda/prefer-lodash-typecheck": 2,
    "remeda/prefer-nullish-coalescing": 2,
    "remeda/prefer-filter": [2, 3],
    "remeda/collection-method-value": 2,
    "remeda/collection-return": 2,
    "remeda/prefer-map": 2,
    "remeda/prefer-find": 2,
    "remeda/prefer-some": 2,
    // "remeda/prefer-flat-map": 2, //FIXME: some tests are failing
    // "remeda/prefer-includes": [1, { includeNative: true }],
    // "remeda/prefer-noop": 2, //TODO: needs adaptation from https://remedajs.com/migrate/lodash/#noop

    // "remeda/prefer-get": [2, 3],
    // "remeda/prefer-lodash-method": 1,
  },
};
module.exports = {
  rules: _.zipObject(
    rules,
    rules.map((rule) => require(`./rules/${rule}`)),
  ),
  configs: {
    recommended,
  },
};
