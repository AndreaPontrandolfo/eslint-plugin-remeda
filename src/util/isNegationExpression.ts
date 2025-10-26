import { matches } from "lodash-es";

/**
 * Returns whether the expression is a negation.
 *
 * @param exp - The expression to check.
 */
const isNegationExpression = matches({
  type: "UnaryExpression",
  operator: "!",
});

export { isNegationExpression };
