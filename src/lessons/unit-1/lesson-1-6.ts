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
      text: 'Analogous colors sit next to each other on the color wheel. They share a hue family and feel cohesive and calm. Most monochromatic-feeling interfaces use analogous relationships.',
      highlights: ['analogous'],
      panel: { type: 'color-wheel-preview', relationship: 'analogous' },
    },
    {
      id: 's3',
      text: 'Complementary colors sit opposite each other. They create strong contrast and energy. In UI design, a small complementary accent on a base hue creates immediate visual pop.',
      highlights: ['complementary'],
      panel: { type: 'color-wheel-preview', relationship: 'complementary' },
    },
    {
      id: 's4',
      text: 'Triadic palettes use three hues equally spaced around the wheel. They can feel dynamic, but in interfaces they require careful restraint — only one hue should dominate.',
      highlights: ['triadic'],
      panel: { type: 'color-wheel-preview', relationship: 'triadic' },
    },
    {
      id: 's5',
      text: 'Harmony in UI design is about coordination, not maximum variety. A good digital palette usually has one dominant direction, one or two supporting colors, and a small accent. Explore the wheel and build yours.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'A wellness startup wants a calm, trust-building UI palette — think healthcare, finance, or mindfulness. Build a 3-color starter palette using a relationship that supports that mood. When your palette is locked, you will be asked to explain your choice.',
      type: 'build-palette',
      hints: [
        'Start with a dominant hue you like, then let the relationship type guide your other choices.',
        'Analogous palettes feel safe and cohesive. Complementary palettes feel more energetic.',
        'Your accent should be the color you\'d use least, but it should stand out the most.',
      ],
      successCriteria: 'Palette has a clear relationship type and the accent creates visible contrast against the dominant hue.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'A designer uses blue as the dominant hue and adds a small amount of orange for buttons. What relationship is this?',
      choices: [
        { id: 'a', label: 'Analogous', isCorrect: false, explanation: 'Analogous colors are adjacent on the wheel. Blue and orange are opposite each other.' },
        { id: 'b', label: 'Triadic', isCorrect: false, explanation: 'A triadic relationship uses three hues equally spaced — not just a pair.' },
        { id: 'c', label: 'Complementary', isCorrect: true, explanation: 'Blue and orange sit opposite each other on the color wheel. That is the complementary relationship, and it creates strong accent contrast.' },
        { id: 'd', label: 'Monochromatic', isCorrect: false, explanation: 'A monochromatic palette uses only one hue at different lightness and saturation levels.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why might too many unrelated accent colors weaken a design?',
      choices: [
        { id: 'a', label: 'They use too much screen space.', isCorrect: false, explanation: 'Color itself does not take up space — its visual weight is what matters.' },
        { id: 'b', label: 'The eye cannot find a clear priority when everything is equally colorful.', isCorrect: true, explanation: 'Too many competing accents remove hierarchy. The user does not know which color signal to follow.' },
        { id: 'c', label: 'Users cannot remember more than three colors.', isCorrect: false, explanation: 'Memory is not the issue. Hierarchy and coherence are.' },
        { id: 'd', label: 'Unrelated colors always clash visually.', isCorrect: false, explanation: 'They may or may not clash visually, but even when they coexist without friction, they can still undermine hierarchy.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which palette description fits a beginner UI most reliably?',
      choices: [
        { id: 'a', label: 'Six hues, all equally saturated, used freely throughout.', isCorrect: false, explanation: 'Equal saturation everywhere and no dominant direction produces a noisy, hierarchy-free design.' },
        { id: 'b', label: 'A rainbow of tints so nothing feels too strong.', isCorrect: false, explanation: 'Softening everything does not solve the problem — it just removes all hierarchy.' },
        { id: 'c', label: 'Fully monochromatic with no accent at all.', isCorrect: false, explanation: 'Monochromatic palettes are valid but they make it harder to create clear emphasis without an accent.' },
        { id: 'd', label: 'One dominant hue, one complementary accent, one or two neutrals.', isCorrect: true, explanation: 'A controlled palette with a clear dominant direction and a single intentional accent is easier to keep coherent, especially for beginners.' },
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
