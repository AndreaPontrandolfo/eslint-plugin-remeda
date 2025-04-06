import { assign } from "lodash-es";
import type { TSESTree } from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { isCollectionMethod } from "../util/methodDataUtil";
import {
  getRemedaContext,
  getRemedaMethodCallExpVisitor,
} from "../util/remedaUtil";

interface FuncInfo {
  upper: FuncInfo;
  codePath: Record<string, unknown>;
  hasReturn: boolean;
}

const meta = {
  type: "problem",
  schema: [],
  docs: {
    description:
      "Always return a value in iteratees of Remeda collection methods that aren't `forEach`",
    url: getDocsUrl("collection-return"),
  },
} as const;

/**
 * Rule to check that iteratees for all collection functions except forEach return a value;.
 */
function create(context) {
  const funcInfos = new Map();
  let currFuncInfo: FuncInfo;
  const remedaContext = getRemedaContext(context);

  return assign(
    {
      "CallExpression:exit": getRemedaMethodCallExpVisitor(
        remedaContext,
        (
          node,
          iteratee:
            | TSESTree.FunctionExpression
            | TSESTree.ArrowFunctionExpression
            | TSESTree.FunctionDeclaration,
          { method },
        ) => {
          if (!isCollectionMethod(method) || !funcInfos.has(iteratee)) {
            return;
          }

          const { hasReturn } = funcInfos.get(iteratee);

          if (
            !astUtil.isFunctionDefinitionWithBlock(iteratee) ||
            hasReturn ||
            iteratee.async ||
            iteratee.generator
          ) {
            return;
          }

          context.report({
            node,
            message: `Do not use R.${method} without returning a value`,
          });
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

const rule = {
  create,
  meta,
};

export const RULE_NAME = "collection-return";
export default rule;
