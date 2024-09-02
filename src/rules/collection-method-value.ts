/**
 * @fileoverview Rule to enforce usage of collection method values
 */

import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors, isCallToMethod } from "../util/remedaUtil";
import astUtil from "../util/astUtil";
import {
  isCollectionMethod,
  getSideEffectIterationMethods,
} from "../util/methodDataUtil";
import includes from "lodash/includes";

const { getMethodName } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("collection-method-value"),
  },
} as const;

function create(context) {
  function parentUsesValue(node) {
    return node.parent.type !== "ExpressionStatement";
  }

  function isSideEffectIterationMethod(method) {
    return includes(getSideEffectIterationMethods(), method);
  }

  function isParentCommit(node, callType) {
    return (
      callType === "chained" && isCallToMethod(node.parent.parent, "commit")
    );
  }

  return getRemedaMethodVisitors(
    context,
    (node, iteratee, { method, callType }) => {
      if (isCollectionMethod(method) && !parentUsesValue(node)) {
        context.report({
          node,
          message: `Use value returned from R.${method}`,
        });
      } else if (
        isSideEffectIterationMethod(method) &&
        parentUsesValue(node) &&
        !isParentCommit(node, callType)
      ) {
        context.report({
          node,
          message: `Do not use value returned from R.${getMethodName(node)}`,
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
