const get = require("lodash/get");

function getNameFromCjsRequire(init) {
  if (
    get(init, "callee.name") === "require" &&
    get(init, "arguments.length") === 1 &&
    init.arguments[0].type === "Literal"
  ) {
    return init.arguments[0].value;
  }
}

const isFullRemedaImport = (str) => /^remeda?(\/)?$/.test(str);
const getMethodImportFromName = (str) => {
  const match = /^remeda([./])(\w+)$/.exec(str);
  return match && match[2];
};

module.exports = {
  getNameFromCjsRequire,
  isFullRemedaImport,
  getMethodImportFromName,
};
