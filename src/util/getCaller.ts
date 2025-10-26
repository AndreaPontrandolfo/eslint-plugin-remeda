import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Gets the object that called the method in a CallExpression.
 *
 * @param node - The node to check.
 */
const getCaller = (
  node: TSESTree.Node | null | undefined,
): TSESTree.Node | null | undefined => {
  if (
    !node ||
    node.type !== AST_NODE_TYPES.CallExpression ||
    !node.callee ||
    node.callee.type !== AST_NODE_TYPES.MemberExpression
  ) {
    return null;
  }

  return node.callee.object;
};

export { getCaller };
