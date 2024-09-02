/**
 * @fileoverview Rule to prefer isNil over manual checking for undefined or null.
 */

import type { RemedaMethodVisitors } from "../types";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { isCallToRemedaMethod, getRemedaContext } from "../util/remedaUtil";
import _, { matches, cond, property } from "lodash";

const { isNegationExpression, isEquivalentMemberExp } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-is-nil"),
  },
} as const;

function create(context) {
  const remedaContext = getRemedaContext(context);
  const nilChecks = {
    null: {
      isValue: matches({ type: "Literal", value: null }),
      expressionChecks: [
        getRemedaTypeCheckedBy("isNull"),
        getValueComparedTo("null"),
      ],
    },
    undefined: {
      isValue: matches({ type: "Identifier", name: "undefined" }),
      expressionChecks: [
        getRemedaTypeCheckedBy("isUndefined"),
        getValueComparedTo("undefined"),
        getValueWithTypeofUndefinedComparison,
      ],
    },
  };

  function getRemedaTypeCheckedBy(typecheck) {
    return function (node) {
      return (
        isCallToRemedaMethod(node, typecheck, remedaContext) &&
        node.arguments[0]
      );
    };
  }

  function getValueComparedTo(nil) {
    return function (node, operator) {
      return (
        node.type === "BinaryExpression" &&
        node.operator === operator &&
        ((nilChecks[nil].isValue(node.right) && node.left) ||
          (nilChecks[nil].isValue(node.left) && node.right))
      );
    };
  }

  const getTypeofArgument = cond([
    [
      matches({ type: "UnaryExpression", operator: "typeof" }),
      property("argument"),
    ],
  ]);

  const isUndefinedString = matches({
    type: "Literal",
    value: "undefined",
  });

  function getValueWithTypeofUndefinedComparison(node, operator) {
    return (
      node.type === "BinaryExpression" &&
      node.operator === operator &&
      ((isUndefinedString(node.right) && getTypeofArgument(node.left)) ||
        (isUndefinedString(node.left) && getTypeofArgument(node.right)))
    );
  }

  function checkExpression(nil, operator, node) {
    return _(nilChecks[nil].expressionChecks)
      .map((check) => check(node, operator))
      .find();
  }

  function checkNegatedExpression(nil, node) {
    return (
      (isNegationExpression(node) &&
        checkExpression(nil, "===", node.argument)) ||
      checkExpression(nil, "!==", node)
    );
  }

  function isEquivalentExistingExpression(node, leftNil, rightNil) {
    const leftExp = checkExpression(leftNil, "===", node.left);
    return (
      leftExp &&
      isEquivalentMemberExp(
        leftExp,
        checkExpression(rightNil, "===", node.right),
      )
    );
  }

  function isEquivalentExistingNegation(node, leftNil, rightNil) {
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
  visitors.LogicalExpression = function (node) {
    if (node.operator === "||") {
      if (
        isEquivalentExistingExpression(node, "undefined", "null") ||
        isEquivalentExistingExpression(node, "null", "undefined")
      ) {
        context.report({
          node,
          message: "Prefer isNil over checking for undefined or null.",
        });
      }
    } else if (
      isEquivalentExistingNegation(node, "undefined", "null") ||
      isEquivalentExistingNegation(node, "null", "undefined")
    ) {
      context.report({
        node,
        message: "Prefer isNil over checking for undefined or null.",
      });
    }
  };
  return visitors;
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-is-nil";
export default rule;
