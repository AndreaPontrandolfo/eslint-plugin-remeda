/**
 * @file Rule to check if array.length comparisons or negated isEmpty calls should be replaced with R.hasAtLeast.
 */

import type { isEmpty } from "lodash-es";
import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext, isCallToRemedaMethod } from "../util/remedaUtil";

export const RULE_NAME = "prefer-has-atleast";
const LENGTH_COMPARISON_MESSAGE =
  "Prefer R.hasAtLeast over array.length comparison";
const NEGATED_ISEMPTY_MESSAGE =
  "Prefer R.hasAtLeast(data, 1) over negated R.isEmpty for better type narrowing";

export type MessageIds =
  | "prefer-has-atleast"
  | "prefer-has-atleast-over-negated-isempty";
export type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Prefer R.hasAtLeast over array.length comparison or negated R.isEmpty.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      "prefer-has-atleast": LENGTH_COMPARISON_MESSAGE,
      "prefer-has-atleast-over-negated-isempty": NEGATED_ISEMPTY_MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    const remedaContext = getRemedaContext(context);

    function isRemedaIsEmptyCall(
      node: TSESTree.Node,
    ): node is TSESTree.CallExpression {
      return (
        node.type === "CallExpression" &&
        isCallToRemedaMethod(node, "isEmpty", remedaContext)
      );
    }

    function isArrayLengthProperty(
      node: TSESTree.Node,
    ): node is TSESTree.MemberExpression {
      return (
        node.type === "MemberExpression" &&
        node.property.type === "Identifier" &&
        node.property.name === "length"
      );
    }

    function isNumberLiteral(node: TSESTree.Node): node is TSESTree.Literal {
      return node.type === "Literal" && typeof node.value === "number";
    }

    function getNumberValue(node: TSESTree.Node): number | null {
      if (isNumberLiteral(node)) {
        return node.value as number;
      }

      return null;
    }

    function reportArrayLengthComparison(
      node: TSESTree.BinaryExpression,
      arrayNode: TSESTree.Expression,
      numberNode: TSESTree.Expression,
      operator: string,
    ) {
      const numberValue = getNumberValue(numberNode);

      if (numberValue === null) {
        return;
      }

      let targetNumber: number;

      switch (operator) {
        case ">=": {
          targetNumber = numberValue;

          break;
        }
        case ">": {
          targetNumber = numberValue + 1;

          break;
        }
        case "<=": {
          targetNumber = numberValue;

          break;
        }
        case "<": {
          targetNumber = numberValue - 1;

          break;
        }
        default: {
          return;
        }
      }

      context.report({
        node,
        messageId: "prefer-has-atleast",
        fix(fixer) {
          const sourceCode = context.getSourceCode();

          return fixer.replaceText(
            node,
            `R.hasAtLeast(${sourceCode.getText(arrayNode)}, ${targetNumber})`,
          );
        },
      });
    }

    return {
      BinaryExpression(node) {
        if (
          node.operator === ">=" &&
          isArrayLengthProperty(node.left) &&
          isNumberLiteral(node.right)
        ) {
          reportArrayLengthComparison(node, node.left.object, node.right, ">=");
        } else if (
          node.operator === "<=" &&
          isNumberLiteral(node.left) &&
          isArrayLengthProperty(node.right)
        ) {
          reportArrayLengthComparison(node, node.right.object, node.left, "<=");
        } else if (
          node.operator === ">" &&
          isArrayLengthProperty(node.left) &&
          isNumberLiteral(node.right)
        ) {
          reportArrayLengthComparison(node, node.left.object, node.right, ">");
        } else if (
          node.operator === "<" &&
          isNumberLiteral(node.left) &&
          isArrayLengthProperty(node.right)
        ) {
          reportArrayLengthComparison(node, node.right.object, node.left, "<");
        } else if (
          (node.operator === "===" || node.operator === "!==") &&
          ((node.left.type === "Literal" && node.left.value === false) ||
            (node.right.type === "Literal" && node.right.value === false))
        ) {
          const isEmptyCall = isRemedaIsEmptyCall(node.left)
            ? node.left
            : isRemedaIsEmptyCall(node.right)
              ? node.right
              : null;

          if (isEmptyCall && !isEmpty(isEmptyCall.arguments)) {
            context.report({
              node,
              messageId: "prefer-has-atleast-over-negated-isempty",
              fix(fixer) {
                const sourceCode = context.getSourceCode();

                return fixer.replaceText(
                  node,
                  `R.hasAtLeast(${sourceCode.getText(isEmptyCall.arguments[0])}, 1)`,
                );
              },
            });
          }
        }
      },
      UnaryExpression(node) {
        if (node.operator === "!" && isRemedaIsEmptyCall(node.argument)) {
          const isEmptyCall = node.argument;

          if (!isEmpty(isEmptyCall.arguments)) {
            context.report({
              node,
              messageId: "prefer-has-atleast-over-negated-isempty",
              fix(fixer) {
                const sourceCode = context.getSourceCode();

                return fixer.replaceText(
                  node,
                  `R.hasAtLeast(${sourceCode.getText(isEmptyCall.arguments[0])}, 1)`,
                );
              },
            });
          }
        }
      },
    };
  },
});
