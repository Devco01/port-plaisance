"use strict";

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "commonjs",
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
            indent: ["error", 4],
            "linebreak-style": ["off"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "no-var": "off",
            "comma-dangle": ["error", "never"]
        },
        ignores: [
            "client/",
            "client/**",
            "coverage/**/*",
            "build/**/*",
            "node_modules/**/*",
            "*.config.js",
            "data/",
            "coverage/",
            "dist/"
        ]
    }
];
