/**
 * Rule to check if a findIndex comparison should be a call to R.some.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import { getExpressionComparedToInt } from "../util/getExpressionComparedToInt";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

export const RULE_NAME = "prefer-some";
const MESSAGE = "Prefer R.some over findIndex comparison to -1";

type MessageIds = "prefer-some";
type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforce using R.some over findIndex comparison to -1",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-some": MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    const visitors = getRemedaMethodVisitors(
      context,
      (
        node: TSESTree.Node,
        iteratee: TSESTree.Node,
        { method }: { method: string },
      ) => {
        if (
          method === "findIndex" &&
          node.parent?.type === AST_NODE_TYPES.BinaryExpression &&
          node === getExpressionComparedToInt(node.parent, -1, true)
        ) {
          context.report({
            node,
            messageId: "prefer-some",
          });
        }
      },
    );

    return visitors;
  },
});
