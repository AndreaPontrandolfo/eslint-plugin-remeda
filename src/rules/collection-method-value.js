/**
 * @fileoverview Rule to enforce usage of collection method values
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
      url: getDocsUrl("collection-method-value"),
    },
  },

  create(context) {
    const {
      isChainBreaker,
      getRemedaMethodVisitors,
      isCallToMethod,
    } = require("../util/remedaUtil");
    const { getMethodName } = require("../util/astUtil");
    const {
      isCollectionMethod,
      getSideEffectIterationMethods,
    } = require("../util/methodDataUtil");
    const includes = require("lodash/includes");

    function parentUsesValue(node, callType) {
      const isBeforeChainBreaker =
        callType === "chained" && isChainBreaker(node.parent.parent);
      return (
        (isBeforeChainBreaker ? node.parent.parent : node).parent.type !==
        "ExpressionStatement"
      );
    }

    function isSideEffectIterationMethod(method) {
      return includes(getSideEffectIterationMethods(), method);
    }

    function isParentCommit(node, callType) {
      return (
        callType === "chained" && isCallToMethod(node.parent.parent, "commit")
      );
    }

    return getRemedaMethodVisitors(
      context,
      (node, iteratee, { method, callType }) => {
        if (isCollectionMethod(method) && !parentUsesValue(node, callType)) {
          context.report({
            node,
            message: `Use value returned from R.${method}`,
          });
        } else if (
          isSideEffectIterationMethod(method) &&
          parentUsesValue(node, callType) &&
          !isParentCommit(node, callType)
        ) {
          context.report({
            node,
            message: `Do not use value returned from R.${getMethodName(node)}`,
          });
        }
      },
    );
  },
};
