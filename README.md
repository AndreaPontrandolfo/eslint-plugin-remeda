# ESLint Plugin Remeda

ESLint plugin for [Remeda](https://github.com/remeda/remeda).

## Preamble

This plugin was originally derived from [eslint-plugin-lodash-f](https://github.com/AndreaPontrandolfo/eslint-plugin-lodash) (fork of [eslint-plugin-lodash](https://github.com/wix-incubator/eslint-plugin-lodash)) and used that as a base to build upon.

## Installation

First, you'll first need to install [ESLint](https://eslint.org/):

```sh
pnpm add -D eslint
```

Next, install `eslint-plugin-remeda`:

```sh
pnpm add -D eslint-plugin-remeda
```

## Rules

Enable all of the rules that you would like to use. All rules are off by default, unless you use one of the plugin's configurations which turn all relevant rules on.

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                 | 💼  | 🔧  |
| :------------------------------------------------------------------- | :-- | :-- |
| [collection-method-value](docs/rules/collection-method-value.md)     | ✅  |     |
| [collection-return](docs/rules/collection-return.md)                 | ✅  |     |
| [prefer-constant](docs/rules/prefer-constant.md)                     | ✅  |     |
| [prefer-do-nothing](docs/rules/prefer-do-nothing.md)                 | ✅  |     |
| [prefer-filter](docs/rules/prefer-filter.md)                         | ✅  |     |
| [prefer-find](docs/rules/prefer-find.md)                             | ✅  |     |
| [prefer-flat-map](docs/rules/prefer-flat-map.md)                     | ✅  |     |
| [prefer-is-empty](docs/rules/prefer-is-empty.md)                     | ✅  | 🔧  |
| [prefer-is-nullish](docs/rules/prefer-is-nullish.md)                 | ✅  |     |
| [prefer-map](docs/rules/prefer-map.md)                               | ✅  |     |
| [prefer-nullish-coalescing](docs/rules/prefer-nullish-coalescing.md) | ✅  | 🔧  |
| [prefer-remeda-typecheck](docs/rules/prefer-remeda-typecheck.md)     | ✅  |     |
| [prefer-some](docs/rules/prefer-some.md)                             | ✅  |     |
| [prefer-times](docs/rules/prefer-times.md)                           | ✅  |     |

<!-- end auto-generated rules list -->

## Contributing

Contributions are always welcome! For more info, read our [contribution guide](.github/CONTRIBUTING.md).
