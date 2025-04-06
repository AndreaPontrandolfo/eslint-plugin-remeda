# remeda/prefer-has-atleast

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

When checking if an array has at least a certain number of elements, it is more expressive to use `R.hasAtLeast` instead of comparing the array's length with a number.

## Rule Details

The following patterns are considered warnings:

```js
if (array.length >= 3) {
  // ...
}

if (array.length > 2) {
  // ...
}

if (3 <= array.length) {
  // ...
}

if (2 < array.length) {
  // ...
}
```

The following patterns are not considered warnings:

```js
if (R.hasAtLeast(array, 3)) {
  // ...
}

if (array.length === 3) {
  // ...
}

if (array.length < 3) {
  // ...
}

if (array.length <= 3) {
  // ...
}
```

## When Not To Use It

If you do not want to enforce using `R.hasAtLeast` or prefer the explicit array length comparison, you should not use this rule.
