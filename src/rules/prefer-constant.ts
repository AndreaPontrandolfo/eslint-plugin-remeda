/**
 * @fileoverview Rule to check if the expression could be better expressed as a R.constant
 */

import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";

const { getValueReturnedInFirstStatement } = astUtil;

const meta = {
  type: "problem",
  docs: {
    url: getDocsUrl("prefer-constant"),
  },
  schema: [
    {
      type: "boolean",
    },
    {
      type: "boolean",
    },
  ],
} as const;

function create(context) {
  const shouldCheckArrowFunctions =
    context.options[0] !== undefined ? context.options[0] : true;
  const shouldCheckFunctionDeclarations =
    context.options[1] !== undefined ? context.options[1] : false;

  function isCompletelyLiteral(node) {
    switch (node.type) {
      case "Literal": {
        return true;
      }
      case "BinaryExpression": {
        return (
          isCompletelyLiteral(node.left) && isCompletelyLiteral(node.right)
        );
      }
      case "UnaryExpression": {
        return isCompletelyLiteral(node.argument);
      }
      case "ConditionalExpression": {
        return (
          isCompletelyLiteral(node.test) &&
          isCompletelyLiteral(node.consequent) &&
          isCompletelyLiteral(node.alternate)
        );
      }
      default: {
        return false;
      }
    }
  }

  function reportIfLikeConstant(func, node) {
    const valueReturnedInFirstLine = func(node);

    if (
      valueReturnedInFirstLine &&
      isCompletelyLiteral(valueReturnedInFirstLine)
    ) {
      context.report({
        node,
        message: "Prefer R.constant over a function returning a literal",
      });
    }
  }

  function handleFunctionDefinition(node) {
    reportIfLikeConstant(getValueReturnedInFirstStatement, node);
  }

  return {
    FunctionExpression: handleFunctionDefinition,
    FunctionDeclaration(node) {
      if (shouldCheckFunctionDeclarations) {
        handleFunctionDefinition(node);
      }
    },
    ArrowFunctionExpression(node) {
      if (shouldCheckArrowFunctions) {
        handleFunctionDefinition(node);
      }
    },
  };
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-constant";
export default rule;
