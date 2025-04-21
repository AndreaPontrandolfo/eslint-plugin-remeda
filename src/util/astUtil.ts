/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  flatMap,
  get,
  includes,
  isEqualWith,
  isMatch,
  matches,
  matchesProperty,
  overEvery,
  overSome,
  property,
} from "lodash-es";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Gets the object that called the method in a CallExpression.
 *
 * @param node - The node to check.
 */
const getCaller = (
  node: TSESTree.Node | null | undefined,
): TSESTree.Node | null | undefined => {
  if (
    !node ||
    node.type !== AST_NODE_TYPES.CallExpression ||
    !node.callee ||
    node.callee.type !== AST_NODE_TYPES.MemberExpression
  ) {
    return null;
  }

  return node.callee.object;
};

/**
 * Gets the name of a method in a CallExpression.
 *
 * @param node - The node to check.
 */
const getMethodName = property("callee.property.name");

/**
 * Returns whether the node is a method call.
 *
 * @param node - The node to check.
 */
const isMethodCall = matches({
  type: "CallExpression",
  callee: { type: "MemberExpression" },
});

const isFunctionExpression = overSome(
  matchesProperty("type", "FunctionExpression"),
  matchesProperty("type", "FunctionDeclaration"),
);
/**
 * Returns whether the node is a function declaration that has a block.
 *
 * @param node - The node to check.
 */
const isFunctionDefinitionWithBlock = overSome(
  isFunctionExpression,
  matches({
    type: "ArrowFunctionExpression",
    body: { type: "BlockStatement" },
  }),
);

/**
 * If the node specified is a function, returns the node corresponding with the first statement/expression in that function.
 *
 * @param node - The node to check.
 */
const getFirstFunctionLine = (
  node:
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | null
    | undefined,
): TSESTree.Node | undefined => {
  if (!node) {
    return undefined;
  }

  if (isFunctionDefinitionWithBlock(node)) {
    if (node.body.type === AST_NODE_TYPES.BlockStatement) {
      return node.body.body[0];
    }

    return undefined;
  }

  if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return node.body;
  }

  return undefined;
};

/**
 * @param node - The node to check.
 */
const isPropAccess = overSome(
  matches({ computed: false }),
  matchesProperty("property.type", "Literal"),
);

interface IsMemberExpOfOptions {
  maxLength?: number;
  allowComputed?: boolean;
}

/**
 * Returns whether the node is a member expression starting with the same object, up to the specified length.
 *
 * @param node - The node to check.
 * @param objectName - The object name to check against.
 */
function isMemberExpOf(
  node: TSESTree.Node | null | undefined,
  objectName: string,
  { maxLength = Number.MAX_VALUE, allowComputed }: IsMemberExpOfOptions = {},
): boolean {
  if (!objectName) {
    return false;
  }

  let currentNode = node;
  let depth = maxLength;

  while (currentNode && depth) {
    if (allowComputed || isPropAccess(currentNode)) {
      if (
        currentNode.type === AST_NODE_TYPES.MemberExpression &&
        currentNode.object.type === AST_NODE_TYPES.Identifier &&
        currentNode.object.name === objectName
      ) {
        return true;
      }
      currentNode =
        currentNode.type === AST_NODE_TYPES.MemberExpression
          ? currentNode.object
          : undefined;
      depth = depth - 1;
    } else {
      return false;
    }
  }

  return false;
}

/**
 * Returns the name of the first parameter of a function, if it exists.
 *
 * @param func - The function to check.
 */
const getFirstParamName = property("params[0].name");

/**
 * Returns whether or not the expression is a return statement.
 *
 * @param exp - The expression to check.
 */
const isReturnStatement = matchesProperty("type", "ReturnStatement");

/**
 * Returns whether the node specified has only one statement.
 *
 * @param func - The function to check.
 */
function hasOnlyOneStatement(func: {
  type: string;
  body: { body?: unknown };
}): boolean {
  if (isFunctionDefinitionWithBlock(func)) {
    const body = get(func, "body.body");

    return Array.isArray(body) && body.length === 1;
  }
  if (func.type === "ArrowFunctionExpression") {
    return !get(func, "body.body");
  }

  return false;
}

/**
 * Returns whether the node is an object of a method call.
 *
 * @param node - The node to check.
 */
function isObjectOfMethodCall(node: TSESTree.Node | null | undefined) {
  return (
    get(node, "parent.object") === node &&
    get(node, "parent.parent.type") === AST_NODE_TYPES.CallExpression
  );
}

