# remeda/prefer-has-atleast

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

When checking if an array has at least a certain number of elements, it is more expressive to use `R.hasAtLeast` instead of comparing the array's length with a number.

Additionally, when checking if an array is not empty, it's better to use `R.hasAtLeast(data, 1)` instead of negated `R.isEmpty(data)` patterns (`!R.isEmpty(data)`) because the TypeScript type narrowing works better with `hasAtLeast`.

## Rule Details

The following patterns are considered warnings:

```js
// Array length comparisons
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

// Negated isEmpty patterns (problematic for TypeScript type narrowing)
if (!R.isEmpty(array)) {
  // TypeScript won't narrow the array type here
}

if (R.isEmpty(array) === false) {
  // Same issue with type narrowing
}

if (R.isEmpty(array) !== true) {
  // Same issue with type narrowing
}
```

The following patterns are not considered warnings:

```js
// Using hasAtLeast
if (R.hasAtLeast(array, 3)) {
  // ...
}

// For non-empty checks, use hasAtLeast with 1
if (R.hasAtLeast(array, 1)) {
  // TypeScript correctly narrows the type here
}

// Other length comparisons
if (array.length === 3) {
  // ...
}

if (array.length < 3) {
  // ...
}

if (array.length <= 3) {
  // ...
}

// Regular isEmpty checks are fine
if (R.isEmpty(array)) {
  // ...
}
```

## Type Safety Improvement

From Remeda documentation:

> "This guard [isEmpty] doesn't work negated because of typescript limitations! If you need to check that an array is not empty, use R.hasAtLeast(data, 1) and not !R.isEmpty(data). For strings and objects there's no way in typescript to narrow the result to a non-empty type."

Using `R.hasAtLeast(array, 1)` instead of `!R.isEmpty(array)` improves type safety because TypeScript can properly narrow the array type to a non-empty array, which helps prevent "possibly undefined" errors when accessing array elements.

## When Not To Use It

If you do not want to enforce using `R.hasAtLeast` or prefer the explicit array length comparison, you should not use this rule. However, consider enabling it at least for the negated `isEmpty` patterns to improve type safety.
