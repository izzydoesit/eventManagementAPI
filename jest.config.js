const { clear } = require("console");

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    verbose: true,
    detectOpenHandles: true,
    forceExit: true,
    clearMocks: true,
    restoreMocks: true,
    resetMocks: true,
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/config/jest.setup.config.ts'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: 'tsconfig.json'
        }]
    }
};