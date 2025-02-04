module.exports = {
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'commonjs',
        globals: {
            // Node globals
            process: true,
            require: true,
            module: true,
            __dirname: true,
            // Test globals
            describe: true,
            it: true,
            expect: true,
            beforeAll: true,
            afterAll: true,
            beforeEach: true,
            afterEach: true,
            jest: true
        }
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['off'],
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    },
    ignores: [
        'client/**/*',
        'build/**',
        'dist/**',
        'coverage/**',
        'node_modules/**',
        '*.config.js'
    ]
}; 