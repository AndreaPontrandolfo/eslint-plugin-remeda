/**
 * @fileoverview Rule to prefer isNil over manual checking for undefined or null.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const getDocsUrl = require("../util/getDocsUrl");

module.exports = {
  meta: {
    type: "problem",
    schema: [],
    docs: {
      url: getDocsUrl("prefer-is-nil"),
    },
  },

  create(context) {
    const {
      isNegationExpression,
      isEquivalentMemberExp,
    } = require("../util/astUtil");
    const {
      isCallToRemedaMethod,
      getRemedaContext,
    } = require("../util/remedaUtil");
    const _ = require("lodash");
    const remedaContext = getRemedaContext(context);
    const nilChecks = {
      null: {
        isValue: _.matches({ type: "Literal", value: null }),
        expressionChecks: [
          getRemedaTypeCheckedBy("isNull"),
          getValueComparedTo("null"),
        ],
      },
      undefined: {
        isValue: _.matches({ type: "Identifier", name: "undefined" }),
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

    const getTypeofArgument = _.cond([
      [
        _.matches({ type: "UnaryExpression", operator: "typeof" }),
        _.property("argument"),
      ],
    ]);

    const isUndefinedString = _.matches({
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

    const visitors = remedaContext.getImportVisitors();
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
  },
};
