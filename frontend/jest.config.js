const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  reporters: [
    'default',
    ['jest-html-reporters', {
      "publicPath": "./test-reports",
      "filename": "test-report.html",
      "pageTitle": "Frontend Test Results",
      "expand": true
    }],
    ['jest-junit', {
      "outputDirectory": "./test-reports",
      "outputName": "junit.xml"
    }]
  ]
};

module.exports = createJestConfig(customJestConfig);
