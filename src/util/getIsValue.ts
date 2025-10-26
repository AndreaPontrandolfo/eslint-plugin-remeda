import { matches, overEvery } from "lodash-es";
import isMinus from "./isMinus";

function getIsValue(value: number) {
  return value < 0
    ? overEvery(isMinus, matches({ argument: { value: -value } }))
    : matches({ value });
}

export default getIsValue;
