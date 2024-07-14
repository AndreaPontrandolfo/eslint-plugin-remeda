"use strict";
const _ = require("lodash");
const methodDataUtil = require("./methodDataUtil");
const astUtil = require("./astUtil");
const RemedaContext = require("./RemedaContext");

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
 * Gets the context's Remeda settings and a function and returns a visitor that calls the function for every Remeda or chain call
 * @param {RemedaContext} remedaContext
 * @param {RemedaReporter} reporter
 * @returns {NodeTypeVisitor}
 */
function getRemedaMethodCallExpVisitor(remedaContext, reporter) {
  return function (node) {
    let iterateeIndex;
    if (remedaContext.isRemedaCall(node)) {
      const method = astUtil.getMethodName(node);
      iterateeIndex = methodDataUtil.getIterateeIndex(method);
      reporter(node, node.arguments[iterateeIndex], {
        callType: "method",
        method,
        remedaContext,
      });
    } else {
      const method = remedaContext.getImportedRemedaMethod(node);
      if (method) {
        iterateeIndex = methodDataUtil.getIterateeIndex(method);
        reporter(node, node.arguments[iterateeIndex], {
          method,
          callType: "single",
          remedaContext,
        });
      }
    }
  };
}

function isRemedaCallToMethod(node, method, remedaContext) {
  return remedaContext.isRemedaCall(node) && isCallToMethod(node, method);
}

function isCallToRemedaMethod(node, method, remedaContext) {
  if (!node || node.type !== "CallExpression") {
    return false;
  }
  return (
    isRemedaCallToMethod(node, method, remedaContext) ||
    methodDataUtil.isAliasOfMethod(
      method,
      remedaContext.getImportedRemedaMethod(node),
    )
  );
}

function getRemedaMethodVisitors(context, remedaCallExpVisitor) {
  const remedaContext = new RemedaContext(context);
  const visitors = remedaContext.getImportVisitors();
  visitors.CallExpression = getRemedaMethodCallExpVisitor(
    remedaContext,
    remedaCallExpVisitor,
  );
  return visitors;
}

/**
 *
 * @param context
 * @returns {RemedaContext} a RemedaContext for a given context
 */
function getRemedaContext(context) {
  return new RemedaContext(context);
}

module.exports = {
  isChainBreaker,
  isCallToMethod,
  getIsTypeMethod,
  getRemedaMethodCallExpVisitor,
  isCallToRemedaMethod,
  getRemedaMethodVisitors,
  getRemedaContext,
};
