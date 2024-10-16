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
      // Remove this when we get a handle of the missing "key" prop violations
      'react/jsx-key': 'off',

      // Remove this when we get a handle of the "any" violations
      '@typescript-eslint/no-explicit-any': 'off',

      // Remove this when we get a handle of unused variables
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
