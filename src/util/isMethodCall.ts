import { matches } from "lodash-es";

/**
 * Returns whether the node is a method call.
 *
 * @param node - The node to check.
 */
const isMethodCall = matches({
  type: "CallExpression",
  callee: { type: "MemberExpression" },
});

export default isMethodCall;
