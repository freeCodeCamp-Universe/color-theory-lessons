import type { LessonConfig } from '../../types/lesson.ts';

export const lesson3_5: LessonConfig = {
  id: 'u3-l5',
  unitId: 'unit-3',
  title: 'Gradients, CSS Color Usage, and Theme Building',
  description:
    'Connect color formats to real product work by applying gradients and role assignments to build a coherent interface theme in a live sandbox.',
  learningGoal:
    'Apply role-based color usage to build a simple, coherent interface theme with a functional gradient.',
  estimatedMinutes: 16,
  prerequisites: ['u3-l4'],
  conceptsIntroduced: [
    'gradient',
    'linear gradient',
    'radial gradient',
    'text color',
    'border color',
    'semantic color',
    'theme',
  ],
  interactionType: 'theme-sandbox',
  glossaryTerms: [
    'gradient',
    'linear gradient',
    'radial gradient',
    'border color',
    'text color',
    'semantic color',
    'theme',
  ],
  reviewTags: ['formats', 'gradients', 'themes', 'semantic-color'],
  steps: [
    {
      id: 's1',
      text: 'In this lesson, treat colors as assignments in a UI: background, surface, text, border, accent, success, warning, and error. The task is practical: place each color where it belongs so the interface reads clearly and consistently.',
      highlights: ['semantic color', 'theme'],
    },
    {
      id: 's2',
      text: 'A gradient is a controlled transition between two or more colors. CSS supports linear-gradient (a direction-based blend) and radial-gradient (a center-outward blend). Gradients can add hierarchy, depth, or energy — but they should serve a purpose, not just decorate.',
      highlights: ['gradient', 'linear gradient', 'radial gradient'],
    },
    {
      id: 's3',
      text: 'In CSS, roles are usually assigned through custom properties. Instead of repeating "#2563EB" in many rules, assign a role variable and apply it to buttons, links, and focus rings. This keeps the lesson focused on implementation rather than one-off values.',
    },
    {
      id: 's4',
      text: 'A theme is the set of role assignments used by a given interface mode. In the sandbox, you will swap assignments and immediately see how readability, hierarchy, and emphasis change across components.',
    },
    {
      id: 's5',
      text: 'The theme sandbox lets you assign colors to common roles and apply a gradient to a hero panel. Build a coherent theme where text is readable, accents are purposeful, and the gradient supports — not fights — the rest of the interface.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt:
        'Build a coherent interface theme by assigning colors to all roles and creating a functional gradient. The theme must pass basic readability checks.',
      type: 'build-palette',
      hints: [
        'Start with the background and surface — these set the overall tone.',
        'Make sure primary text has strong contrast against the surface.',
        'Use the gradient to add visual interest to the hero area without hurting text readability.',
        'Status colors (success, warning, error) should be distinct from each other and from the accent.',
      ],
      successCriteria: 'All roles assigned, gradient applied, readability checks pass.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the difference between a color value and a color role?',
      choices: [
        {
          id: 'a',
          label: 'A value is a specific code like #2563EB; a role describes what that color does in the interface, like "primary action"',
          isCorrect: true,
          explanation:
            'Values are raw numbers. Roles describe purpose. A system uses role names so the same logic can apply even when values change — for example, in a dark theme.',
        },
        {
          id: 'b',
          label: 'They are the same thing — just different terms used by designers and developers',
          isCorrect: false,
          explanation:
            'They are genuinely different concepts. A value is a specific color code. A role is the function that code serves in the design system.',
        },
        {
          id: 'c',
          label: 'A value is the color in HEX; a role is the same color in HSL',
          isCorrect: false,
          explanation: 'HEX and HSL are both formats for the same value. A role is about meaning and usage, not format.',
        },
        {
          id: 'd',
          label: 'Roles are only relevant in large enterprise design systems',
          isCorrect: false,
          explanation:
            'Even a small product benefits from role-based thinking. Roles help maintain consistency whether the team is one person or one hundred.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Are gradients always decorative?',
      choices: [
        {
          id: 'a',
          label: 'Yes — gradients are purely visual style and never affect usability',
          isCorrect: false,
          explanation:
            'Gradients can serve functional purposes: adding depth to card surfaces, creating visual hierarchy in hero sections, or encoding data in heatmaps.',
        },
        {
          id: 'b',
          label: 'No — gradients can support hierarchy, emphasis, or data encoding when used deliberately',
          isCorrect: true,
          explanation:
            'A gradient can add intentional emphasis to a hero section, create surface depth, or represent data ranges. The key is deliberate usage, not decoration for its own sake.',
        },
        {
          id: 'c',
          label: 'No — gradients are required for accessible contrast',
          isCorrect: false,
          explanation:
            'Gradients are not required for accessibility. In fact, they can make contrast harder to verify because the background color varies.',
        },
        {
          id: 'd',
          label: 'Only radial gradients can be functional; linear gradients are decorative',
          isCorrect: false,
          explanation: 'Both types can be either functional or decorative. The distinction is about intent and usage, not gradient shape.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which approach is more scalable for a growing product?',
      choices: [
        {
          id: 'a',
          label: 'Storing one-off button colors on every screen individually',
          isCorrect: false,
          explanation:
            'One-off values become inconsistent and unmaintainable as the product grows. Changing the brand accent would require finding and updating every instance.',
        },
        {
          id: 'b',
          label: 'Defining shared theme roles that all components reference',
          isCorrect: true,
          explanation:
            'Shared roles mean one change — like updating the primary action color — propagates automatically to every button, link, and focus ring in the system.',
        },
        {
          id: 'c',
          label: 'Using only CSS named colors like "blue" and "red"',
          isCorrect: false,
          explanation:
            'CSS named colors are limited and imprecise. They do not support the semantic role-based approach that real products need.',
        },
        {
          id: 'd',
          label: 'Using gradients instead of flat colors everywhere',
          isCorrect: false,
          explanation: 'Gradients add visual complexity and have nothing to do with the scalability of a color system.',
        },
      ],
    },
  ],
  keyPoints: [
    'Products apply colors by role: background, surface, text, border, accent, success, warning, and error.',
    'Gradients are controlled transitions between colors — useful for hierarchy, depth, or energy, but they should serve a function.',
    'CSS role variables let you apply one assignment across many components without repeating raw values.',
    'A theme is a coordinated set of role assignments; changing assignments changes interface behavior immediately.',
    'This lesson emphasizes implementation: build, evaluate, and refine role assignments in a live UI.',
  ],
};
