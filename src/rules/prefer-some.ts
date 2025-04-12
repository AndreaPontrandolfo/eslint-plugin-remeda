/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * Rule to check if a findIndex comparison should be a call to R.some.
 */

import { ESLintUtils } from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

const { getExpressionComparedToInt } = astUtil;

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
      (node, iteratee, { method }) => {
        if (
          method === "findIndex" &&
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
