/**
 * @fileoverview Rule to prefer nullish coalescing over checking a ternary with !isNullish.
 */

import type { RemedaMethodVisitors } from "../types";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaContext } from "../util/remedaUtil";

const meta = {
  type: "problem",
  schema: [],
  docs: {
    url: getDocsUrl("prefer-nullish-coalescing"),
  },
  fixable: "code",
} as const;

function create(context) {
  const remedaContext = getRemedaContext(context);

  function getTextOfNode(node) {
    if (node) {
      if (node.type === "Identifier") {
        return node.name;
      }

      return context.getSourceCode().getText(node);
    }
  }

  const visitors: RemedaMethodVisitors = remedaContext.getImportVisitors();

  visitors.ConditionalExpression = function (node) {
    const statement = node.test;

    if (statement.operator === "!") {
      if (
        statement.argument &&
        statement.argument.callee &&
        statement.argument.callee.name &&
        statement.argument.callee.name === "isNullish"
      ) {
        const argument = getTextOfNode(statement.argument.arguments[0]);
        const consequent = getTextOfNode(node.consequent);
        const alternate = getTextOfNode(node.alternate);

        if (argument === consequent) {
          context.report({
            node,
            message:
              "Prefer nullish coalescing over checking a ternary with !isNullish.",
            fix(fixer) {
              return fixer.replaceText(node, `${argument} ?? ${alternate}`);
            },
          });
        }
      }
    }
  };

  return visitors;
}

const rule = {
  create,
  meta,
};

export const RULE_NAME = "prefer-nullish-coalescing";
export default rule;
