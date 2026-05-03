const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@mswjs|msw)/)"],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  // MSW node tests use jest.msw.config.cjs (next/jest transformIgnore skips until-async)
  testPathIgnorePatterns: ["<rootDir>/src/mocks/unit-testing/"],
};

module.exports = createJestConfig(config);
