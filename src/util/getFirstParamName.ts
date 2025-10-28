import { property } from "lodash-es";

/**
 * Returns the name of the first parameter of a function, if it exists.
 *
 * @param func - The function to check.
 */
const getFirstParamName = property("params[0].name");

export { getFirstParamName };
