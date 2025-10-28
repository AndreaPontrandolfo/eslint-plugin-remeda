import { matchesProperty, overSome } from "lodash-es";

const isFunctionExpression = overSome(
  matchesProperty("type", "FunctionExpression"),
  // eslint-disable-next-line
  matchesProperty("type", "FunctionDeclaration"),
);

export { isFunctionExpression };
