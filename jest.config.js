module.exports = {
    testEnvironment: 'node',
    globalSetup: '<rootDir>/tests/setup/setup.js',
    globalTeardown: '<rootDir>/tests/setup/teardown.js',
    setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
    testTimeout: 60000,
    verbose: true,
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    testSequencer: '<rootDir>/tests/setup/sequencer.js'
}; 