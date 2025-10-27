import { get } from "lodash-es";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns whether the node is a call from the specified object name.
 *
 * @param node - The node to check.
 * @param objName   - The object name to check against.
 */
function isCallFromObject(
  node: TSESTree.Node | null | undefined,
  objName: string,
) {
  return (
    node &&
    objName &&
    node.type === AST_NODE_TYPES.CallExpression &&
    get(node, "callee.object.name") === objName
  );
}

export { isCallFromObject };
