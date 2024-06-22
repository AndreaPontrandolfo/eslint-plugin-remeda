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

This plugin was originally derived from a [eslint-plugin-lodash](https://github.com/wix-incubator/eslint-plugin-lodash) fork [eslint-plugin-lodash-f](https://github.com/AndreaPontrandolfo/eslint-plugin-lodash) and used that as a base to build upon.

## Usage

Finally, enable all of the rules that you would like to use.

# List of provided rules

Rules are divided into categories for your convenience. All rules are off by default, unless you use one of the plugin's configurations which turn all relevant rules on.

### Possible Errors

The following rules point out areas where you might have made mistakes.

- [collection-method-value](docs/rules/collection-method-value.md): Use value returned from collection methods properly.
- [collection-return](docs/rules/collection-return.md): Always return a value in iteratees of Lodash collection methods that aren't `forEach`.
- [no-double-unwrap](docs/rules/no-double-unwrap.md): Do not use `.value()` on chains that have already ended (e.g. with `max()` or `reduce()`) (fixable)
- [no-unbound-this](docs/rules/no-unbound-this.md): Do not use `this` inside callbacks without binding them.
- [unwrap](docs/rules/unwrap.md): Prevent chaining without evaluation via `value()` or non-chainable methods like `max()`.,

### Stylistic Issues

These rules are purely matters of style and are quite subjective.

- [chain-style](docs/rules/chain-style.md): Enforce a specific chain style: explicit, implicit, or explicit only when necessary.
- [chaining](docs/rules/chaining.md): Prefer a either a Lodash chain or nested Lodash calls
- [collection-ordering](docs/rules/collection-ordering.md): Enforce a specific collection sorting method: `sortBy` or `orderBy`
- [consistent-compose](docs/rules/consistent-compose.md): Enforce a specific function composition direction: `flow` or `flowRight`.
- [identity-shorthand](docs/rules/identity-shorthand.md): Prefer identity shorthand syntax
- [matches-prop-shorthand](docs/rules/matches-prop-shorthand.md): Prefer matches property shorthand syntax
- [matches-shorthand](docs/rules/matches-shorthand.md): Prefer matches shorthand syntax
- [no-commit](docs/rules/no-commit.md): Do not use `.commit()` on chains that should end with `.value()`
- [path-style](docs/rules/path-style.md): Enforce a specific path style for methods like `get` and `property`: array, string, or arrays only for paths with variables. (fixable)
- [prefer-filter](docs/rules/prefer-filter.md): Prefer `_.filter` over `_.forEach` with an `if` statement inside.
- [prefer-find](docs/rules/prefer-find.md): Prefer `_.find` over `_.filter` followed by selecting the first result.
- [prefer-flat-map](docs/rules/prefer-flat-map.md): Prefer `_.flatMap` over consecutive `map` and `flatten`.
- [prefer-immutable-method](docs/rules/prefer-immutable-method.md): Prefer using methods that do not mutate the source parameters, e.g. `_.without` instead of `_.pull`.
- [prefer-invoke-map](docs/rules/prefer-invoke-map.md): Prefer using `_.invoke` over `_.map` with a method call inside.
- [prefer-map](docs/rules/prefer-map.md): Prefer `_.map` over `_.forEach` with a `push` inside.
- [prefer-nullish-coalescing](docs/rules/prefer-nullish-coalescing.md): Prefer `??` when doing a comparison with a non-nil value as test.
- [prefer-wrapper-method](docs/rules/prefer-wrapper-method.md): Prefer using array and string methods in the chain and not the initial value, e.g. `_(str).split(' ')...`
- [prop-shorthand](docs/rules/prop-shorthand.md): Use/forbid property shorthand syntax.

#### Preference over native

These rules are also stylistic choices, but they also recommend using Lodash instead of native functions and constructs.
For example, Lodash collection methods (e.g. `map`, `forEach`) are generally faster than native collection methods.

- [prefer-constant](docs/rules/prefer-constant.md): Prefer `_.constant` over functions returning literals.
- [prefer-get](docs/rules/prefer-get.md): Prefer using `_.get` or `_.has` over expression chains like `a && a.b && a.b.c`.
- [prefer-includes](docs/rules/prefer-includes.md): Prefer `_.includes` over comparing `indexOf` to -1.
- [prefer-is-empty](docs/rules/prefer-is-empty.md): Prefer `_.isEmpty` over manual checking for length value.
- [prefer-is-nil](docs/rules/prefer-is-nil.md): Prefer `_.isNil` over checks for both null and undefined.
- [prefer-lodash-chain](docs/rules/prefer-lodash-chain.md): Prefer using Lodash chains (e.g. `_.map`) over native and mixed chains.
- [prefer-lodash-method](docs/rules/prefer-lodash-method.md): Prefer using Lodash collection methods (e.g. `_.map`) over native array methods.
- [prefer-lodash-typecheck](docs/rules/prefer-lodash-typecheck.md): Prefer using `_.is*` methods over `typeof` and `instanceof` checks when applicable.
- [prefer-noop](docs/rules/prefer-noop.md): Prefer `_.noop` over empty functions.
- [prefer-over-quantifier](docs/rules/prefer-over-quantifier.md): Prefer `_.overSome` and `_.overEvery` instead of checks with `&&` and `||` for methods that have a boolean check iteratee.
- [prefer-some](docs/rules/prefer-some.md): Prefer using `_.some` over comparing `findIndex` to -1.
- [prefer-startswith](docs/rules/prefer-startswith.md): Prefer `_.startsWith` over `a.indexOf(b) === 0`.
- [prefer-times](docs/rules/prefer-times.md): Prefer `_.times` over `_.map` without using the iteratee's arguments.

# Contributing

Contributions are always welcome! For more info, read our [contribution guide](.github/CONTRIBUTING.md).
