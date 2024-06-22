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
    // "remeda/prefer-noop": 2, //TODO: needs adaptation from https://remedajs.com/migrate/lodash/#noop
    // "remeda/prefer-flat-map": 2, //FIXME: some tests are failing
    // "remeda/prefer-find": 2, //FIXME: some tests are failing

    // "remeda/prefer-map": 1,
    // "remeda/prefer-some": [1, { includeNative: true }],
    // "remeda/chain-style": [1, "as-needed"],
    // "remeda/chaining": 1,
    // "remeda/collection-method-value": 1,
    // "remeda/collection-return": 1,
    // "remeda/consistent-compose": [1, "flow"],
    // "remeda/matches-prop-shorthand": [1, "always"],
    // "remeda/matches-shorthand": [1, "always", 3],
    // "remeda/no-unbound-this": 1,
    // "remeda/prefer-get": [2, 3],
    // "remeda/prefer-includes": [1, { includeNative: true }],
    // "remeda/prefer-lodash-chain": 1,
    // "remeda/prefer-lodash-method": 1,
    // "remeda/prefer-wrapper-method": 1,
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
