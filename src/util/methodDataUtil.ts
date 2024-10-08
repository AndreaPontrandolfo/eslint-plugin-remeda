import { get, has, includes, isObject } from "lodash-es";
import * as methodDataCatalog from "./methodData";

/**
 * Gets whether the method is a collection method.
 *
 * @param method
 */
function isCollectionMethod(method) {
  return (
    methodSupportsShorthand(method) ||
    includes(["reduce", "reduceRight"], method)
  );
}

/**
 * Returns whether the node's method call supports using shorthands.
 *
 * @returns
 */
function methodSupportsShorthand(method: string, shorthandType?: string) {
  const methodShorthandData = get(methodDataCatalog, `${method}.shorthand`);

  return isObject(methodShorthandData)
    ? Boolean(shorthandType && methodShorthandData[shorthandType])
    : Boolean(methodShorthandData);
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
 * @returns
 */
function getSideEffectIterationMethods() {
  return sideEffectIterationMethods;
}

export { getIterateeIndex, getSideEffectIterationMethods, isCollectionMethod };
