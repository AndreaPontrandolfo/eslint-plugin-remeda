import { assignWith, mapValues, over } from "lodash-es";

function combineVisitorObjects(...objects) {
  const accumForAllVisitors = assignWith(
    {},
    ...objects,
    (objValue, sourceValue) => (objValue || []).concat(sourceValue),
  );

  // @ts-expect-error
  return mapValues(accumForAllVisitors, over);
}

export { combineVisitorObjects };
