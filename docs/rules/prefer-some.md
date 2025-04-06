# remeda/prefer-some

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

When comparing the index of an item with an `findIndex` method, it can be more expressive to use `R.some`, when only the sole existence of a matching item is taken into account.

## Rule Details

The following patterns are considered warnings:

```js
var a = R.findIndex(b, f) === -1;

var a = R.findIndex(b, f) >= 0;
```

The following patterns are not considered warnings:

```js
x = R.findIndex(a, f);

R.findIndex(a, f) === 2;

if (R.some(a, f)) {
  // ...
}
```

## When Not To Use It

If you do not want to enforce using `R.findIndex`, you should not use this rule.
