// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi': ['error', 'always'],
    'indent': 2,
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'no-throw-literal': 0,
    'camelcase': 0,
    'prefer-promise-reject-errors': 0,
    'no-undef': 0,
    'no-new-func': 0,
    "eqeqeq": 0,
    "no-console": 0, // 禁止使用 console
    "max-params": [0, 3],//函数最多只能有3个参数
  }
}
