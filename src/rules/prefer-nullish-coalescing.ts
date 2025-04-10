/**
 * Rule to prefer nullish coalescing over checking a ternary with !isNullish.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext } from "../util/remedaUtil";

export const RULE_NAME = "prefer-nullish-coalescing";
const MESSAGE =
  "Prefer nullish coalescing over checking a ternary with !isNullish.";

type MessageIds = "prefer-nullish-coalescing";
type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce using nullish coalescing over checking a ternary with !isNullish",
      url: getDocsUrl(RULE_NAME),
    },
    fixable: "code",
    schema: [],
    messages: {
      "prefer-nullish-coalescing": MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    function getTextOfNode(
      node: TSESTree.Node | null | undefined,
    ): string | undefined {
      if (!node) {
        return undefined;
      }

      if (node.type === AST_NODE_TYPES.Identifier) {
        return node.name;
      }

      return context.sourceCode.getText(node);
    }

    const remedaContext = getRemedaContext(context);

    const visitors = remedaContext.getImportVisitors();

    // @ts-expect-error
    visitors.ConditionalExpression = function (
      node: TSESTree.ConditionalExpression,
    ) {
      const statement = node.test;

      if (
        statement.type === AST_NODE_TYPES.UnaryExpression &&
        statement.operator === "!" &&
        statement.argument.type === AST_NODE_TYPES.CallExpression &&
        statement.argument.callee.type === AST_NODE_TYPES.Identifier &&
        statement.argument.callee.name === "isNullish"
      ) {
        const argument = getTextOfNode(statement.argument.arguments[0]);
        const consequent = getTextOfNode(node.consequent);
        const alternate = getTextOfNode(node.alternate);

        if (argument && consequent && alternate && argument === consequent) {
          context.report({
            node,
            messageId: "prefer-nullish-coalescing",
            fix(fixer) {
              return fixer.replaceText(node, `${argument} ?? ${alternate}`);
            },
          });
        }
      }
    };

    return visitors;
  },
});
