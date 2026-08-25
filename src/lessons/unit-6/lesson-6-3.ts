import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_3: LessonConfig = {
  id: 'u6-l3', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l3'],
  interactionType: 'brand-pressure',
  reviewTags: ['brand', 'hierarchy', 'neutrals', 'balance'],
  steps: [
    { text: 'Unit 1 showed that accent colors lose emphasis when they appear on too many elements. Applying a brand color to backgrounds, labels, icons, and states can create the same problem across an interface because those elements compete for attention.' },
    { text: 'Reserve the brand color for a small set of emphasis roles, such as primary actions, links, or selected highlights. Neutrals and surface levels can define the rest of the structure.' },
    { text: 'Neutral colors can define page backgrounds, card surfaces, body text, dividers, and secondary actions. Using the brand color less often distinguishes it from these structural and content roles.' },
    { text: 'A tonal scale expands the brand color into lighter and darker variants. Those variants can support surfaces and interaction states when their contrast is tested. Success, warning, error, and info still need separate semantic roles.' },
    { text: 'The brand pressure challenge provides fixed brand colors for two actions and lets you edit four supporting roles. Reach the activity targets for text contrast and page/surface contrast, then keep the brand pressure meter below 40%.' },
  ],
  challenge: {
      prompt: 'Edit four supporting color roles around the two fixed brand actions. Reach 4.5:1 text contrast, 1.2:1 page/surface contrast, and less than 40% brand pressure.',
      hints: [
        'The fixed actions already use the brand colors. Start the editable supporting roles with neutral colors.',
        'Test primary text against the page background. This pair must reach 4.5:1.',
        'If the meter stays at 40% or above, replace saturated colors near the brand hue in the supporting roles with neutrals.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why does a complete interface need more than one color value?',
      choices: [
        { stableId: 'brand-colors-are-always-too-dark', label: 'Every brand color is too dark to use in an interface', isCorrect: false, explanation: 'Brand colors can be light or dark. Contrast depends on each foreground and background pair.' },
        { stableId: 'interfaces-need-neutrals-surface-levels-text-hierarchy-states-an', label: 'Different roles need color values that distinguish surfaces, text, actions, and statuses', isCorrect: true, explanation: 'Correct. Assigning different color values to these roles creates the contrast and color relationships that separate them.' },
        { stableId: 'regulations-require-multiple-colors', label: 'Accessibility standards require multiple colors', isCorrect: false, explanation: 'Accessibility standards do not require a minimum number of interface colors. They define requirements such as contrast and non-color cues.' },
        { stableId: 'brand-guidelines-always-forbid-overuse', label: 'Brand guidelines set the required number of interface colors', isCorrect: false, explanation: 'A design system defines the roles an interface needs. A brand guideline does not determine that number.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'The same saturated brand color appears on page backgrounds, cards, buttons, links, icons, and badges. What happens to the interface hierarchy?',
      choices: [
        { stableId: 'the-brand-becomes-more-recognizable', label: 'One element becomes the clear focal point', isCorrect: false, explanation: 'Repeating the same emphasis across these elements prevents any one of them from becoming the focal point.' },
        { stableId: 'contrast-improves-everywhere', label: 'The saturation guarantees contrast between every pair', isCorrect: false, explanation: 'Contrast ratios depend on relative luminance, not saturation alone.' },
        { stableId: 'hierarchy-collapses-every-element-competes-equally-for-attention', label: 'The elements compete for attention, making the interface harder to scan', isCorrect: true, explanation: 'Correct. Giving each element the same color emphasis makes it difficult to identify a primary action or focal point.' },
        { stableId: 'users-trust-the-product-more', label: 'Users trust the product more', isCorrect: false, explanation: 'Color repetition alone provides no basis for predicting user trust.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Where should a saturated brand color appear if the goal is to reserve it for emphasis?',
      choices: [
        { stableId: 'page-backgrounds', label: 'Page backgrounds', isCorrect: false, explanation: 'A page background repeats the brand color across the largest surface instead of reserving it for emphasis. Its text contrast would also need separate testing.' },
        { stableId: 'primary-interactive-elements-buttons-links-and-key-highlights-wh', label: 'Primary actions, links, and selected highlights', isCorrect: true, explanation: 'Correct. Restricting the brand color to these roles distinguishes them from neutral surfaces and supporting content.' },
        { stableId: 'all-text-colors', label: 'All text colors', isCorrect: false, explanation: 'Using one brand color for all text removes text hierarchy, and each text/background pair still needs contrast testing.' },
        { stableId: 'chart-backgrounds', label: 'Chart backgrounds', isCorrect: false, explanation: 'A brand-colored chart background gives a large area the strongest color emphasis and can compete with the data marks.' },
      ],
    },
  ],
  keyPoints: [
    'Brand colors are anchors, not complete systems — interfaces also need neutrals, tonal steps, and semantic roles.',
    'Put the brand color on primary interactive roles (buttons, links, highlights); use neutrals for structure and content.',
    'A tonal scale expands one brand hue into lighter/darker variants for states and hierarchy without introducing new hues.',
    'Accent overuse occurs when the brand color appears on everything — hierarchy collapses and nothing stands out.',
  ],
};
