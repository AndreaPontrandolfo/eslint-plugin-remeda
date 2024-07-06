# Collection Return Statement

When using a Remeda collection method that isn't forEach, the iteratee should return a value, otherwise it could result in either unclear code or unexpected results.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js

R.map(arr, function(x) { console.log(x); });

R.some(arr, function(x) { if (x.a) {f(x); });

R.every(collection, x => { f(x); });

```

The following patterns are not considered warnings:

```js
R.map((x) => x + 1);

R.forEach(arr, function (a) {
  console.log(a);
});
```
