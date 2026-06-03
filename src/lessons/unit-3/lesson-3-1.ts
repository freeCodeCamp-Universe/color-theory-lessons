import type { LessonConfig } from '../../types/lesson.ts';

export const lesson3_1: LessonConfig = {
  id: 'u3-l1',
  unitId: 'unit-3',
  title: 'Why Digital Design Needs Color Formats',
  description:
    'Discover why digital interfaces require precise coded color values — and explore the three most common formats by clicking through a real UI mockup.',
  learningGoal:
    'Explain why coded color formats matter and identify where designers encounter them.',
  estimatedMinutes: 13,
  prerequisites: ['u2-l6'],
  conceptsIntroduced: [
    'color value',
    'color format',
    'HEX',
    'RGB',
    'HSL',
    'implementation',
    'token',
  ],
  interactionType: 'format-reveal',
  glossaryTerms: ['color value', 'color format', 'implementation', 'token'],
  reviewTags: ['foundations', 'formats', 'HEX', 'RGB', 'HSL', 'implementation'],
  steps: [
    {
      id: 's1',
      text: 'In digital products, the computer needs exact instructions. A vague description like "nice soft blue" cannot be reproduced reliably. Anywhere a color appears — a button, a background, a border — it needs a precise value that means the same thing to every tool and every browser.',
    },
    {
      id: 's2',
      text: 'Designers encounter color values in many places: CSS files, design tool inspectors, browser dev tools, component libraries, and design token files. In all of them, the color is expressed as a specific format — not a feeling, but a number.',
      highlights: ['color values'],
    },
    {
      id: 's3',
      text: 'Three formats are especially common: HEX, RGB, and HSL. They all describe the same visible colors — just in different ways. HEX is compact and common in CSS. RGB maps directly to screen light channels. HSL matches how designers often describe adjustments.',
      highlights: ['HEX', 'RGB', 'HSL'],
    },
    {
      id: 's4',
      text: 'One important thing: a single visible color can be expressed in multiple valid formats. The swatch does not change — only the representation does. HEX #1E40AF, rgb(30, 64, 175), and hsl(224, 71%, 40%) can all describe the same blue.',
    },
    {
      id: 's5',
      text: 'Click each colored element in the UI mockup. A panel will reveal the same color in all three formats. Notice how the visible result stays exactly the same while the representation changes.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt:
        'Click every colored element in the mockup to reveal its formats. Explore all of them before moving on.',
      type: 'identify-problem',
      hints: [
        'Click directly on any colored region — background, button, text, border.',
        'Each element reveals HEX, RGB, and HSL for the same color.',
        'You do not need to memorize the values — focus on the structure of each format.',
      ],
      successCriteria: 'All elements explored.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why is a precise color value more useful than a vague description in a digital handoff?',
      choices: [
        {
          id: 'a',
          label: 'Because developers prefer reading numbers over words',
          isCorrect: false,
          explanation:
            'The reason is not about preference — it is about reproducibility. A vague description cannot be reliably implemented across tools, screens, and contributors.',
        },
        {
          id: 'b',
          label: 'Because a precise value can be reproduced exactly across every tool, browser, and screen',
          isCorrect: true,
          explanation:
            'A specific format like #1E40AF means the same blue everywhere — in CSS, design tools, and browsers — with no guesswork.',
        },
        {
          id: 'c',
          label: 'Because color formats are required by accessibility standards',
          isCorrect: false,
          explanation:
            'Accessibility standards require sufficient contrast, not a specific format. Formats are about precision and reproducibility, not compliance.',
        },
        {
          id: 'd',
          label: 'Because vague descriptions are only acceptable for prototypes',
          isCorrect: false,
          explanation:
            'Even in early stages, imprecise descriptions create inconsistency. The core reason for formats is reproducibility, not project phase.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Can one visible color be correctly described by more than one format?',
      choices: [
        {
          id: 'a',
          label: 'No — each visible color has exactly one correct format',
          isCorrect: false,
          explanation:
            'HEX, RGB, and HSL can all describe the exact same visible color. The format is the representation, not the color itself.',
        },
        {
          id: 'b',
          label: 'Yes — HEX, RGB, and HSL can all describe the same visible color',
          isCorrect: true,
          explanation:
            'For example, #1E40AF, rgb(30, 64, 175), and hsl(224, 71%, 40%) are all valid descriptions of the same blue. The swatch stays the same; only the notation changes.',
        },
        {
          id: 'c',
          label: 'Only if the color is a standard web-safe color',
          isCorrect: false,
          explanation:
            'Any color can be expressed in multiple formats. The concept of "web-safe colors" is an outdated limitation from early displays and has no bearing on format equivalence.',
        },
        {
          id: 'd',
          label: 'Yes, but only HEX and RGB — HSL is a different color system',
          isCorrect: false,
          explanation:
            'HSL describes the same visible colors as HEX and RGB. All three are interconvertible representations of the same color space.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which of these is the most implementation-ready description of a button color?',
      choices: [
        {
          id: 'a',
          label: '"A warm coral sort of red"',
          isCorrect: false,
          explanation:
            'This is subjective. Two designers would produce different results from this description.',
        },
        {
          id: 'b',
          label: '"Something between orange and red, not too bright"',
          isCorrect: false,
          explanation:
            'Still subjective and vague. It cannot be reliably turned into a specific color across tools.',
        },
        {
          id: 'c',
          label: '#E05252',
          isCorrect: true,
          explanation:
            'A HEX value is implementation-ready — it produces the same color in every browser, design tool, and handoff document with no interpretation required.',
        },
        {
          id: 'd',
          label: '"Use the error red from the style guide"',
          isCorrect: false,
          explanation:
            'This references a named token, which is useful if the token is defined — but without knowing the actual value, it cannot be implemented.',
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
