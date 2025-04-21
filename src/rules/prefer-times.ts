/**
 * Rule to check if a call to map should be a call to times.
 */

import { get } from "remeda";
import { ESLintUtils } from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

export const RULE_NAME = "prefer-times";

type MessageIds = "prefer-times";
type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforce using R.times over R.map without using arguments",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-times": "Prefer R.times over R.map without using arguments",
    },
  },
  defaultOptions: [],
  create(context) {
    return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
      if (method === "map" && get(iteratee, "params.length") === 0) {
        context.report({
          node,
          messageId: "prefer-times",
        });
      }
    });
  },
});
