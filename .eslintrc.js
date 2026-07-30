// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('eslint');

config.parserOptions = {
  ...config.parserOptions,
  project: `${__dirname}/tsconfig.eslint.json`,
};

config.rules = {
  ...config.rules,
  'import/extensions': ['error', 'ignorePackages', {
    js: 'never',
    jsx: 'never',
    ts: 'never',
    tsx: 'never',
  }],
  'import/no-extraneous-dependencies': ['error', {
    devDependencies: true,
  }],
};

module.exports = config;
