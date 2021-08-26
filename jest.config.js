module.exports = {
  roots: ['<rootDir>'],
  "transform": {
    "\\.[jt]sx?$": "<rootDir>/node_modules/babel-jest"
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest/presets/js-with-ts-esm',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true
    },
  },
};