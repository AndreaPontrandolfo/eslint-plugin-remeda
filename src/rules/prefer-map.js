/**
 * @fileoverview Rule to check if a call to R.forEach should be a call to R.map
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
      url: getDocsUrl("prefer-map"),
    },
  },

  create(context) {
    const { getRemedaMethodVisitors } = require("../util/remedaUtil");
    const {
      getFirstFunctionLine,
      hasOnlyOneStatement,
      getMethodName,
      isFunctionDefinitionWithBlock,
      collectParameterValues,
    } = require("../util/astUtil");
    const { isAliasOfMethod } = require("../util/methodDataUtil");
    const get = require("lodash/get");
    const includes = require("lodash/includes");

    function onlyHasPush(func) {
      const firstLine = getFirstFunctionLine(func);
      const firstParam = get(func, "params[0]");
      const exp =
        func && !isFunctionDefinitionWithBlock(func)
          ? firstLine
          : firstLine && firstLine.expression;
      return (
        func &&
        hasOnlyOneStatement(func) &&
        getMethodName(exp) === "push" &&
        !includes(
          collectParameterValues(firstParam),
          get(exp, "callee.object.name"),
        )
      );
    }

    return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
      if (isAliasOfMethod("forEach", method) && onlyHasPush(iteratee)) {
        context.report({
          node,
          message:
            "Prefer R.map over a R.forEach with a push to an array inside",
        });
      }
    });
  },
};
