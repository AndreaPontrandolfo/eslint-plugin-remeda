import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { isCollectionMethod } from "../util/methodDataUtil";
import {
  getRemedaContext,
  getRemedaMethodCallExpVisitor,
} from "../util/remedaUtil";

export const RULE_NAME = "collection-return";
const NO_RETURN_MESSAGE = "Do not use R.{{method}} without returning a value";

type MessageIds = "no-return";
type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce returning a value in iteratees of Remeda collection methods that aren't `forEach`",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "no-return": NO_RETURN_MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    const remedaContext = getRemedaContext(context);

    return {
      "CallExpression:exit": getRemedaMethodCallExpVisitor(
        remedaContext,
        // @ts-expect-error
        (
          node,
          iteratee:
            | TSESTree.FunctionExpression
            | TSESTree.ArrowFunctionExpression
            | TSESTree.FunctionDeclaration,
          { method },
        ) => {
          if (!isCollectionMethod(method)) {
            return;
          }

          if (
            !astUtil.isFunctionDefinitionWithBlock(iteratee) ||
            iteratee.async ||
            iteratee.generator
          ) {
            return;
          }

          // Check if the function has a return statement
          const hasReturnStatement =
            iteratee.body.type === AST_NODE_TYPES.BlockStatement &&
            iteratee.body.body.some(
              (statement): statement is TSESTree.ReturnStatement => {
                return statement.type === AST_NODE_TYPES.ReturnStatement;
              },
            );

          if (!hasReturnStatement) {
            context.report({
              node,
              messageId: "no-return",
              data: { method },
            });
          }
        },
      ),
      ...remedaContext.getImportVisitors(),
    };
  },
});
