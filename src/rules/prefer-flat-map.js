/**
 * @fileoverview Rule to check if a call to map and flatten should be a call to _.flatMap
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
      url: getDocsUrl("prefer-flat-map"),
    },
  },

  create(context) {
    const {
      getLodashMethodVisitors,
      isCallToMethod,
      isCallToLodashMethod,
    } = require("../util/lodashUtil");
    const { getCaller } = require("../util/astUtil");
    const { isAliasOfMethod } = require("../util/methodDataUtil");

    function isChainedMapFlatten(callType, node) {
      return callType === "chained" && isCallToMethod(getCaller(node), "map");
    }

    return getLodashMethodVisitors(
      context,
      (node, iteratee, { method, callType, lodashContext }) => {
        if (
          isAliasOfMethod("flatten", method) &&
          (isChainedMapFlatten(callType, node) ||
            isCallToLodashMethod(node.arguments[0], "map", lodashContext))
        ) {
          context.report({
            node,
            message: "Prefer _.flatMap over consecutive map and flatten.",
          });
        }
      },
    );
  },
};
