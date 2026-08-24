import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_2: LessonConfig = {
  id: 'u6-l2', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l2'],
  interactionType: 'role-builder',
  reviewTags: ['roles', 'components', 'states', 'hierarchy'],
  steps: [
    { text: 'A useful role set covers four areas: structural (backgrounds, surfaces, dividers), content (primary text, secondary text, and inverse text — text placed on dark or colored surfaces), interactive (primary action, secondary action, focus, links), and semantic (success, warning, error, info).' },
    { text: 'Text usually needs at least two levels. Primary text is used for headings and important labels. Secondary text is used for supporting information, captions, and metadata. Without this separation, everything fights for attention.' },
    { text: 'Surfaces also need levels: the page background, the card surface on top of it, and sometimes a raised panel on top of the card. Without tonal separation between surfaces, the layout loses depth and visual structure.' },
    { text: 'Interactive roles need more than a single action color. A button also has hover, focus, pressed, and disabled states. Each needs a clear visual treatment — not just a different hex, but a meaningful role.' },
    { text: 'In the role builder, assign colors to each semantic role. The live preview applies them to a card, an action, and three status badges. Text labels and icons keep each status identifiable without color, while the colors reinforce its semantic role.' },
  ],
  challenge: {
      prompt: 'Assign colors to every semantic role. Create visible surface hierarchy, readable text, and status colors that differ in both hue and luminance. Labels and icons remain as non-color status cues.',
      hints: [
        'Start with the page and card surfaces. Their contrast must reach the exercise threshold of 1.5:1.',
        'Action and status text must reach the WCAG AAA contrast ratio of 7:1. The preview chooses black or white text, whichever has more contrast.',
        'Every status pair must differ by at least 30 degrees of hue and 1.5:1 in relative luminance. These are course thresholds for practicing semantic color roles, not WCAG requirements.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why should a system usually include at least two text roles?',
      choices: [
        { stableId: 'contrast-rules-require-it', label: 'Contrast rules require it', isCorrect: false, explanation: 'WCAG does not require two text roles — the reasoning is about visual hierarchy.' },
        { stableId: 'to-create-hierarchy-primary-text-draws-attention-secondary-text-', label: 'To create hierarchy — primary text draws attention, secondary text supports without competing', isCorrect: true, explanation: 'Correct. Two text roles allow information to have weight and hierarchy without every element demanding equal attention.' },
        { stableId: 'components-need-many-text-colors-to-look-complex', label: 'Components need many text colors to look complex', isCorrect: false, explanation: 'Complexity is not a goal — clear hierarchy is.' },
        { stableId: 'brand-guidelines-require-two-text-colors', label: 'Brand guidelines require two text colors', isCorrect: false, explanation: 'Text hierarchy is a usability concern, not a brand guideline requirement.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A button has only a default color. No hover, focus, pressed, or disabled state is defined. What is missing?',
      choices: [
        { stableId: 'brand-alignment', label: 'Brand alignment', isCorrect: false, explanation: 'Brand alignment is not the issue — component state feedback is.' },
        { stableId: 'component-state-treatments-without-them-users-cannot-tell-whethe', label: 'Component state treatments — without them users cannot tell whether a button responded to their input', isCorrect: true, explanation: 'Correct. States communicate feedback — users need to know when something is being hovered, focused, or is unavailable.' },
        { stableId: 'dark-mode-support', label: 'Dark mode support', isCorrect: false, explanation: 'Dark mode is a separate concern from component states.' },
        { stableId: 'icon-support', label: 'Icon support', isCorrect: false, explanation: 'Icons are optional — component states are not.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'An interface has one surface color used everywhere — page, cards, panels, and overlays. What breaks?',
      choices: [
        { stableId: 'text-contrast-always-fails', label: 'Text contrast always fails', isCorrect: false, explanation: 'Text contrast depends on text/background pairs, not on surface uniformity.' },
        { stableId: 'buttons-become-unclickable', label: 'Buttons become unclickable', isCorrect: false, explanation: 'Button functionality is not affected by surface uniformity.' },
        { stableId: 'visual-depth-and-structure-without-surface-levels-the-layout-los', label: 'Visual depth and structure — without surface levels, the layout loses hierarchy and components blur together', isCorrect: true, explanation: 'Correct. Depth and separation between layers require distinct surface values.' },
        { stableId: 'brand-colors-dominate', label: 'Brand colors dominate', isCorrect: false, explanation: 'Surface uniformity is a structural problem, not a brand color problem.' },
      ],
    },
  ],
  keyPoints: [
    'A useful role set covers four areas: structural, content, interactive, and semantic.',
    'Text needs multiple levels (primary, secondary, inverse) to support readable hierarchy across components.',
    'Surfaces need distinct levels (page, card, raised panel) to create depth and layout clarity.',
    'Component states (hover, focus, pressed, disabled) are essential — they tell users whether their actions are registering.',
  ],
};
