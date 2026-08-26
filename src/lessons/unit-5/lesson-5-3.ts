import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_3: LessonConfig = {
  id: 'u5-l3', unitId: 'unit-5',
  title: LESSON_TITLES['u5-l3'],
  interactionType: 'state-workshop',
  reviewTags: ['color-only', 'wcag', 'redundancy', 'states', 'charts', 'backup-cues'],
  steps: [
    {
      text: 'In Unit 4, you saw that information conveyed by hue alone can become unclear when people perceive colors differently. WCAG 1.4.1, "Use of Color," requires another visual way to convey that information. Color can support the message, but it cannot be the only visual cue.',
    },
    {
      text: 'Interfaces often use color to identify semantic states such as success, warning, error, and information. A green badge alone requires the user to recognize its hue. Pairing the color with a checkmark icon and the word "Success" gives the state two non-color cues.',
    },
    {
      text: 'Form validation is one example. A red border alone does not explain what happened. Add an error icon and a text message that identifies the error and tells the user how to correct it.',
    },
    {
      text: 'A chart that identifies each series only by hue has the same problem. Place a text label beside each line or bar, or use patterns such as hatching and textures. These cues let users match data to a series without relying on a color-only legend.',
    },
    {
      text: 'Redundancy means communicating the same information with more than one visual cue. To check a color-coded state, ignore its hue and identify it from its icon, label, shape, or pattern. If the second cue conveys the state, the design does not rely on color alone.',
    },
  ],
  challenge: {
      prompt: 'Complete one repair stage: give every semantic state a non-color treatment, then check that no two treatments match.',
      hints: [
        'Toggle at least one of the three cues (icon, label, border) for each state card.',
        'If two states use the same border style, add an icon or label to distinguish them.',
        'Start by asking: if I removed hue, what would still communicate meaning?',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What does WCAG 1.4.1 "Use of Color" require?',
      choices: [
        {
          stableId: 'that-interfaces-use-no-more-than-five-colors',
          label: 'That interfaces use no more than five colors',
          isCorrect: false,
          explanation: 'WCAG 1.4.1 does not set a limit on the number of colors. It requires another visual cue when color conveys information.',
        },
        {
          stableId: 'that-color-is-not-the-only-visual-means-of-conveying-information',
          label: 'That color is not the only visual means of conveying information',
          isCorrect: true,
          explanation: 'When color conveys information, a label, icon, shape, pattern, or another visual distinction must convey that information too.',
        },
        {
          stableId: 'that-all-colors-must-pass-contrast-ratio-thresholds',
          label: 'That all colors must pass contrast ratio thresholds',
          isCorrect: false,
          explanation: 'Contrast ratios are covered by separate WCAG criteria. 1.4.1 is specifically about whether color is the sole information carrier.',
        },
        {
          stableId: 'that-color-must-be-removed-from-interactive-elements',
          label: 'That color must be removed from interactive elements',
          isCorrect: false,
          explanation: 'WCAG permits color coding when another visual cue conveys the same information.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why is a green border alone a weak success message?',
      choices: [
        {
          stableId: 'because-green-is-not-a-good-success-color',
          label: 'Because green is not a good success color',
          isCorrect: false,
          explanation: 'The problem is not the choice of green. A color-only border requires the user to recognize its hue.',
        },
        {
          stableId: 'because-it-conveys-meaning-only-through-hue-which-may-not-be-dis',
          label: 'Because it conveys success only through hue, which some users or displays may not distinguish',
          isCorrect: true,
          explanation: 'Some users and displays cannot distinguish green from other colors. An icon and text identify the success state without requiring the user to recognize green.',
        },
        {
          stableId: 'because-borders-should-not-be-used-in-accessible-designs',
          label: 'Because borders should not be used in accessible designs',
          isCorrect: false,
          explanation: 'A border can show a component\'s boundary. A green border alone still requires the user to recognize its hue as the success cue.',
        },
        {
          stableId: 'because-success-messages-must-always-use-a-modal-dialog',
          label: 'Because success feedback belongs in a modal dialog',
          isCorrect: false,
          explanation: 'Success feedback can appear inline. Its location does not provide a second visual cue for the success state.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'What does redundancy mean in accessible design?',
      choices: [
        {
          stableId: 'repeating-the-same-content-multiple-times-unnecessarily',
          label: 'Repeating the same content multiple times unnecessarily',
          isCorrect: false,
          explanation: 'Redundancy here means providing meaning through more than one visual channel.',
        },
        {
          stableId: 'conveying-meaning-through-more-than-one-visual-channel-so-that-l',
          label: 'Conveying the same meaning through more than one visual cue so it does not depend on color',
          isCorrect: true,
          explanation: 'If a user cannot distinguish the state colors, the icons and labels still identify the states.',
        },
        {
          stableId: 'using-the-same-color-for-all-states-to-reduce-confusion',
          label: 'Using the same color for all states to reduce confusion',
          isCorrect: false,
          explanation: 'Same color for all states would remove distinction entirely.',
        },
        {
          stableId: 'adding-extra-whitespace-to-improve-readability',
          label: 'Adding extra whitespace to improve readability',
          isCorrect: false,
          explanation: 'Whitespace is a layout concept, not a redundancy strategy.',
        },
      ],
    },
  ],
  keyPoints: [
    'WCAG 1.4.1 requires another visual way to convey information that color communicates.',
    'Pair color-coded semantic states with a non-color cue such as an icon, label, shape, or pattern.',
    'Form validation can combine a colored border with an error icon and text that explains how to correct the error.',
    'Direct labels and patterns can identify chart series without requiring users to match hues with a legend.',
    'Redundancy means communicating the same information with more than one visual cue.',
  ],
};
