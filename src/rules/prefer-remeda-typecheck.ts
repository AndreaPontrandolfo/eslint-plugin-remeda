/**
 * Rule to check if there's a method in the chain start that can be in the chain.
 */

import { some } from "lodash-es";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import { getIsTypeMethod } from "../util/remedaUtil";

export const RULE_NAME = "prefer-remeda-typecheck";

export type MessageIds = "prefer-remeda-typecheck";
export type Options = [];

function isTypeOf(node: TSESTree.Node): node is TSESTree.UnaryExpression {
  return (
    node.type === AST_NODE_TYPES.UnaryExpression && node.operator === "typeof"
  );
}

function isStrictComparison(node: TSESTree.BinaryExpression): boolean {
  return node.operator === "===" || node.operator === "!==";
}

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce using `R.is*` methods over `typeof` and `instanceof` checks when applicable.",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-remeda-typecheck": "Prefer 'R.{{method}}' over {{actual}}.",
    },
  },
  defaultOptions: [],
  create(context) {
    const otherSides = {
      left: "right",
      right: "left",
    } as const;

    function isDeclaredVariable(node: TSESTree.Identifier): boolean {
      const { sourceCode } = context;
      const scope = sourceCode.getScope(node);
      const definedVariables = scope.variables;

      return some(definedVariables, { name: node.name });
    }

    function getValueForSide(
      node: TSESTree.BinaryExpression,
      side: "left" | "right",
    ): string | undefined {
      const otherSide = otherSides[side];

      if (
        isTypeOf(node[side]) &&
        node[otherSide].type === AST_NODE_TYPES.Literal &&
        (node[otherSide].value !== "undefined" ||
          node[side].argument.type !== AST_NODE_TYPES.Identifier ||
          isDeclaredVariable(node[side].argument))
      ) {
        return String(node[otherSide].value);
      }
    }

    function getTypeofCompareType(
      node: TSESTree.BinaryExpression,
    ): string | undefined {
      if (isStrictComparison(node)) {
        return getValueForSide(node, "left") || getValueForSide(node, "right");
      }
    }

    return {
      BinaryExpression(node) {
        const typeofCompareType = getTypeofCompareType(node);

        if (typeofCompareType) {
          context.report({
            node,
            messageId: "prefer-remeda-typecheck",
            data: {
              method: getIsTypeMethod(typeofCompareType),
              actual: "'typeof' comparison",
            },
          });
        } else if (
          node.operator === "instanceof" &&
          node.right.type === AST_NODE_TYPES.Identifier
        ) {
          const remedaEquivalent = getIsTypeMethod(node.right.name);

          if (remedaEquivalent) {
            context.report({
              node,
              messageId: "prefer-remeda-typecheck",
              data: {
                method: remedaEquivalent,
                actual: `'instanceof ${node.right.name}'`,
              },
            });
          }
        }
      },
    };
  },
});
