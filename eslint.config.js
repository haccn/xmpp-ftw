import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import stylisticJs from '@stylistic/eslint-plugin-js'
import eslintPluginVue from 'eslint-plugin-vue'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import ts from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    files: ['**/*.{vue,js,ts}'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'sort-imports': 'error',
      'eqeqeq': ['error', 'always'],
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'keyword-spacing': ['error', { 'before': true }],
    },
  },
]
