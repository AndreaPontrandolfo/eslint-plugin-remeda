/* eslint-disable no-restricted-syntax/noClasses */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import type { ESLintContext } from "../types";
import astUtil from "./astUtil";
import {
  getMethodImportFromName,
  getNameFromCjsRequire,
  isFullRemedaImport,
} from "./importUtil";
import { getSettings } from "./settingsUtil";

const { isMethodCall, isCallFromObject, getCaller } = astUtil;

/* Class representing remeda data for a given context */
export default class {
  context: ESLintContext;
  general: Record<string, boolean>;
  methods: Record<string, string>;
  _pragma: string | undefined;
  /**
   * Create a Remeda context wrapper from a file's RuleContext.
   *
   * @param context - The context of the file.
   */
  constructor(context: ESLintContext) {
    this.context = context;
    this.general = Object.create(null);
    this.methods = Object.create(null);
  }

  /**
   * Gets visitors to collect Remeda declarations in the context.
   *
   * @returns Visitors for everywhere Remeda can be declared.
   */
  getImportVisitors() {
    const self = this;

    return {
      ImportDeclaration({
        source,
        specifiers,
      }: {
        source: TSESTree.StringLiteral;
        specifiers: TSESTree.ImportSpecifier[];
      }) {
        if (isFullRemedaImport(source.value)) {
          specifiers.forEach(
            (
              spec:
                | TSESTree.ImportSpecifier
                | TSESTree.ImportNamespaceSpecifier
                | TSESTree.ImportDefaultSpecifier,
            ) => {
              switch (spec.type) {
                case AST_NODE_TYPES.ImportNamespaceSpecifier:
                case AST_NODE_TYPES.ImportDefaultSpecifier: {
                  self.general[spec.local.name] = true;
                  break;
                }
                case AST_NODE_TYPES.ImportSpecifier: {
                  if (spec.imported.type === AST_NODE_TYPES.Identifier) {
                    self.methods[spec.local.name] = spec.imported.name;

                    if (spec.imported.name === "chain") {
                      self.general[spec.local.name] = true;
                    }
                  }
                  break;
                }
              }
            },
          );
        } else {
          const method = getMethodImportFromName(source.value);

          if (method) {
            self.methods[specifiers[0].local.name] = method;
          }
        }
      },
      // @ts-expect-error
      VariableDeclarator({ init, id }) {
        const required = getNameFromCjsRequire(init);

        if (required && isFullRemedaImport(required)) {
          if (id.type === "Identifier") {
            self.general[id.name] = true;
          } else if (id.type === "ObjectPattern") {
            id.properties.forEach(
              (prop: { value: { name: string }; key: { name: string } }) => {
                self.methods[prop.value.name] = prop.key.name;

                if (prop.value.name === "chain") {
                  self.general[prop.value.name] = true;
                }
              },
            );
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
   * Returns whether the node is an imported Remeda in this context.
   *
   * @param node - The node to check.
   */
  isImportedRemeda(node: TSESTree.Node | null | undefined) {
    if (node && node.type === AST_NODE_TYPES.Identifier) {
      return this.general[node.name];
    }
  }

  /**
   * Returns the name of the Remeda method for this node, if any.
   *
   * @param node - The node to check.
   */
  getImportedRemedaMethod(node: TSESTree.Node | null | undefined) {
    if (
      node &&
      node.type === AST_NODE_TYPES.CallExpression &&
      !isMethodCall(node) &&
      node.callee.type === AST_NODE_TYPES.Identifier
    ) {
      return this.methods[node.callee.name];
    }
  }

  /**
   * Returns whether the node is a call from a Remeda object.
   *
   * @param node - The node to check.
   */
  isRemedaCall(node: TSESTree.Node | null | undefined): boolean {
    return Boolean(
      (this.pragma && isCallFromObject(node, this.pragma)) ||
        this.isImportedRemeda(getCaller(node)),
    );
  }

  /**
   * Gets the current Remeda pragma.
   *
   */
  get pragma() {
    if (!this._pragma) {
      const { pragma } = getSettings(this.context);

      this._pragma = pragma;
    }

    return this._pragma;
  }
}
