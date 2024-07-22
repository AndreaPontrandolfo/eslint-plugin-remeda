/**
 * @fileoverview Rule to check if a call to R.forEach should be a call to R.filter
 */

import { getDocsUrl } from "../util/getDocsUrl";
import { getRemedaMethodVisitors } from "../util/remedaUtil";
import astUtil from "../util/astUtil";

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

const meta = {
  type: "problem",
  docs: {
    url: getDocsUrl("prefer-filter"),
  },
  schema: [
    {
      type: "integer",
    },
  ],
};
function create(context) {
  const DEFAULT_MAX_PROPERTY_PATH_LENGTH = 3;
  const maxLength =
    parseInt(context.options[0], 10) || DEFAULT_MAX_PROPERTY_PATH_LENGTH;

  function isIfWithoutElse(statement) {
    return (
      statement && statement.type === "IfStatement" && !statement.alternate
    );
  }

  function canBeShorthand(exp, paramName) {
    return (
      isIdentifierWithName(exp, paramName) ||
      isMemberExpOf(exp, paramName, { maxLength }) ||
      isNegationOfMemberOf(exp, paramName, { maxLength }) ||
      isEqEqEqToMemberOf(exp, paramName, { maxLength }) ||
      isNotEqEqToMemberOf(exp, paramName, { maxLength })
    );
  }

  function onlyHasSimplifiableIf(func) {
    const firstLine: any = getFirstFunctionLine(func);
    return (
      func &&
      hasOnlyOneStatement(func) &&
      func.params.length === 1 &&
      isIfWithoutElse(firstLine) &&
      canBeShorthand(firstLine.test, getFirstParamName(func))
    );
  }

  return getRemedaMethodVisitors(context, (node, iteratee, { method }) => {
    if (method === "forEach" && onlyHasSimplifiableIf(iteratee)) {
      context.report({
        node,
        message:
          "Prefer R.filter or R.some over an if statement inside a R.forEach",
      });
    }
  });
}

export { create, meta };
