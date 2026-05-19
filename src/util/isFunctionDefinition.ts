import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

const isFunctionDefinition = (node: TSESTree.Node) => {
  return (
    node.type === AST_NODE_TYPES.FunctionExpression ||
    node.type === AST_NODE_TYPES.FunctionDeclaration ||
    node.type === AST_NODE_TYPES.ArrowFunctionExpression
  );
};

export { isFunctionDefinition };
