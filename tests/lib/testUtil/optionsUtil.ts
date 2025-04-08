import { assign, defaultsDeep, isString } from "lodash-es";

type TestCase = string | Record<string, unknown>;
type TestOptions = Record<string, Record<string, unknown>[]>;

function fromOptions(
  options: TestOptions,
): (testCase: TestCase) => Record<string, unknown> {
  return function (testCase: TestCase) {
    return isString(testCase)
      ? assign({ code: testCase }, options)
      : defaultsDeep(testCase, options);
  };
}

function fromMessage(message: string) {
  return fromOptions({ errors: [{ message }] });
}

function fromMessageId(messageId: string) {
  return fromOptions({ errors: [{ messageId }] });
}

const withDefaultPragma = fromOptions({
  settings: { remeda: { pragma: "R" } },
});

export { fromMessage, fromMessageId, fromOptions, withDefaultPragma };
