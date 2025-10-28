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
