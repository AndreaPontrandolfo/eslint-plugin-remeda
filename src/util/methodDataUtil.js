"use strict";

const _ = require("lodash");

const getMethodData = _.memoize(() => require(`./methodData`));

/**
 * Gets a method name and returns all its aliases including itself.
 * @param {string} method
 * @returns {string[]}
 */
const expandAlias = (method) => {
  const methodAliases = _.get(getMethodData(), [method, "aliases"], []);
  return [method, ...methodAliases];
};

/**
 * Gets a list of methods and returns a list of methods and all their aliases
 * @param methods
 * @returns {string[]}
 */
function expandAliases(methods) {
  return _.flatMap(methods, (method) => expandAlias(method));
}

/**
 * Returns whether the method is the main alias
 * @param method
 * @returns {Boolean}
 */
function isMainAlias(method) {
  return Boolean(getMethodData()[method]);
}

/**
 * Gets a list of all chainable methods and their aliases.
 * @param {string} method
 * @returns {boolean}
 */
function isChainable(method) {
  const data = getMethodData();
  return _.get(data, [getMainAlias(method), "chainable"], false);
}

/**
 * Gets whether the method is a collection method
 * @param {string} method
 * @returns {Boolean}
 */
function isCollectionMethod(method) {
  return (
    methodSupportsShorthand(method) ||
    _.includes(expandAliases(["reduce", "reduceRight"]), method)
  );
}

/**
 * Returns whether the node's method call supports using shorthands.
 * @param {string} method
 * @returns {boolean}
 */
function methodSupportsShorthand(method, shorthandType) {
  const mainAlias = getMainAlias(method);
  const methodShorthandData = _.get(getMethodData(), [mainAlias, "shorthand"]);
  return _.isObject(methodShorthandData)
    ? Boolean(shorthandType && methodShorthandData[shorthandType])
    : Boolean(methodShorthandData);
}

/**
 * Gets whether the method is a wrapper method
 * @param {string} method
 * @returns {boolean}
 */
function isWrapperMethod(method) {
  return _.get(getMethodData(), [method, "wrapper"], false);
}
/**
 * Gets whether the suspect is an alias of the method
 * @param {string} method
 * @param {string} suspect
 * @returns {boolean}
 */
function isAliasOfMethod(method, suspect) {
  return (
    method === suspect ||
    _.includes(_.get(getMethodData(), [method, "aliases"]), suspect)
  );
}

/**
 * Returns the main alias for the method.
 * @param {string} method
 * @returns {string}
 */
function getMainAlias(method) {
  const data = getMethodData();
  return data[method]
    ? method
    : _.findKey(data, (methodData) => _.includes(methodData.aliases, method));
}

/**
 * Gets the index of the iteratee of a method when it isn't chained, or -1 if it doesn't have one.
 * @param {string} method
 * @returns {number}
 */
function getIterateeIndex(method) {
  const mainAlias = getMainAlias(method);
  const methodData = getMethodData()[mainAlias];
  if (_.has(methodData, "iterateeIndex")) {
    return methodData.iterateeIndex;
  }
  if (methodData && methodData.iteratee) {
    return 1;
  }
  return -1;
}

/**
 * Gets the maximum number of arguments to be given to the function.
 * @param {string} name
 * @returns {number}
 */
function getFunctionMaxArity(name) {
  return _.get(getMethodData(), [name, "args"], Infinity);
}

const sideEffectIterationMethods = [
  "forEach",
  "forEachRight",
  "forIn",
  "forInRight",
  "forOwn",
  "forOwnRight",
];

/**
 * Gets a list of side effect iteration methods
 * @returns {string[]}
 */
function getSideEffectIterationMethods() {
  return expandAliases(sideEffectIterationMethods);
}

/**
 * Returns whether the method exists.
 * @param {string} method
 * @returns {boolean}
 */
function methodExists(method) {
  return Boolean(getMethodData()[method]);
}

module.exports = {
  isAliasOfMethod,
  isChainable,
  methodSupportsShorthand,
  isWrapperMethod,
  isCollectionMethod,
  isMainAlias,
  getMainAlias,
  getIterateeIndex,
  getFunctionMaxArity,
  getSideEffectIterationMethods,
  methodExists,
};
