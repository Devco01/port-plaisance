module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        jest: true,
        browser: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    ignorePatterns: [
        'client/**/*',
        'build/**',
        'dist/**',
        'coverage/**',
        'node_modules/**',
        '*.config.js'
    ],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['off'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-var': 'error',
        'prefer-const': 'error'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
