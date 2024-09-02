import collectionMethodValue, {
  RULE_NAME as collectionMethodValueName,
} from "./collection-method-value";
import collectionReturn, {
  RULE_NAME as collectionReturnName,
} from "./collection-return";
import preferConstant, {
  RULE_NAME as preferConstantName,
} from "./prefer-constant";
import preferDoNothing, {
  RULE_NAME as preferDoNothingName,
} from "./prefer-do-nothing";
import preferFilter, { RULE_NAME as preferFilterName } from "./prefer-filter";
import preferFind, { RULE_NAME as preferFindName } from "./prefer-find";
import preferFlatMap, {
  RULE_NAME as preferFlatMapName,
} from "./prefer-flat-map";
import preferIsEmpty, {
  RULE_NAME as preferIsEmptyName,
} from "./prefer-is-empty";
import preferIsNil, { RULE_NAME as preferIsNilName } from "./prefer-is-nil";
import preferMap, { RULE_NAME as preferMapName } from "./prefer-map";
import preferNullishCoalescing, {
  RULE_NAME as preferNullishCoalescingName,
} from "./prefer-nullish-coalescing";
import preferRemedaTypecheck, {
  RULE_NAME as preferRemedaTypecheckName,
} from "./prefer-remeda-typecheck";
import preferSome, { RULE_NAME as preferSomeName } from "./prefer-some";
import preferTimes, { RULE_NAME as preferTimesName } from "./prefer-times";

export const rules = {
  [collectionMethodValueName]: collectionMethodValue,
  [collectionReturnName]: collectionReturn,
  [preferConstantName]: preferConstant,
  [preferDoNothingName]: preferDoNothing,
  [preferFilterName]: preferFilter,
  [preferFindName]: preferFind,
  [preferFlatMapName]: preferFlatMap,
  [preferIsEmptyName]: preferIsEmpty,
  [preferIsNilName]: preferIsNil,
  [preferMapName]: preferMap,
  [preferNullishCoalescingName]: preferNullishCoalescing,
  [preferRemedaTypecheckName]: preferRemedaTypecheck,
  [preferSomeName]: preferSome,
  [preferTimesName]: preferTimes,
};
