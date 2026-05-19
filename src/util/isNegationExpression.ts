import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns whether the expression is a negation.
 *
 * @param exp - The expression to check.
 */
const isNegationExpression = (exp: TSESTree.Node) => {
  return exp.type === AST_NODE_TYPES.UnaryExpression && exp.operator === "!";
};

export { isNegationExpression };
