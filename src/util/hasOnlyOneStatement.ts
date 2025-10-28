import { get } from "lodash-es";
import { isFunctionDefinitionWithBlock } from "./isFunctionDefinitionWithBlock";

/**
 * Returns whether the node specified has only one statement.
 *
 * @param func - The function to check.
 */
function hasOnlyOneStatement(func: {
  type: string;
  body: { body?: unknown };
}): boolean {
  if (isFunctionDefinitionWithBlock(func)) {
    const body = get(func, "body.body");

    return Array.isArray(body) && body.length === 1;
  }
  if (func.type === "ArrowFunctionExpression") {
    return !get(func, "body.body");
  }

  return false;
}

export { hasOnlyOneStatement };
