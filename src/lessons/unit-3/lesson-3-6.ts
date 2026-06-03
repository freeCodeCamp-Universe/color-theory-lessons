import type { LessonConfig } from '../../types/lesson.ts';

export const lesson3_6: LessonConfig = {
  id: 'u3-l6',
  unitId: 'unit-3',
  title: 'Design Tokens and Role-Based Color Systems',
  description:
    'Learn how design tokens separate color meaning from raw values — and see how changing one base value can update an entire interface.',
  learningGoal:
    'Explain what design tokens do, distinguish tokens from raw values, and demonstrate how token propagation works.',
  estimatedMinutes: 15,
  prerequisites: ['u3-l5'],
  conceptsIntroduced: [
    'design token',
    'variable',
    'alias token',
    'role token',
    'theme propagation',
  ],
  interactionType: 'token-map',
  glossaryTerms: [
    'design token',
    'variable',
    'alias token',
    'role token',
    'theme propagation',
  ],
  reviewTags: ['formats', 'tokens', 'design-systems', 'themes'],
  steps: [
    {
      id: 's1',
      text: 'A design token is a named variable that stores a color value. Instead of writing #0B57D0 in every button, a system defines --color-action-primary and references that name. The value can change without touching every component.',
      highlights: ['design token', 'variable'],
    },
    {
      id: 's2',
      text: 'Tokens work at different levels. An alias token points to a base value — like --blue-600: #1E40AF. A role token assigns meaning to an alias — like --color-action-primary: var(--blue-600). The role name describes usage, not appearance.',
      highlights: ['alias token', 'role token'],
    },
    {
      id: 's3',
      text: 'This separation makes updates powerful. Change --blue-600 and every role that references it updates automatically. Switch from light to dark theme by swapping the values behind the same role names. This is theme propagation.',
      highlights: ['theme propagation'],
    },
    {
      id: 's4',
      text: 'Good token names describe what the color does, not what it looks like. --color-text-primary is better than --dark-gray because the role stays meaningful even if the value changes. --color-success-bg is better than --green-100 for the same reason.',
    },
    {
      id: 's5',
      text: 'The token map shows a base value connected to several role tokens. Change the base and watch every role update across the interface. Then sort items into raw values, alias tokens, and role tokens.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt:
        'Use the token map to fix a broken interface by adjusting base values, then sort items into the correct category: raw value, alias token, or role token.',
      type: 'sort',
      hints: [
        'A raw value is a specific code like #1E40AF. An alias points to that value. A role describes what the alias is used for.',
        'If you change a base value and multiple interface elements update, those elements reference the same token.',
        'Role tokens describe function: --color-text-primary, --color-success-bg. Alias tokens describe the palette: --blue-600.',
      ],
      successCriteria: 'Base values fixed and all items correctly sorted.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'What problem do design tokens help solve?',
      choices: [
        {
          id: 'a',
          label: 'They make colors load faster in the browser',
          isCorrect: false,
          explanation:
            'Token naming does not affect rendering speed. Tokens solve a maintenance and consistency problem, not a performance problem.',
        },
        {
          id: 'b',
          label: 'They separate color meaning from raw values so updates are easier and more consistent',
          isCorrect: true,
          explanation:
            'When a value changes, every component referencing the token updates automatically. This keeps the system consistent without manual find-and-replace.',
        },
        {
          id: 'c',
          label: 'They automatically fix contrast problems',
          isCorrect: false,
          explanation:
            'Tokens do not check contrast. They organize color decisions — but designers still need to verify accessibility.',
        },
        {
          id: 'd',
          label: 'They are required by CSS to define custom properties',
          isCorrect: false,
          explanation:
            'CSS custom properties are a mechanism. Design tokens are a design system concept that can use custom properties as implementation.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What stays the same when a token value changes but the token role does not?',
      choices: [
        {
          id: 'a',
          label: 'The visible color on screen',
          isCorrect: false,
          explanation:
            'The visible color changes because the value behind the token changed. What stays the same is the role — the purpose the token serves.',
        },
        {
          id: 'b',
          label: 'The role name and its meaning in the system',
          isCorrect: true,
          explanation:
            '--color-action-primary still means "primary action color" even if the value behind it switches from blue to purple. The role is stable; the value is swappable.',
        },
        {
          id: 'c',
          label: 'The HEX code stored in the token',
          isCorrect: false,
          explanation: 'The HEX code is exactly what changed. The question is about what remains stable.',
        },
        {
          id: 'd',
          label: 'Nothing — everything changes when a token value changes',
          isCorrect: false,
          explanation:
            'The role name, its semantic meaning, and its usage across the system all remain stable. Only the visible output changes.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which is a role token name?',
      choices: [
        {
          id: 'a',
          label: '#0B57D0',
          isCorrect: false,
          explanation: 'This is a raw hex value, not a token name at all.',
        },
        {
          id: 'b',
          label: '--blue-600',
          isCorrect: false,
          explanation:
            'This is an alias token — it names a palette step but does not describe a usage role.',
        },
        {
          id: 'c',
          label: '--color-text-primary',
          isCorrect: true,
          explanation:
            'This name describes a function (primary text color), not an appearance. It stays meaningful even if the underlying value changes.',
        },
        {
          id: 'd',
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
