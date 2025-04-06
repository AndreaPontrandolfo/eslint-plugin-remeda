/**
 * Rule to check if a call to R.forEach should be a call to R.filter.
 */

import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";
import astUtil from "../util/astUtil";
import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";

const {
  isIdentifierWithName,
  isMemberExpOf,
  isNegationOfMemberOf,
  isEqEqEqToMemberOf,
  isNotEqEqToMemberOf,
  getFirstFunctionLine,
  hasOnlyOneStatement,
  getFirstParamName,
} = astUtil;

export const RULE_NAME = "prefer-filter";
const MESSAGE =
  "Prefer R.filter or R.some over an if statement inside a R.forEach";

export type MessageIds = "prefer-filter";
export type Options = [
  {
    maxPropertyPathLength?: number;
  },
];

function isIfWithoutElse(
  statement: { type?: string; alternate?: unknown } | null | undefined,
): boolean {
  return Boolean(
    statement && statement.type === "IfStatement" && !statement.alternate,
  );
}

export default ESLintUtils.RuleCreator(getDocsUrl)<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "enforce using R.filter or R.some over an if statement inside a R.forEach",
      url: getDocsUrl(RULE_NAME),
    },
    schema: [
      {
        type: "object",
        properties: {
          maxPropertyPathLength: {
            type: "integer",
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      "prefer-filter": MESSAGE,
    },
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const DEFAULT_MAX_PROPERTY_PATH_LENGTH = 3;
    const maxLength =
      options.maxPropertyPathLength ?? DEFAULT_MAX_PROPERTY_PATH_LENGTH;

    function canBeShorthand(exp: TSESTree.Node, paramName: string): boolean {
      return (
        isIdentifierWithName(exp, paramName) ||
        isMemberExpOf(exp, paramName, { maxLength }) ||
        isNegationOfMemberOf(exp, paramName, { maxLength }) ||
        isEqEqEqToMemberOf(exp, paramName, { maxLength }) ||
        isNotEqEqToMemberOf(exp, paramName, { maxLength })
      );
    }

    function onlyHasSimplifiableIf(
      func: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): boolean {
      const firstLine = getFirstFunctionLine(func) as
        | TSESTree.IfStatement
        | undefined;
      const paramName = getFirstParamName(func) as string | undefined;
      const hasOneStatement = hasOnlyOneStatement(func);

      if (!paramName || !firstLine || hasOneStatement === undefined) {
        return false;
      }

      return Boolean(
        hasOneStatement &&
          func.params.length === 1 &&
          isIfWithoutElse(firstLine) &&
          canBeShorthand(firstLine.test, paramName),
      );
    }

    return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
      if (
        method === "forEach" &&
        onlyHasSimplifiableIf(
          iteratee as
            | TSESTree.FunctionExpression
            | TSESTree.ArrowFunctionExpression,
        )
      ) {
        context.report({
          node,
          messageId: "prefer-filter",
        });
      }
    });
  },
});
