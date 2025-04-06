import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";

const { getFirstFunctionLine } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    description:
      "Prefer R.doNothing() or R.constant(undefined) over an empty function",
    url: getDocsUrl("prefer-do-nothing"),
  },
} as const;

/**
 * Rule to prefer R.doNothing() or R.constant(undefined) over an empty function.
 */
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

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-do-nothing";
export default rule;
