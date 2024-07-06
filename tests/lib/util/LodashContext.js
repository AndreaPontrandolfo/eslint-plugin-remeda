"use strict";
const assign = require("lodash/assign");
const traverser = require("eslint-traverser");
const LodashContext = require("../../../src/util/LodashContext");
const assert = require("assert");
const defaultPragmaConfig = { settings: { remeda: { pragma: "R" } } };

function visitWithContext(code, config, getVisitorsByLodashContext) {
  traverser(code, config).runRuleCode((context) => {
    const lodashContext = new LodashContext(context);
    const importVisitors = lodashContext.getImportVisitors();
    return assign(importVisitors, getVisitorsByLodashContext(lodashContext));
  });
}

describe("LodashContext", () => {
  describe("getImportVisitors", () => {
    describe("ImportDeclaration", () => {
      it("should accept a namespace import as remeda", (done) => {
        visitWithContext(
          'import * as remeda from "remeda"; remeda.map(arr, x => x)',
          { sourceType: "module" },
          (lodashContext) => ({
            CallExpression(node) {
              assert(lodashContext.general[node.callee.object.name]);
              done();
            },
          }),
        );
      });
      it("should accept a default import as remeda", (done) => {
        visitWithContext(
          'import remeda from "remeda"; remeda.map(arr, x => x)',
          { sourceType: "module" },
          (lodashContext) => ({
            CallExpression(node) {
              assert(lodashContext.general[node.callee.object.name]);
              done();
            },
          }),
        );
      });
      it("should accept a chain imported as module", (done) => {
        visitWithContext(
          'import { chain } from "remeda"; chain.map(arr, x => x)',
          { sourceType: "module" },
          (lodashContext) => ({
            CallExpression(node) {
              assert(lodashContext.general[node.callee.object.name]);
              done();
            },
          }),
        );
      });
      it("should accept a destructured import as remeda", (done) => {
        visitWithContext(
          'import {map} from "remeda"; map(arr, x => x)',
          { sourceType: "module" },
          (lodashContext) => ({
            CallExpression(node) {
              assert(lodashContext.methods[node.callee.name] === "map");
              done();
            },
          }),
        );
      });
      it("should accept a single method import as remeda", (done) => {
        visitWithContext(
          'import map from "remeda/map"; map(arr, x => x)',
          { sourceType: "module" },
          (lodashContext) => ({
            CallExpression(node) {
              assert(lodashContext.methods[node.callee.name] === "map");
              done();
            },
          }),
        );
      });
      it("should not collect anything from arbitrary imports", (done) => {
        visitWithContext(
          'import map from "some-other-map"; map(arr, x => x)',
          { sourceType: "module" },
          (lodashContext) => ({
            CallExpression(node) {
              assert(!lodashContext.methods[node.callee.name]);
              done();
            },
          }),
        );
      });
    });
    describe("VariableDeclarator", () => {
      it("should accept a require of the entire remeda library", (done) => {
        visitWithContext(
          'const R = require("remeda"); R.map(arr, x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.property && node.callee.property.name === "map") {
                assert(lodashContext.general[node.callee.object.name]);
                done();
              }
            },
          }),
        );
      });
      it("should accept a destructured require of the main module", (done) => {
        visitWithContext(
          'const {map} = require("remeda"); map(arr, x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(lodashContext.methods[node.callee.name] === "map");
                done();
              }
            },
          }),
        );
      });
      it("should accept chain destructured from the main module", (done) => {
        visitWithContext(
          'const {chain} = require("remeda"); chain(arr).map(x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.name === "chain") {
                assert(lodashContext.general[node.callee.name]);
                done();
              }
            },
          }),
        );
      });
      it("should accept a single method require", (done) => {
        visitWithContext(
          'const map = require("remeda/map"); map(arr, x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(lodashContext.methods[node.callee.name] === "map");
                done();
              }
            },
          }),
        );
      });
      it("should not accept a single method package require from lodash-es", (done) => {
        visitWithContext(
          'const map = require("lodash-es.map"); map(arr, x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(!lodashContext.methods[node.callee.name]);
                done();
              }
            },
          }),
        );
      });
      it("should not collect arbitrary requires", (done) => {
        visitWithContext(
          'const map = require("some-other-map"); map(arr, x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(lodashContext.methods[node.callee.name] !== "map");
                done();
              }
            },
          }),
        );
      });
      it("should not collect anything from array patterns required from remeda", (done) => {
        visitWithContext(
          'const [map] = require("remeda"); map(arr, x => x)',
          undefined,
          (lodashContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(lodashContext.methods[node.callee.name] !== "map");
                done();
              }
            },
          }),
        );
      });
    });
  });
  describe("isImportedRemeda", () => {
    it("should return true for a remeda that was imported as Remeda", (done) => {
      visitWithContext(
        'import * as Remeda from "remeda"; Remeda.map(arr, x => x)',
        { sourceType: "module" },
        (lodashContext) => ({
          CallExpression(node) {
            assert(lodashContext.isImportedRemeda(node.callee.object));
            done();
          },
        }),
      );
    });
    it("should return true for a remeda that was imported as R", (done) => {
      visitWithContext(
        'import * as R from "remeda"; R.map(arr, x => x)',
        { sourceType: "module" },
        (lodashContext) => ({
          CallExpression(node) {
            assert(lodashContext.isImportedRemeda(node.callee.object));
            done();
          },
        }),
      );
    });
    it("should return true for a remeda that was imported as remeda", (done) => {
      visitWithContext(
        'import * as remeda from "remeda"; remeda.map(arr, x => x)',
        { sourceType: "module" },
        (lodashContext) => ({
          CallExpression(node) {
            assert(lodashContext.isImportedRemeda(node.callee.object));
            done();
          },
        }),
      );
    });
    it("should return false for other identifiers", (done) => {
      visitWithContext("const one = 1", undefined, (lodashContext) => ({
        Identifier(node) {
          assert(!lodashContext.isImportedRemeda(node));
          done();
        },
      }));
    });
  });
  describe("getImportedRemedaMethod", () => {
    it("should return the imported Remeda method when called as a single method", (done) => {
      visitWithContext(
        'import map from "remeda/map"; map(arr, x => x)',
        { sourceType: "module" },
        (lodashContext) => ({
          CallExpression(node) {
            assert(lodashContext.getImportedRemedaMethod(node) === "map");
            done();
          },
        }),
      );
    });
    it("should return undefined for other function calls", (done) => {
      visitWithContext("const one = f()", undefined, (lodashContext) => ({
        CallExpression(node) {
          assert(lodashContext.getImportedRemedaMethod(node) === undefined);
          done();
        },
      }));
    });
    it("should return undefined for other node types", (done) => {
      visitWithContext("const one = 1", undefined, (lodashContext) => ({
        Identifier(node) {
          assert(lodashContext.getImportedRemedaMethod(node) === undefined);
          done();
        },
      }));
    });
  });
  describe("isLodashCall", () => {
    it("should return true if pragma is defined and it is a call from it", (done) => {
      visitWithContext(
        'const ids = R.map(users, "id")',
        defaultPragmaConfig,
        (lodashContext) => ({
          CallExpression(node) {
            assert(lodashContext.isLodashCall(node));
            done();
          },
        }),
      );
    });
    it("should return true if no pragma is defined and the call is an imported remeda", (done) => {
      visitWithContext(
        'import R from "remeda"; const ids = R.map(users, () => "id")',
        { sourceType: "module" },
        (lodashContext) => ({
          CallExpression(node) {
            assert(lodashContext.isLodashCall(node));
            done();
          },
        }),
      );
    });
  });
});
