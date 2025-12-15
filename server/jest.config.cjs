/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 1. Use the ESM preset
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
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
        // 4. Override tsconfig for tests
        tsconfig: {
          module: 'es2022',         // Fixes "import.meta" error
          moduleResolution: 'node', // Ensures modules are resolved correctly
          isolatedModules: true,    // Fixes the "TS151002" warning
        },
      },
    ],
  },
};