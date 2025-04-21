/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * Rule to prefer isNullish over manual checking for undefined or null.
 */

import { find, map } from "remeda";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import type { RemedaMethodVisitors } from "../types";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext, isCallToRemedaMethod } from "../util/remedaUtil";

type ValueOf<T> = T[keyof T];

type nil = "undefined" | "null";

const { isNegationExpression, isEquivalentMemberExp } = astUtil;

export const RULE_NAME = "prefer-is-nullish";
const PREFER_IS_NULLISH_MESSAGE =
  "Prefer isNullish over checking for undefined or null.";

type MessageIds = "prefer-is-nullish";
type Options = [];

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce R.isNullish over checks for both null and undefined.",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-is-nullish": PREFER_IS_NULLISH_MESSAGE,
    },
  },
  defaultOptions: [],
  create(context) {
    const remedaContext = getRemedaContext(context);

    function getRemedaTypeCheckedBy(typecheck) {
      return function (node: TSESTree.Node) {
        return (
          isCallToRemedaMethod(node, typecheck, remedaContext) &&
          node.arguments[0]
        );
      };
    }

    const getTypeofArgument = (node: TSESTree.Node) => {
      if (
        node.type === AST_NODE_TYPES.UnaryExpression &&
        node.operator === "typeof"
      ) {
        return node.argument;
      }

      return undefined;
    };

    const isUndefinedString = (node: TSESTree.Node) => {
      return node.type === "Literal" && node.value === "undefined";
    };

    function getValueWithTypeofUndefinedComparison(
      node: TSESTree.Node,
      operator: "===" | "!==",
    ) {
      return (
        node.type === "BinaryExpression" &&
        node.operator === operator &&
        ((isUndefinedString(node.right) && getTypeofArgument(node.left)) ||
          (isUndefinedString(node.left) && getTypeofArgument(node.right)))
      );
    }

    const nilChecksIsValue = {
      null: (node: TSESTree.Node) =>
        node.type === AST_NODE_TYPES.Literal && node.value === null,
      undefined: (node: TSESTree.Node) => {
        return (
          node.type === AST_NODE_TYPES.Identifier && node.name === "undefined"
        );
      },
    };

    function getValueComparedTo(nil: nil) {
      return function (node: TSESTree.Node, operator: "===" | "!==") {
        return (
          node.type === "BinaryExpression" &&
          node.operator === operator &&
          ((nilChecksIsValue[nil](node.right) && node.left) ||
            (nilChecksIsValue[nil](node.left) && node.right))
        );
      };
    }

    const nilChecksExpressionChecks = {
      null: [getRemedaTypeCheckedBy("isNull"), getValueComparedTo("null")],
      undefined: [
        getRemedaTypeCheckedBy("isUndefined"),
        getValueComparedTo("undefined"),
        getValueWithTypeofUndefinedComparison,
      ],
    };

    function checkExpression(
      nil: nil,
      operator: "===" | "!==",
      node: TSESTree.Node,
    ): TSESTree.MemberExpression {
      const mappedValues = map(nilChecksExpressionChecks[nil], (check) =>
        check(node, operator),
      );

      return find(mappedValues);
    }

    function checkNegatedExpression(nil, node) {
      return (
        (isNegationExpression(node) &&
          checkExpression(nil, "===", node.argument)) ||
        checkExpression(nil, "!==", node)
      );
    }

    function isEquivalentExistingExpression(node, leftNil: nil, rightNil: nil) {
      const leftExp = checkExpression(leftNil, "===", node.left);

      return (
        leftExp &&
        isEquivalentMemberExp(
          leftExp,
          checkExpression(rightNil, "===", node.right),
        )
      );
    }

    function isEquivalentExistingNegation(
      node: TSESTree.LogicalExpression,
      leftNil: nil,
      rightNil: nil,
    ) {
      const leftExp = checkNegatedExpression(leftNil, node.left);

      return (
        leftExp &&
        isEquivalentMemberExp(
          leftExp,
          checkNegatedExpression(rightNil, node.right),
        )
      );
    }

    const visitors: RemedaMethodVisitors = remedaContext.getImportVisitors();

    visitors.LogicalExpression = function (node: TSESTree.LogicalExpression) {
      if (node.operator === "||") {
        if (
          isEquivalentExistingExpression(node, "undefined", "null") ||
          isEquivalentExistingExpression(node, "null", "undefined")
        ) {
          context.report({
            node,
            messageId: "prefer-is-nullish",
          });
        }
      } else if (
        isEquivalentExistingNegation(node, "undefined", "null") ||
        isEquivalentExistingNegation(node, "null", "undefined")
      ) {
        context.report({
          node,
          messageId: "prefer-is-nullish",
        });
      }
    };

    return visitors;
  },
});
