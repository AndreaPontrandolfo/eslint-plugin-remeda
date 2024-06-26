"use strict";

const { getSettings } = require("./settingsUtil");
const {
  isMethodCall,
  isCallFromObject,
  getCaller,
  getMethodName,
} = require("./astUtil");
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
   * Gets visitors to collect remeda declarations in the context
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
   * Returns whether the node is a call from a Lodash object
   * @param node
   * @returns {boolean|undefined}
   */
  isLodashCall(node) {
    return (
      (this.pragma && isCallFromObject(node, this.pragma)) ||
      this.isImportedRemeda(getCaller(node))
    );
  }

  /**
   * Returns whether the node is an implicit chain start, _()...
   * @param node
   * @returns {boolean|undefined}
   */
  isImplicitChainStart(node) {
    return (
      (this.pragma && node.callee.name === this.pragma) ||
      (this.isImportedRemeda(node.callee) && node.callee.name !== "chain")
    );
  }

  /**
   * Returns whether the node is an explicit chain start, _.chain()...
   * @param node
   * @returns {boolean|undefined}
   */
  isExplicitChainStart(node) {
    return this.isLodashCall(node) && getMethodName(node) === "chain";
  }

  /**
   * Returns whether the node is chain start imported as member, chain()... import { chain } from 'lodash'
   * @param node
   * @returns {boolean|undefined}
   */
  isImportedChainStart(node) {
    return node.callee.name === "chain" && this.isImportedRemeda(node.callee);
  }

  /**
   * Returns whether the node is a Lodash chain start, implicit or explicit
   * @param node
   * @returns {*|boolean|boolean|undefined}
   */
  isLodashChainStart(node) {
    return (
      node &&
      node.type === "CallExpression" &&
      (this.isImplicitChainStart(node) ||
        this.isExplicitChainStart(node) ||
        this.isImportedChainStart(node))
    );
  }

  /**
   *
   * @returns {string|undefined} the current Lodash pragma
   */
  get pragma() {
    if (!this._pragma) {
      const { pragma } = getSettings(this.context);
      this._pragma = pragma;
    }
    return this._pragma;
  }
};
