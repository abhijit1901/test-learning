import path from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const config = [
  {
    ignores: [
      ".next/",
      "coverage/",
      "test-reports/",
      "jest.config.js",
      "jest.setup.ts"
    ]
  },
  ...compat.config({
    extends: ["next/core-web-vitals"]
  }),
  {
    rules: {
      "react/jsx-no-useless-fragment": "warn"
    }
  }
];

export default config;
