import { get } from "lodash-es";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns whether the node is actually computed (x['ab'] does not count, x['a' + 'b'] does.
 *
 * @param node - The node to check.
 */
function isComputed(node: TSESTree.MemberExpression): boolean {
  return get(node, "computed") && node.property.type !== AST_NODE_TYPES.Literal;
}

export { isComputed };