/**
 * Returns whether the node is a literal.
 *
 * @param node - The node to check.
 */
function isLiteral(node: TSESTree.Node | null | undefined) {
  return node?.type === AST_NODE_TYPES.Literal;
}

interface IsBinaryExpWithMemberOfOptions {
  maxLength?: number;
  allowComputed?: boolean;
  onlyLiterals?: boolean;
}

/**
 * Returns whether the expression specified is a binary expression with the specified operator and one of its sides is a member expression of the specified object name.
 */
function isBinaryExpWithMemberOf(
  operator: string,
  exp: TSESTree.BinaryExpression,
  objectName: string,
  {
    maxLength,
    allowComputed,
    onlyLiterals,
  }: IsBinaryExpWithMemberOfOptions = {},
) {
  if (!isMatch(exp, { type: "BinaryExpression", operator })) {
    return false;
  }
  const [left, right] = [exp.left, exp.right].map((side) =>
    isMemberExpOf(side, objectName, { maxLength, allowComputed }),
  );

  return (
    left === !right &&
    (!onlyLiterals || isLiteral(exp.left) || isLiteral(exp.right))
  );
}

/**
 * Returns whether the specified expression is a negation.
 *
 * @param exp - The expression to check.
 */
const isNegationExpression = matches({
  type: "UnaryExpression",
  operator: "!",
});

interface IsNegationOfMemberOfOptions {
  maxLength?: number;
}

/**
 * Returns whether the expression is a negation of a member of objectName, in the specified depth.
 */
function isNegationOfMemberOf(
  exp: TSESTree.Node | null | undefined,
  objectName: string,
  { maxLength }: IsNegationOfMemberOfOptions = {},
) {
  if (
    !exp ||
    exp.type !== AST_NODE_TYPES.UnaryExpression ||
    exp.operator !== "!"
  ) {
    return false;
  }

  return isMemberExpOf(exp.argument, objectName, {
    maxLength,
    allowComputed: false,
  });
}

/**
 * Checks if the given expression is an identifier with the specified name.
 *
 * @param expression - The expression to check.
 * @param paramName - The name to check against.
 */
function isIdentifierWithName(
  expression: { type: string; name: string },
  paramName: string,
) {
  return (
    expression &&
    paramName &&
    expression.type === "Identifier" &&
    expression.name === paramName
  );
}

/**
 * Returns the node of the value returned in the first line, if any.
 *
 * @param func - The function to check.
 */
function getValueReturnedInFirstStatement(
  func:
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | null
    | undefined,
): TSESTree.Node | undefined {
  const firstLine = getFirstFunctionLine(func);

  if (!func) {
    return undefined;
  }

  if (isFunctionDefinitionWithBlock(func)) {
    if (
      firstLine &&
      isReturnStatement(firstLine) &&
      firstLine.type === AST_NODE_TYPES.ReturnStatement
    ) {
      return firstLine.argument ?? undefined;
    }

    return undefined;
  }

  if (func.type === AST_NODE_TYPES.ArrowFunctionExpression) {
    return firstLine;
  }

  return undefined;
}

/**
 * Returns whether the node is a call from the specified object name.
 *
 * @param node - The node to check.
 * @param objName   - The object name to check against.
 */
function isCallFromObject(
  node: TSESTree.Node | null | undefined,
  objName: string,
) {
  return (
    node &&
    objName &&
    node.type === AST_NODE_TYPES.CallExpression &&
    get(node, "callee.object.name") === objName
  );
}

/**
 * Returns whether the node is actually computed (x['ab'] does not count, x['a' + 'b'] does.
 *
 * @param node - The node to check.
 */
function isComputed(node: TSESTree.MemberExpression): boolean {
  return get(node, "computed") && node.property.type !== AST_NODE_TYPES.Literal;
}

/**
 * Returns whether the two expressions refer to the same object (e.g. A['b'].c and a.b.c).
 *
 * @param a - The first expression to check.
 * @param b - The second expression to check.
 */
