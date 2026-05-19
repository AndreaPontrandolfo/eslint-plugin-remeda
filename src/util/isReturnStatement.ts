import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

const isReturnStatement = (node: TSESTree.Node) => {
  return node.type === AST_NODE_TYPES.ReturnStatement;
};

export { isReturnStatement };
