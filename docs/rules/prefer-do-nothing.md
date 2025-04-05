# remeda/prefer-do-nothing

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

When defining an empty function (e.g. for callbacks) it can be more readable to use `R.doNothing()` or `R.constant(undefined)` instead. Use `R.doNothing()` if you need to return void, otherwise use `R.constant(undefined)`.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
functionWithCallback(function () {});

const emptyFunction = () => {};
```

The following patterns are not considered warnings:

```js
functionWithCallback(function (x) {
  return x + 1;
});

const sqr = (x) => x * x;
```

## When Not To Use It

If you do not want to enforce using `R.doNothing`, you should not use this rule.
