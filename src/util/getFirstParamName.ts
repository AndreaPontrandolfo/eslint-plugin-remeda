import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns the name of the first parameter of a function, if it exists.
 *
 * @param func - The function to check.
 */
const getFirstParamName = (func: TSESTree.Node | null | undefined) => {
  if (
    func?.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
    func?.type !== AST_NODE_TYPES.FunctionExpression &&
    func?.type !== AST_NODE_TYPES.FunctionDeclaration
  ) {
    return undefined;
  }
  const first = func.params[0];

  return first?.type === AST_NODE_TYPES.Identifier ? first.name : undefined;
};

export { getFirstParamName };
