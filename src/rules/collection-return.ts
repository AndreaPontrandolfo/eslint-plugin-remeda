/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { assign } from "lodash-es";
import type { TSESTree } from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { isCollectionMethod } from "../util/methodDataUtil";
import {
  getRemedaContext,
  getRemedaMethodCallExpVisitor,
} from "../util/remedaUtil";

interface FunctionAnalysis {
  parentFunction: FunctionAnalysis;
  codePath: Record<string, unknown>;
  hasReturnStatement: boolean;
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
  const functionAnalyses = new Map();
  let currentFunctionAnalysis: FunctionAnalysis;
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
          if (!isCollectionMethod(method) || !functionAnalyses.has(iteratee)) {
            return;
          }

          const { hasReturnStatement } = functionAnalyses.get(iteratee);

          if (
            !astUtil.isFunctionDefinitionWithBlock(iteratee) ||
            hasReturnStatement ||
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
        currentFunctionAnalysis.hasReturnStatement = true;
      },
      onCodePathStart(codePath, node) {
        currentFunctionAnalysis = {
          parentFunction: currentFunctionAnalysis,
          codePath,
          hasReturnStatement: false,
        };
        functionAnalyses.set(node, currentFunctionAnalysis);
      },
      onCodePathEnd() {
        currentFunctionAnalysis = currentFunctionAnalysis.parentFunction;
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
