module.exports = {
    root: true,
    env: {
        node: true,
        jest: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    extends: ['eslint:recommended'],
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['off'],
        quotes: ['error', 'double'],
        semi: ['error', 'always'],
        'no-var': 'off'
    },
    ignorePatterns: [
        'client/**/*',
        'coverage/**/*',
        'build/**/*',
        'node_modules/**/*',
        '*.config.js',
        'data/**/*'
    ]
};
