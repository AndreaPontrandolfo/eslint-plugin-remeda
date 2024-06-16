'use strict'
const _ = require('lodash')

function fromMessage(message) {
    return fromOptions({errors: [{message}]})
}

function fromMessageId(messageId) {
    return fromOptions({errors: [{messageId}]})
}

function fromOptions(options) {
    return function (testCase) {
        return _.isString(testCase) ? _.assign({code: testCase}, options) : _.defaultsDeep(testCase, options)
    }
}

module.exports = {
    fromMessage,
    fromMessageId,
    fromVersion3: fromOptions({settings: {lodash: {version: 3}}}),
    fromVersion3WithDefaultPragma: fromOptions({settings: {lodash: {version: 3, pragma: '_'}}}),
    fromOptions,
    withDefaultPragma: fromOptions({settings: {lodash: {pragma: '_'}}})
}