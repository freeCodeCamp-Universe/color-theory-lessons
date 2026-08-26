import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_2: LessonConfig = {
  id: 'u5-l2', unitId: 'unit-5',
  title: LESSON_TITLES['u5-l2'],
  interactionType: 'component-checker',
  reviewTags: ['contrast', 'components', 'controls', 'wcag'],
  steps: [
    {
      text: 'WCAG contrast requirements cover more than text. Visual information that identifies a control or its state needs at least 3:1 contrast with adjacent colors. The same threshold applies to parts of graphics needed to understand the content.',
    },
    {
      text: "Some controls use a visible boundary to show their size and location. If an input's border is the only visual cue that identifies it, the border needs at least 3:1 contrast with the adjacent background.",
    },
    {
      text: 'A visible focus indicator shows sighted keyboard users which element has focus. If an author styles the indicator, it needs at least 3:1 contrast with adjacent colors so users can locate it.',
    },
    {
      text: 'An icon is a graphical object when it provides information without an equivalent visible text label. The parts needed to understand the icon need at least 3:1 contrast with adjacent colors. A state icon that is the only visible cue for enabled or disabled must meet this threshold.',
    },
    {
      text: 'Use the component checker to adjust each element until its contrast ratio against white is at least 3:1. Check the ratio for each boundary, icon, focus indicator, and state indicator.',
    },
  ],
  challenge: {
    prompt: 'Complete one repair stage: adjust the input border, icon, focus ring, and toggle track, then check that each has at least 3:1 contrast against white.',
    hints: [
      'WCAG measures non-text contrast between the visual information needed to identify a component or state and its adjacent color.',
      'Each preview uses a white background. Choose a color that the checker reports as 3:1 or higher.',
      'An element passes when its displayed contrast ratio reaches 3:1.',
    ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which visual information does WCAG require to have at least 3:1 contrast with adjacent colors?',
      choices: [
        {
          stableId: 'yes-text-is-the-most-important-element',
          label: 'Every graphic, including decoration',
          isCorrect: false,
          explanation: 'Decorative graphics are not required to meet the non-text contrast threshold.',
        },
        {
          stableId: 'no-controls-icons-boundaries-and-meaningful-graphics-also-need-c',
          label: 'Visual information needed to identify controls, states, and meaningful graphics',
          isCorrect: true,
          explanation: 'These visual details need at least 3:1 contrast with adjacent colors.',
        },
        {
          stableId: 'yes-graphics-are-decorative',
          label: 'Only text and text labels',
          isCorrect: false,
          explanation: 'WCAG also sets contrast requirements for visual information that identifies controls, states, and meaningful graphics.',
        },
        {
          stableId: 'yes-focus-states-only-matter-for-mobile',
          label: 'Every border, even when it is not needed to identify a component',
          isCorrect: false,
          explanation: 'A border does not need 3:1 contrast when other visual information identifies the component and its state.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why does a visible focus indicator matter?',
      choices: [
        {
          stableId: 'it-makes-the-design-look-more-polished',
          label: 'It makes the design look more polished',
          isCorrect: false,
          explanation: 'A focus indicator communicates keyboard focus, not visual polish.',
        },
        {
          stableId: 'it-lets-keyboard-and-assistive-technology-users-track-which-elem',
          label: 'It shows sighted keyboard users which element has keyboard focus',
          isCorrect: true,
          explanation: 'The indicator shows which element will receive the next keyboard action.',
        },
        {
          stableId: 'it-improves-load-performance',
          label: 'It improves load performance',
          isCorrect: false,
          explanation: 'Focus indicators do not affect load performance.',
        },
        {
          stableId: 'designers-prefer-visible-focus-rings-aesthetically',
          label: 'It shows which element a pointer is hovering over',
          isCorrect: false,
          explanation: 'Hover and keyboard focus are different interaction states.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'An icon is the only visible cue that shows whether a setting is enabled or disabled. What contrast does it need against its background?',
      choices: [
        {
          stableId: 'icons-are-decorative-and-do-not-need-contrast',
          label: 'No minimum because icons are decorative',
          isCorrect: false,
          explanation: 'This icon communicates the setting state, so it is not decorative.',
        },
        {
          stableId: 'the-icon-carries-essential-meaning-and-low-contrast-makes-it-har',
          label: 'At least 3:1',
          isCorrect: true,
          explanation: 'The icon needs at least 3:1 contrast because it is the only visible cue for the setting state.',
        },
        {
          stableId: 'icons-only-need-to-be-large-to-be-accessible',
          label: 'No minimum if the icon is large',
          isCorrect: false,
          explanation: 'Increasing the icon size does not remove the non-text contrast requirement.',
        },
        {
          stableId: 'the-button-text-label-fixes-the-contrast-problem',
          label: 'At least 4.5:1',
          isCorrect: false,
          explanation: 'The 4.5:1 threshold applies to normal-size text. Meaningful icons need at least 3:1 contrast.',
        },
      ],
    },
  ],
  keyPoints: [
    'Visual information needed to identify controls, states, and meaningful graphics needs at least 3:1 contrast with adjacent colors.',
    'If an input border is the only visual cue that identifies the control, it needs at least 3:1 contrast with the adjacent background.',
    'A visible focus indicator shows sighted keyboard users which element has focus. An author-styled indicator needs at least 3:1 contrast with adjacent colors.',
    'The parts needed to understand an icon without an equivalent visible text label need at least 3:1 contrast with adjacent colors.',
  ],
};
