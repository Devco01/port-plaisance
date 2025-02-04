"use strict";

module.exports = {
    languageOptions: {
        ecmaVersion: 5,
        sourceType: 'commonjs',
        globals: {
            // Test globals
            describe: 'readonly',
            it: 'readonly',
            expect: 'readonly',
            beforeAll: 'readonly',
            afterAll: 'readonly',
            beforeEach: 'readonly',
            afterEach: 'readonly',
            done: 'readonly',
            // Node globals
            process: 'readonly',
            require: 'readonly',
            module: 'readonly',
            __dirname: 'readonly',
            console: 'readonly'
        }
    },
    rules: {
        'no-var': 'off',
        'prefer-const': 'off',
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'indent': ['error', 4],
        'linebreak-style': ['off'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', { 
            varsIgnorePattern: '^(_|[A-Z][a-zA-Z]*)',
            args: 'none'
        }],
        'no-console': 'off'
    }
}; 