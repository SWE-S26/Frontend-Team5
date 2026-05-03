/**
 * Jest config for MSW handler integration tests only.
 * Omits next/jest transformIgnorePatterns so @mswjs + until-async can be transformed.
 */
/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src/mocks/unit-testing"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^until-async$": "<rootDir>/src/mocks/unit-testing/helpers/untilAsyncShim.cjs",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          esModuleInterop: true,
          isolatedModules: true,
          jsx: "react-jsx",
          paths: { "@/*": ["./src/*"] },
          baseUrl: ".",
        },
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/(?!(@mswjs/|msw/|until-async/))"],
  setupFiles: ["<rootDir>/jest.msw.setup.js"],
};
