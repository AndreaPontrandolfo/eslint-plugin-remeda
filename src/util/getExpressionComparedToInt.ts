import { includes } from "lodash-es";
import { type TSESTree } from "@typescript-eslint/utils";
import { getIsValue } from "./getIsValue";
import { comparisonOperators } from "./comparisonOperators";

/**
 * Returns the expression compared to the value in a binary expression, or undefined if there isn't one.
 *
 * @param node - The node to check.
 * @param value - The value to compare to.
 * @param checkOver - Whether to check for over/under.
 */
function getExpressionComparedToInt(
  node: TSESTree.BinaryExpression,
  value: number,
  checkOver: boolean,
): TSESTree.Node | undefined {
  const isValue = getIsValue(value);

  if (includes(comparisonOperators, node.operator)) {
    if (isValue(node.right)) {
      return node.left;
    }
    if (isValue(node.left)) {
      return node.right;
    }
  }
  if (checkOver) {
    if (node.operator === ">" && isValue(node.right)) {
      return node.left;
    }
    if (node.operator === "<" && isValue(node.left)) {
      return node.right;
    }
    const isNext = getIsValue(value + 1);

    if (
      (node.operator === ">=" || node.operator === "<") &&
      isNext(node.right)
    ) {
      return node.left;
    }
    if (
      (node.operator === "<=" || node.operator === ">") &&
      isNext(node.left)
    ) {
      return node.right;
    }
  }
}

export { getExpressionComparedToInt };
