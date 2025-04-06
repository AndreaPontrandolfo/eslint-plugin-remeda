import { version } from "../../package.json";

const REPO_URL = "https://github.com/AndreaPontrandolfo/eslint-plugin-remeda";

/**
 * Generates the URL to documentation for the given rule name. It uses the
 * package version to build the link to a tagged version of the
 * documentation file.
 *
 * @param ruleName - Name of the eslint rule.
 * @returns URL to the documentation for the given rule.
 */
export function getDocsUrl(ruleName: string) {
  return `${REPO_URL}/blob/v${version}/docs/rules/${ruleName}.md`;
}
