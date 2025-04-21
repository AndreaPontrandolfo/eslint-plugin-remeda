import { get } from "remeda";

interface RequireCall {
  callee: { name: string };
  arguments: { type: string; value: string }[];
}

function getNameFromCjsRequire(init: RequireCall): string | undefined {
  if (
    get(init, "callee.name") === "require" &&
    get(init, "arguments.length") === 1 &&
    init.arguments[0].type === "Literal"
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
