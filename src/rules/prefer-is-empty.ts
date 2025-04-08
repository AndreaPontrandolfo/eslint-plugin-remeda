/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Rule to prefer isEmpty over manually checking for length value.
 */

import type { RemedaMethodVisitors } from "../types";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext } from "../util/remedaUtil";

const meta = {
  type: "problem",
  schema: [],
  docs: {
    description: "Prefer R.isEmpty over manually checking for length value.",
    url: getDocsUrl("prefer-is-empty"),
  },
  fixable: "code",
} as const;

function create(context) {
  const remedaContext = getRemedaContext(context);

  function getTextOfNode(node) {
    if (node) {
      if (node.type === "Identifier") {
        return node.name;
      }

      return context.getSourceCode().getText(node);
    }
  }

  const visitors: RemedaMethodVisitors = remedaContext.getImportVisitors();

  visitors.BinaryExpression = function (node) {
    if (node.operator === "===") {
      if (node.left) {
        if (node.left.property && node.right) {
          const leftExpressionMember = node.left.property.name;
          const rightExpressionMember = node.right.value;

          if (
            leftExpressionMember === "length" &&
            rightExpressionMember === 0
          ) {
            const subjectObject = node.left.object;

            context.report({
              node,
              message:
                "Prefer isEmpty over manually checking for length value.",
              fix(fixer) {
                return fixer.replaceText(
                  node,
                  `isEmpty(${getTextOfNode(subjectObject)})`,
                );
              },
            });
          }
        } else if (
          node.left.expression &&
          node.right &&
          node.left.expression.property
        ) {
          const leftExpressionMember = node.left.expression.property.name;
          const rightExpressionMember = node.right.value;

          if (
            leftExpressionMember === "length" &&
            rightExpressionMember === 0
          ) {
            const subjectObject = node.left.expression.object;

            context.report({
              node,
              message:
                "Prefer isEmpty over manually checking for length value.",
              fix(fixer) {
                return fixer.replaceText(
                  node,
                  `isEmpty(${getTextOfNode(subjectObject)})`,
                );
              },
            });
          }
        }
      }
    }
    if (node.operator === ">") {
      if (node.left) {
        if (node.left.property && node.right) {
          const leftExpressionMember = node.left.property.name;
          const rightExpressionMember = node.right.value;

          if (
            leftExpressionMember === "length" &&
            rightExpressionMember === 0
          ) {
            const subjectObject = node.left.object;

            context.report({
              node,
              message:
                "Prefer isEmpty over manually checking for length value.",
              fix(fixer) {
                return fixer.replaceText(
                  node,
                  `!isEmpty(${getTextOfNode(subjectObject)})`,
                );
              },
            });
          }
        } else if (node.left.expression && node.right) {
          const leftExpressionMember = node.left.expression.property.name;
          const rightExpressionMember = node.right.value;

          if (
            leftExpressionMember === "length" &&
            rightExpressionMember === 0
          ) {
            const subjectObject = node.left.expression.object;

            context.report({
              node,
              message:
                "Prefer isEmpty over manually checking for length value.",
              fix(fixer) {
                return fixer.replaceText(
                  node,
                  `!isEmpty(${getTextOfNode(subjectObject)})`,
                );
              },
            });
          }
        }
      }
    }
  };

  return visitors;
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-is-empty";
export default rule;
