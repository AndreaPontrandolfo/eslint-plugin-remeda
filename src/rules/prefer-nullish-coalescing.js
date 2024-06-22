/**
 * @fileoverview Rule to prefer nullish coalescing over checking a ternary with !isNullish.
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
      url: getDocsUrl("prefer-nullish-coalescing"),
    },
    fixable: "code",
  },

  create(context) {
    const { getLodashContext } = require("../util/lodashUtil");
    const lodashContext = getLodashContext(context);

    function getTextOfNode(node) {
      if (node) {
        if (node.type === "Identifier") {
          return node.name;
        }
        return context.getSourceCode().getText(node);
      }
    }

    const visitors = lodashContext.getImportVisitors();
    visitors.ConditionalExpression = function (node) {
      const statement = node.test;
      if (statement.operator === "!") {
        if (
          statement.argument &&
          statement.argument.callee &&
          statement.argument.callee.name &&
          statement.argument.callee.name === "isNullish"
        ) {
          const argument = getTextOfNode(statement.argument.arguments[0]);
          const consequent = getTextOfNode(node.consequent);
          const alternate = getTextOfNode(node.alternate);
          if (argument === consequent) {
            context.report({
              node,
              message:
                "Prefer nullish coalescing over checking a ternary with !isNullish.",
              fix(fixer) {
                return fixer.replaceText(node, `${argument} ?? ${alternate}`);
              },
            });
          }
        }
      }
    };
    return visitors;
  },
};
