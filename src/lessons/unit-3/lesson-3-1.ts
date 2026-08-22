import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_1: LessonConfig = {
  id: 'u3-l1',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l1'],
  interactionType: 'format-reveal',
  reviewTags: ['foundations', 'formats', 'HEX', 'RGB', 'HSL', 'implementation'],
  steps: [
    {
      text: 'Digital interfaces need precise color values. A description like "nice soft blue" cannot be reproduced reliably. Buttons, backgrounds, borders, and text use coded values that browsers and design tools can interpret consistently.',
    },
    {
      text: 'Designers encounter color values and references in CSS files, design tool inspectors, browser developer tools, component libraries, and design token files. A color may appear as a raw value or as a named reference to a design token.',
    },
    {
      text: 'Three common formats are HEX, RGB, and HSL. In CSS, these formats describe colors in sRGB, the standard color space for most web content. sRGB defines how numeric values map to colors. HEX is compact and common in CSS. RGB lists the red, green, and blue channels. HSL organizes a color by hue, saturation, and lightness.',
    },
    {
      text: 'A single color can be expressed in multiple valid formats. HEX #1E40AF and rgb(30, 64, 175) encode the same sRGB channel values. HSL can represent the same color, although rounding HSL values can produce a slightly different result.',
    },
    {
      text: 'Select each colored element in the UI mockup. The panel will show its HEX, RGB, and rounded HSL values so you can compare the structure of each format.',
    },
  ],
  challenge: {
    prompt:
      'Select every colored element in the mockup to reveal its formats. Explore all of them before moving on.',
    hints: [
      'Select a colored region such as the background, button, text, or border.',
      'Each selection shows HEX, RGB, and rounded HSL values.',
      'Compare how each format organizes its values. You do not need to memorize them.',
    ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why is a precise color value more useful than a vague description in a digital handoff?',
      choices: [
        {
          stableId: 'because-developers-prefer-reading-numbers-over-words',
          label: 'Because developers prefer reading numbers over words',
          isCorrect: false,
          explanation:
            'Developer preference does not make a color reproducible. A coded value gives collaborators a shared specification.',
        },
        {
          stableId: 'because-a-precise-value-can-be-reproduced-exactly-across-every-t',
          label: 'Because a precise value gives tools and collaborators a reproducible color specification',
          isCorrect: true,
          explanation:
            'A coded value such as #1E40AF specifies the intended sRGB color without relying on a subjective description. Physical screens can still display that color differently.',
        },
        {
          stableId: 'because-color-formats-are-required-by-accessibility-standards',
          label: 'Because color formats are required by accessibility standards',
          isCorrect: false,
          explanation:
            'Accessibility standards set requirements such as contrast ratios. They do not require HEX, RGB, or HSL notation.',
        },
        {
          stableId: 'because-vague-descriptions-are-only-acceptable-for-prototypes',
          label: 'Because vague descriptions are only acceptable for prototypes',
          isCorrect: false,
          explanation:
            'Project phase does not determine whether a color description is reproducible. A coded value provides a specific color at any stage.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Can one sRGB color be correctly described by more than one format?',
      choices: [
        {
          stableId: 'no-each-visible-color-has-exactly-one-correct-format',
          label: 'No. Each sRGB color has exactly one correct format',
          isCorrect: false,
          explanation:
            'Equivalent HEX, RGB, and HSL values can represent one sRGB color. The format is the representation, not the color itself.',
        },
        {
          stableId: 'yes-hex-rgb-and-hsl-can-all-describe-the-same-visible-color',
          label: 'Yes. HEX, RGB, and HSL can all describe the same sRGB color',
          isCorrect: true,
          explanation:
            'Equivalent HEX, RGB, and HSL values represent one color with different notation. Rounded conversions can introduce small differences.',
        },
        {
          stableId: 'only-if-the-color-is-a-standard-web-safe-color',
          label: 'Only if the color is a standard web-safe color',
          isCorrect: false,
          explanation:
            'Modern CSS color formats are not limited to the web-safe palette created for early computer displays.',
        },
        {
          stableId: 'yes-but-only-hex-and-rgb-hsl-is-a-different-color-system',
          label: 'Yes, but only HEX and RGB. HSL represents a different set of colors',
          isCorrect: false,
          explanation:
            'CSS HSL represents sRGB colors and can be converted to and from RGB or HEX.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which of these is the most implementation-ready description of a button color?',
      choices: [
        {
          stableId: 'a-warm-coral-sort-of-red',
          label: '"A warm coral sort of red"',
          isCorrect: false,
          explanation:
            'This description is subjective. Different people could choose different color values.',
        },
        {
          stableId: 'something-between-orange-and-red-not-too-bright',
          label: '"Something between orange and red, not too bright"',
          isCorrect: false,
          explanation:
            'Terms such as "not too bright" do not identify a specific color value.',
        },
        {
          stableId: 'e05252',
          label: '#E05252',
          isCorrect: true,
          explanation:
            'In CSS, this HEX value specifies a particular sRGB color for the browser to render.',
        },
        {
          stableId: 'use-the-error-red-from-the-style-guide',
          label: '"Use the error red from the style guide"',
          isCorrect: false,
          explanation:
            'A documented design token can be implementation-ready, but this phrase provides neither a token name nor a color value.',
        },
      ],
    },
  ],
  keyPoints: [
    'Digital products need exact color values — a description like "soft blue" cannot be reliably reproduced across tools, browsers, or contributors.',
    'HEX, RGB, and HSL are three common formats that can describe the exact same color; the visible swatch does not change between them.',
    'Color values appear in CSS, design tool inspectors, browser dev tools, component libraries, and token files.',
    'Tokens are named variables that separate color meaning (e.g. brand-primary) from raw value (e.g. #2563eb), making updates easier.',
    'Choosing a format is not a design decision — it is a representation choice; different tools and workflows favor different formats.',
  ],
};
