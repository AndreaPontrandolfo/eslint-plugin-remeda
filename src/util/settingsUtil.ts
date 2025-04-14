import { defaults, get } from "lodash-es";
import type { ESLintContext } from "../types";

interface RemedaSettings {
  version: number;
  pragma?: string;
}

export function getSettings(context: ESLintContext): RemedaSettings {
  return defaults(get(context, "settings.remeda", {}), {
    version: 4,
  });
}

// export function isEcmaFeatureOn(
//   context: ESLintContext,
//   featureName: string,
// ): boolean {
//   const featureValue = get(context, `ecmaFeatures.${featureName}`);
//   const ecmaVersion = get(context, "parserOptions.ecmaVersion", 0);

//   if (!isNil(featureValue)) {
//     return featureValue;
//   }

//   return ecmaVersion > 5;
// }
