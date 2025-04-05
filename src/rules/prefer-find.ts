/**
 * @file Rule to check if a call to `R.filter` should be a call to `R.find`.
 */

import { getDocsUrl } from "../util/getDocsUrl";
import {
  getRemedaMethodVisitors,
  isCallToMethod,
  isCallToRemedaMethod,
} from "../util/remedaUtil";

const meta = {
  type: "problem",
  schema: [],
  docs: {
    description:
      "Prefer using `R.find` over selecting the first item of a filtered result",
    url: getDocsUrl("prefer-find"),
  },
} as const;

function create(context) {
  function isZeroIndexAccess(node) {
    return node.type === "MemberExpression" && node.property.value === 0;
  }

  function isChainedBeforeMethod(callType, node, method) {
    return callType === "chained" && isCallToMethod(node.parent.parent, method);
  }

  return getRemedaMethodVisitors(
    context,
    (node, iteratee, { method, callType, remedaContext }) => {
      if (method === "filter") {
        if (
          isZeroIndexAccess(node.parent) ||
          isCallToRemedaMethod(node.parent, "first", remedaContext) ||
          isChainedBeforeMethod(callType, node, "first")
        ) {
          context.report({
            node,
            message:
              "Prefer using `R.find` over selecting the first item of a filtered result",
          });
        }
        if (
          isCallToRemedaMethod(node.parent, "last", remedaContext) ||
          isChainedBeforeMethod(callType, node, "last")
        ) {
          context.report({
            node,
            message:
              "Prefer using `R.findLast` over selecting the last item of a filtered result",
          });
        }
      }
    },
  );
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-find";
export default rule;
