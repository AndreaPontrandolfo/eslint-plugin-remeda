'use strict'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const rules = fs.readdirSync(path.resolve(__dirname, 'rules')).map(f => f.replace(/\.js$/, ''))
const recommended = {
    plugins: ['lodash-f'],
    rules: {
        'lodash-f/callback-binding': 1,
        'lodash-f/chain-style': [1, 'as-needed'],
        'lodash-f/chaining': 1,
        'lodash-f/collection-method-value': 1,
        'lodash-f/collection-ordering': 1,
        'lodash-f/collection-return': 1,
        'lodash-f/consistent-compose': [1, 'flow'],
        'lodash-f/identity-shorthand': [1, 'always'],
        'lodash-f/import-scope': [1],
        'lodash-f/matches-prop-shorthand': [1, 'always'],
        'lodash-f/matches-shorthand': [1, 'always', 3],
        'lodash-f/no-commit': 1,
        'lodash-f/no-double-unwrap': 1,
        'lodash-f/no-extra-args': 1,
        'lodash-f/no-unbound-this': 1,
        'lodash-f/path-style': [1, 'string'],
        'lodash-f/prefer-compact': 1,
        'lodash-f/prefer-constant': 1,
        'lodash-f/prefer-filter': [2, 3],
        'lodash-f/prefer-find': 1,
        'lodash-f/prefer-flat-map': 1,
        'lodash-f/prefer-get': [2, 3],
        'lodash-f/prefer-immutable-method': 1,
        'lodash-f/prefer-includes': [1, {includeNative: true}],
        'lodash-f/prefer-invoke-map': 1,
        'lodash-f/prefer-is-empty': 1,
        'lodash-f/prefer-is-nil': 1,
        'lodash-f/prefer-lodash-chain': 1,
        'lodash-f/prefer-lodash-method': 1,
        'lodash-f/prefer-lodash-typecheck': 1,
        'lodash-f/prefer-map': 1,
        'lodash-f/prefer-matches': [2, 3],
        'lodash-f/prefer-nullish-coalescing': 1,
        'lodash-f/prefer-noop': 1,
        'lodash-f/prefer-over-quantifier': 1,
        'lodash-f/prefer-reject': [2, 3],
        'lodash-f/prefer-some': [1, {includeNative: true}],
        'lodash-f/prefer-startswith': 1,
        'lodash-f/prefer-thru': 1,
        'lodash-f/prefer-times': 1,
        'lodash-f/prefer-wrapper-method': 1,
        'lodash-f/preferred-alias': 1,
        'lodash-f/prop-shorthand': [1, 'always'],
        'lodash-f/unwrap': 1
    }
}
module.exports = {
    rules: _.zipObject(rules, rules.map(rule => require(`./rules/${rule}`))),
    configs: {
        recommended,
        canonical: _.defaultsDeep({
            settings: {lodash: {pragma: '_'}},
            rules: {
                'lodash/import-scope': [2, 'full']
            }
        }, recommended),
        v3: {
            settings: {
                lodash: {
                    version: 3,
                    pragma: '_'
                }
            },
            rules: {
                'lodash/callback-binding': 2,
                'lodash/chain-style': [2, 'as-needed'],
                'lodash/chaining': [2, 'implicit'],
                'lodash/collection-method-value': 2,
                'lodash/collection-return': 2,
                'lodash/consistent-compose': [2, 'flow'],
                'lodash/import-scope': [2, 'full'],
                'lodash/identity-shorthand': [2, 'always'],
                'lodash/matches-prop-shorthand': [2, 'always'],
                'lodash/matches-shorthand': [2, 'always', 3],
                'lodash/no-commit': 2,
                'lodash/no-double-unwrap': 2,
                'lodash/no-extra-args': 2,
                'lodash/path-style': [2, 'string'],
                'lodash/prefer-compact': 2,
                'lodash/prefer-constant': 2,
                'lodash/prefer-filter': [2, 3],
                'lodash/prefer-get': [2, 3],
                'lodash/prefer-includes': [2, {includeNative: true}],
                'lodash/prefer-lodash-chain': 2,
                'lodash/prefer-lodash-method': 2,
                'lodash/prefer-lodash-typecheck': 2,
                'lodash/prefer-map': 2,
                'lodash/prefer-matches': [2, 3],
                'lodash/prefer-noop': 2,
                'lodash/prefer-reject': [2, 3],
                'lodash/prefer-some': [2, {includeNative: true}],
                'lodash/prefer-startswith': 2,
                'lodash/prefer-thru': 2,
                'lodash/prefer-times': 2,
                'lodash/prefer-wrapper-method': 2,
                'lodash/preferred-alias': 2,
                'lodash/prop-shorthand': [2, 'always'],
                'lodash/unwrap': 2
            }
        }
    }
}
