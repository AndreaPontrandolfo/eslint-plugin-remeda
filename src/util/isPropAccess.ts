import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

const isPropAccess = (node: TSESTree.Node) => {
  return (
    node.type === AST_NODE_TYPES.MemberExpression &&
    (!node.computed || node.property.type === AST_NODE_TYPES.Literal)
  );
};

export { isPropAccess };
