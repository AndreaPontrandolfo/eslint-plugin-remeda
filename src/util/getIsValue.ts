import { matches, overEvery } from "lodash-es";
import type { TSESTree } from "@typescript-eslint/utils";
import { isMinus } from "./isMinus";

type GetIsValueReturn = (node: TSESTree.Node) => boolean;

export const getIsValue = (value: number): GetIsValueReturn => {
  return value < 0
    ? // eslint-disable-next-line
      overEvery(isMinus, matches({ argument: { value: -value } }))
    : matches({ value });
};
