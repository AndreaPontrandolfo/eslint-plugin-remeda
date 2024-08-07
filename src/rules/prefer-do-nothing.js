/**
 * @fileoverview Rule to prefer R.doNothing() or R.constant(undefined) over an empty function
 */

import { getDocsUrl } from "../util/getDocsUrl";
import astUtil from "../util/astUtil";

const { getFirstFunctionLine } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-do-nothing"),
  },
};
function create(context) {
  function reportIfEmptyFunction(node) {
    if (
      !getFirstFunctionLine(node) &&
      node.parent.type !== "MethodDefinition" &&
      !node.generator &&
      !node.async
    ) {
      context.report({
        node,
        message:
          "Prefer R.doNothing() or R.constant(undefined) over an empty function",
      });
    }
  }

  return {
    FunctionExpression: reportIfEmptyFunction,
    ArrowFunctionExpression: reportIfEmptyFunction,
  };
}

export { create, meta };
