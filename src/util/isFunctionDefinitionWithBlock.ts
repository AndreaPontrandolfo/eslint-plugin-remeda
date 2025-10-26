import { matches, overSome } from "lodash-es";
import { isFunctionExpression } from "./isFunctionExpression";

/**
 * Returns whether the node is a function declaration that has a block.
 *
 * @param node - The node to check.
 */
const isFunctionDefinitionWithBlock = overSome(
  isFunctionExpression,
  matches({
    type: "ArrowFunctionExpression",
    body: { type: "BlockStatement" },
  }),
);

export { isFunctionDefinitionWithBlock };
