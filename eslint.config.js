"use strict";

var reactPlugin = require('eslint-plugin-react');
var reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-var": "off",  // Permettre l'utilisation de var
        "prefer-const": "off", // Ne pas forcer l'utilisation de const
        "prefer-arrow-callback": "off", // Permettre les fonctions classiques
        "func-names": "off", // Permettre les fonctions anonymes
        // Configuration React/Client
        'indent': ['error', 4],
        'linebreak-style': ['off'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', { 
            varsIgnorePattern: '^(React|_|[A-Z][a-zA-Z]*)',
            args: 'none'
        }],
        'no-console': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
}; 