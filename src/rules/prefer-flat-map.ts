/**
 * @fileoverview Rule to check if a call to map and flatten should be a call to R.flatMap
 */

import { getDocsUrl } from "../util/getDocsUrl";
import {
  getRemedaMethodVisitors,
  isCallToMethod,
  isCallToRemedaMethod,
} from "../util/remedaUtil";
import astUtil from "../util/astUtil";

const { getCaller } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-flat-map"),
  },
} as const;

function create(context) {
  function isChainedMapFlatten(node) {
    return isCallToMethod(getCaller(node), "map");
  }

  return getRemedaMethodVisitors(
    context,
    (node, iteratee, { method, remedaContext }) => {
      if (
        method === "flat" &&
        (isChainedMapFlatten(node) ||
          isCallToRemedaMethod(node.arguments[0], "map", remedaContext))
      ) {
        context.report({
          node,
          message: "Prefer R.flatMap over consecutive R.map and R.flat.",
        });
      }
    },
  );
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-flat-map";
export default rule;
