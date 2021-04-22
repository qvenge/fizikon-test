module.exports = {
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb-base', 'prettier'],
  plugins: ['@babel'],
  rules: {
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
  },
};
