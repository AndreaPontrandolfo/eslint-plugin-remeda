import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isFunctionDefinitionWithBlock } from "./isFunctionDefinitionWithBlock";

/**
 * Returns whether the node specified has only one statement.
 *
 * @param func - The function to check.
 */
const hasOnlyOneStatement = (func: TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression) => {
  if (isFunctionDefinitionWithBlock(func)) {
    return func.body.body.length === 1;
  }

  return func.type === AST_NODE_TYPES.ArrowFunctionExpression;
};

export { hasOnlyOneStatement };
