import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

const isMinus = (node: TSESTree.Node | null | undefined) => {
  return node?.type === AST_NODE_TYPES.UnaryExpression && node.operator === "-";
};

export { isMinus };
