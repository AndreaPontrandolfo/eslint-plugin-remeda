/**
 * @fileoverview Rule to check if a findIndex comparison should be a call to _.some
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const getDocsUrl = require("../util/getDocsUrl");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      url: getDocsUrl("prefer-some"),
    },
    schema: [],
  },

  create(context) {
    const { getExpressionComparedToInt } = require("../util/astUtil");
    const { getLodashMethodVisitors } = require("../util/lodashUtil");
    const { isAliasOfMethod } = require("../util/methodDataUtil");

    const visitors = getLodashMethodVisitors(
      context,
      (node, iteratee, { method }) => {
        if (
          isAliasOfMethod("findIndex", method) &&
          node === getExpressionComparedToInt(node.parent, -1, true)
        ) {
          context.report({
            node,
            message: "Prefer _.some over findIndex comparison to -1",
          });
        }
      },
    );

    return visitors;
  },
};
