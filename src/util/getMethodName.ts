import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Gets the name of a method in a CallExpression.
 *
 * @param node - The node to check.
 */
const getMethodName = (node: TSESTree.Node) => {
  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return node.callee.property.name;
  }

  return undefined;
};

export { getMethodName };
