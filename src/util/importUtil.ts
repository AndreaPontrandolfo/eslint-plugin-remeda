import { get } from "lodash";

function getNameFromCjsRequire(init) {
  if (
    get(init, "callee.name") === "require" &&
    get(init, "arguments.length") === 1 &&
    init.arguments[0].type === "Literal"
  ) {
    return init.arguments[0].value;
  }
}

const isFullRemedaImport = (str: string) => /^remeda?(\/)?$/.test(str);
const getMethodImportFromName = (str: string) => {
  const match = /^remeda([./])(\w+)$/.exec(str);

  return match && match[2];
};

export { getMethodImportFromName, getNameFromCjsRequire, isFullRemedaImport };
