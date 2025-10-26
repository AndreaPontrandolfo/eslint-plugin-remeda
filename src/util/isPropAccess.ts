import { matches, matchesProperty, overSome } from "lodash-es";

const isPropAccess = overSome(
  matches({ computed: false }),
  matchesProperty("property.type", "Literal"),
);

export default isPropAccess;
