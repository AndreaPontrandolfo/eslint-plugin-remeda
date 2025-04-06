# remeda/prefer-is-empty

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When checking if a collection is empty or no, it is more concise to use R.isEmpty instead.

## Rule Details

This rule takes no arguments.

The following patterns are considered warnings:

```js
const myLengthEqualZero = myVar.length === 0;

const myLengthEqualZero = myVar.length > 0;

const myLengthEqualZero = myVar.length > 0 ? "first" : "second";

const myLengthEqualZero = myVar.myProp.mySecondProp.length === 0;

const myLengthEqualZero = myVar.myProp.mySecondProp.length > 0;
```

The following patterns are not considered warnings:

```js
const myLengthEqualZero = !isEmpty(myVar);

const myLengthEqualZero = isEmpty(myVar);

const myLengthEqualZero = myVar.length == 0;

const myLengthEqualZero = myVar.length;

const myLengthEqualZero = myVar;
```

## When Not To Use It

If you do not want to enforce using `R.isEmpty`, and prefer using native checks instead.
