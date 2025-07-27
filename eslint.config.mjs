// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import parser from '@typescript-eslint/parser';

import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import sonarjsPlugin from 'eslint-plugin-sonarjs';


export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  // Base recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,

  // Additional plugins
  {
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
    },
  },

  // Parser and environment settings
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },

  // Custom rules for clean code and best practices
  {
    rules: {
      // Prettier integration
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // TypeScript strictness
      '@typescript-eslint/explicit-function-return-type': ['warn'],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'warn',

      // General code quality
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'complexity': ['warn', 10],
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'consistent-return': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Import order and resolution
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      }],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.spec.ts', '**/test/**'] }],

      // Unicorn plugin for stylistic improvements
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-null': 'error',
      'unicorn/prevent-abbreviations': ['warn', { allowList: { req: true, db: true } }],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],

      // SonarJS rules for bug detection
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-small-switch': 'off',
    },
  }
);
