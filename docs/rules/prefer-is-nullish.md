# Prefer R.isNullish

When checking that a value is undefined or null (but not false or ''), it is more concise to use R.isNullish instead.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
var t = !R.isNull(x) && !R.isUndefined(x);

var t = x === undefined || x === null;
```

The following patterns are not considered warnings:

```js
var t = R.isNullish(x);

var t = R.isUndefined(x) || R.isNull(y);
```

## When Not To Use It

If you do not want to enforce using `R.isNullish`, and prefer using specific checks instead.
