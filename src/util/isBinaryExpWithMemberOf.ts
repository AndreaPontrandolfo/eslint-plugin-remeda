import { isMatch } from "lodash-es";
import { type TSESTree } from "@typescript-eslint/utils";
import isMemberExpOf from "./isMemberExpOf";
import isLiteral from "./isLiteral";

interface IsBinaryExpWithMemberOfOptions {
  maxLength?: number;
  allowComputed?: boolean;
  onlyLiterals?: boolean;
}

/**
 * Returns whether the expression specified is a binary expression with the specified operator and one of its sides is a member expression of the specified object name.
 */
function isBinaryExpWithMemberOf(
  operator: string,
  exp: TSESTree.BinaryExpression,
  objectName: string,
  {
    maxLength,
    allowComputed,
    onlyLiterals,
  }: IsBinaryExpWithMemberOfOptions = {},
) {
  if (!isMatch(exp, { type: "BinaryExpression", operator })) {
    return false;
  }
  const [left, right] = [exp.left, exp.right].map((side) =>
    isMemberExpOf(side, objectName, { maxLength, allowComputed }),
  );

  return (
    left === !right &&
    (!onlyLiterals || isLiteral(exp.left) || isLiteral(exp.right))
  );
}

export default isBinaryExpWithMemberOf;
