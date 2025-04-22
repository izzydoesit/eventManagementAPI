module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
      '**/tests/integration/**/*.test.ts'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/tests/config/jest.setup.config.ts'],
  };