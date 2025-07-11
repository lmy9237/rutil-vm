module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": "off",
  },
};