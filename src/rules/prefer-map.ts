/**
 * Rule to check if a call to R.forEach should be a call to R.map.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { collectParameterValues } from "../util/collectParameterValues";
import { getDocsUrl } from "../util/getDocsUrl";
import { getFirstFunctionLine } from "../util/getFirstFunctionLine";
import { hasOnlyOneStatement } from "../util/hasOnlyOneStatement";
import { isFunctionDefinition } from "../util/isFunctionDefinition";
import { isFunctionDefinitionWithBlock } from "../util/isFunctionDefinitionWithBlock";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

export const RULE_NAME = "prefer-map";
type MessageIds = "prefer-map";
type Options = [];

const onlyHasPush = (node: TSESTree.Node) => {
  if (!isFunctionDefinition(node)) {
    return false;
  }

  if (
    node.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
    !hasOnlyOneStatement(node)
  ) {
    return false;
  }

  const firstLine = getFirstFunctionLine(node);
  // eslint-disable-next-line no-nested-ternary
  const exp = isFunctionDefinitionWithBlock(node) ? firstLine?.type === AST_NODE_TYPES.ExpressionStatement
        ? firstLine.expression
        : undefined : firstLine;

  if (
    exp?.type !== AST_NODE_TYPES.CallExpression ||
    exp.callee.type !== AST_NODE_TYPES.MemberExpression ||
    exp.callee.property.type !== AST_NODE_TYPES.Identifier ||
    exp.callee.property.name !== "push"
  ) {
    return false;
  }
  
  if (exp.callee.object.type !== AST_NODE_TYPES.Identifier) {
    return true;
  }

  return !collectParameterValues(node.params[0]).includes(
    exp.callee.object.name,
  );
};

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce using R.map over a R.forEach with a push to an array inside",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [],
    messages: {
      "prefer-map":
        "Prefer R.map over a R.forEach with a push to an array inside",
    },
  },
  defaultOptions: [],
  create(context) {
    return getRemedaMethodVisitors(
      context,
      (
        node: TSESTree.Node,
        iteratee: TSESTree.Node,
        { method }: { method: string },
      ) => {
        if (method === "forEach" && onlyHasPush(iteratee)) {
          context.report({
            node,
            messageId: "prefer-map",
          });
        }
      },
    );
  },
});
