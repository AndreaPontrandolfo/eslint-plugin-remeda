import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

function getNameFromCjsRequire(
  init: TSESTree.Node | null | undefined,
): string | undefined {
  if (
    init?.type === AST_NODE_TYPES.CallExpression &&
    init.callee.type === AST_NODE_TYPES.Identifier &&
    init.callee.name === "require" &&
    init.arguments.length === 1 &&
    init.arguments[0].type === AST_NODE_TYPES.Literal &&
    typeof init.arguments[0].value === "string"
  ) {
    return init.arguments[0].value;
  }
}

const isFullRemedaImport = (str: string) => /^remeda\/?$/.test(str);
const getMethodImportFromName = (str: string) => {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const match = /^remeda([./])(\w+)$/.exec(str);

  return match?.[2];
};

export { getMethodImportFromName, getNameFromCjsRequire, isFullRemedaImport };
