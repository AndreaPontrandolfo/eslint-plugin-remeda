'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../src/rules/prefer-nullish-coalescing')
const ruleTesterUtil = require('../testUtil/ruleTesterUtil')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = ruleTesterUtil.getRuleTester()
const {withDefaultPragma, fromMessage} = require('../testUtil/optionsUtil')
const toErrorObject = fromMessage('Prefer nullish coalescing over checking a ternary with !isNil.')
ruleTester.run('prefer-nullish-coalescing', rule, {
    valid: [
        'const myExpression = myVar ?? myOtherVar;',
        'const myExpression = !isNil(myVar) ? mySecondVar : myThirdVar;',
        'const myExpression = myOtherVar ? myVar : !isNil(myVar);',
        'const myExpression = myOtherVar ? !isNil(myVar) : myVar;',
        'const myExpression = (myVar ?? myOtherVar) ? doThis() : doThat();',
        'const myExpression = (myVar?.thisProp ?? myOtherVar[thatProp]) ? doThis() : doThat();',
        'myVar ?? myOtherVar;' 
    ].map(withDefaultPragma),
    invalid: [
        {code: 'const myExpression = !isNil(myVar) ? myVar : myOtherVar;', output: 'const myExpression = myVar ?? myOtherVar;'},
        {code: '!isNil(myVar) ? myVar : myOtherVar;', output: 'myVar ?? myOtherVar;'}
    ].map(withDefaultPragma).map(toErrorObject)
})
