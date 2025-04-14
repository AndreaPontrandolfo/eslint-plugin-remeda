/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @regru/prefer-early-return/prefer-early-return */

/**
 * Rule to check if a call to `R.filter` should be a call to `R.find`.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import {
  getRemedaMethodVisitors,
  isCallToMethod,
  isCallToRemedaMethod,
} from "../util/remedaUtil";

export const RULE_NAME = "prefer-find";

const PREFER_FIND_MESSAGE =
  "Prefer using `R.find` over selecting the first item of a filtered result";
const PREFER_FIND_LAST_MESSAGE =
  "Prefer using `R.findLast` over selecting the last item of a filtered result";

type MessageIds = "prefer-find" | "prefer-find-last";
type Options = [];

function isZeroIndexAccess(
  node: TSESTree.Node,
): node is TSESTree.MemberExpression {
  return (
    node.type === AST_NODE_TYPES.MemberExpression &&
    node.property.type === AST_NODE_TYPES.Literal &&
    node.property.value === 0
  );
}

function isChainedBeforeMethod(
  callType: string,
  node: TSESTree.Node,
  method: string,
): boolean {
  return (
    callType === "chained" &&
    node.parent?.parent !== undefined &&
    isCallToMethod(node.parent.parent, method)
  );
}

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce using `R.find` over selecting the first item of a filtered result",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-find": PREFER_FIND_MESSAGE,
      "prefer-find-last": PREFER_FIND_LAST_MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    return getRemedaMethodVisitors(
      context,
      (
        node: TSESTree.Node,
        iteratee: TSESTree.Node,
        // @ts-expect-error
        { method, callType, remedaContext },
      ) => {
        if (method === "filter") {
          if (
            (node.parent && isZeroIndexAccess(node.parent)) ||
            isCallToRemedaMethod(node.parent, "first", remedaContext) ||
            isChainedBeforeMethod(callType, node, "first")
          ) {
            context.report({
              node,
              messageId: "prefer-find",
            });
          }
          if (
            isCallToRemedaMethod(node.parent, "last", remedaContext) ||
            isChainedBeforeMethod(callType, node, "last")
          ) {
            context.report({
              node,
              messageId: "prefer-find-last",
            });
          }
        }
      },
    );
  },
});
