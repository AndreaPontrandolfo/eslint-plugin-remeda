import { assignWith, mapValues, over } from "lodash-es";

type VisitorFunction = (...args: unknown[]) => unknown;

function combineVisitorObjects(
  ...objects: Record<string, unknown>[]
): Record<string, (...args: unknown[]) => unknown[]> {
  const accumForAllVisitors = assignWith<Record<string, VisitorFunction[]>>(
    {},
    ...objects,
    (objValue: VisitorFunction[] | undefined, sourceValue: unknown) => {
      return [...(objValue ?? []), sourceValue as VisitorFunction];
    },
  );

  return mapValues(accumForAllVisitors, (fns: VisitorFunction[]) => over(fns));
}

export { combineVisitorObjects };
