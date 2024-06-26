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
    "remeda/prefer-remeda-typecheck": 2,
    "remeda/prefer-nullish-coalescing": 2,
    "remeda/prefer-filter": [2, 3],
    "remeda/collection-method-value": 2,
    "remeda/collection-return": 2,
    "remeda/prefer-map": 2,
    "remeda/prefer-find": 2,
    "remeda/prefer-some": 2,
    "remeda/prefer-flat-map": 2,
    "remeda/prefer-do-nothing": 2,
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
