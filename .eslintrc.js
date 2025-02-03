module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:jest/recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['jest', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'no-console': 'warn',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'jest/expect-expect': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/valid-expect': 'error',
        'no-process-env': 'off',
        'no-underscore-dangle': 'off'
    },
    settings: {
        jest: {
            version: 29
        }
    },
    ignorePatterns: [
        'node_modules/',
        'coverage/',
        'dist/',
        'public/',
        '*.test.js'
    ]
}; 