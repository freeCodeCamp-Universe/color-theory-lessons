import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_4: LessonConfig = {
  id: 'u6-l4', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l4'],
  interactionType: 'dark-translator',
  reviewTags: ['dark-mode', 'theme', 'hierarchy', 'adaptation'],
  steps: [
    { text: 'Inverting a light theme does not preserve the relationships between its color roles. The result can reduce separation between surfaces, change text contrast, and make semantic colors harder to distinguish.' },
    { text: 'One way to distinguish a dark theme\'s base background from raised surfaces is to give each role a different lightness. For example, a page background of #0f172a can pair with a lighter #1e293b card surface so the card remains distinguishable.' },
    { text: 'Check each text color against the surface where it appears. For example, #f8fafc primary text and #94a3b8 secondary text both exceed 4.5:1 against a #1e293b surface.' },
    { text: 'The same accent can have different visual prominence when its surrounding colors change. Compare it with its dark background and nearby semantic colors, then adjust its lightness or saturation if needed.' },
    { text: 'In the dark translator, you start with a fixed light theme and assign a dark value to each role. Switch the preview between modes to compare their surface hierarchy, text readability, and semantic colors.' },
  ],
  challenge: {
      prompt: 'Complete one stage: choose dark-theme values for each semantic role. Use the preview to compare the fixed light theme with your dark theme, then evaluate the values with the displayed checks.',
      hints: [
        'Try #0f172a for the page and a lighter #1e293b or #334155 for the surface.',
        'Check the action color against both its dark surroundings and its white button text.',
        'Check primary and secondary text separately because each role uses a different color.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why is simple inversion not a reliable dark mode strategy?',
      choices: [
        { stableId: 'css-cannot-invert-values', label: 'CSS cannot invert color values', isCorrect: false, explanation: 'CSS filters can invert rendered colors. The problem is how the resulting colors relate to each other.' },
        { stableId: 'inverted-colors-never-pass-contrast', label: 'Inversion applies the wrong contrast formula', isCorrect: false, explanation: 'The contrast formula does not change between themes, and an inverted pair can still pass a contrast check.' },
        { stableId: 'inverted-values-often-collapse-surface-separation-create-harsh-e', label: 'Inversion can collapse surface separation and change the meaning of semantic colors', isCorrect: true, explanation: 'Each role needs a value that works with the other colors in the dark theme.' },
        { stableId: 'users-dislike-inverted-themes', label: 'Users prefer light themes', isCorrect: false, explanation: 'Theme preference does not determine whether the color relationships work.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why might a saturated accent color need adjustment in dark mode?',
      choices: [
        { stableId: 'colors-always-need-to-match-exactly-across-modes', label: 'Theme roles must use the same color values in both modes', isCorrect: false, explanation: 'A role keeps the same purpose across themes, but its color value can change.' },
        { stableId: 'vivid-colors-appear-more-intense-on-dark-backgrounds-they-can-do', label: 'The accent can gain too much visual prominence against a dark background', isCorrect: true, explanation: 'Compare the accent with nearby content and adjust its lightness or saturation when needed.' },
        { stableId: 'dark-mode-requires-desaturated-colors', label: 'Every dark-theme accent needs the same saturation reduction', isCorrect: false, explanation: 'No fixed saturation adjustment works for every accent and background pair.' },
        { stableId: 'browsers-change-color-values-in-dark-mode', label: 'Browsers automatically modify custom colors in dark mode', isCorrect: false, explanation: 'A custom color keeps its specified value unless the stylesheet supplies another value for dark mode.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'How can a dark theme distinguish stacked surfaces?',
      choices: [
        { stableId: 'using-slightly-different-dark-values-for-each-surface-layer-page', label: 'Using different values for the page, card, and raised panel so each layer remains visible', isCorrect: true, explanation: 'Small lightness differences can separate adjacent surface layers.' },
        { stableId: 'adding-white-borders-to-each-layer', label: 'Using one color for every layer without a visible boundary', isCorrect: false, explanation: 'Identical fills without borders or other boundaries do not separate the layers.' },
        { stableId: 'inverting-the-light-theme-surface-values', label: 'Inverting the light theme surface values', isCorrect: false, explanation: 'Inversion does not guarantee useful differences between adjacent surface roles.' },
        { stableId: 'using-pure-black-for-all-backgrounds', label: 'Using pure black for all backgrounds', isCorrect: false, explanation: 'Pure black for all backgrounds eliminates all separation between layers.' },
      ],
    },
  ],
  keyPoints: [
    'Build a dark theme role by role; direct inversion can flatten surfaces, alter contrast, and blur semantic distinctions.',
    'Separate base and raised surface roles with different lightness values.',
    'Retest every text-and-surface pair in each theme because light-theme contrast does not carry over automatically.',
    'Judge an accent against its theme background and nearby semantic colors, adjusting lightness or saturation when its prominence changes.',
    'After assigning every dark-theme role, compare the paired themes for surface hierarchy, text readability, and semantic distinction.',
  ],
};
