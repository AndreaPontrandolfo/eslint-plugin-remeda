import { has, includes, isObject } from "lodash-es";
import type { MethodData } from "../types";
import * as methodDataCatalog from "./methodData";

export const methods = Object.keys(
  methodDataCatalog,
) as (keyof typeof methodDataCatalog)[];

export const isKnownMethod = (
  method: string,
): method is keyof typeof methodDataCatalog => {
  return methods.includes(method as keyof typeof methodDataCatalog);
};

/**
 * Returns whether the node's method call supports using shorthands.
 *
 */
function methodSupportsShorthand(method: string, shorthandType?: string) {
  if (!isKnownMethod(method)) {
    return false;
  }

  const methodData = methodDataCatalog[method];

  const methodShorthandData = methodData.shorthand;
  const isShorthandObject = isObject(methodShorthandData);

  return isShorthandObject
    ? // @ts-expect-error
      Boolean(shorthandType && methodShorthandData[shorthandType])
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
  // @ts-expect-error
  const methodData: MethodData | undefined = methodDataCatalog[method];

  if (methodData) {
    if (has(methodData, "iterateeIndex")) {
      return methodData.iterateeIndex;
    }
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
