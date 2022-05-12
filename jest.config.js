module.exports = {
  verbose: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "text", "lcov", "cobertura"],
  testResultsProcessor: "jest-sonar-reporter",
  reporters: ["default", "jest-junit"],
  testEnvironment: "node",
  // testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"]
};
