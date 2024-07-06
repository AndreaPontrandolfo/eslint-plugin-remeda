"use strict";
const _ = require("lodash");

function fromMessage(message) {
  return fromOptions({ errors: [{ message }] });
}

function fromMessageId(messageId) {
  return fromOptions({ errors: [{ messageId }] });
}

function fromOptions(options) {
  return function (testCase) {
    return _.isString(testCase)
      ? _.assign({ code: testCase }, options)
      : _.defaultsDeep(testCase, options);
  };
}

module.exports = {
  fromMessage,
  fromMessageId,
  fromOptions,
  withDefaultPragma: fromOptions({ settings: { remeda: { pragma: "R" } } }),
};
