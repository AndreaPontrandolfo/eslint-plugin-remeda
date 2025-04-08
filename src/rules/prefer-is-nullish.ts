/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * Rule to prefer isNullish over manual checking for undefined or null.
 */

import { cond, find, map, matches, property } from "lodash-es";
import type { RemedaMethodVisitors } from "../types";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext, isCallToRemedaMethod } from "../util/remedaUtil";

const { isNegationExpression, isEquivalentMemberExp } = astUtil;

const meta = {
  type: "problem",
  schema: [],
  docs: {
    description: "Prefer R.isNullish over checks for both null and undefined.",
    url: getDocsUrl("prefer-is-nullish"),
  },
} as const;

function create(context) {
  const remedaContext = getRemedaContext(context);

  function getRemedaTypeCheckedBy(typecheck) {
    return function (node) {
      return (
        isCallToRemedaMethod(node, typecheck, remedaContext) &&
        node.arguments[0]
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

  const nilChecksIsValue = {
    null: matches({ type: "Literal", value: null }),
    undefined: matches({ type: "Identifier", name: "undefined" }),
  };

  function getValueComparedTo(nil) {
    return function (node, operator) {
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

  function checkExpression(nil, operator, node) {
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
          message: "Prefer isNullish over checking for undefined or null.",
        });
      }
    } else if (
      isEquivalentExistingNegation(node, "undefined", "null") ||
      isEquivalentExistingNegation(node, "null", "undefined")
    ) {
      context.report({
        node,
        message: "Prefer isNullish over checking for undefined or null.",
      });
    }
  };

  return visitors;
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-is-nullish";
export default rule;
