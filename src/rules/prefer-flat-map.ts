/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * Rule to check if a call to map and flatten should be a call to R.flatMap.
 */

import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";
import { getCaller } from "../util/getCaller";
import { getDocsUrl } from "../util/getDocsUrl";
import {
  getRemedaMethodVisitors,
  isCallToMethod,
  isCallToRemedaMethod,
} from "../util/remedaUtil";

export const RULE_NAME = "prefer-flat-map";

type MessageIds = "prefer-flat-map";
type Options = [];

function isChainedMapFlatten(node: TSESTree.Node): boolean {
  const caller = getCaller(node);

  return caller ? isCallToMethod(caller, "map") : false;
}

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforce using R.flatMap over consecutive R.map and R.flat",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-flat-map": "Prefer R.flatMap over consecutive R.map and R.flat.",
    },
  },
  defaultOptions: [],
  create(context) {
    return getRemedaMethodVisitors(
      context,
      // @ts-expect-error
      (node, iteratee, { method, remedaContext }) => {
        if (
          method === "flat" &&
          (isChainedMapFlatten(node) ||
            isCallToRemedaMethod(node.arguments[0], "map", remedaContext))
        ) {
          context.report({
            node,
            messageId: "prefer-flat-map",
          });
        }
      },
    );
  },
});
