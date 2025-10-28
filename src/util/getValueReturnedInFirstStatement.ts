import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { getFirstFunctionLine } from "./getFirstFunctionLine";
import { isFunctionDefinitionWithBlock } from "./isFunctionDefinitionWithBlock";
import { isReturnStatement } from "./isReturnStatement";

/**
 * Returns the node of the value returned in the first line, if any.
 *
 * @param func - The function to check.
 */
function getValueReturnedInFirstStatement(
  func:
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | null
    | undefined,
): TSESTree.Node | undefined {
  const firstLine = getFirstFunctionLine(func);

  if (!func) {
    return undefined;
  }

  if (isFunctionDefinitionWithBlock(func)) {
    if (
      firstLine &&
      isReturnStatement(firstLine) &&
      firstLine.type === AST_NODE_TYPES.ReturnStatement
    ) {
      return firstLine.argument ?? undefined;
    }

    return undefined;
  }

  if (func.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return firstLine;
  }

  return undefined;
}

export { getValueReturnedInFirstStatement };
