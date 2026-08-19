import type { LessonConfig } from '../../types/lesson.ts';

export const lesson1_6: LessonConfig = {
  id: 'u1-l6',
  unitId: 'unit-1',
  title: 'Basic Color Relationships and Harmony',
  description: 'Learn a few simple palette relationship patterns and understand why a controlled palette usually works better than an unrestricted one.',
  learningGoal: 'Create a small controlled palette and explain its basic relationship structure.',
  estimatedMinutes: 14,
  prerequisites: ['u1-l4', 'u1-l5'],
  conceptsIntroduced: ['analogous', 'complementary', 'triadic', 'palette', 'harmony', 'balance'],
  interactionType: 'color-wheel',
  glossaryTerms: ['analogous', 'complementary', 'triadic', 'palette', 'harmony', 'balance'],
  reviewTags: ['harmony', 'foundations', 'palette'],
  steps: [
    {
      id: 's1',
      text: 'A color wheel shows relationships between hues based on their positions. Hues can sit next to each other, opposite each other, or at equal intervals around the wheel. Designers use these positions as starting points for building palettes.',
    },
    {
      id: 's2',
      text: 'Analogous colors sit next to each other on the color wheel. Their hue angles are close together, so the changes from one color to the next are gradual. An analogous palette can use one hue as the dominant color and nearby hues as supporting colors.',
      highlights: ['analogous'],
      panel: { type: 'color-wheel-preview', relationship: 'analogous' },
    },
    {
      id: 's3',
      text: 'Complementary colors sit opposite each other on the color wheel, 180 degrees apart. This pairing creates a large hue difference. In an interface, one hue can be dominant while the other appears in smaller areas as an accent.',
      highlights: ['complementary'],
      panel: { type: 'color-wheel-preview', relationship: 'complementary' },
    },
    {
      id: 's4',
      text: 'Triadic palettes use three hues spaced 120 degrees apart around the color wheel. The hues have equal angular separation, but they do not need equal visual weight. One hue can be dominant while the other two support it.',
      highlights: ['triadic'],
      panel: { type: 'color-wheel-preview', relationship: 'triadic' },
    },
    {
      id: 's5',
      text: 'Color harmony describes how the colors in a palette relate to one another. A simple interface palette can start with one dominant hue, supporting hues chosen from a color-wheel relationship, and neutral colors for surfaces or text. Use the tool to choose a relationship and base hue.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Build a starter palette by choosing an analogous, complementary, or triadic relationship and adjusting the base hue. After you lock it in, identify how the selected relationship positions its hues on the color wheel.',
      type: 'build-palette',
      hints: [
        'The base hue is the starting point. The wheel marks the other hues in the selected relationship.',
        'In this tool, analogous hues are 30 degrees from the base, a complementary hue is 180 degrees from the base, and triadic hues are 120 degrees apart.',
        'Look at the positions of the marked hues before answering the reflection question.',
      ],
      successCriteria: 'Palette has a clear relationship type and the accent creates visible contrast against the dominant hue.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'On the color wheel used in this lesson, a designer pairs a blue at 210 degrees with an orange at 30 degrees. What relationship is this?',
      choices: [
        { id: 'a', label: 'Analogous', isCorrect: false, explanation: 'Analogous hues sit next to each other. These two hue angles are 180 degrees apart.' },
        { id: 'b', label: 'Triadic', isCorrect: false, explanation: 'A triadic relationship contains three hues spaced 120 degrees apart. This pair is 180 degrees apart.' },
        { id: 'c', label: 'Complementary', isCorrect: true, explanation: 'The hue angles are 180 degrees apart, so they form a complementary pair.' },
        { id: 'd', label: 'Monochromatic', isCorrect: false, explanation: 'A monochromatic palette changes the saturation or lightness of one hue. This palette uses two different hues.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why might too many unrelated accent colors weaken a design?',
      choices: [
        { id: 'a', label: 'They use too much screen space.', isCorrect: false, explanation: 'Changing an element\'s color does not change the amount of screen space it occupies. The issue is competing emphasis.' },
        { id: 'b', label: 'They can make the intended priority unclear.', isCorrect: true, explanation: 'When several accents have similar visual weight, no single accent identifies the primary element.' },
        { id: 'c', label: 'Users cannot remember more than three colors.', isCorrect: false, explanation: 'There is no three-color memory limit. The problem described is competition among accents with similar visual weight.' },
        { id: 'd', label: 'Their hue differences reduce text contrast.', isCorrect: false, explanation: 'Hue relationship alone does not determine readable contrast. The hierarchy problem comes from giving several accents similar emphasis.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which palette plan gives a beginner the clearest color roles for an interface?',
      choices: [
        { id: 'a', label: 'Six hues with equal saturation and no assigned roles.', isCorrect: false, explanation: 'This plan gives every hue the same treatment and does not establish a color hierarchy.' },
        { id: 'b', label: 'Several muted hues used interchangeably.', isCorrect: false, explanation: 'Reducing saturation does not assign the colors different roles.' },
        { id: 'c', label: 'One hue and one lightness value for every element.', isCorrect: false, explanation: 'Using the same hue and lightness for every element removes color differences that could support hierarchy.' },
        { id: 'd', label: 'One dominant hue, one supporting hue, one accent, and neutrals.', isCorrect: true, explanation: 'The named roles limit competition: the dominant hue sets the palette direction, the accent marks priority, and neutrals provide colors for surfaces or text.' },
      ],
    },
  ],
  keyPoints: [
    'Analogous colors sit adjacent on the color wheel and feel naturally harmonious.',
    'Complementary colors are opposite on the wheel and create strong contrast when paired.',
    'Triadic colors are three hues evenly spaced at 120° intervals, producing vibrant and balanced palettes.',
    'Harmony comes from intentional relationships between colors — not from luck or random selection.',
    'Palette balance means no single color dominates unintentionally; variety and repetition are both tools for balance.',
  ],
};
