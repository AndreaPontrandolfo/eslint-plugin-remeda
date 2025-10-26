import { matchesProperty, overSome } from "lodash-es";

const isFunctionExpression = overSome(
  matchesProperty("type", "FunctionExpression"),
  matchesProperty("type", "FunctionDeclaration"),
);

export default isFunctionExpression;
