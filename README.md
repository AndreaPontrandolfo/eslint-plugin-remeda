# 🚧 UNDER CONSTRUCTION 🚧

This library is still under construction. Don't use this in production yet. If you want to contribute, look at the open issues.

# ESLint Plugin Remeda

ESLint plugin for [Remeda](https://github.com/remeda/remeda).

## Installation

First, you'll first need to install [ESLint](https://eslint.org/):

```sh
npm add eslint -D
```

Next, install `eslint-plugin-remeda`:

```sh
npm add eslint-plugin-remeda -D
```

## Preamble

This plugin was originally derived from [eslint-plugin-lodash-f](https://github.com/AndreaPontrandolfo/eslint-plugin-lodash) (fork of [eslint-plugin-lodash](https://github.com/wix-incubator/eslint-plugin-lodash)) and used that as a base to build upon.

## Rules

Enable all of the rules that you would like to use. All rules are off by default, unless you use one of the plugin's configurations which turn all relevant rules on.

- [collection-method-value](docs/rules/collection-method-value.md): Use value returned from collection methods properly.
- [collection-return](docs/rules/collection-return.md): Always return a value in iteratees of Lodash collection methods that aren't `forEach`.
- [prefer-filter](docs/rules/prefer-filter.md): Prefer `R.filter` over `R.forEach` with an `if` statement inside.
- [prefer-find](docs/rules/prefer-find.md): Prefer `R.find` over `R.filter` followed by selecting the first result.
- [prefer-flat-map](docs/rules/prefer-flat-map.md): Prefer `R.flatMap` over consecutive `map` and `flatten`.
- [prefer-map](docs/rules/prefer-map.md): Prefer `R.map` over `R.forEach` with a `push` inside.
- [prefer-nullish-coalescing](docs/rules/prefer-nullish-coalescing.md): Prefer `??` when doing a comparison with a non-nullish value as test.
- [prefer-constant](docs/rules/prefer-constant.md): Prefer `R.constant` over functions returning literals.
- [prefer-get](docs/rules/prefer-get.md): Prefer using `R.get` or `R.has` over expression chains like `a && a.b && a.b.c`.
- [prefer-is-empty](docs/rules/prefer-is-empty.md): Prefer `R.isEmpty` over manual checking for length value.
- [prefer-is-nil](docs/rules/prefer-is-nil.md): Prefer `R.isNil` over checks for both null and undefined.
- [prefer-lodash-method](docs/rules/prefer-lodash-method.md): Prefer using Lodash collection methods (e.g. `R.map`) over native array methods.
- [prefer-lodash-typecheck](docs/rules/prefer-lodash-typecheck.md): Prefer using `R.is*` methods over `typeof` and `instanceof` checks when applicable.
- [prefer-noop](docs/rules/prefer-noop.md): Prefer `R.noop` over empty functions.
- [prefer-some](docs/rules/prefer-some.md): Prefer using `R.some` over comparing `findIndex` to -1.
- [prefer-times](docs/rules/prefer-times.md): Prefer `R.times` over `R.map` without using the iteratee's arguments.

## Contributing

Contributions are always welcome! For more info, read our [contribution guide](.github/CONTRIBUTING.md).
