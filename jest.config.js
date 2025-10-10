/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  rootDir: './test',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};
