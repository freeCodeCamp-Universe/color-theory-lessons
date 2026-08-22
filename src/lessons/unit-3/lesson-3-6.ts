import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_6: LessonConfig = {
  id: 'u3-l6',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l6'],
  interactionType: 'token-map',
  reviewTags: ['formats', 'tokens', 'design-systems', 'theme'],
  steps: [
    {
      text: 'A design token pairs a name with a value. In CSS, a color token can be implemented as a custom property such as --color-action-primary. Components reference that name instead of repeating a raw value such as #0B57D0.',
    },
    {
      text: 'Tokens can form layers. A palette token stores a raw value, such as --blue-600: #1E40AF. A role token describes how a color is used and can reference a palette token, such as --color-action-primary: var(--blue-600). A token whose value references another token is also called an alias.',
    },
    {
      text: 'When --blue-600 changes, role tokens that reference it resolve to the new value. Components that use those role tokens then render the new color. A theme can assign different values to the same role names for light and dark modes. This update through references is theme propagation.',
    },
    {
      text: 'Token names should match their layer. A palette name such as --green-100 describes a color family and step. A role name such as --color-success-bg describes the color\'s purpose. The role name remains meaningful when a theme assigns it a different palette value.',
    },
    {
      text: 'The token map derives several role colors from one base hue and saturation. Adjust the base controls and watch the role colors update across the interface. Then classify each item as a raw value, palette token name, or role token name.',
    },
  ],
  challenge: {
    prompt:
      'Use the token map to make the action and error hues distinct. Then classify each item as a raw value, palette token name, or role token name.',
    hints: [
      'A raw value is a color code such as #1E40AF. A palette token name identifies a color family and step. A role token name identifies how a color is used.',
      'Changing the base controls updates every role color derived from them.',
      'Names such as --blue-600 and --green-500 identify palette colors. Names such as --color-text-primary and --color-success-bg identify usage roles.',
    ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What problem do design tokens help solve?',
      choices: [
        {
          stableId: 'they-make-colors-load-faster-in-the-browser',
          label: 'They make colors load faster in the browser',
          isCorrect: false,
          explanation:
            'Token naming does not affect rendering speed. Tokens solve a maintenance and consistency problem, not a performance problem.',
        },
        {
          stableId: 'they-separate-color-meaning-from-raw-values-so-updates-are-easie',
          label: 'They separate color meaning from raw values so updates are easier and more consistent',
          isCorrect: true,
          explanation:
            'When a token value changes, components that reference the token use the new value. This avoids changing the same color separately in each component.',
        },
        {
          stableId: 'they-automatically-fix-contrast-problems',
          label: 'They automatically fix contrast problems',
          isCorrect: false,
          explanation:
            'Tokens organize color decisions but do not check contrast. Designers and developers still need to verify that color combinations meet accessibility requirements.',
        },
        {
          stableId: 'they-are-required-by-css-to-define-custom-properties',
          label: 'They are required by CSS to define custom properties',
          isCorrect: false,
          explanation:
            'Design tokens are not limited to CSS. CSS custom properties are one way to implement tokens for the web.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What stays the same when a token value changes but the token role does not?',
      choices: [
        {
          stableId: 'the-visible-color-on-screen',
          label: 'The visible color on screen',
          isCorrect: false,
          explanation:
            'The visible color changes because the token resolves to a different value. The role, which describes the token\'s purpose, stays the same.',
        },
        {
          stableId: 'the-role-name-and-its-meaning-in-the-system',
          label: 'The role name and its meaning in the system',
          isCorrect: true,
          explanation:
            '--color-action-primary still means "primary action color" if it changes from blue to purple. The role name and purpose stay the same while the underlying value changes.',
        },
        {
          stableId: 'the-hex-code-stored-in-the-token',
          label: 'The HEX code stored in the token',
          isCorrect: false,
          explanation: 'The HEX code is exactly what changed. The question is about what remains stable.',
        },
        {
          stableId: 'nothing-everything-changes-when-a-token-value-changes',
          label: 'Nothing. Everything changes when a token value changes',
          isCorrect: false,
          explanation:
            'The role name, its meaning, and the references to it remain stable. The stored value and rendered color change.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which is a role token name?',
      choices: [
        {
          stableId: '0b57d0',
          label: '#0B57D0',
          isCorrect: false,
          explanation: 'This is a raw HEX value, not a token name.',
        },
        {
          stableId: 'blue-600',
          label: '--blue-600',
          isCorrect: false,
          explanation:
            'This palette token name identifies a color family and step. It does not describe where the color is used.',
        },
        {
          stableId: 'color-text-primary',
          label: '--color-text-primary',
          isCorrect: true,
          explanation:
            'This name describes its purpose: primary text color. It remains meaningful when the underlying value changes.',
        },
        {
          stableId: 'rgb-34-34-34',
          label: 'rgb(34, 34, 34)',
          isCorrect: false,
          explanation: 'This is a raw RGB value, not a token.',
        },
      ],
    },
  ],
  keyPoints: [
    'Design tokens are named variables that store color values and separate meaning from raw codes.',
    'Alias tokens point to base palette values (--blue-600). Role tokens assign meaning (--color-action-primary).',
    'Changing a base value propagates automatically to every component that references the token — this is theme propagation.',
    'Good token names describe function (--color-text-primary), not appearance (--dark-gray).',
    'Token systems make dark mode, brand changes, and scaling easier because the same role names work across themes.',
  ],
};
