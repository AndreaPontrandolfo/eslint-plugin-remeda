import { chain, get } from "lodash-es";

export function getSettings(context) {
  return (
    chain(context)
      .get(["settings", "remeda"])
      .clone()
      //@ts-expect-error
      .defaults({
        version: 4,
      })
      .value()
  );
}
export function isEcmaFeatureOn(context, featureName) {
  return (
    get(context, ["ecmaFeatures", featureName]) ||
    get(context, ["parserOptions", "ecmaVersion"], 0) > 5
  );
}
