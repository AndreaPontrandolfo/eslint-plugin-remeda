import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isMinus } from "./isMinus";

export const getIsValue = (value: number) => {
  if (value < 0) {
    return (node: TSESTree.Node) => {
      return (
        isMinus(node) &&
        node.argument.type === AST_NODE_TYPES.Literal &&
        node.argument.value === -value
      );
    };
  }

  return (node: TSESTree.Node) =>
    node.type === AST_NODE_TYPES.Literal && node.value === value;
};
