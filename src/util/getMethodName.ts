import { property } from "lodash-es";

/**
 * Gets the name of a method in a CallExpression.
 *
 * @param node - The node to check.
 */
const getMethodName = property("callee.property.name");

export default getMethodName;
