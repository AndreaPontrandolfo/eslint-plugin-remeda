"use strict";
const _ = require("lodash");
const methodDataUtil = require("./methodDataUtil");
const astUtil = require("./astUtil");
const LodashContext = require("./LodashContext");

/**
 * Returns whether the node is a chain breaker method
 * @param {Object} node
 * @returns {boolean}
 */
function isChainBreaker(node) {
  return methodDataUtil.isAliasOfMethod("value", astUtil.getMethodName(node));
}

/**
 * Returns whether the node is a call to the specified method or one of its aliases.
 * @param {Object} node
 * @param {string} method
 * @returns {boolean}
 */
function isCallToMethod(node, method) {
  return methodDataUtil.isAliasOfMethod(method, astUtil.getMethodName(node));
}

/**
 * Gets the 'isX' method for a specified type, e.g. isObject
 * @param {string} name
 * @returns {string|null}
 */
function getIsTypeMethod(name) {
  const types = [
    "number",
    "boolean",
    "function",
    "Function",
    "string",
    // "object",
    // "undefined",
    "Date",
    "Array",
    "Error",
    // "Element",
  ];
  return _.includes(types, name) ? `is${_.capitalize(name)}` : null;
}

/**
 * Gets the context's Lodash settings and a function and returns a visitor that calls the function for every Lodash or chain call
 * @param {LodashContext} lodashContext
 * @param {LodashReporter} reporter
 * @returns {NodeTypeVisitor}
 */
function getRemedaMethodCallExpVisitor(lodashContext, reporter) {
  return function (node) {
    let iterateeIndex;
    if (lodashContext.isLodashCall(node)) {
      const method = astUtil.getMethodName(node);
      iterateeIndex = methodDataUtil.getIterateeIndex(method);
      reporter(node, node.arguments[iterateeIndex], {
        callType: "method",
        method,
        lodashContext,
      });
    } else {
      const method = lodashContext.getImportedRemedaMethod(node);
      if (method) {
        iterateeIndex = methodDataUtil.getIterateeIndex(method);
        reporter(node, node.arguments[iterateeIndex], {
          method,
          callType: "single",
          lodashContext,
        });
      }
    }
  };
}

function isRemedaCallToMethod(node, method, lodashContext) {
  return lodashContext.isLodashCall(node) && isCallToMethod(node, method);
}

function isCallToRemedaMethod(node, method, lodashContext) {
  if (!node || node.type !== "CallExpression") {
    return false;
  }
  return (
    isRemedaCallToMethod(node, method, lodashContext) ||
    methodDataUtil.isAliasOfMethod(
      method,
      lodashContext.getImportedRemedaMethod(node),
    )
  );
}

function getRemedaMethodVisitors(context, lodashCallExpVisitor) {
  const lodashContext = new LodashContext(context);
  const visitors = lodashContext.getImportVisitors();
  visitors.CallExpression = getRemedaMethodCallExpVisitor(
    lodashContext,
    lodashCallExpVisitor,
  );
  return visitors;
}

/**
 *
 * @param context
 * @returns {LodashContext} a LodashContext for a given context
 */
function getLodashContext(context) {
  return new LodashContext(context);
}

module.exports = {
  isChainBreaker,
  isCallToMethod,
  getIsTypeMethod,
  getRemedaMethodCallExpVisitor,
  isCallToLodashMethod: isCallToRemedaMethod,
  getRemedaMethodVisitors,
  getLodashContext,
};
