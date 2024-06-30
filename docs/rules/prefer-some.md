# Prefer \_.some

When comparing the index of an item with an `findIndex` method, it can be more expressive to use `_.some`, when only the sole existence of a matching item is taken into account.

## Rule Details

The following patterns are considered warnings:

```js
var a = _.findIndex(b, f) === -1;

var a = _.findIndex(b, f) >= 0;
```

The following patterns are not considered warnings:

```js
x = _.findIndex(a, f);

_.findIndex(a, f) === 2;

if (_.some(a, f)) {
  // ...
}
```

## When Not To Use It

If you do not want to enforce using `_.findIndex`, you should not use this rule.
