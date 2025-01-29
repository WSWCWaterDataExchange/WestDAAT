import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // Mapbox is currently using a require() and there is some kind of conflict
      // between eslint and the react build, so we need to disable the rule here
      // instead of in the file.
      '@typescript-eslint/no-require-imports': 'off',

      // Remove this to get a handle of the "any" violations
      '@typescript-eslint/no-explicit-any': 'off',

      // Remove this to get a handle of the missing "key" prop violations
      'react/jsx-key': 'off',

      // Remove this to get a handle of unescaped single quotes in template strings
      'react/no-unescaped-entities': 'off',

      // Allow jsx to be used without importing React
      'react/react-in-jsx-scope': 'off',
    },
  },
];
