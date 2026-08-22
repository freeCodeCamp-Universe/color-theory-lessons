import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_5: LessonConfig = {
  id: 'u3-l5',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l5'],
  interactionType: 'theme-sandbox',
  reviewTags: ['formats', 'gradients', 'theme', 'semantic-color'],
  steps: [
    {
      text: 'In this lesson, assign colors to interface roles: background, surface, text, border, accent, success, warning, and error. Role names describe how each color is used, so the same roles can organize different sets of color values.',
    },
    {
      text: 'A gradient is a transition between two or more colors. CSS provides linear-gradient() for a transition along a line and radial-gradient() for a transition that spreads from an origin. A gradient can direct attention, suggest depth, or represent a range of values.',
    },
    {
      text: 'CSS custom properties can connect a color role to a reusable value. For example, define a property for the primary action color, then reference it in the rules for buttons, links, and focus rings. Changing the property updates every rule that references it.',
    },
    {
      text: 'A theme is a coordinated set of colors assigned to interface roles. Light and dark themes can keep the same role names while assigning different values to them. This lets components keep their purpose when the theme changes.',
    },
    {
      text: 'Use the theme sandbox to edit common role colors and the two endpoints of a hero gradient. Compare the preview and contrast readouts as you change each value.',
    },
  ],
  challenge: {
      prompt:
        'Explore the role colors and hero gradient. Set the primary and secondary text colors so all three contrast checks pass, then submit the theme.',
      hints: [
        'Choose the background and surface colors first. They provide the backdrop for the text and border colors.',
        'Check the primary text ratios against both the background and the surface.',
        'Compare both ends of the gradient with the white text in the hero preview.',
        'Compare the success, warning, error, and primary action colors in the card preview.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the difference between a color value and a color role?',
      choices: [
        {
          stableId: 'a-value-is-a-specific-code-like-2563eb-a-role-describes-what-tha',
          label: 'A value is a specific code like #2563EB; a role describes what that color does in the interface, like "primary action"',
          isCorrect: true,
          explanation:
            'Values are specific color codes. Roles describe purpose. A dark theme can assign new values to the same role names without changing how components use those roles.',
        },
        {
          stableId: 'they-are-the-same-thing-just-different-terms-used-by-designers-a',
          label: 'They are two terms for the same thing',
          isCorrect: false,
          explanation:
            'They are different concepts. A value is a specific color code. A role is the function that code serves in the design system.',
        },
        {
          stableId: 'a-value-is-the-color-in-hex-a-role-is-the-same-color-in-hsl',
          label: 'A value is the color in HEX; a role is the same color in HSL',
          isCorrect: false,
          explanation: 'HEX and HSL are both formats for the same value. A role is about meaning and usage, not format.',
        },
        {
          stableId: 'roles-are-only-relevant-in-large-enterprise-design-systems',
          label: 'Roles are only relevant in large enterprise design systems',
          isCorrect: false,
          explanation:
            'Role names can organize colors in a product of any size. Each name identifies where a color should be used.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which example gives a gradient a functional role?',
      choices: [
        {
          stableId: 'yes-gradients-are-purely-visual-style-and-never-affect-usability',
          label: 'Adding a gradient to every card because it matches the visual style',
          isCorrect: false,
          explanation:
            'Repeating a gradient for style alone is decorative. A functional gradient communicates information or helps organize the interface.',
        },
        {
          stableId: 'no-gradients-can-support-hierarchy-emphasis-or-data-encoding-whe',
          label: 'Using color changes in a heatmap legend to represent low-to-high values',
          isCorrect: true,
          explanation:
            'The gradient maps colors to values, so it helps readers interpret the data in the heatmap.',
        },
        {
          stableId: 'no-gradients-are-required-for-accessible-contrast',
          label: 'Placing white text over a gradient without checking the colors directly behind the text',
          isCorrect: false,
          explanation:
            'A gradient can make contrast harder to verify because the background changes behind the text. Each color directly behind the text must provide enough contrast.',
        },
        {
          stableId: 'only-radial-gradients-can-be-functional-linear-gradients-are-dec',
          label: 'Choosing a radial gradient because linear gradients cannot communicate meaning',
          isCorrect: false,
          explanation: 'Both linear and radial gradients can communicate meaning. Their function depends on how the design uses them, not on their shape.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which approach lets a team change one color across every component that uses it?',
      choices: [
        {
          stableId: 'storing-one-off-button-colors-on-every-screen-individually',
          label: 'Storing one-off button colors on every screen individually',
          isCorrect: false,
          explanation:
            'With separate values on each screen, changing the color requires finding and updating every instance.',
        },
        {
          stableId: 'defining-shared-theme-roles-that-all-components-reference',
          label: 'Defining shared theme roles that all components reference',
          isCorrect: true,
          explanation:
            'Changing a shared role updates every button, link, and focus ring that references that role.',
        },
        {
          stableId: 'using-only-css-named-colors-like-blue-and-red',
          label: 'Using only CSS named colors like "blue" and "red"',
          isCorrect: false,
          explanation:
            'A named color is still a raw value. Repeating it does not create one shared definition for the components to reference.',
        },
        {
          stableId: 'using-gradients-instead-of-flat-colors-everywhere',
          label: 'Replacing each flat color with a gradient',
          isCorrect: false,
          explanation: 'A gradient changes the visual treatment, but it does not create a shared color definition for components.',
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
