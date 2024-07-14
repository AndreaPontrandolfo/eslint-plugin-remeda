"use strict";
const assign = require("lodash/assign");
const traverser = require("eslint-traverser");
const RemedaContext = require("../../../src/util/RemedaContext");
const assert = require("assert");
const defaultPragmaConfig = { settings: { remeda: { pragma: "R" } } };

function visitWithContext(code, config, getVisitorsByRemedaContext) {
  traverser(code, config).runRuleCode((context) => {
    const remedaContext = new RemedaContext(context);
    const importVisitors = remedaContext.getImportVisitors();
    return assign(importVisitors, getVisitorsByRemedaContext(remedaContext));
  });
}

describe("RemedaContext", () => {
  describe("getImportVisitors", () => {
    describe("ImportDeclaration", () => {
      it("should accept a namespace import as remeda", (done) => {
        visitWithContext(
          'import * as remeda from "remeda"; remeda.map(arr, x => x)',
          { sourceType: "module" },
          (remedaContext) => ({
            CallExpression(node) {
              assert(remedaContext.general[node.callee.object.name]);
              done();
            },
          }),
        );
      });
      it("should accept a default import as remeda", (done) => {
        visitWithContext(
          'import remeda from "remeda"; remeda.map(arr, x => x)',
          { sourceType: "module" },
          (remedaContext) => ({
            CallExpression(node) {
              assert(remedaContext.general[node.callee.object.name]);
              done();
            },
          }),
        );
      });
      it("should accept a chain imported as module", (done) => {
        visitWithContext(
          'import { chain } from "remeda"; chain.map(arr, x => x)',
          { sourceType: "module" },
          (remedaContext) => ({
            CallExpression(node) {
              assert(remedaContext.general[node.callee.object.name]);
              done();
            },
          }),
        );
      });
      it("should accept a destructured import as remeda", (done) => {
        visitWithContext(
          'import {map} from "remeda"; map(arr, x => x)',
          { sourceType: "module" },
          (remedaContext) => ({
            CallExpression(node) {
              assert(remedaContext.methods[node.callee.name] === "map");
              done();
            },
          }),
        );
      });
      it("should accept a single method import as remeda", (done) => {
        visitWithContext(
          'import map from "remeda/map"; map(arr, x => x)',
          { sourceType: "module" },
          (remedaContext) => ({
            CallExpression(node) {
              assert(remedaContext.methods[node.callee.name] === "map");
              done();
            },
          }),
        );
      });
      it("should not collect anything from arbitrary imports", (done) => {
        visitWithContext(
          'import map from "some-other-map"; map(arr, x => x)',
          { sourceType: "module" },
          (remedaContext) => ({
            CallExpression(node) {
              assert(!remedaContext.methods[node.callee.name]);
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
          (remedaContext) => ({
            CallExpression(node) {
              if (node.callee.property && node.callee.property.name === "map") {
                assert(remedaContext.general[node.callee.object.name]);
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
          (remedaContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(remedaContext.methods[node.callee.name] === "map");
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
          (remedaContext) => ({
            CallExpression(node) {
              if (node.callee.name === "chain") {
                assert(remedaContext.general[node.callee.name]);
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
          (remedaContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(remedaContext.methods[node.callee.name] === "map");
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
          (remedaContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(remedaContext.methods[node.callee.name] !== "map");
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
          (remedaContext) => ({
            CallExpression(node) {
              if (node.callee.name === "map") {
                assert(remedaContext.methods[node.callee.name] !== "map");
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
        (remedaContext) => ({
          CallExpression(node) {
            assert(remedaContext.isImportedRemeda(node.callee.object));
            done();
          },
        }),
      );
    });
    it("should return true for a remeda that was imported as R", (done) => {
      visitWithContext(
        'import * as R from "remeda"; R.map(arr, x => x)',
        { sourceType: "module" },
        (remedaContext) => ({
          CallExpression(node) {
            assert(remedaContext.isImportedRemeda(node.callee.object));
            done();
          },
        }),
      );
    });
    it("should return true for a remeda that was imported as remeda", (done) => {
      visitWithContext(
        'import * as remeda from "remeda"; remeda.map(arr, x => x)',
        { sourceType: "module" },
        (remedaContext) => ({
          CallExpression(node) {
            assert(remedaContext.isImportedRemeda(node.callee.object));
            done();
          },
        }),
      );
    });
    it("should return false for other identifiers", (done) => {
      visitWithContext("const one = 1", undefined, (remedaContext) => ({
        Identifier(node) {
          assert(!remedaContext.isImportedRemeda(node));
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
        (remedaContext) => ({
          CallExpression(node) {
            assert(remedaContext.getImportedRemedaMethod(node) === "map");
            done();
          },
        }),
      );
    });
    it("should return undefined for other function calls", (done) => {
      visitWithContext("const one = f()", undefined, (remedaContext) => ({
        CallExpression(node) {
          assert(remedaContext.getImportedRemedaMethod(node) === undefined);
          done();
        },
      }));
    });
    it("should return undefined for other node types", (done) => {
      visitWithContext("const one = 1", undefined, (remedaContext) => ({
        Identifier(node) {
          assert(remedaContext.getImportedRemedaMethod(node) === undefined);
          done();
        },
      }));
    });
  });
  describe("isRemedaCall", () => {
    it("should return true if pragma is defined and it is a call from it", (done) => {
      visitWithContext(
        'const ids = R.map(users, "id")',
        defaultPragmaConfig,
        (remedaContext) => ({
          CallExpression(node) {
            assert(remedaContext.isRemedaCall(node));
            done();
          },
        }),
      );
    });
    it("should return true if no pragma is defined and the call is an imported remeda", (done) => {
      visitWithContext(
        'import R from "remeda"; const ids = R.map(users, () => "id")',
        { sourceType: "module" },
        (remedaContext) => ({
          CallExpression(node) {
            assert(remedaContext.isRemedaCall(node));
            done();
          },
        }),
      );
    });
  });
});
