/**
 * @file Rule to check if an array.length comparison should be a call to R.hasAtLeast.
 */

import { getDocsUrl } from "../util/getDocsUrl";

const MESSAGE_ID = "prefer-has-atleast";

const meta = {
  type: "suggestion",
  docs: {
    description: "Prefer R.hasAtLeast over array.length comparison",
    url: getDocsUrl("prefer-has-atleast"),
  },
  fixable: "code",
  schema: [],
  messages: {
    [MESSAGE_ID]: "Prefer R.hasAtLeast over array.length comparison",
  },
} as const;

function create(context) {
  return {
    BinaryExpression(node) {
      // Check for array.length >= n
      if (node.operator === ">=" || node.operator === ">") {
        // Check for array.length >= n
        if (
          node.left.type === "MemberExpression" &&
          node.left.property.type === "Identifier" &&
          node.left.property.name === "length" &&
          node.right.type === "Literal" &&
          typeof node.right.value === "number"
        ) {
          const comparison =
            node.operator === ">=" ? node.right.value : node.right.value + 1;

          context.report({
            node,
            messageId: MESSAGE_ID,
            fix(fixer) {
              const arrayCode = context
                .getSourceCode()
                .getText(node.left.object);

              return fixer.replaceText(
                node,
                `R.hasAtLeast(${arrayCode}, ${comparison})`,
              );
            },
          });
        }

        // Check for n <= array.length
        if (
          node.right.type === "MemberExpression" &&
          node.right.property.type === "Identifier" &&
          node.right.property.name === "length" &&
          node.left.type === "Literal" &&
          typeof node.left.value === "number"
        ) {
          // Swap the comparison since the order is reversed
          const comparison =
            node.operator === ">=" ? node.left.value : node.left.value + 1;

          context.report({
            node,
            messageId: MESSAGE_ID,
            fix(fixer) {
              const arrayCode = context
                .getSourceCode()
                .getText(node.right.object);

              return fixer.replaceText(
                node,
                `R.hasAtLeast(${arrayCode}, ${comparison})`,
              );
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

export const RULE_NAME = "prefer-has-atleast";
export default rule;
