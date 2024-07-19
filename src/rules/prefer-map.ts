/**
 * @fileoverview Rule to check if a call to R.forEach should be a call to R.map
 */

import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";
import astUtil from "../util/astUtil";
import get from "lodash/get";
import includes from "lodash/includes";

const {
  getFirstFunctionLine,
  hasOnlyOneStatement,
  getMethodName,
  isFunctionDefinitionWithBlock,
  collectParameterValues,
} = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-map"),
  },
};
function create(context) {
  function onlyHasPush(func) {
    const firstLine = getFirstFunctionLine(func);
    const firstParam = get(func, "params[0]");
    const exp =
      func && !isFunctionDefinitionWithBlock(func)
        ? firstLine
        : firstLine?.expression;
    return (
      func &&
      hasOnlyOneStatement(func) &&
      getMethodName(exp) === "push" &&
      !includes(
        collectParameterValues(firstParam),
        get(exp, "callee.object.name"),
      )
    );
  }

  return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
    if (method === "forEach" && onlyHasPush(iteratee)) {
      context.report({
        node,
        message: "Prefer R.map over a R.forEach with a push to an array inside",
      });
    }
  });
}

export { create, meta };
