module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest-setup.js'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testMatch: ['**/?(*.)+(spec).ts?(x)'],
  verbose: true,
};
