import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isFunctionDefinition } from "./isFunctionDefinition";

/**
 * Returns whether the node is a function declaration that has a block.
 *
 * @param node - The node to check.
 */
const isFunctionDefinitionWithBlock = (
  node: TSESTree.Node,
): node is
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | (TSESTree.ArrowFunctionExpression & { body: TSESTree.BlockStatement }) => {
  return (
    isFunctionDefinition(node) &&
    !(node.type === AST_NODE_TYPES.ArrowFunctionExpression &&
      node.body.type !== AST_NODE_TYPES.BlockStatement)
  );
};

export { isFunctionDefinitionWithBlock };