function isEquivalentMemberExp(
  a: TSESTree.MemberExpression,
  b: TSESTree.MemberExpression,
) {
  return isEqualWith(
    a,
    b,
    (
      left: TSESTree.Node | undefined,
      right: TSESTree.Node | undefined,
      key: PropertyKey | undefined,
    ) => {
      if (!left || !right || !key) {
        return undefined;
      }
      if (
        includes(["loc", "range", "computed", "start", "end", "parent"], key)
      ) {
        return true;
      }
      if (
        isComputed(left as TSESTree.MemberExpression) ||
        isComputed(right as TSESTree.MemberExpression)
      ) {
        return false;
      }
      if (key === "property") {
        if (
          left.type === AST_NODE_TYPES.Identifier &&
          right.type === AST_NODE_TYPES.Identifier
        ) {
          return left.name === right.name;
        }
        if (
          left.type === AST_NODE_TYPES.Literal &&
          right.type === AST_NODE_TYPES.Literal
        ) {
          return left.value === right.value;
        }

        return false;
      }

      return undefined;
    },
  );
}

/**
 * Returns whether the expression is a strict equality comparison, ===.
 *
 * @param node - The node to check.
 */
const isEqEqEq = matches({ type: "BinaryExpression", operator: "===" });

const isMinus = (node: TSESTree.Node | null | undefined) => {
  return node?.type === AST_NODE_TYPES.UnaryExpression && node.operator === "-";
};

/**
 * Enum for type of comparison to int literal.
 */
const comparisonType = {
  exact: 0,
  over: 1,
  under: 2,
  any: 3,
};
const comparisonOperators = ["==", "!=", "===", "!=="];

function getIsValue(value: number) {
  return value < 0
    ? overEvery(isMinus, matches({ argument: { value: -value } }))
    : matches({ value });
}

/**
 * Returns the expression compared to the value in a binary expression, or undefined if there isn't one.
 *
 * @param node - The node to check.
 * @param value - The value to compare to.
 * @param checkOver - Whether to check for over/under.
 */
function getExpressionComparedToInt(
  node: TSESTree.BinaryExpression,
  value: number,
  checkOver: boolean,
): TSESTree.Node | undefined {
  const isValue = getIsValue(value);

  if (includes(comparisonOperators, node.operator)) {
    if (isValue(node.right)) {
      return node.left;
    }
    if (isValue(node.left)) {
      return node.right;
    }
  }
  if (checkOver) {
    if (node.operator === ">" && isValue(node.right)) {
      return node.left;
    }
    if (node.operator === "<" && isValue(node.left)) {
      return node.right;
    }
    const isNext = getIsValue(value + 1);

    if (
      (node.operator === ">=" || node.operator === "<") &&
      isNext(node.right)
    ) {
      return node.left;
    }
    if (
      (node.operator === "<=" || node.operator === ">") &&
      isNext(node.left)
    ) {
      return node.right;
    }
  }
}

/**
 * Returns whether the node is a call to indexOf.
 *
 * @param node - The node to check.
 */
const isIndexOfCall = (node: TSESTree.Node | null | undefined) => {
  return isMethodCall(node) && getMethodName(node) === "indexOf";
};

/**
 * Returns whether the node is a call to findIndex.
 *
 * @param node - The node to check.
 */
const isFindIndexCall = (node: TSESTree.Node | null | undefined) => {
  return isMethodCall(node) && getMethodName(node) === "findIndex";
};

/**
 * Returns an array of identifier names returned in a parameter or variable definition.
 *
 * @param node - An AST node which is a parameter or variable declaration.
 * @returns List of names defined in the parameter.
 */
function collectParameterValues(
  node: TSESTree.Node | null | undefined,
): string[] {
  switch (node?.type) {
    case AST_NODE_TYPES.Identifier: {
      return [node.name];
    }
    case AST_NODE_TYPES.ObjectPattern: {
      return flatMap(node.properties, (prop) =>
        collectParameterValues(prop.value),
      );
    }
    case AST_NODE_TYPES.ArrayPattern: {
      return flatMap(node.elements, collectParameterValues);
    }
    default: {
      return [];
    }
  }
}

export default {
  getCaller,
  getMethodName,
  isMethodCall,
  getFirstFunctionLine,
  isMemberExpOf,
  getFirstParamName,
  hasOnlyOneStatement,
  isObjectOfMethodCall,
  isEqEqEqToMemberOf: isBinaryExpWithMemberOf.bind(null, "==="),
  isNotEqEqToMemberOf: isBinaryExpWithMemberOf.bind(null, "!=="),
  isNegationOfMemberOf,
  isIdentifierWithName,
  isNegationExpression,
  getValueReturnedInFirstStatement,
  isCallFromObject,
  isComputed,
  isEquivalentMemberExp,
  isEqEqEq,
  comparisonType,
  getExpressionComparedToInt,
  isIndexOfCall,
  isFindIndexCall,
  isFunctionExpression,
  isFunctionDefinitionWithBlock,
  collectParameterValues,
};
