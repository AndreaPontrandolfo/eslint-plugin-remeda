# remeda/prefer-map

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

When using `R.forEach` that pushes into an array, it could improve readability to use `R.map` instead.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
R.forEach(arr, function (x) {
  newArr.push(f(x));
});
```

The following patterns are not considered warnings:

```js
R.forEach(arr, function (x) {
  if (x.a) {
    a.push(x);
  }
});
```

## When Not To Use It

If you do not want to enforce using `map`, you should not use this rule.
