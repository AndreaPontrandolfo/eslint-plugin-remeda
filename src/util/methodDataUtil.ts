import { has, includes, isObject } from "lodash-es";
import * as methodDataCatalog from "./methodData";

interface MethodData {
  wrapper: boolean;
  shorthand: boolean;
  chainable: boolean;
  iteratee: boolean;
  args: number;
}

/**
 * Returns whether the node's method call supports using shorthands.
 *
 */
function methodSupportsShorthand(
  method: keyof typeof methodDataCatalog,
  shorthandType?: string,
) {
  const methodShorthandData = methodDataCatalog[method].shorthand;
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
    // @ts-expect-error
    methodSupportsShorthand(method) ||
    includes(["reduce", "reduceRight"], method)
  );
}

/**
 * Gets the index of the iteratee of a method when it isn't chained, or -1 if it doesn't have one.
 */
function getIterateeIndex(method: keyof typeof methodDataCatalog) {
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
