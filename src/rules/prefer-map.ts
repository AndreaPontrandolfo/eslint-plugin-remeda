/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * Rule to check if a call to R.forEach should be a call to R.map.
 */

import { get, includes } from "lodash-es";
import { ESLintUtils } from "@typescript-eslint/utils";
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

export const RULE_NAME = "prefer-map";
type MessageIds = "prefer-map";
type Options = [];

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

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce using R.map over a R.forEach with a push to an array inside",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-map":
        "Prefer R.map over a R.forEach with a push to an array inside",
    },
  },
  defaultOptions: [],
  create(context) {
    return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
      if (method === "forEach" && onlyHasPush(iteratee)) {
        context.report({
          node,
          messageId: "prefer-map",
        });
      }
    });
  },
});
