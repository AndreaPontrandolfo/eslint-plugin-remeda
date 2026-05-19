import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns whether the node is a call from the specified object name.
 *
 * @param node - The node to check.
 * @param objName   - The object name to check against.
 */
const isCallFromObject = (
  node: TSESTree.Node | null | undefined,
  objName: string,
) => {
  return (
    Boolean(objName) &&
    node?.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.object.type === AST_NODE_TYPES.Identifier &&
    node.callee.object.name === objName
  );
};

export { isCallFromObject };
