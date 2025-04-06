/**
 * Rule to enforce usage of collection method values.
 */

import { includes } from "lodash-es";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import {
  getSideEffectIterationMethods,
  isCollectionMethod,
} from "../util/methodDataUtil";
import { getRemedaMethodVisitors, isCallToMethod } from "../util/remedaUtil";

const { getMethodName } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  messages: {
    useReturnValue: "Use value returned from R.{{method}}",
    dontUseReturnValue: "Do not use value returned from R.{{method}}",
  },
  docs: {
    description: "Use value returned from collection methods properly",
    url: getDocsUrl("collection-method-value"),
  },
} as const;

function parentUsesValue(node) {
  return node.parent.type !== "ExpressionStatement";
}

function isSideEffectIterationMethod(method) {
  return includes(getSideEffectIterationMethods(), method);
}

function isParentCommit(node, callType) {
  return callType === "chained" && isCallToMethod(node.parent.parent, "commit");
}

function create(context) {
  return getRemedaMethodVisitors(
    context,
    (node, iteratee, { method, callType }) => {
      if (isCollectionMethod(method) && !parentUsesValue(node)) {
        context.report({
          node,
          messageId: "useReturnValue",
          data: { method },
        });
      } else if (
        isSideEffectIterationMethod(method) &&
        parentUsesValue(node) &&
        !isParentCommit(node, callType)
      ) {
        context.report({
          node,
          messageId: "dontUseReturnValue",
          data: { method: getMethodName(node) },
        });
      }
    },
  );
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "collection-method-value";
export default rule;
