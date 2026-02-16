import path from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const config = [
  ...compat.config({
    extends: ["next/core-web-vitals"]
  }),
  {
    rules: {
      "react/jsx-no-useless-fragment": "warn"
    }
  },
  {
    ignores: [".next/"]
  }
];

export default config;
