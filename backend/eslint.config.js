import js from '@eslint/js';
import pluginN from 'eslint-plugin-n';
import { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },
  js.configs.recommended,
  pluginN.configs['flat/recommended'],
  importXFlatConfigs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-console': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'no-process-exit': 'off',
      'n/no-process-exit': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      semi: 'off',

      'import-x/order': 'off',
      'import-x/extensions': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/namespace': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',

      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|_' }],

      'no-throw-literal': 'error',
      'no-async-promise-executor': 'error',
      'n/no-unsupported-features/es-syntax': 'off',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    },
  },
];
