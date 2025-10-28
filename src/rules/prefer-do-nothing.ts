import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import { getFirstFunctionLine } from "../util/getFirstFunctionLine";

export const RULE_NAME = "prefer-do-nothing";
const MESSAGE =
  "enforce using R.doNothing() or R.constant(undefined) over an empty function";

type MessageIds = "prefer-do-nothing";
type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: MESSAGE,
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-do-nothing": MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    function reportIfEmptyFunction(
      node: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ) {
      if (
        !getFirstFunctionLine(node) &&
        node.parent.type !== AST_NODE_TYPES.MethodDefinition &&
        !node.generator &&
        !node.async
      ) {
        context.report({
          node,
          messageId: "prefer-do-nothing",
        });
      }
    }

    return {
      FunctionExpression: reportIfEmptyFunction,
      ArrowFunctionExpression: reportIfEmptyFunction,
    };
  },
});
