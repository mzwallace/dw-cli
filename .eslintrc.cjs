module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  rules: {
    "unicorn/no-process-exit": "off",
  },
};
