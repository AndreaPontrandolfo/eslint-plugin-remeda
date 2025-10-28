/**
 * Rule to check if a call to R.forEach should be a call to R.map.
 */

import { get, includes } from "lodash-es";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { collectParameterValues } from "../util/collectParameterValues";
import { getDocsUrl } from "../util/getDocsUrl";
import { getFirstFunctionLine } from "../util/getFirstFunctionLine";
import { getMethodName } from "../util/getMethodName";
import { hasOnlyOneStatement } from "../util/hasOnlyOneStatement";
import { isFunctionDefinitionWithBlock } from "../util/isFunctionDefinitionWithBlock";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

export const RULE_NAME = "prefer-map";
type MessageIds = "prefer-map";
type Options = [];

function onlyHasPush(
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
    | null
    | undefined,
) {
  const firstLine = getFirstFunctionLine(node);
  const firstParam = get(node, "params[0]");
  const exp =
    node && !isFunctionDefinitionWithBlock(node)
      ? firstLine
      : //@ts-expect-error
        firstLine?.expression;

  return (
    node &&
    (node.type === AST_NODE_TYPES.ArrowFunctionExpression
      ? true
      : hasOnlyOneStatement(node)) &&
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
    return getRemedaMethodVisitors(
      context,
      (
        node: TSESTree.Node,
        iteratee: TSESTree.Node,
        { method }: { method: string },
      ) => {
        if (
          method === "forEach" &&
          onlyHasPush(
            iteratee as
              | TSESTree.ArrowFunctionExpression
              | TSESTree.FunctionDeclaration
              | TSESTree.FunctionExpression,
          )
        ) {
          context.report({
            node,
            messageId: "prefer-map",
          });
        }
      },
    );
  },
});
