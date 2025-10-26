import { flatMap } from "lodash-es";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Returns an array of identifier names returned in a parameter or variable definition.
 *
 * @param node - An AST node which is a parameter or variable declaration.
 * @returns List of names defined in the parameter.
 */
function collectParameterValues(
  node: TSESTree.Node | null | undefined,
): string[] {
  switch (node?.type) {
    case AST_NODE_TYPES.Identifier: {
      return [node.name];
    }
    case AST_NODE_TYPES.ObjectPattern: {
      return flatMap(node.properties, (prop) =>
        collectParameterValues(prop.value),
      );
    }
    case AST_NODE_TYPES.ArrayPattern: {
      return flatMap(node.elements, collectParameterValues);
    }
    default: {
      return [];
    }
  }
}

export default collectParameterValues;
