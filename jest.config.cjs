module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  passWithNoTests: true,
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
  extensionsToTreatAsEsm: [],
  collectCoverageFrom: [
    'src/backend/**/*.ts',
    '!src/backend/**/*.test.ts',
    '!src/backend/tests/**',
    '!src/backend/main.ts',
    '!src/backend/config/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  coverageProvider: 'v8',
};
