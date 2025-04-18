/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { capitalize, includes } from "lodash-es";
import type { RemedaMethodVisitors } from "../types";
import astUtil from "./astUtil";
import * as methodDataUtil from "./methodDataUtil";
import RemedaContext from "./RemedaContext";

/**
 * Returns whether the node is a call to the specified method.
 *
 * @param node - The node to check.
 * @param method - The method to check against.
 * @returns Whether the node is a call to the specified method.
 */
function isCallToMethod(node, method) {
  return method === astUtil.getMethodName(node);
}

/**
 * Gets the 'isX' method for a specified type, e.g. IsObject.
 *
 * @param name - The name of the type to get the 'isX' method for.
 */
function getIsTypeMethod(name) {
  const types = [
    "number",
    "boolean",
    "function",
    "Function",
    "string",
    // "object",
    // "undefined",
    "Date",
    "Array",
    "Error",
    // "Element",
  ];

  return includes(types, name) ? `is${capitalize(name)}` : null;
}

/**
 * Gets the context's Remeda settings and a function and returns a visitor that calls the function for every Remeda or chain call.
 *
 * @param remedaContext - The Remeda context.
 * @param reporter - The reporter to use.
 * @returns A visitor that calls the function for every Remeda or chain call.
 */
function getRemedaMethodCallExpVisitor(remedaContext, reporter) {
  return function (node) {
    let iterateeIndex;

    if (remedaContext.isRemedaCall(node)) {
      const method = astUtil.getMethodName(node);

      //@ts-expect-error
      iterateeIndex = methodDataUtil.getIterateeIndex(method);
      reporter(node, node.arguments[iterateeIndex], {
        callType: "method",
        method,
        remedaContext,
      });
    } else {
      const method = remedaContext.getImportedRemedaMethod(node);

      if (method) {
        iterateeIndex = methodDataUtil.getIterateeIndex(method);
        reporter(node, node.arguments[iterateeIndex], {
          method,
          callType: "single",
          remedaContext,
        });
      }
    }
  };
}

function isRemedaCallToMethod(
  node: { type?: string } | null | undefined,
  method: string,
  remedaContext: { isRemedaCall: (node: unknown) => boolean },
): boolean {
  return remedaContext.isRemedaCall(node) && isCallToMethod(node, method);
}

function isCallToRemedaMethod(
  node: { type?: string } | null | undefined,
  method: string,
  remedaContext: {
    getImportedRemedaMethod: (node: unknown) => string;
    isRemedaCall: (node: unknown) => boolean;
  },
): boolean {
  if (!node || node.type !== "CallExpression") {
    return false;
  }

  return (
    isRemedaCallToMethod(node, method, remedaContext) ||
    method === remedaContext.getImportedRemedaMethod(node)
  );
}

function getRemedaMethodVisitors(context, remedaCallExpVisitor) {
  const remedaContext = new RemedaContext(context);
  const visitors: RemedaMethodVisitors = remedaContext.getImportVisitors();

  visitors.CallExpression = getRemedaMethodCallExpVisitor(
    remedaContext,
    remedaCallExpVisitor,
  );

  return visitors;
}

/**
 * Gets a RemedaContext for a given context.
 *
 * @param context - The context to get the Remeda context for.
 * @returns A RemedaContext for a given context.
 */
function getRemedaContext(context) {
  return new RemedaContext(context);
}

export {
  getIsTypeMethod,
  getRemedaContext,
  getRemedaMethodCallExpVisitor,
  getRemedaMethodVisitors,
  isCallToMethod,
  isCallToRemedaMethod,
};
