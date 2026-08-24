import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_2: LessonConfig = {
  id: 'u6-l2', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l2'],
  interactionType: 'role-builder',
  reviewTags: ['roles', 'components', 'states', 'hierarchy'],
  steps: [
    { text: 'A useful role set covers four areas: structural (backgrounds, surfaces, dividers), content (primary text, secondary text, and inverse text placed on dark or colored surfaces), interactive (primary action, secondary action, focus, links), and semantic (success, warning, error, info).' },
    { text: 'Text usually needs at least two levels. Primary text is used for headings and important labels. Secondary text is used for supporting information, captions, and metadata. Separate roles let headings and important labels stand out from supporting text.' },
    { text: 'Surfaces also need levels: the page background, the card surface on top of it, and sometimes a raised panel on top of the card. Differences in color, borders, shadows, or spacing can show where one surface ends and another begins.' },
    { text: 'Interactive roles need more than a single action color. A button also has hover, focus, pressed, and disabled states. Each state needs a visual treatment that communicates the button\'s current interaction state.' },
    { text: 'In the role builder, assign colors to each semantic role. The live preview applies your choices to a card, a button, and three status badges. The validation panel reports text contrast and the hue difference between the warning and error colors.' },
  ],
  challenge: {
      prompt: 'Assign colors to all required semantic roles so the live preview shows clear hierarchy, readable text, and distinguishable status states.',
      hints: [
        'Start with the surface and text colors. Check their contrast before adding action and status colors.',
        'Choose success, warning, and error colors that remain distinguishable from one another.',
        'Check: can you tell what is interactive vs informational vs structural?',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why should a system usually include at least two text roles?',
      choices: [
        { stableId: 'contrast-rules-require-it', label: 'Contrast rules require it', isCorrect: false, explanation: 'WCAG does not require separate primary and secondary text roles. These roles establish visual hierarchy.' },
        { stableId: 'to-create-hierarchy-primary-text-draws-attention-secondary-text-', label: 'To create hierarchy, with primary text drawing attention and secondary text supporting it', isCorrect: true, explanation: 'Correct. Separate roles let headings and important labels stand out from supporting information.' },
        { stableId: 'components-need-many-text-colors-to-look-complex', label: 'Components need many text colors to look complex', isCorrect: false, explanation: 'Extra complexity does not establish a clear text hierarchy.' },
        { stableId: 'brand-guidelines-require-two-text-colors', label: 'Brand guidelines require two text colors', isCorrect: false, explanation: 'Text hierarchy is a usability concern, not a brand guideline requirement.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A button has only a default color. No hover, focus, pressed, or disabled state is defined. What is missing?',
      choices: [
        { stableId: 'brand-alignment', label: 'Brand alignment', isCorrect: false, explanation: 'Brand alignment does not provide the missing component-state feedback.' },
        { stableId: 'component-state-treatments-without-them-users-cannot-tell-whethe', label: 'Component-state treatments that show how the button responds to input', isCorrect: true, explanation: 'Correct. State treatments show when a user hovers over or focuses a button, presses it, or cannot use it.' },
        { stableId: 'dark-mode-support', label: 'Dark mode support', isCorrect: false, explanation: 'Dark mode is a separate concern from component states.' },
        { stableId: 'icon-support', label: 'Icon support', isCorrect: false, explanation: 'A button does not need an icon to show its hover, focus, pressed, and disabled states.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'An interface uses the same color for its page, cards, panels, and overlays, with no borders, shadows, or spacing to separate them. What design problem can this cause?',
      choices: [
        { stableId: 'text-contrast-always-fails', label: 'The shared surface color determines every text contrast result', isCorrect: false, explanation: 'Text contrast depends on each text and background color pair, not on whether surfaces share a color.' },
        { stableId: 'buttons-become-unclickable', label: 'Buttons become unclickable', isCorrect: false, explanation: 'Button functionality is not affected by surface uniformity.' },
        { stableId: 'visual-depth-and-structure-without-surface-levels-the-layout-los', label: 'Surface levels become difficult to distinguish from one another', isCorrect: true, explanation: 'Correct. Without a color difference or another boundary cue, adjacent layers can appear to merge.' },
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
