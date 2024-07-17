"use strict";

const _ = require("lodash");

const getMethodData = _.memoize(() => require(`./methodData`));

/**
 * Gets whether the method is a collection method
 * @param {string} method
 * @returns {Boolean}
 */
function isCollectionMethod(method) {
  return (
    methodSupportsShorthand(method) ||
    _.includes(["reduce", "reduceRight"], method)
  );
}

/**
 * Returns whether the node's method call supports using shorthands.
 * @param {string} method
 * @returns {boolean}
 */
function methodSupportsShorthand(method, shorthandType) {
  const methodShorthandData = _.get(getMethodData(), [method, "shorthand"]);
  return _.isObject(methodShorthandData)
    ? Boolean(shorthandType && methodShorthandData[shorthandType])
    : Boolean(methodShorthandData);
}

/**
 * Gets the index of the iteratee of a method when it isn't chained, or -1 if it doesn't have one.
 * @param {string} method
 * @returns {number}
 */
function getIterateeIndex(method) {
  const methodData = getMethodData()[method];
  if (_.has(methodData, "iterateeIndex")) {
    return methodData.iterateeIndex;
  }
  if (methodData && methodData.iteratee) {
    return 1;
  }
  return -1;
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
  return sideEffectIterationMethods;
}

module.exports = {
  isCollectionMethod,
  getIterateeIndex,
  getSideEffectIterationMethods,
};
