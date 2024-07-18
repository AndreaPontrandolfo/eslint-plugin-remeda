import { isString, assign, defaultsDeep } from "lodash";

function fromMessage(message) {
  return fromOptions({ errors: [{ message }] });
}

function fromMessageId(messageId) {
  return fromOptions({ errors: [{ messageId }] });
}

function fromOptions(options) {
  return function (testCase) {
    return isString(testCase)
      ? assign({ code: testCase }, options)
      : defaultsDeep(testCase, options);
  };
}

const withDefaultPragma = fromOptions({
  settings: { remeda: { pragma: "R" } },
});

export { fromMessage, fromMessageId, fromOptions, withDefaultPragma };
