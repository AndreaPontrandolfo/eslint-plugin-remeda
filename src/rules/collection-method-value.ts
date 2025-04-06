/**
 * Rule to enforce usage of collection method values.
 */

import { includes } from "lodash-es";
import {
  AST_NODE_TYPES,
  type TSESLint,
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

const meta = {
  type: "problem" as const,
  schema: [] as const,
  messages: {
    useReturnValueId: "Use value returned from R.{{method}}",
    dontUseReturnValueId: "Do not use value returned from R.{{method}}",
  },
  docs: {
    description: "Use value returned from collection methods properly",
    url: getDocsUrl("collection-method-value"),
  },
} as const;

function parentUsesValue(node: TSESTree.CallExpression) {
  return node.parent.type !== AST_NODE_TYPES.ExpressionStatement;
}

function isSideEffectIterationMethod(method: string) {
  return includes(getSideEffectIterationMethods(), method);
}

function isParentCommit(node: TSESTree.CallExpression, callType: string) {
  return callType === "chained" && isCallToMethod(node.parent.parent, "commit");
}

function create(
  context: TSESLint.RuleContext<
    "useReturnValueId" | "dontUseReturnValueId",
    []
  >,
) {
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
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "collection-method-value";
export default rule;
