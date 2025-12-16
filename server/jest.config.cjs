/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 1. Use the ESM preset
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node',
  
  collectCoverage: true,
  coverageDirectory: 'coverage',
  
  // Ensure we generate 'lcov' for SonarQube and 'text' for your terminal
  coverageReporters: ['lcov', 'text'],

  //Only count coverage for source files. 
  collectCoverageFrom: [
    "**/*.ts",                 // Include all TS files
    "!**/*.test.ts",           // Exclude test files
    "!**/node_modules/**",     // Exclude dependencies
    "!**/dist/**",             // Exclude build output
    "!**/coverage/**",         // Exclude coverage folder
    "!jest.config.cjs"         // Exclude this config file
  ],

  testMatch: ["**/tests/**/*.test.ts"],
  
  // 2. Map .js imports to .ts files (Crucial for ESM imports)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // 3. Configure ts-jest
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'es2022',
          moduleResolution: 'node',
          isolatedModules: true,
        },
      },
    ],
  },
};