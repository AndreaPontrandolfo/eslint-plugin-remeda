/**
 * Rule to check if a call to R.forEach should be a call to R.filter.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
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

type MessageIds = "prefer-filter";
type Options = [
  {
    maxPropertyPathLength?: number;
  },
];

function isIfWithoutElse(
  statement: TSESTree.IfStatement | null | undefined,
): boolean {
  return Boolean(statement && !statement.alternate);
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
            description: "Maximum length of property paths to check",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ maxPropertyPathLength: 3 }],
    messages: {
      "prefer-filter": MESSAGE,
    },
  },
  defaultOptions: [{ maxPropertyPathLength: 3 }],
  create(context, [options]) {
    const DEFAULT_MAX_PROPERTY_PATH_LENGTH = 3;
    const maxLength =
      options.maxPropertyPathLength ?? DEFAULT_MAX_PROPERTY_PATH_LENGTH;

    function canBeShorthand(exp: TSESTree.Node, paramName: string): boolean {
      return (
        (exp.type === AST_NODE_TYPES.Identifier &&
          isIdentifierWithName(exp, paramName)) ||
        isMemberExpOf(exp, paramName, { maxLength }) ||
        isNegationOfMemberOf(exp, paramName, { maxLength }) ||
        (exp.type === AST_NODE_TYPES.BinaryExpression &&
          isEqEqEqToMemberOf(exp, paramName, { maxLength })) ||
        (exp.type === AST_NODE_TYPES.BinaryExpression &&
          isNotEqEqToMemberOf(exp, paramName, { maxLength }))
      );
    }

    function onlyHasSimplifiableIf(
      func: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): boolean {
      const firstLine = getFirstFunctionLine(func) as
        | TSESTree.IfStatement
        | undefined;
      const paramName = getFirstParamName(func) as string | undefined;
      const hasOneStatement =
        func.type === AST_NODE_TYPES.ArrowFunctionExpression
          ? func.body.type !== AST_NODE_TYPES.BlockStatement
          : hasOnlyOneStatement(func);

      if (!paramName || !firstLine) {
        return false;
      }

      return Boolean(
        hasOneStatement &&
          func.params.length === 1 &&
          isIfWithoutElse(firstLine) &&
          canBeShorthand(firstLine.test, paramName),
      );
    }

    return getRemedaMethodVisitors(
      context,
      (
        node: TSESTree.CallExpression,
        iteratee: TSESTree.Node,
        { method }: { method: string },
      ) => {
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
      },
    );
  },
});
