/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * Rule to check if a call to R.forEach should be a call to R.map.
 */

import { get, includes } from "lodash-es";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

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
    description: "Prefer R.map over a R.forEach with a push to an array inside",
    url: getDocsUrl("prefer-map"),
  },
} as const;

function onlyHasPush(func) {
  const firstLine = getFirstFunctionLine(func);
  const firstParam = get(func, "params[0]");
  const exp =
    func && !isFunctionDefinitionWithBlock(func)
      ? firstLine
      : //@ts-expect-error
        firstLine?.expression;

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

function create(context) {
  return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
    if (method === "forEach" && onlyHasPush(iteratee)) {
      context.report({
        node,
        message: "Prefer R.map over a R.forEach with a push to an array inside",
      });
    }
  });
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-map";
export default rule;
