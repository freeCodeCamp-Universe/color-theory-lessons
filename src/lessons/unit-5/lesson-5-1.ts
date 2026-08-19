import type { LessonConfig } from '../../types/lesson.ts';

export const lesson5_1: LessonConfig = {
  id: 'u5-l1', unitId: 'unit-5',
  title: 'Text Contrast in Practice',
  interactionType: 'text-contrast-lab',
  glossaryTerms: ['text contrast', 'normal text', 'large text', 'contrast ratio', 'pass', 'fail'],
  reviewTags: ['contrast', 'text', 'WCAG'],
  steps: [
    { id: 's1', text: 'In Unit 1, you learned that lightness difference — not hue — drives readable contrast. Now we quantify that with specific thresholds. A light gray label on a white card may feel elegant, but if the luminance difference is too small, many users will struggle to read it.', highlights: ['text contrast', 'contrast ratio'] },
    { id: 's2', text: 'For most practical design work, remember two thresholds: 4.5:1 for normal body text and interface labels, and 3:1 for large text (18pt+ regular or 14pt+ bold).', highlights: ['normal text', 'large text'] },
    { id: 's3', text: 'Large text can tolerate slightly less contrast because its size makes it easier to perceive. Small, light, or thin text needs stronger contrast — sometimes significantly more than the minimum.' },
    { id: 's4', text: 'A contrast ratio is a number from 1:1 (no contrast) to 21:1 (pure black on pure white). The tool calculates this ratio from the relative luminance of both colors. A pair either passes or fails — there is no aesthetic override.', highlights: ['pass', 'fail'] },
    { id: 's5', text: 'Adjust the text and background colors in the lab. Watch how the ratio changes. Fix the three failing pairs in the challenge — meet the threshold for the stated use case. Remember: checking a color chip is not the same as checking text at real size and weight.' },
  ],
  challenges: [{ id: 'c1', prompt: 'Fix three failing text/background pairs to pass the contrast threshold for their stated use case.', type: 'repair', hints: ['Lower the text lightness (make it darker) or raise the background lightness (make it lighter).', 'Changing hue alone often does not fix contrast — focus on the lightness difference.', 'Normal text needs 4.5:1. Large text needs 3:1.'] }],
  quizItems: [
    { id: 'q1', prompt: 'What contrast ratio is typically required for normal-size body text?', choices: [{ id: 'a', label: '2:1', isCorrect: false, explanation: 'This is below the practical minimum. Normal text typically needs 4.5:1.' }, { id: 'b', label: '3:1', isCorrect: false, explanation: '3:1 is the threshold for large text, not normal body copy.' }, { id: 'c', label: '4.5:1', isCorrect: true, explanation: '4.5:1 is the practical target for normal text in most beginner-level UI work.' }, { id: 'd', label: '7:1', isCorrect: false, explanation: '7:1 is considered enhanced contrast — beyond the typical minimum.' }] },
    { id: 'q2', prompt: 'Why does large text have a lower contrast requirement than normal text?', choices: [{ id: 'a', label: 'Large text is decorative and does not need to be readable', isCorrect: false, explanation: 'Large text is just as readable as small text — in fact, more so.' }, { id: 'b', label: 'Large type is easier to perceive at lower contrast because of its size', isCorrect: true, explanation: 'Larger forms are more legible at lower contrast ratios — the eye has more surface area to work with.' }, { id: 'c', label: 'Large text is always bold and bold text is always accessible', isCorrect: false, explanation: 'Size and weight both factor in, but bold alone does not guarantee accessibility.' }, { id: 'd', label: 'Designers prefer large text so the rules are more lenient', isCorrect: false, explanation: 'The threshold reflects legibility science, not designer preference.' }] },
    { id: 'q3', prompt: 'A designer changes the hue of text from blue to orange, but the contrast ratio does not improve. Why?', choices: [{ id: 'a', label: 'Orange is always less accessible than blue', isCorrect: false, explanation: 'Neither hue is inherently more or less accessible.' }, { id: 'b', label: 'Contrast ratio depends on relative luminance, not hue — two different hues can have the same lightness and produce the same ratio', isCorrect: true, explanation: 'Hue changes alone do not improve contrast. Lightness difference is what matters.' }, { id: 'c', label: 'The text was already passing', isCorrect: false, explanation: 'If the ratio did not change, neither the pass nor fail status changed.' }, { id: 'd', label: 'Hue always changes contrast ratio', isCorrect: false, explanation: 'Hue changes only affect contrast if they also change luminance.' }] },
  ],
  keyPoints: [
    'Text readability depends primarily on the luminance contrast between text and background, not on hue.',
    'Common practical thresholds: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold).',
    'Changing hue alone rarely fixes a contrast failure — focus on lightness difference.',
    'Always test contrast with actual text sizes and weights in context, not only with color chip pairs.',
  ],
};
