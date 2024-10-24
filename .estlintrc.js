module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: ["standard-with-typescript", "prettier"],
    overrides: [],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: ["./tsconfig.json"],
    },
    rules: {
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/strict-boolean-expressions': 0
    },
  };