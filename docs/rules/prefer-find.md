# remeda/prefer-find

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

When using R.filter and accessing the first or last result, you should probably use `R.find` or `R.findLast`, respectively.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
const x = R.filter(a, f)[0];
```

```js
const x = R.head(R.filter(a, f));
```

```js
const x = R.last(R.filter(a, f));
```

```js
const x = R.head(R.reject(a, f));
```

The following patterns are not considered warnings:

```js
const x = R.filter(a, f);
```

```js
const x = R.filter(a, f)[3];
```

```js
const x = R.find(a, f);
```
