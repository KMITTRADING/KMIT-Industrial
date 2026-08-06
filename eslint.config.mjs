import next from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

/**
 * Physical-direction utilities are the single most common way an RTL layout
 * silently breaks: the English page looks right, the Arabic page has its
 * padding on the wrong side, and nobody notices until a native reader does.
 *
 * The regex below is deliberately close to the grep gate in CLAUDE.md §9 —
 * ESLint catches it while typing, the grep catches it in CI, and they agree on
 * what counts as a violation.
 *
 * Escape hatch: none. If a genuinely physical direction is required (a chart
 * axis, a piece of embedded LTR data), use an inline style with a comment, not
 * a utility class.
 */
const PHYSICAL_DIRECTION_PATTERN = String.raw`(^|[\s"'\`:\[!])-?(ml|mr|pl|pr)-|(^|[\s"'\`:\[!])(left|right)-|(^|[\s"'\`:\[!])text-(left|right)($|[\s"'\`\]])|(^|[\s"'\`:\[!])(border|rounded|inset|scroll-m|scroll-p|space)-(l|r)-`;

const physicalDirectionMessage =
  'Physical-direction utility detected. Use logical properties instead: ms-*/me-*, ps-*/pe-*, start-*/end-*, text-start/text-end, border-s-*/border-e-*, rounded-s-*/rounded-e-*. See CLAUDE.md §2.';

const config = [
  ...next,
  ...nextTypescript,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'next-env.d.ts',
      'assets-source/**',
      '.preview/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: `JSXAttribute[name.name=/^(className|class)$/] Literal[value=/${PHYSICAL_DIRECTION_PATTERN}/]`,
          message: physicalDirectionMessage,
        },
        {
          selector: `JSXAttribute[name.name=/^(className|class)$/] TemplateElement[value.raw=/${PHYSICAL_DIRECTION_PATTERN}/]`,
          message: physicalDirectionMessage,
        },
        {
          selector: `CallExpression[callee.name=/^(cn|clsx|cva|twMerge)$/] Literal[value=/${PHYSICAL_DIRECTION_PATTERN}/]`,
          message: physicalDirectionMessage,
        },
        {
          selector: `CallExpression[callee.name=/^(cn|clsx|cva|twMerge)$/] TemplateElement[value.raw=/${PHYSICAL_DIRECTION_PATTERN}/]`,
          message: physicalDirectionMessage,
        },
        {
          selector: "TSTypeReference > TSQualifiedName[left.name='React'][right.name='FC']",
          message:
            'Type the props object directly and let the return type be inferred. React.FC adds an implicit children prop that most components should not accept.',
        },
      ],
    },
  },
  {
    // Node scripts are not part of the Next.js app graph.
    files: ['scripts/**/*.{mjs,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
  prettier,
];

export default config;
