/**
 * @fileoverview Rule to check if a call to `R.filter` should be a call to `R.find`.
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
      url: getDocsUrl("prefer-find"),
    },
  },

  create(context) {
    const {
      getRemedaMethodVisitors,
      isCallToMethod,
      isCallToLodashMethod,
    } = require("../util/lodashUtil");
    const { isAliasOfMethod } = require("../util/methodDataUtil");

    function isZeroIndexAccess(node) {
      return node.type === "MemberExpression" && node.property.value === 0;
    }

    function isChainedBeforeMethod(callType, node, method) {
      return (
        callType === "chained" && isCallToMethod(node.parent.parent, method)
      );
    }

    return getRemedaMethodVisitors(
      context,
      (node, iteratee, { method, callType, lodashContext }) => {
        if (isAliasOfMethod("filter", method)) {
          if (
            isZeroIndexAccess(node.parent) ||
            isCallToLodashMethod(node.parent, "first", lodashContext) ||
            isChainedBeforeMethod(callType, node, "first")
          ) {
            context.report({
              node,
              message:
                "Prefer using `R.find` over selecting the first item of a filtered result",
            });
          }
          if (
            isCallToLodashMethod(node.parent, "last", lodashContext) ||
            isChainedBeforeMethod(callType, node, "last")
          ) {
            context.report({
              node,
              message:
                "Prefer using `R.findLast` over selecting the last item of a filtered result",
            });
          }
        }
      },
    );
  },
};
