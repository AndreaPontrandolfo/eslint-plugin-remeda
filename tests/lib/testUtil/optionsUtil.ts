import { isString } from "remeda";

type TestCase = string | { code: string; [key: string]: unknown };
type TestOptions = Record<string, unknown>;
interface TestCaseResult {
  code: string;
  [key: string]: unknown;
}

function fromOptions(
  options: TestOptions,
): (testCase: TestCase) => TestCaseResult {
  return function (testCase: TestCase): TestCaseResult {
    if (isString(testCase)) {
      return { code: testCase, ...options };
    }

    return { ...testCase, ...options };
  };
}

function fromMessage(message: string) {
  return fromOptions({ errors: [{ message }] });
}

// function fromMessageId(messageId: string) {
//   return fromOptions({ errors: [{ messageId }] });
// }

const withDefaultPragma = fromOptions({
  settings: { remeda: { pragma: "R" } },
});

export { fromMessage, withDefaultPragma };
