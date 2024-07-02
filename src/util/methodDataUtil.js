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

const sideEffectIterationMethods = [
  "forEach",
  "forEachRight",
  "forIn",
  "forInRight",
  "forOwn",
  "forOwnRight",
];

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
 * Gets a list of side effect iteration methods
 * @returns {string[]}
 */
function getSideEffectIterationMethods() {
  return expandAliases(sideEffectIterationMethods);
}

module.exports = {
  isAliasOfMethod,
  isCollectionMethod,
  getIterateeIndex,
  getSideEffectIterationMethods,
};
