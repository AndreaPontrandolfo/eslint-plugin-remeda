import { matchesProperty } from "lodash-es";

const isReturnStatement = matchesProperty("type", "ReturnStatement");

export { isReturnStatement };
