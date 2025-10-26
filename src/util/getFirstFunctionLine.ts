import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isFunctionDefinitionWithBlock } from "./isFunctionDefinitionWithBlock";

/**
 * If the node specified is a function, returns the node corresponding with the first statement/expression in that function.
 *
 * @param node - The node to check.
 */
const getFirstFunctionLine = (
  node:
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | null
    | undefined,
): TSESTree.Node | undefined => {
  if (!node) {
    return undefined;
  }

  if (isFunctionDefinitionWithBlock(node)) {
    if (node.body.type === AST_NODE_TYPES.BlockStatement) {
      return node.body.body[0];
    }

    return undefined;
  }

  if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return node.body;
  }

  return undefined;
};

export { getFirstFunctionLine };
