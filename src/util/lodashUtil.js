"use strict";
const _ = require("lodash");
const methodDataUtil = require("./methodDataUtil");
const astUtil = require("./astUtil");
const LodashContext = require("./LodashContext");

/**
 * Returns whether or not a node is a chainable method call.
 * @param {Object} node
 * @returns {boolean}
 */
function isChainable(node) {
  return methodDataUtil.isChainable(astUtil.getMethodName(node));
}

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
 * Returns whether or not the node is a call to a lodash wrapper method
 * @param {Object} node
 * @returns {boolean}
 */
function isLodashWrapperMethod(node) {
  return methodDataUtil.isWrapperMethod(astUtil.getMethodName(node));
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
 * Returns whether or not the node is a call to a native collection method
 * @param {Object} node
 * @returns {boolean}
 */
function isNativeCollectionMethodCall(node) {
  return _.includes(
    [
      "every",
      "fill",
      "filter",
      "find",
      "findIndex",
      "forEach",
      "includes",
      "map",
      "reduce",
      "reduceRight",
      "some",
    ],
    astUtil.getMethodName(node),
  );
}

/**
 * Gets the context's Lodash settings and a function and returns a visitor that calls the function for every Lodash or chain call
 * @param {LodashContext} lodashContext
 * @param {LodashReporter} reporter
 * @returns {NodeTypeVisitor}
 */
function getLodashMethodCallExpVisitor(lodashContext, reporter) {
  return function (node) {
    let iterateeIndex;
    if (lodashContext.isLodashChainStart(node)) {
      let prevNode = node;
      node = node.parent.parent;
      while (
        astUtil.getCaller(node) === prevNode &&
        astUtil.isMethodCall(node) &&
        !isChainBreaker(node)
      ) {
        const method = astUtil.getMethodName(node);
        iterateeIndex = methodDataUtil.getIterateeIndex(method);
        reporter(node, node.arguments[iterateeIndex - 1], {
          callType: "chained",
          method,
          lodashContext,
        });
        prevNode = node;
        node = node.parent.parent;
      }
    } else if (lodashContext.isLodashCall(node)) {
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

function isLodashCallToMethod(node, method, lodashContext) {
  return lodashContext.isLodashCall(node) && isCallToMethod(node, method);
}

function isCallToLodashMethod(node, method, lodashContext) {
  if (!node || node.type !== "CallExpression") {
    return false;
  }
  return (
    isLodashCallToMethod(node, method, lodashContext) ||
    methodDataUtil.isAliasOfMethod(
      method,
      lodashContext.getImportedRemedaMethod(node),
    )
  );
}

function getLodashMethodVisitors(context, lodashCallExpVisitor) {
  const lodashContext = new LodashContext(context);
  const visitors = lodashContext.getImportVisitors();
  visitors.CallExpression = getLodashMethodCallExpVisitor(
    lodashContext,
    lodashCallExpVisitor,
  );
  return visitors;
}

function getShorthandVisitors(context, checks, messages, shorthandType) {
  const lodashContext = new LodashContext(context);
  const visitors = lodashContext.getImportVisitors();
  visitors.CallExpression = getLodashMethodCallExpVisitor(
    lodashContext,
    {
      always(node, iteratee, { method }) {
        if (
          methodDataUtil.methodSupportsShorthand(method, shorthandType) &&
          checks.canUseShorthand(iteratee, lodashContext)
        ) {
          context.report(iteratee, messages.always);
        }
      },
      never(node, iteratee, { method }) {
        if (checks.usesShorthand(node, iteratee, method)) {
          context.report(iteratee || node.callee.property, messages.never);
        }
      },
    }[context.options[0] || "always"],
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
  isChainable,
  isChainBreaker,
  isCallToMethod,
  isLodashWrapperMethod,
  getIsTypeMethod,
  isNativeCollectionMethodCall,
  getLodashMethodCallExpVisitor,
  isCallToLodashMethod,
  getShorthandVisitors,
  getLodashMethodVisitors,
  getLodashContext,
};

/**
 @callback LodashReporter
 @param {Object} node
 @param {Object} iteratee
 @param {Object?} options
 */

/**
 @callback NodeTypeVisitor
 @param {Object} node
 */

/**
 * @typedef {Object} ShorthandChecks
 * @property {function} canUseShorthand
 * @property {function} usesShorthand
 */

/**
 * @typedef {object} ShorthandMessages
 * @property {string} always
 * @property {string} never
 */
