/**
 * Checks if the given expression is an identifier with the specified name.
 *
 * @param expression - The expression to check.
 * @param paramName - The name to check against.
 */
function isIdentifierWithName(
  expression: { type: string; name: string },
  paramName: string,
) {
  return (
    expression &&
    paramName &&
    expression.type === "Identifier" &&
    expression.name === paramName
  );
}

export { isIdentifierWithName };
