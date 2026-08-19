import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_2: LessonConfig = {
  id: 'u6-l2', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l2'],
  interactionType: 'role-builder',
  glossaryTerms: ['component state', 'disabled', 'elevated surface', 'hover', 'primary text', 'secondary text', 'semantic status'],
  reviewTags: ['roles', 'components', 'states', 'hierarchy'],
  steps: [
    { text: 'A useful role set covers four areas: structural (backgrounds, surfaces, dividers), content (primary text, secondary text, and inverse text — text placed on dark or colored surfaces), interactive (primary action, secondary action, focus, links), and semantic (success, warning, error, info).' },
    { text: 'Text usually needs at least two levels. Primary text is used for headings and important labels. Secondary text is used for supporting information, captions, and metadata. Without this separation, everything fights for attention.' },
    { text: 'Surfaces also need levels: the page background, the card surface on top of it, and sometimes a raised panel on top of the card. Without tonal separation between surfaces, the layout loses depth and visual structure.' },
    { text: 'Interactive roles need more than a single action color. A button also has hover, focus, pressed, and disabled states. Each needs a clear visual treatment — not just a different hex, but a meaningful role.' },
    { text: 'In the role builder, assign colors to each semantic slot. A live preview shows how your choices affect a card, a button, an alert, and a form field. The tool flags obvious problems like indistinct statuses or weak text hierarchy.' },
  ],
  challenge: {
      prompt: 'Assign colors to all required semantic roles so the live preview shows clear hierarchy, readable text, and distinguishable status states.',
      hints: [
        'Start with surfaces and text — get the background and readability right before adding accent colors.',
        'Keep success/warning/error visually distinct — not just different hues but different enough lightness too.',
        'Check: can you tell what is interactive vs informational vs structural?',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why should a system usually include at least two text roles?',
      choices: [
        { id: 'a', label: 'Contrast rules require it', isCorrect: false, explanation: 'WCAG does not require two text roles — the reasoning is about visual hierarchy.' },
        { id: 'b', label: 'To create hierarchy — primary text draws attention, secondary text supports without competing', isCorrect: true, explanation: 'Correct. Two text roles allow information to have weight and hierarchy without every element demanding equal attention.' },
        { id: 'c', label: 'Components need many text colors to look complex', isCorrect: false, explanation: 'Complexity is not a goal — clear hierarchy is.' },
        { id: 'd', label: 'Brand guidelines require two text colors', isCorrect: false, explanation: 'Text hierarchy is a usability concern, not a brand guideline requirement.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A button has only a default color. No hover, focus, pressed, or disabled state is defined. What is missing?',
      choices: [
        { id: 'a', label: 'Brand alignment', isCorrect: false, explanation: 'Brand alignment is not the issue — component state feedback is.' },
        { id: 'b', label: 'Component state treatments — without them users cannot tell whether a button responded to their input', isCorrect: true, explanation: 'Correct. States communicate feedback — users need to know when something is being hovered, focused, or is unavailable.' },
        { id: 'c', label: 'Dark mode support', isCorrect: false, explanation: 'Dark mode is a separate concern from component states.' },
        { id: 'd', label: 'Icon support', isCorrect: false, explanation: 'Icons are optional — component states are not.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'An interface has one surface color used everywhere — page, cards, panels, and overlays. What breaks?',
      choices: [
        { id: 'a', label: 'Text contrast always fails', isCorrect: false, explanation: 'Text contrast depends on text/background pairs, not on surface uniformity.' },
        { id: 'b', label: 'Buttons become unclickable', isCorrect: false, explanation: 'Button functionality is not affected by surface uniformity.' },
        { id: 'c', label: 'Visual depth and structure — without surface levels, the layout loses hierarchy and components blur together', isCorrect: true, explanation: 'Correct. Depth and separation between layers require distinct surface values.' },
        { id: 'd', label: 'Brand colors dominate', isCorrect: false, explanation: 'Surface uniformity is a structural problem, not a brand color problem.' },
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
