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
      getLodashMethodVisitors,
      isCallToMethod,
    } = require("../util/lodashUtil");
    const { getMethodName } = require("../util/astUtil");
    const {
      isCollectionMethod,
      isAliasOfMethod,
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

    function isPureLodashCollectionMethod(method) {
      return isCollectionMethod(method) && !isAliasOfMethod("remove", method);
    }

    function isSideEffectIterationMethod(method) {
      return includes(getSideEffectIterationMethods(), method);
    }

    function isParentCommit(node, callType) {
      return (
        callType === "chained" && isCallToMethod(node.parent.parent, "commit")
      );
    }

    return getLodashMethodVisitors(
      context,
      (node, iteratee, { method, callType }) => {
        if (
          isPureLodashCollectionMethod(method) &&
          !parentUsesValue(node, callType)
        ) {
          context.report({
            node,
            message: `Use value returned from _.${method}`,
          });
        } else if (
          isSideEffectIterationMethod(method) &&
          parentUsesValue(node, callType) &&
          !isParentCommit(node, callType)
        ) {
          context.report({
            node,
            message: `Do not use value returned from _.${getMethodName(node)}`,
          });
        }
      },
    );
  },
};
