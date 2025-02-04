module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        jest: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    ignorePatterns: [
        'client/**/*',
        'build/**',
        'dist/**',
        'coverage/**',
        'node_modules/**'
    ],
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['off'],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'semi': ['error', 'always'],
        'no-var': 'off',
        'prefer-const': 'off'
    }
};
