module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
    globalTeardown: '<rootDir>/tests/setup/teardown.js',
    testPathIgnorePatterns: ['/node_modules/', '/client/'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    forceExit: true,
    detectOpenHandles: true,
    verbose: true
};
