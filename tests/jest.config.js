module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/tests/'
    ],
    testPathIgnorePatterns: [
        '/node_modules/'
    ],
    setupFilesAfterEnv: ['<rootDir>/config/setup.js'],
    testTimeout: 10000,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}; 