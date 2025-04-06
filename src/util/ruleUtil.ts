import { assignWith, mapValues, over } from "lodash-es";

function combineVisitorObjects(...objects: Record<string, unknown>[]) {
  const accumForAllVisitors = assignWith(
    {},
    ...objects,
    (objValue, sourceValue) => (objValue || []).concat(sourceValue),
  );

  return mapValues(accumForAllVisitors, over);
}

export { combineVisitorObjects };
