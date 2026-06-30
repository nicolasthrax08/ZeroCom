import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['.next/', 'node_modules/', 'prisma/migrations/'],
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(nextPlugin.rules).map(([name]) => [
          `@next/next/${name}`,
          'error',
        ]),
      ),
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
