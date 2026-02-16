const js = require("@eslint/js");
const jestPlugin = require("eslint-plugin-jest");
const globals = require("globals");

module.exports = [
  // 1. Use ESLint's recommended rules
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];