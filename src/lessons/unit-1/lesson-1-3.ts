import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson1_3: LessonConfig = {
  id: 'u1-l3',
  unitId: 'unit-1',
  title: LESSON_TITLES['u1-l3'],
  interactionType: 'contrast-checker',
  reviewTags: ['contrast', 'readability', 'foundations'],
  steps: [
    {
      text: 'Text and its background can have different hues and still be hard to distinguish when they appear similarly light or dark. Changing hue alone does not guarantee readable text.',
    },
    {
      text: 'Labels, button text, navigation links, helper text, and placeholder text all rely on contrast with their backgrounds. When contrast is low, their letter shapes are harder to distinguish.',
    },
    {
      text: 'The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios for text. WCAG calculates contrast from the relative luminance of the foreground and background colors, not from their hue or HSL lightness values. At Level AA, text needs at least 4.5:1 contrast. Text that is at least 18 pt, or at least 14 pt and bold, qualifies as large text and needs at least 3:1.',
    },
    {
      text: 'A palette can look appealing while text and controls still blend into their backgrounds. Check the contrast of each foreground and background pair instead of judging readability from the palette as a whole.',
    },
    {
      text: 'A contrast problem does not have one fixed solution. Depending on the color pair, you can change the foreground, the background, or both.',
    },
  ],
  challenge: {
      prompt: 'Repair three low-contrast text pairs in the dashboard card: the section label, the helper text, and the Submit text on its button background.',
      hints: [
        'The section label sits on a dark background. Increase the label\'s lightness to raise its contrast.',
        'Increase the helper text\'s lightness so it stands out from the dark background.',
        'The Submit text is white. Decrease the button background\'s lightness to raise the contrast.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which measurement determines whether text and its background meet a WCAG contrast requirement?',
      choices: [
        { stableId: 'the-difference-between-their-hue-angles', label: 'The difference between their hue angles', isCorrect: false, explanation: 'Hue angle is not part of the WCAG contrast calculation.' },
        { stableId: 'the-difference-between-their-hsl-lightness-values', label: 'The difference between their HSL lightness values', isCorrect: false, explanation: 'Changing HSL lightness can affect contrast, but WCAG does not calculate the ratio from those percentages.' },
        { stableId: 'the-contrast-ratio-calculated-from-relative-luminance', label: 'The contrast ratio calculated from relative luminance', isCorrect: true, explanation: 'WCAG calculates the contrast ratio from the relative luminance of the text and background colors.' },
        { stableId: 'the-difference-between-their-saturation-values', label: 'The difference between their saturation values', isCorrect: false, explanation: 'Saturation is not part of the WCAG contrast calculation.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A paragraph uses 16 pt regular text with a contrast ratio of 3.8:1. Does it meet WCAG Level AA?',
      choices: [
        { stableId: 'yes-any-ratio-above-3-1-passes-level-aa', label: 'Yes. Any ratio above 3:1 passes Level AA.', isCorrect: false, explanation: 'The 3:1 threshold applies only to large text.' },
        { stableId: 'no-it-needs-at-least-4-5-1', label: 'No. It needs at least 4.5:1.', isCorrect: true, explanation: 'At 16 pt and regular weight, this does not qualify as large text. It needs at least 4.5:1 contrast.' },
        { stableId: 'it-cannot-be-determined-without-the-hue-values', label: 'It cannot be determined without the hue values.', isCorrect: false, explanation: 'Hue is not part of the WCAG contrast calculation.' },
        { stableId: 'yes-text-above-14-pt-only-needs-3-1', label: 'Yes. Text above 14 pt only needs 3:1.', isCorrect: false, explanation: 'The 14 pt threshold applies only to bold text. Regular text must be at least 18 pt to use the 3:1 threshold.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'The same text color has a 7:1 contrast ratio on the page background and 2:1 on a card background. Which statement is correct?',
      choices: [
        { stableId: 'both-pairs-pass-because-their-ratios-average-to-4-5-1', label: 'Both pairs pass because their ratios average to 4.5:1.', isCorrect: false, explanation: 'Contrast ratios are not averaged. Each pair must meet the threshold.' },
        { stableId: 'the-result-cannot-change-unless-the-text-color-changes', label: 'The result cannot change unless the text color changes.', isCorrect: false, explanation: 'Changing the background changes the contrast ratio even when the text color stays fixed.' },
        { stableId: 'it-passes-in-both-places-because-the-text-color-can-reach-7-1', label: 'It passes in both places because the text color can reach 7:1.', isCorrect: false, explanation: 'A passing ratio against one background does not apply to other backgrounds.' },
        { stableId: 'it-passes-on-the-page-background-and-fails-on-the-card-backgroun', label: 'It passes on the page background and fails on the card background.', isCorrect: true, explanation: 'WCAG evaluates each foreground and background pair separately.' },
      ],
    },
  ],
  keyPoints: [
    'Different hues do not guarantee that a text and background pair is readable when both colors appear similarly light or dark.',
    'WCAG calculates text contrast from the relative luminance of the foreground and background colors, not from hue or HSL lightness.',
    'At WCAG Level AA, text that does not qualify as large needs at least 4.5:1 contrast. Large text needs at least 3:1.',
    'Contrast belongs to a foreground and background pair. The same text color can pass on one background and fail on another.',
    'A low-contrast pair can be repaired by changing the foreground, the background, or both.',
  ],
};
