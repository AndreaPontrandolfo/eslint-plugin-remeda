/**
 * Rule to prefer isNullish over manual checking for undefined or null.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import type { RemedaMethodVisitors } from "../types";
import { getDocsUrl } from "../util/getDocsUrl";
import { isEquivalentMemberExp } from "../util/isEquivalentMemberExp";
import { isNegationExpression } from "../util/isNegationExpression";
import { getRemedaContext, isCallToRemedaMethod } from "../util/remedaUtil";

export const RULE_NAME = "prefer-is-nullish";
const PREFER_IS_NULLISH_MESSAGE =
  "Prefer isNullish over checking for undefined or null.";

type MessageIds = "prefer-is-nullish";
type Options = [];

type Nil = "null" | "undefined";

type ExpressionCheck = (
  node: TSESTree.Node,
  operator: string,
) => TSESTree.Node | false | undefined;

const getTypeofArgument = (node: TSESTree.Node) => {
  return node.type === AST_NODE_TYPES.UnaryExpression &&
    node.operator === "typeof"
    ? node.argument
    : undefined;
};

const isUndefinedString = (node: TSESTree.Node) => {
  return node.type === AST_NODE_TYPES.Literal && node.value === "undefined";
};

const getValueWithTypeofUndefinedComparison: ExpressionCheck = (
  node,
  operator,
) => {
  if (
    node.type !== AST_NODE_TYPES.BinaryExpression ||
    node.operator !== operator
  ) {
    return undefined;
  }

  return (
    (isUndefinedString(node.right) && getTypeofArgument(node.left)) ||
    (isUndefinedString(node.left) && getTypeofArgument(node.right))
  );
};

const nilChecksIsValue: Record<Nil, (node: TSESTree.Node) => boolean> = {
  null: (node) =>
    node.type === AST_NODE_TYPES.Literal && node.value === null,
  undefined: (node) =>
    node.type === AST_NODE_TYPES.Identifier && node.name === "undefined",
};

const getValueComparedTo = (nil: Nil): ExpressionCheck => {
  return (node, operator) => {
    if (
      node.type !== AST_NODE_TYPES.BinaryExpression ||
      node.operator !== operator
    ) {
      return undefined;
    }

    if (nilChecksIsValue[nil](node.right)) {
      return node.left;
    }
    
    if (nilChecksIsValue[nil](node.left)) {
      return node.right;
    }

    return undefined;
  };
};

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce R.isNullish over checks for both null and undefined.",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-is-nullish": PREFER_IS_NULLISH_MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    const remedaContext = getRemedaContext(context);

    function getRemedaTypeCheckedBy(typecheck: string): ExpressionCheck {
      return (node) => {
        if (
          node.type !== AST_NODE_TYPES.CallExpression ||
          !isCallToRemedaMethod(node, typecheck, remedaContext)
        ) {
          return undefined;
        }

        return node.arguments[0];
      };
    }

    const nilChecksExpressionChecks: Record<Nil, ExpressionCheck[]> = {
      null: [getRemedaTypeCheckedBy("isNull"), getValueComparedTo("null")],
      undefined: [
        getRemedaTypeCheckedBy("isUndefined"),
        getValueComparedTo("undefined"),
        getValueWithTypeofUndefinedComparison,
      ],
    };

    function checkExpression(nil: Nil, operator: string, node: TSESTree.Node) {
      for (const check of nilChecksExpressionChecks[nil]) {
        const result = check(node, operator);

        if (result) {
          return result;
        }
      }

      return undefined;
    }

    function checkNegatedExpression(nil: Nil, node: TSESTree.Node) {
      if (isNegationExpression(node)) {
        const inner = checkExpression(nil, "===", node.argument);

        if (inner) {
          return inner;
        }
      }

      return checkExpression(nil, "!==", node);
    }

    function isEquivalentExistingExpression(
      node: TSESTree.LogicalExpression,
      leftNil: Nil,
      rightNil: Nil,
    ) {
      const leftExp = checkExpression(leftNil, "===", node.left);
      const rightExp = checkExpression(rightNil, "===", node.right);

      if (!leftExp || !rightExp) {
        return false;
      }

      return isEquivalentMemberExp(leftExp, rightExp);
    }

    function isEquivalentExistingNegation(
      node: TSESTree.LogicalExpression,
      leftNil: Nil,
      rightNil: Nil,
    ) {
      const leftExp = checkNegatedExpression(leftNil, node.left);
      const rightExp = checkNegatedExpression(rightNil, node.right);

      if (!leftExp || !rightExp) {
        return false;
      }

      return isEquivalentMemberExp(leftExp, rightExp);
    }

    const visitors: RemedaMethodVisitors = remedaContext.getImportVisitors();

    visitors.LogicalExpression = function (node: TSESTree.LogicalExpression) {
      if (node.operator === "||") {
        if (
          isEquivalentExistingExpression(node, "undefined", "null") ||
          isEquivalentExistingExpression(node, "null", "undefined")
        ) {
          context.report({
            node,
            messageId: "prefer-is-nullish",
          });
        }
      } else if (
        isEquivalentExistingNegation(node, "undefined", "null") ||
        isEquivalentExistingNegation(node, "null", "undefined")
      ) {
        context.report({
          node,
          messageId: "prefer-is-nullish",
        });
      }
    };

    return visitors;
  },
});
