/**
 * @fileoverview Rule to check if a call to map should be a call to times
 */

import { get } from "lodash-es";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-times"),
  },
} as const;

function create(context) {
  return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
    if (method === "map" && get(iteratee, "params.length") === 0) {
      context.report({
        node,
        message: "Prefer R.times over R.map without using arguments",
      });
    }
  });
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-times";
export default rule;
