import { get, has, includes, isObject } from "lodash-es";
import * as methodDataCatalog from "./methodData";

/**
 * Returns whether the node's method call supports using shorthands.
 *
 */
function methodSupportsShorthand(method: string, shorthandType?: string) {
  const path = `${method}.shorthand`;
  const methodShorthandData = get(methodDataCatalog, path);
  const isShorthandObject = isObject(methodShorthandData);

  return isShorthandObject
    ? Boolean(shorthandType && methodShorthandData[shorthandType])
    : Boolean(methodShorthandData);
}

/**
 * Gets whether the method is a collection method.
 *
 * @param method - The method to check.
 */
function isCollectionMethod(method: string) {
  return (
    methodSupportsShorthand(method) ||
    includes(["reduce", "reduceRight"], method)
  );
}

/**
 * Gets the index of the iteratee of a method when it isn't chained, or -1 if it doesn't have one.
 */
function getIterateeIndex(method: string) {
  const methodData = methodDataCatalog[method];

  if (methodData) {
    if (has(methodData, "iterateeIndex")) {
      return methodData.iterateeIndex;
    }
    //@ts-expect-error
    if (methodData.iteratee) {
      return 1;
    }
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
 * Gets a list of side effect iteration methods.
 *
 */
function getSideEffectIterationMethods() {
  return sideEffectIterationMethods;
}

export { getIterateeIndex, getSideEffectIterationMethods, isCollectionMethod };
