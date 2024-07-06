# Prefer R.times

When using `R.map` in which the iteratee does not have any arguments, it's better to use `R.times`.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
R.map(arr, function () {
  return 7;
});

R.map(Array(10), function () {
  return f(y);
});

import f from "remeda/map";
f(arr, () => 0);
```

The following patterns are not considered warnings:

```js
R.times(arr.length, R.constant(7));

R.map(arr, function (x) {
  return x * x;
});
```

## When Not To Use It

If you do not want to enforce always using `times` when not using the arguments, you should not use this rule.
