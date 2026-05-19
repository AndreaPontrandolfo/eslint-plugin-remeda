import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns whether the node is a method call.
 *
 * @param node - The node to check.
 */
const isMethodCall = (node: TSESTree.Node) => {
  return (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression
  );
};

export { isMethodCall };
