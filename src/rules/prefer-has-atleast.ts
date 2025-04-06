/**
 * @file Rule to check if an array.length comparison should be a call to R.hasAtLeast.
 */

import { getDocsUrl } from "../util/getDocsUrl";
import { isCallToRemedaMethod } from "../util/remedaUtil";

const MESSAGE_ID = "prefer-has-atleast";
const MESSAGE_ID_EMPTY = "prefer-has-atleast-over-negated-isempty";

const meta = {
  type: "suggestion",
  docs: {
    description:
      "Prefer R.hasAtLeast over array.length comparison or negated isEmpty",
    url: getDocsUrl("prefer-has-atleast"),
  },
  fixable: "code",
  schema: [],
  messages: {
    [MESSAGE_ID]: "Prefer R.hasAtLeast over array.length comparison",
    [MESSAGE_ID_EMPTY]:
      "Prefer R.hasAtLeast(data, 1) over negated R.isEmpty for better type narrowing",
  },
} as const;

function create(context) {
  const remedaContext = { getImportedRemedaMethod: () => null };

  function isRemedaIsEmptyCall(node) {
    return (
      node.type === "CallExpression" &&
      (isCallToRemedaMethod(node, "isEmpty", remedaContext) ||
        (node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "R" &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "isEmpty"))
    );
  }

  return {
    /**
     * Check for array.length comparisons.
     */
    BinaryExpression(node) {
      // Check for R.isEmpty() === false or R.isEmpty() !== true
      if (
        (node.operator === "===" &&
          ((isRemedaIsEmptyCall(node.left) &&
            node.right.type === "Literal" &&
            node.right.value === false) ||
            (isRemedaIsEmptyCall(node.right) &&
              node.left.type === "Literal" &&
              node.left.value === false))) ||
        (node.operator === "!==" &&
          ((isRemedaIsEmptyCall(node.left) &&
            node.right.type === "Literal" &&
            node.right.value === true) ||
            (isRemedaIsEmptyCall(node.right) &&
              node.left.type === "Literal" &&
              node.left.value === true)))
      ) {
        const isEmptyCall = isRemedaIsEmptyCall(node.left)
          ? node.left
          : node.right;
        const arrayArg = isEmptyCall.arguments[0];

        if (arrayArg) {
          context.report({
            node,
            messageId: MESSAGE_ID_EMPTY,
            fix(fixer) {
              const arrayCode = context.getSourceCode().getText(arrayArg);

              return fixer.replaceText(node, `R.hasAtLeast(${arrayCode}, 1)`);
            },
          });
        }

        return;
      }

      // Original array.length checks
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

    /**
     * Check for !R.isEmpty(data).
     */
    UnaryExpression(node) {
      if (node.operator === "!" && isRemedaIsEmptyCall(node.argument)) {
        const isEmptyCall = node.argument;
        const arrayArg = isEmptyCall.arguments[0];

        if (arrayArg) {
          context.report({
            node,
            messageId: MESSAGE_ID_EMPTY,
            fix(fixer) {
              const arrayCode = context.getSourceCode().getText(arrayArg);

              return fixer.replaceText(node, `R.hasAtLeast(${arrayCode}, 1)`);
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
