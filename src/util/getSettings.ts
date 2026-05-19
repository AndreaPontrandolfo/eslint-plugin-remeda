import type { ESLintContext } from "../types";

interface RemedaSettings {
  version: number;
  pragma?: string;
}

export function getSettings(context: ESLintContext): RemedaSettings {
  const remedaSettings = context.settings?.remeda;
  
  return { ...remedaSettings, version: remedaSettings?.version ?? 4 };  
}
