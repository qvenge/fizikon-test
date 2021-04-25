module.exports = {
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb-base', 'prettier'],
  plugins: ['@babel'],
  rules: {
    'no-underscore-dangle': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'import/prefer-default-export': 0,
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],
  },
};
