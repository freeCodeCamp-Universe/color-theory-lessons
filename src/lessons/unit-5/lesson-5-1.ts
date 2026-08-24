import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_1: LessonConfig = {
  id: 'u5-l1',
  unitId: 'unit-5',
  title: LESSON_TITLES['u5-l1'],
  interactionType: 'text-contrast-lab',
  reviewTags: ['contrast', 'text', 'wcag'],
  steps: [
    {
      text: 'In Unit 1, you learned that different hues do not guarantee readable text. WCAG calculates contrast from the relative luminance of the text and background colors. A light gray label on a white card can be hard to distinguish when the pair has a low contrast ratio.',
    },
    {
      text: 'At WCAG Level AA, normal text needs a contrast ratio of at least 4.5:1. Large text needs at least 3:1. Text qualifies as large when it is at least 18 pt at regular weight or at least 14 pt and bold.',
    },
    {
      text: 'Large text can use the lower threshold because its size and wider character strokes make it easier to read. Text below the large-text size and weight thresholds needs at least 4.5:1. Thin or unusual fonts can look fainter than their specified color, so check the rendered text as well as its calculated ratio.',
    },
    {
      text: 'A contrast ratio ranges from 1:1 for colors with the same relative luminance to 21:1 for black and white. The lab calculates this ratio for the text and background colors. Compare the result with the threshold for the text size and weight.',
    },
    {
      text: 'Adjust the text and background colors in the lab, and watch how each change affects the ratio. Fix all three pairs so their normal-size text reaches 4.5:1. Use the preview to check the text at its displayed size and weight.',
    },
  ],
  challenge: {
    prompt: 'Fix all three text and background pairs so their normal-size text has a contrast ratio of at least 4.5:1.',
    hints: [
      'Choose a darker text color or a lighter background color to increase the contrast of these pairs.',
      'Changing hue does not guarantee a higher contrast ratio. Check the ratio after each color change.',
      'Normal text needs at least 4.5:1. Large text needs at least 3:1.',
    ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the WCAG Level AA contrast requirement for normal-size body text?',
      choices: [
        { stableId: '2-1', label: '2:1', isCorrect: false, explanation: 'This is below the WCAG Level AA minimum for normal text.' },
        { stableId: '3-1', label: '3:1', isCorrect: false, explanation: 'The 3:1 threshold applies to large text at Level AA, not normal-size body text.' },
        { stableId: '4-5-1', label: '4.5:1', isCorrect: true, explanation: 'WCAG Level AA requires a contrast ratio of at least 4.5:1 for normal text.' },
        { stableId: '7-1', label: '7:1', isCorrect: false, explanation: 'A 7:1 ratio meets the Level AAA minimum for normal text and exceeds the Level AA requirement.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why does large text have a lower contrast requirement than normal text?',
      choices: [
        {
          stableId: 'large-text-is-decorative-and-does-not-need-to-be-readable',
          label: 'Large text is decorative and does not need to be readable',
          isCorrect: false,
          explanation: 'Large text still needs to be readable. Its size does not make it decorative.',
        },
        {
          stableId: 'large-type-is-easier-to-perceive-at-lower-contrast-because-of-it',
          label: 'Large type is easier to perceive at lower contrast because of its size',
          isCorrect: true,
          explanation: 'Larger text usually has wider character strokes, which makes it easier to read at a lower contrast ratio.',
        },
        {
          stableId: 'large-text-is-always-bold-and-bold-text-is-always-accessible',
          label: 'WCAG treats all large text as bold',
          isCorrect: false,
          explanation: 'Regular-weight text can qualify as large at 18 pt. Bold text can qualify at 14 pt.',
        },
        {
          stableId: 'designers-prefer-large-text-so-the-rules-are-more-lenient',
          label: 'Designers prefer large text, so WCAG lowers the requirement',
          isCorrect: false,
          explanation: 'The lower threshold reflects the readability of larger text, not a design preference.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'A designer changes text from blue to orange, but the contrast ratio does not improve. Why?',
      choices: [
        {
          stableId: 'orange-is-always-less-accessible-than-blue',
          label: 'WCAG uses different contrast thresholds for orange and blue text',
          isCorrect: false,
          explanation: 'WCAG uses the same text contrast thresholds for every hue.',
        },
        {
          stableId: 'contrast-ratio-depends-on-relative-luminance-not-hue-two-differe',
          label: 'Hue alone does not determine contrast; WCAG uses the relative luminance of both colors',
          isCorrect: true,
          explanation: 'Changing hue can raise, lower, or leave the ratio unchanged. WCAG calculates the ratio from the relative luminance of the text and background colors.',
        },
        {
          stableId: 'the-text-was-already-passing',
          label: 'A passing color cannot have a higher contrast ratio',
          isCorrect: false,
          explanation: 'A pair can pass its required threshold and still have a higher ratio, up to 21:1.',
        },
        {
          stableId: 'hue-always-changes-contrast-ratio',
          label: 'Any hue change produces a higher contrast ratio',
          isCorrect: false,
          explanation: 'A hue change can raise, lower, or leave the ratio unchanged, depending on the colors\' relative luminance.',
        },
      ],
    },
  ],
  keyPoints: [
    'WCAG calculates text contrast from the relative luminance of the text and background colors, not from their hues.',
    'At WCAG Level AA, normal text needs at least 4.5:1 contrast. Large text needs at least 3:1.',
    'Changing hue can raise, lower, or leave the contrast ratio unchanged. Check the ratio after each color change.',
    'Check rendered text at its displayed size and weight as well as its calculated contrast ratio.',
  ],
};
