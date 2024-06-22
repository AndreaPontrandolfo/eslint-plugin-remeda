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
    // "remeda/prefer-flat-map": 2, // some tests are failing
    // "remeda/prefer-find": 2, // some tests are failing

    // "remeda/prefer-map": 1,
    // "remeda/prefer-filter": [2, 3],
    // "remeda/prefer-startswith": 1,
    // "remeda/prefer-nullish-coalescing": 1,
    // "remeda/prefer-some": [1, { includeNative: true }],
    // "remeda/prefer-noop": 1,
    // "remeda/chain-style": [1, "as-needed"],
    // "remeda/chaining": 1,
    // "remeda/collection-method-value": 1,
    // "remeda/collection-ordering": 1,
    // "remeda/collection-return": 1,
    // "remeda/consistent-compose": [1, "flow"],
    // "remeda/identity-shorthand": [1, "always"],
    // "remeda/matches-prop-shorthand": [1, "always"],
    // "remeda/matches-shorthand": [1, "always", 3],
    // "remeda/no-commit": 1,
    // "remeda/no-double-unwrap": 1,
    // "remeda/no-unbound-this": 1,
    // "remeda/path-style": [1, "string"],
    // "remeda/prefer-get": [2, 3],
    // "remeda/prefer-immutable-method": 1,
    // "remeda/prefer-includes": [1, { includeNative: true }],
    // "remeda/prefer-invoke-map": 1,
    // "remeda/prefer-lodash-chain": 1,
    // "remeda/prefer-lodash-method": 1,
    // "remeda/prefer-matches": [2, 3],
    // "remeda/prefer-over-quantifier": 1,
    // "remeda/prefer-thru": 1,
    // "remeda/prefer-wrapper-method": 1,
    // "remeda/prop-shorthand": [1, "always"],
    // "remeda/unwrap": 1,
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
