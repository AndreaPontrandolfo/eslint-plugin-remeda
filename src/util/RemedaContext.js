"use strict";

const { getSettings } = require("./settingsUtil");
const { isMethodCall, isCallFromObject, getCaller } = require("./astUtil");
const {
  getNameFromCjsRequire,
  isFullRemedaImport,
  getMethodImportFromName,
} = require("./importUtil");

/* Class representing remeda data for a given context */
module.exports = class {
  /**
   * Create a Remeda context wrapper from a file's RuleContext
   * @param {RuleContext} context
   */
  constructor(context) {
    this.context = context;
    this.general = Object.create(null);
    this.methods = Object.create(null);
  }

  /**
   * Gets visitors to collect Remeda declarations in the context
   * @returns {Object} visitors for everywhere Remeda can be declared
   */
  getImportVisitors() {
    const self = this;
    return {
      ImportDeclaration({ source, specifiers }) {
        if (isFullRemedaImport(source.value)) {
          specifiers.forEach((spec) => {
            switch (spec.type) {
              case "ImportNamespaceSpecifier":
              case "ImportDefaultSpecifier":
                self.general[spec.local.name] = true;
                break;
              case "ImportSpecifier":
                self.methods[spec.local.name] = spec.imported.name;

                if (spec.imported.name === "chain") {
                  self.general[spec.local.name] = true;
                }
                break;
            }
          });
        } else {
          const method = getMethodImportFromName(source.value);
          if (method) {
            self.methods[specifiers[0].local.name] = method;
          }
        }
      },
      VariableDeclarator({ init, id }) {
        const required = getNameFromCjsRequire(init);
        if (isFullRemedaImport(required)) {
          if (id.type === "Identifier") {
            self.general[id.name] = true;
          } else if (id.type === "ObjectPattern") {
            id.properties.forEach((prop) => {
              self.methods[prop.value.name] = prop.key.name;

              if (prop.value.name === "chain") {
                self.general[prop.value.name] = true;
              }
            });
          }
        } else if (required) {
          const method = getMethodImportFromName(required);
          if (method) {
            self.methods[id.name] = method;
          }
        }
      },
    };
  }

  /**
   * Returns whether the node is an imported Remeda in this context
   * @param node
   * @returns {boolean|undefined}
   */
  isImportedRemeda(node) {
    if (node && node.type === "Identifier") {
      return this.general[node.name];
    }
  }

  /**
   * Returns the name of the Remeda method for this node, if any
   * @param node
   * @returns {string|undefined}
   */
  getImportedRemedaMethod(node) {
    if (node && node.type === "CallExpression" && !isMethodCall(node)) {
      return this.methods[node.callee.name];
    }
  }

  /**
   * Returns whether the node is a call from a Remeda object
   * @param node
   * @returns {boolean|undefined}
   */
  isRemedaCall(node) {
    return (
      (this.pragma && isCallFromObject(node, this.pragma)) ||
      this.isImportedRemeda(getCaller(node))
    );
  }

  /**
   *
   * @returns {string|undefined} the current Remeda pragma
   */
  get pragma() {
    if (!this._pragma) {
      const { pragma } = getSettings(this.context);
      this._pragma = pragma;
    }
    return this._pragma;
  }
};
