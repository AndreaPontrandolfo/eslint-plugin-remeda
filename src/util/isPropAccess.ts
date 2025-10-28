import { matches, matchesProperty, overSome } from "lodash-es";

const isPropAccess = overSome(
  matches({ computed: false }),
  // eslint-disable-next-line
  matchesProperty("property.type", "Literal"),
);

export { isPropAccess };
