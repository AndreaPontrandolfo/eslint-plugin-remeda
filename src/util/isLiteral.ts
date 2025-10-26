import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns whether the node is a literal.
 *
 * @param node - The node to check.
 */
function isLiteral(node: TSESTree.Node | null | undefined) {
  return node?.type === AST_NODE_TYPES.Literal;
}

export default isLiteral;
