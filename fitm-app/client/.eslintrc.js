module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "espree",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",
    "vue/require-prop-types": "off",
    "no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
      },
    ],
  },
};
