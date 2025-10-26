import { type TSESTree } from "@typescript-eslint/utils";
import isMethodCall from "./isMethodCall";
import getMethodName from "./getMethodName";

/**
 * Returns whether the node is a call to indexOf.
 *
 * @param node - The node to check.
 */
const isIndexOfCall = (node: TSESTree.Node | null | undefined) => {
  return isMethodCall(node) && getMethodName(node) === "indexOf";
};

export default isIndexOfCall;
