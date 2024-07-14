/**
 * @fileoverview Rule to check if a call to map and flatten should be a call to R.flatMap
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
      getRemedaMethodVisitors,
      isCallToMethod,
      isCallToRemedaMethod,
    } = require("../util/remedaUtil");
    const { getCaller } = require("../util/astUtil");

    function isChainedMapFlatten(callType, node) {
      return callType === "chained" && isCallToMethod(getCaller(node), "map");
    }

    return getRemedaMethodVisitors(
      context,
      (node, iteratee, { method, callType, remedaContext }) => {
        if (
          method === "flat" &&
          (isChainedMapFlatten(callType, node) ||
            isCallToRemedaMethod(node.arguments[0], "map", remedaContext))
        ) {
          context.report({
            node,
            message: "Prefer R.flatMap over consecutive R.map and R.flat.",
          });
        }
      },
    );
  },
};
