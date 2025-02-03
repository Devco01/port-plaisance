module.exports = {
    // Environnement de test
    testEnvironment: 'node',

    // Patterns des fichiers de test
    testMatch: [
        '**/tests/**/*.test.js'
    ],

    // Ignorer certains dossiers
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/'
    ],

    // Configuration de la couverture de code
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/',
        '/config/'
    ],
    coverageReporters: ['text', 'lcov', 'clover'],

    // Configuration de la base de données de test
    globalSetup: './tests/setup/setup.js',
    globalTeardown: './tests/setup/teardown.js',

    // Variables globales
    globals: {
        __MONGO_URI__: 'mongodb://localhost:27017/port-russell-test'
    },

    // Timeout pour les tests
    testTimeout: 10000,

    // Reporter personnalisé
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'reports',
                outputName: 'junit.xml',
                classNameTemplate: '{classname}',
                titleTemplate: '{title}',
                ancestorSeparator: ' › '
            }
        ]
    ],

    // Configuration des mocks
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,

    // Modules à transformer
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Modules à ignorer pour la transformation
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.pnp\\.[^\\/]+$'
    ],

    // Configuration des modules
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/server/$1'
    },

    // Setup de l'environnement de test
    setupFilesAfterEnv: ['./tests/setup/jest.setup.js'],

    verbose: true,
    setupFiles: [
        '<rootDir>/tests/setup.js'
    ],
    moduleFileExtensions: ['js', 'json']
}; 