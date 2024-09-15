/**
 * @file Rule to check if there's a method in the chain start that can be in the chain.
 */

import { some } from "lodash-es";
import { getDocsUrl } from "../util/getDocsUrl";
import { getIsTypeMethod } from "../util/remedaUtil";

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-remeda-typecheck"),
  },
} as const;

function create(context) {
  const otherSides = {
    left: "right",
    right: "left",
  };

  function isTypeOf(node) {
    return (
      node && node.type === "UnaryExpression" && node.operator === "typeof"
    );
  }

  function isStrictComparison(node) {
    return node.operator === "===" || node.operator === "!==";
  }

  function isDeclaredVariable(node) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const scope = sourceCode?.getScope?.(node);
    const definedVariables = scope.variables;

    return some(definedVariables, { name: node.name });
  }

  function getValueForSide(node, side) {
    const otherSide = otherSides[side];

    if (
      isTypeOf(node[side]) &&
      (node[otherSide].value !== "undefined" ||
        node[side].argument.type !== "Identifier" ||
        isDeclaredVariable(node[side].argument))
    ) {
      return node[otherSide].value;
    }
  }

  function getTypeofCompareType(node) {
    if (isStrictComparison(node)) {
      return getValueForSide(node, "left") || getValueForSide(node, "right");
    }
  }

  const REPORT_MESSAGE = "Prefer 'R.{{method}}' over {{actual}}.";

  return {
    BinaryExpression(node) {
      const typeofCompareType = getTypeofCompareType(node);

      if (typeofCompareType) {
        context.report({
          node,
          message: REPORT_MESSAGE,
          data: {
            method: getIsTypeMethod(typeofCompareType),
            actual: "'typeof' comparison",
          },
        });
      } else if (node.operator === "instanceof") {
        const remedaEquivalent = getIsTypeMethod(node.right.name);

        if (node.right.type === "Identifier" && remedaEquivalent) {
          context.report({
            node,
            message: REPORT_MESSAGE,
            data: {
              method: remedaEquivalent,
              actual: `'instanceof ${node.right.name}'`,
            },
          });
        }
      }
    },
  };
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-remeda-typecheck";
export default rule;
