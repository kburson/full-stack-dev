export default {
  displayName: 'api-server',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../reports/coverage/apps/api-server',
  verbose: true,
  /*
  TODO:
  I cannot figure out how to pass the `--verbose` flag to nx.
  nx run api-server:test --verbose
  nx run api-server:test -- --verbose
  I want to run verbose mode for single run and compact mode for watch mode.
  */
};
