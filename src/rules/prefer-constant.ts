/**
 * Rule to check if the expression could be better expressed as a R.constant.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";

const { getValueReturnedInFirstStatement } = astUtil;

export const RULE_NAME = "prefer-constant";
const MESSAGE_ID = "prefer-constant";

export type MessageIds = typeof MESSAGE_ID;
export type Options = [boolean?, boolean?];

function isCompletelyLiteral(node: TSESTree.Node): boolean {
  switch (node.type) {
    case AST_NODE_TYPES.Literal: {
      return true;
    }
    case AST_NODE_TYPES.BinaryExpression: {
      return isCompletelyLiteral(node.left) && isCompletelyLiteral(node.right);
    }
    case AST_NODE_TYPES.UnaryExpression: {
      return isCompletelyLiteral(node.argument);
    }
    case AST_NODE_TYPES.ConditionalExpression: {
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

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforce using R.constant over functions returning literals",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [
      {
        type: "boolean",
      },
      {
        type: "boolean",
      },
    ],
    messages: {
      [MESSAGE_ID]: "Prefer R.constant over a function returning a literal",
    },
  },
  defaultOptions: [true, false],
  create(context) {
    const shouldCheckArrowFunctions = context.options[0] ?? true;
    const shouldCheckFunctionDeclarations = context.options[1] ?? false;

    function reportIfLikeConstant(
      func: (node: TSESTree.Node) => TSESTree.Node | null,
      node: TSESTree.Node,
    ) {
      const valueReturnedInFirstLine = func(node);

      if (
        valueReturnedInFirstLine &&
        isCompletelyLiteral(valueReturnedInFirstLine)
      ) {
        context.report({
          node,
          messageId: MESSAGE_ID,
        });
      }
    }

    function handleFunctionDefinition(node: TSESTree.Node) {
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
  },
});
