/**
 * @fileoverview Rule to check if a call to map should be a call to times
 */

import { get } from "lodash";
import getDocsUrl from "../util/getDocsUrl";
import remedaUtil from "../util/remedaUtil";

const { getRemedaMethodVisitors } = remedaUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-times"),
  },
};
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

export default {
  create,
  meta,
};
