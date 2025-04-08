/**
 * Rule to prefer isEmpty over manually checking for length value.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import type { RemedaMethodVisitors } from "../types";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext } from "../util/remedaUtil";

const MESSAGE_ID = "preferIsEmpty";

type MessageIds = typeof MESSAGE_ID;
type Options = [];

const createRule = ESLintUtils.RuleCreator(getDocsUrl);

const rule = createRule<Options, MessageIds>({
  name: "prefer-is-empty",
  meta: {
    type: "problem",
    docs: {
      description: "enforce isEmpty over manually checking for length value.",
      url: getDocsUrl("prefer-is-empty"),
    },
    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_ID]: "Prefer isEmpty over manually checking for length value.",
    },
  },
  defaultOptions: [],
  create(context) {
    const remedaContext = getRemedaContext(context);
    const { sourceCode } = context;

    function getTextOfNode(node: TSESTree.Expression): string {
      if (node.type === AST_NODE_TYPES.Identifier) {
        return node.name;
      }

      return sourceCode.getText(node);
    }

    const visitors: RemedaMethodVisitors = remedaContext.getImportVisitors();

    visitors.BinaryExpression = function (node: TSESTree.BinaryExpression) {
      const { left, right, operator } = node;

      // Check for === 0
      if (
        operator === "===" &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === 0
      ) {
        let subjectObject: TSESTree.Expression | null = null;

        if (
          left.type === AST_NODE_TYPES.MemberExpression &&
          left.property.type === AST_NODE_TYPES.Identifier &&
          left.property.name === "length"
        ) {
          subjectObject = left.object;
        } else if (
          left.type === AST_NODE_TYPES.ChainExpression &&
          left.expression.type === AST_NODE_TYPES.MemberExpression &&
          left.expression.property.type === AST_NODE_TYPES.Identifier &&
          left.expression.property.name === "length"
        ) {
          subjectObject = left.expression.object;
        }

        if (subjectObject) {
          context.report({
            node,
            messageId: MESSAGE_ID,
            fix(fixer) {
              const subjectText = getTextOfNode(subjectObject);

              // Assuming R is imported or available globally/via context
              return fixer.replaceText(node, `isEmpty(${subjectText})`);
            },
          });
        }
      }

      // Check for > 0
      if (
        operator === ">" &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === 0
      ) {
        let subjectObject: TSESTree.Expression | null = null;

        if (
          left.type === AST_NODE_TYPES.MemberExpression &&
          left.property.type === AST_NODE_TYPES.Identifier &&
          left.property.name === "length"
        ) {
          subjectObject = left.object;
        } else if (
          left.type === AST_NODE_TYPES.ChainExpression &&
          left.expression.type === AST_NODE_TYPES.MemberExpression &&
          left.expression.property.type === AST_NODE_TYPES.Identifier &&
          left.expression.property.name === "length"
        ) {
          subjectObject = left.expression.object;
        }

        if (subjectObject) {
          context.report({
            node,
            messageId: MESSAGE_ID,
            fix(fixer) {
              const subjectText = getTextOfNode(subjectObject);

              // Assuming R is imported or available globally/via context
              return fixer.replaceText(node, `!isEmpty(${subjectText})`);
            },
          });
        }
      }
    };

    return visitors;
  },
});

export const RULE_NAME = "prefer-is-empty";
export default rule;
