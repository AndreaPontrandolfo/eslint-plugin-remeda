import assignWith from "lodash/assignWith";
import mapValues from "lodash/mapValues";
import over from "lodash/over";

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
