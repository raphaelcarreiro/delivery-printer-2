module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['plugin:react/recommended', 'standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  globals: {
    NodeJS: 'readonly',
    google: 'readonly',
  },
  plugins: ['react', 'prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    camelcase: 'off',
    'react/prop-types': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-multi-str': 'off',
    'jsx-a11y/anchor-is-valid': 0,
    'no-use-before-define': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'react/function-component-definition': 'off',
    'no-useless-constructor': 'off',
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
