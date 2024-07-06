/**
 * @fileoverview Rule to check if a call to map should be a call to times
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const getDocsUrl = require("../util/getDocsUrl");

module.exports = {
  meta: {
    type: "problem",
    schema: [],
    docs: {
      url: getDocsUrl("prefer-times"),
    },
  },

  create(context) {
    const { getRemedaMethodVisitors } = require("../util/lodashUtil");
    const { isAliasOfMethod } = require("../util/methodDataUtil");
    const get = require("lodash/get");
    return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
      if (
        isAliasOfMethod("map", method) &&
        get(iteratee, "params.length") === 0
      ) {
        context.report({
          node,
          message: "Prefer R.times over R.map without using arguments",
        });
      }
    });
  },
};
