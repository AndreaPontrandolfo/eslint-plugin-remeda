/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import getCaller from "./getCaller";
import getMethodName from "./getMethodName";
import isMethodCall from "./isMethodCall";
import getFirstFunctionLine from "./getFirstFunctionLine";
import isMemberExpOf from "./isMemberExpOf";
import getFirstParamName from "./getFirstParamName";
import hasOnlyOneStatement from "./hasOnlyOneStatement";
import isObjectOfMethodCall from "./isObjectOfMethodCall";
import isBinaryExpWithMemberOf from "./isBinaryExpWithMemberOf";
import isNegationOfMemberOf from "./isNegationOfMemberOf";
import isIdentifierWithName from "./isIdentifierWithName";
import isNegationExpression from "./isNegationExpression";
import getValueReturnedInFirstStatement from "./getValueReturnedInFirstStatement";
import isCallFromObject from "./isCallFromObject";
import isComputed from "./isComputed";
import isEquivalentMemberExp from "./isEquivalentMemberExp";
import isEqEqEq from "./isEqEqEq";
import comparisonType from "./comparisonType";
import getExpressionComparedToInt from "./getExpressionComparedToInt";
import isIndexOfCall from "./isIndexOfCall";
import isFindIndexCall from "./isFindIndexCall";
import isFunctionExpression from "./isFunctionExpression";
import isFunctionDefinitionWithBlock from "./isFunctionDefinitionWithBlock";
import collectParameterValues from "./collectParameterValues";

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
