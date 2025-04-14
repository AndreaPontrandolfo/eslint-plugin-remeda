/**
 * Rule to enforce usage of collection method values.
 */

import { includes } from "lodash-es";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import {
  getSideEffectIterationMethods,
  isCollectionMethod,
} from "../util/methodDataUtil";
import { getRemedaMethodVisitors, isCallToMethod } from "../util/remedaUtil";

const { getMethodName } = astUtil;

export const RULE_NAME = "collection-method-value";

type MessageIds = "useReturnValueId" | "dontUseReturnValueId";
type Options = [];

function parentUsesValue(node: TSESTree.CallExpression) {
  return node.parent.type !== AST_NODE_TYPES.ExpressionStatement;
}

function isSideEffectIterationMethod(method: string) {
  return includes(getSideEffectIterationMethods(), method);
}

function isParentCommit(node: TSESTree.CallExpression, callType: string) {
  return (
    callType === "chained" &&
    node.parent.parent &&
    isCallToMethod(node.parent.parent, "commit")
  );
}

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforce proper usage of collection method return values",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      useReturnValueId: "Use value returned from R.{{method}}",
      dontUseReturnValueId: "Do not use value returned from R.{{method}}",
    },
  },
  defaultOptions: [],
  create(context) {
    return getRemedaMethodVisitors(
      context,
      (
        node: TSESTree.CallExpression,
        iteratee: TSESTree.Node,
        { method, callType }: { method: string; callType: string },
      ) => {
        if (isCollectionMethod(method) && !parentUsesValue(node)) {
          context.report({
            node,
            messageId: "useReturnValueId",
            data: { method },
          });
        } else if (
          isSideEffectIterationMethod(method) &&
          parentUsesValue(node) &&
          !isParentCommit(node, callType)
        ) {
          context.report({
            node,
            messageId: "dontUseReturnValueId",
            data: { method: getMethodName(node) },
          });
        }
      },
    );
  },
});
