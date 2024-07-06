# Collection Method Value

When using a Remeda collection method, the expression should be used (e.g. assigning to a variable or check in a condition), unless it's a method meant for side effects (e.g. `forEach` or `forOwn`) which should NOT be used.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
x = R.forEach(arr, g);

R.map(arr, f);
```

The following patterns are not considered warnings:

```js
x = R.map(arr, f);

R.forEach(arr, g);

if (R.some(arr, h)) {
  i();
}
```
