import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { isComputed } from "./isComputed";

function isEquivalentLeaf(a: TSESTree.Node, b: TSESTree.Node): boolean {
  if (
    a.type === AST_NODE_TYPES.Identifier &&
    b.type === a.type
  ) {
    return a.name === b.name;
  }

  if (
    a.type === AST_NODE_TYPES.Literal &&
    b.type === a.type
  ) {
    return a.value === b.value;
  }

  return false;
}

/**
 * Returns whether the two expressions structurally refer to the same value
 * (e.g. `a['b'].c` and `a.b.c`, or two identical identifiers / literals).
 * Handles MemberExpression chains, Identifier names, Literal values, and ThisExpression.
 * Source positions and parent links are ignored.
 *
 * @param a - The first expression to check.
 * @param b - The second expression to check.
 */
function isEquivalentMemberExp(a: TSESTree.Node, b: TSESTree.Node): boolean {
  if (a.type !== b.type) {
    return false;
  }

  if (
    a.type === AST_NODE_TYPES.MemberExpression &&
    b.type === AST_NODE_TYPES.MemberExpression
  ) {
    if (isComputed(a) || isComputed(b)) {
      return false;
    }

    return (
      isEquivalentLeaf(a.property, b.property) &&
      isEquivalentMemberExp(a.object, b.object)
    );
  }
  
  if (a.type === AST_NODE_TYPES.ThisExpression) {
    return true;
  }

  return isEquivalentLeaf(a, b);
}

export { isEquivalentMemberExp };
