import { type TSESTree } from "@typescript-eslint/utils";
import isMethodCall from "./isMethodCall";
import getMethodName from "./getMethodName";

/**
 * Returns whether the node is a call to findIndex.
 *
 * @param node - The node to check.
 */
const isFindIndexCall = (node: TSESTree.Node | null | undefined) => {
  return isMethodCall(node) && getMethodName(node) === "findIndex";
};

export default isFindIndexCall;
