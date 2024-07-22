import { getDocsUrl } from "../util/getDocsUrl";
import {
  getRemedaMethodCallExpVisitor,
  getRemedaContext,
} from "../util/remedaUtil";
import { isCollectionMethod } from "../util/methodDataUtil";
import astUtil from "../util/astUtil";
import assign from "lodash/assign";

/**
 * @fileoverview Rule to check that iteratees for all collection functions except forEach return a value;
 */

interface FuncInfo {
  upper: FuncInfo;
  codePath: any;
  hasReturn: boolean;
}

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("collection-return"),
  },
};
function create(context) {
  const funcInfos = new Map();
  let currFuncInfo: FuncInfo;
  const remedaContext = getRemedaContext(context);
  return assign(
    {
      "CallExpression:exit": getRemedaMethodCallExpVisitor(
        remedaContext,
        (node, iteratee, { method }) => {
          if (isCollectionMethod(method) && funcInfos.has(iteratee)) {
            const { hasReturn } = funcInfos.get(iteratee);
            if (
              astUtil.isFunctionDefinitionWithBlock(iteratee) &&
              !hasReturn &&
              !iteratee.async &&
              !iteratee.generator
            ) {
              context.report({
                node,
                message: `Do not use R.${method} without returning a value`,
              });
            }
          }
        },
      ),
      ReturnStatement() {
        currFuncInfo.hasReturn = true;
      },
      onCodePathStart(codePath, node) {
        currFuncInfo = {
          upper: currFuncInfo,
          codePath,
          hasReturn: false,
        };
        funcInfos.set(node, currFuncInfo);
      },
      onCodePathEnd() {
        currFuncInfo = currFuncInfo.upper;
      },
    },
    remedaContext.getImportVisitors(),
  );
}

export { create, meta };
