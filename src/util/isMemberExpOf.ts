import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isPropAccess } from "./isPropAccess";

interface IsMemberExpOfOptions {
  maxLength?: number;
  allowComputed?: boolean;
}

/**
 * Returns whether the node is a member expression starting with the same object, up to the specified length.
 *
 * @param node - The node to check.
 * @param objectName - The object name to check against.
 */
function isMemberExpOf(
  node: TSESTree.Node | null | undefined,
  objectName: string,
  { maxLength = Number.MAX_VALUE, allowComputed }: IsMemberExpOfOptions = {},
): boolean {
  if (!objectName) {
    return false;
  }

  let currentNode = node;
  let depth = maxLength;

  while (currentNode && depth) {
    if (allowComputed || isPropAccess(currentNode)) {
      if (
        currentNode.type === AST_NODE_TYPES.MemberExpression &&
        currentNode.object.type === AST_NODE_TYPES.Identifier &&
        currentNode.object.name === objectName
      ) {
        return true;
      }
      currentNode =
        currentNode.type === AST_NODE_TYPES.MemberExpression
          ? currentNode.object
          : undefined;
      depth = depth - 1;
    } else {
      return false;
    }
  }

  return false;
}

export { isMemberExpOf };
