const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsx = require('@babel/eslint-parser');

module.exports = [
    {
        ignores: ['build/*', 'node_modules/*']
    },
    {
        files: ['src/**/*.{js,jsx}'],
        plugins: {
            react: react,
            'react-hooks': reactHooks
        },
        languageOptions: {
            parser: jsx,
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-react']
                }
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                React: true,
                JSX: true
            }
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn'
        }
    }
]; 