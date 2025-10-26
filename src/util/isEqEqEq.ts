import { matches } from "lodash-es";

/**
 * Returns whether the expression is a strict equality comparison, ===.
 *
 * @param node - The node to check.
 */
const isEqEqEq = matches({ type: "BinaryExpression", operator: "===" });

export { isEqEqEq };
