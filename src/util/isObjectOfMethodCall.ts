import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { get } from "lodash-es";

/**
 * Returns whether the node is an object of a method call.
 *
 * @param node - The node to check.
 */
function isObjectOfMethodCall(node: TSESTree.Node | null | undefined) {
  return (
    get(node, "parent.object") === node &&
    get(node, "parent.parent.type") === AST_NODE_TYPES.CallExpression
  );
}

export { isObjectOfMethodCall };
