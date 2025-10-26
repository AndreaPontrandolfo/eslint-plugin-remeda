import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isMemberExpOf } from "./isMemberExpOf";

interface IsNegationOfMemberOfOptions {
  maxLength?: number;
}

/**
 * Returns whether the expression is a negation of a member of objectName, in the specified depth.
 */
function isNegationOfMemberOf(
  exp: TSESTree.Node | null | undefined,
  objectName: string,
  { maxLength }: IsNegationOfMemberOfOptions = {},
) {
  if (
    !exp ||
    exp.type !== AST_NODE_TYPES.UnaryExpression ||
    exp.operator !== "!"
  ) {
    return false;
  }

  return isMemberExpOf(exp.argument, objectName, {
    maxLength,
    allowComputed: false,
  });
}

export { isNegationOfMemberOf };
