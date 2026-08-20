import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson1_6: LessonConfig = {
  id: 'u1-l6',
  unitId: 'unit-1',
  title: LESSON_TITLES['u1-l6'],
  interactionType: 'color-wheel',
  reviewTags: ['harmony', 'foundations', 'palette'],
  steps: [
    {
      text: 'A color wheel shows relationships between hues based on their positions. Hues can sit next to each other, opposite each other, or at equal intervals around the wheel. Designers use these positions as starting points for building palettes.',
    },
    {
      text: 'Analogous colors sit next to each other on the color wheel. Their hue angles are close together, so the changes from one color to the next are gradual. An analogous palette can use one hue as the dominant color and nearby hues as supporting colors.',
      panel: { type: 'color-wheel-preview', relationship: 'analogous' },
    },
    {
      text: 'Complementary colors sit opposite each other on the color wheel, 180 degrees apart. This is the largest possible separation between two hue angles. In an interface, one hue can be dominant while the other appears in smaller areas as an accent.',
      panel: { type: 'color-wheel-preview', relationship: 'complementary' },
    },
    {
      text: 'Triadic palettes use three hues spaced 120 degrees apart around the color wheel. The hues have equal angular separation, but they do not need equal visual weight. One hue can be dominant while the other two support it.',
      panel: { type: 'color-wheel-preview', relationship: 'triadic' },
    },
    {
      text: 'Color harmony describes how the colors in a palette relate to one another. A simple interface palette can start with one dominant hue, supporting hues chosen from a color-wheel relationship, and neutral colors for surfaces or text. Use the tool to choose a relationship and base hue.',
    },
  ],
  challenge: {
      prompt: 'Build a starter palette by choosing an analogous, complementary, or triadic relationship and adjusting the base hue. After you lock it in, identify how the selected relationship positions its hues on the color wheel.',
      hints: [
        'The base hue is the starting point. The wheel marks the other hues in the selected relationship.',
        'In this tool, analogous hues are 30 degrees from the base, a complementary hue is 180 degrees from the base, and triadic hues are 120 degrees apart.',
        'Look at the positions of the marked hues before answering the reflection question.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'On the color wheel used in this lesson, a designer pairs a blue at 210 degrees with an orange at 30 degrees. What relationship is this?',
      choices: [
        { stableId: 'analogous', label: 'Analogous', isCorrect: false, explanation: 'Analogous hues sit next to each other. These two hue angles are 180 degrees apart.' },
        { stableId: 'triadic', label: 'Triadic', isCorrect: false, explanation: 'A triadic relationship contains three hues spaced 120 degrees apart. This pair is 180 degrees apart.' },
        { stableId: 'complementary', label: 'Complementary', isCorrect: true, explanation: 'The hue angles are 180 degrees apart, so they form a complementary pair.' },
        { stableId: 'monochromatic', label: 'Monochromatic', isCorrect: false, explanation: 'A monochromatic palette changes the saturation or lightness of one hue. This palette uses two different hues.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why can several accent colors with similar visual weight weaken a design?',
      choices: [
        { stableId: 'they-use-too-much-screen-space', label: 'They use too much screen space.', isCorrect: false, explanation: 'Changing an element\'s color does not change the amount of screen space it occupies. The issue is competing emphasis.' },
        { stableId: 'they-can-make-the-intended-priority-unclear', label: 'They can make the intended priority unclear.', isCorrect: true, explanation: 'When several accents have similar visual weight, no single accent identifies the primary element.' },
        { stableId: 'users-cannot-remember-more-than-three-colors', label: 'Users cannot remember more than three colors.', isCorrect: false, explanation: 'There is no three-color memory limit. The problem described is competition among accents with similar visual weight.' },
        { stableId: 'their-hue-differences-reduce-text-contrast', label: 'Their hue differences reduce text contrast.', isCorrect: false, explanation: 'Hue relationship alone does not determine readable contrast. The hierarchy problem comes from giving several accents similar emphasis.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which palette plan gives a beginner the clearest color roles for an interface?',
      choices: [
        { stableId: 'six-hues-with-equal-saturation-and-no-assigned-roles', label: 'Six hues with equal saturation and no assigned roles.', isCorrect: false, explanation: 'This plan gives every hue the same treatment and does not establish a color hierarchy.' },
        { stableId: 'several-muted-hues-used-interchangeably', label: 'Several muted hues used interchangeably.', isCorrect: false, explanation: 'Reducing saturation does not assign the colors different roles.' },
        { stableId: 'one-hue-and-one-lightness-value-for-every-element', label: 'One hue and one lightness value for every element.', isCorrect: false, explanation: 'Using the same hue and lightness for every element removes color differences that could support hierarchy.' },
        { stableId: 'one-dominant-hue-one-supporting-hue-one-accent-and-neutrals', label: 'One dominant hue, one supporting hue, one accent, and neutrals.', isCorrect: true, explanation: 'The named roles limit competition: the dominant hue sets the palette direction, the accent marks priority, and neutrals provide colors for surfaces or text.' },
      ],
    },
  ],
  keyPoints: [
    'Color-wheel positions provide starting points for choosing related hues.',
    'Analogous hues sit next to each other on the color wheel, so the change between their hue angles is gradual.',
    'Complementary hues sit 180 degrees apart. One hue can be dominant while the other appears in smaller areas as an accent.',
    'Triadic palettes use three hues spaced 120 degrees apart, but the hues do not need equal visual weight.',
    'A starter interface palette can combine one dominant hue, supporting hues from a color-wheel relationship, and neutrals for surfaces or text.',
  ],
};
