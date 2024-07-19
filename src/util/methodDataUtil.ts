import { includes, get, isObject, has } from "lodash";
import * as methodDataCatalog from "./methodData";

/**
 * Gets whether the method is a collection method
 * @param {string} method
 * @returns {Boolean}
 */
function isCollectionMethod(method) {
  return (
    methodSupportsShorthand(method) ||
    includes(["reduce", "reduceRight"], method)
  );
}

/**
 * Returns whether the node's method call supports using shorthands.
 * @param {string} method
 * @returns {boolean}
 */
function methodSupportsShorthand(method, shorthandType) {
  const methodShorthandData = get(methodDataCatalog, [method, "shorthand"]);
  return isObject(methodShorthandData)
    ? Boolean(shorthandType && methodShorthandData[shorthandType])
    : Boolean(methodShorthandData);
}

/**
 * Gets the index of the iteratee of a method when it isn't chained, or -1 if it doesn't have one.
 * @param {string} method
 * @returns {number}
 */
function getIterateeIndex(method) {
  const methodData = methodDataCatalog[method];
  if (has(methodData, "iterateeIndex")) {
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

export { isCollectionMethod, getSideEffectIterationMethods, getIterateeIndex };
