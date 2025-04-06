import { defaults, get, isNil } from "lodash-es";

interface ESLintContext {
  settings?: {
    remeda?: {
      version?: number;
    };
  };
  ecmaFeatures?: Record<string, boolean>;
  parserOptions?: {
    ecmaVersion?: number;
  };
}

export function getSettings(context: ESLintContext) {
  return defaults(get(context, "settings.remeda", {}), {
    version: 4,
  });
}

export function isEcmaFeatureOn(
  context: ESLintContext,
  featureName: string,
): boolean {
  const featureValue = get(context, `ecmaFeatures.${featureName}`);
  const ecmaVersion = get(context, "parserOptions.ecmaVersion", 0);

  if (!isNil(featureValue)) {
    return featureValue;
  }

  return ecmaVersion > 5;
}
