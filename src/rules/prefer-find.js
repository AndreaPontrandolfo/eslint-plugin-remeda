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
      isCallToRemedaMethod,
    } = require("../util/remedaUtil");

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
      (node, iteratee, { method, callType, remedaContext }) => {
        if (method === "filter") {
          if (
            isZeroIndexAccess(node.parent) ||
            isCallToRemedaMethod(node.parent, "first", remedaContext) ||
            isChainedBeforeMethod(callType, node, "first")
          ) {
            context.report({
              node,
              message:
                "Prefer using `R.find` over selecting the first item of a filtered result",
            });
          }
          if (
            isCallToRemedaMethod(node.parent, "last", remedaContext) ||
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
