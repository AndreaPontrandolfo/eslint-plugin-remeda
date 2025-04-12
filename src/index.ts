import type { ESLint } from "eslint";
import { last } from "lodash-es";
import packageJson from "../package.json";
import { rules } from "./rules";

const plugin = {
  meta: { name: packageJson.name, version: packageJson.version },
  // @ts-expect-error
  rules,
  configs: {},
  processors: {},
} satisfies ESLint.Plugin;

const pluginShortName = last(plugin.meta.name.split("-")) as string;

const configs = {
  recommended: {
    plugins: {
      [pluginShortName]: plugin,
    },
    rules: {
      [`${pluginShortName}/prefer-is-empty`]: 2,
      [`${pluginShortName}/prefer-is-nullish`]: 2,
      [`${pluginShortName}/prefer-times`]: 2,
      [`${pluginShortName}/prefer-constant`]: 2,
      [`${pluginShortName}/prefer-remeda-typecheck`]: 2,
      [`${pluginShortName}/prefer-nullish-coalescing`]: 2,
      [`${pluginShortName}/prefer-filter`]: [2, 3],
      [`${pluginShortName}/prefer-has-atleast`]: 2,
      [`${pluginShortName}/collection-method-value`]: 2,
      [`${pluginShortName}/collection-return`]: 2,
      [`${pluginShortName}/prefer-map`]: 2,
      [`${pluginShortName}/prefer-find`]: 2,
      [`${pluginShortName}/prefer-some`]: 2,
      [`${pluginShortName}/prefer-flat-map`]: 2,
      [`${pluginShortName}/prefer-do-nothing`]: 2,
    },
  },
};

Object.assign(plugin.configs, configs);

type Plugin = typeof plugin & {
  configs: typeof configs;
};

export default plugin as Plugin;
