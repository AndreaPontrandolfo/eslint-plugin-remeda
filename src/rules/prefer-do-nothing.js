/**
 * @fileoverview Rule to prefer R.doNothing() or R.constant(undefined) over an empty function
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
      url: getDocsUrl("prefer-do-nothing"),
    },
  },

  create(context) {
    const { getFirstFunctionLine } = require("../util/astUtil");

    function reportIfEmptyFunction(node) {
      if (
        !getFirstFunctionLine(node) &&
        node.parent.type !== "MethodDefinition" &&
        !node.generator &&
        !node.async
      ) {
        context.report({
          node,
          message:
            "Prefer R.doNothing() or R.constant(undefined) over an empty function",
        });
      }
    }

    return {
      FunctionExpression: reportIfEmptyFunction,
      ArrowFunctionExpression: reportIfEmptyFunction,
    };
  },
};
