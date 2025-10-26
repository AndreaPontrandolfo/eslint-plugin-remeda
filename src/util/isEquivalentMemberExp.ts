import { includes, isEqualWith } from "lodash-es";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isComputed } from "./isComputed";

/**
 * Returns whether the two expressions refer to the same object (e.g. A['b'].c and a.b.c).
 *
 * @param a - The first expression to check.
 * @param b - The second expression to check.
 */
function isEquivalentMemberExp(
  a: TSESTree.MemberExpression,
  b: TSESTree.MemberExpression,
) {
  return isEqualWith(
    a,
    b,
    (
      left: TSESTree.Node | undefined,
      right: TSESTree.Node | undefined,
      key: PropertyKey | undefined,
    ) => {
      if (!left || !right || !key) {
        return undefined;
      }
      if (
        includes(["loc", "range", "computed", "start", "end", "parent"], key)
      ) {
        return true;
      }
      if (
        isComputed(left as TSESTree.MemberExpression) ||
        isComputed(right as TSESTree.MemberExpression)
      ) {
        return false;
      }
      if (key === "property") {
        if (
          left.type === AST_NODE_TYPES.Identifier &&
          right.type === AST_NODE_TYPES.Identifier
        ) {
          return left.name === right.name;
        }
        if (
          left.type === AST_NODE_TYPES.Literal &&
          right.type === AST_NODE_TYPES.Literal
        ) {
          return left.value === right.value;
        }

        return false;
      }

      return undefined;
    },
  );
}

export { isEquivalentMemberExp };
