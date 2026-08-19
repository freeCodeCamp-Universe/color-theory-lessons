import type { LessonConfig } from '../../types/lesson.ts';

export const lesson1_4: LessonConfig = {
  id: 'u1-l4',
  unitId: 'unit-1',
  title: 'Warm and Cool Colors in Practice',
  interactionType: 'palette-builder',
  glossaryTerms: ['warm', 'cool', 'neutral', 'palette mood'],
  reviewTags: ['temperature', 'foundations', 'visual-vocabulary'],
  steps: [
    {
      text: 'Colors tend to feel warm (reds, oranges, yellows) or cool (blues, greens, blue-purples). Neutrals like grays and beiges sit in between.',
    },
    {
      text: 'Warm colors often feel active or urgent and can appear closer. Cool colors often feel calmer and can appear farther away. These are tendencies, not universal truths; context and culture affect how people respond.',
    },
    {
      text: 'Neutral colors can make an interface feel calmer and less visually demanding. They also give saturated colors more emphasis when used for actions, alerts, and other focal elements.',
    },
    {
      text: 'A red button in a mostly cool interface can feel energetic or urgent because its temperature differs from the surrounding colors. The same red may draw less attention among other saturated warm colors.',
    },
    {
      text: 'Now apply color temperature first to individual colors, then to the mood of an interface.',
    },
  ],
  challenge: {
      prompt: 'Complete the activity in two stages. First, sort each swatch as warm, cool, or neutral. Then match a palette direction to each interface goal.',
      hints: [
        'Start with the dominant hue. Reds, oranges, and yellows usually read as warm, while blues, blue-greens, and blue-purples usually read as cool.',
        'Compare an uncertain swatch with the warmer and cooler examples. If neither temperature dominates, it may belong in the neutral group.',
        'Use the intended mood as your guide. Consider whether the goal needs more energy, more calm, or less color emphasis.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which palette feels cooler overall?',
      choices: [
        { id: 'a', label: 'Navy, slate, dusty teal, off-white', isCorrect: true, explanation: 'Navy and teal are cool hues. Slate and off-white are neutral. The overall tendency is cool.' },
        { id: 'b', label: 'Terracotta, peach, sand, warm brown', isCorrect: false, explanation: 'Terracotta, peach, and warm brown are all in the warm range.' },
        { id: 'c', label: 'Forest green, gold, cream, tan', isCorrect: false, explanation: 'Gold, cream, and tan are warm. Forest green is cool but it is outnumbered by warm tones here.' },
        { id: 'd', label: 'Coral, rust, ivory, stone', isCorrect: false, explanation: 'Coral and rust push the palette toward warm.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A fintech dashboard uses mostly cool grays and blues. Which accent would create warm-cool contrast around an expiring offer?',
      choices: [
        { id: 'a', label: 'A slightly warmer blue', isCorrect: false, explanation: 'A warmer blue remains close to the existing cool palette, so the temperature contrast would be weaker.' },
        { id: 'b', label: 'A brighter, lighter gray', isCorrect: false, explanation: 'This changes lightness rather than creating warm-cool contrast.' },
        { id: 'c', label: 'A warm orange or amber accent', isCorrect: true, explanation: 'Orange and amber are warm, so they contrast with the cool grays and blues.' },
        { id: 'd', label: 'A softer teal', isCorrect: false, explanation: 'Teal is cool, so it would not create warm-cool contrast.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which statement is most accurate about warm and cool colors in UI design?',
      choices: [
        { id: 'a', label: 'Warm colors are the strongest choice for any warning or error.', isCorrect: false, explanation: 'Warm colors can support warnings and errors, but their meaning depends on conventions and context.' },
        { id: 'b', label: 'Cool palettes are generally more professional than warm palettes.', isCorrect: false, explanation: 'Some industries favor cool palettes, but professional interfaces can also use warm colors.' },
        { id: 'c', label: 'Warm and cool tendencies are useful starting points that depend on context.', isCorrect: true, explanation: 'Temperature is a starting point. Surrounding colors and product goals shape its effect.' },
        { id: 'd', label: 'A color\'s temperature determines how much attention it receives.', isCorrect: false, explanation: 'Temperature can affect attention, but surrounding colors, saturation, and contrast also matter.' },
      ],
    },
  ],
  keyPoints: [
    'Reds, oranges, and yellows tend to feel warm, active, or urgent.',
    'Blues, greens, and blue-purples tend to feel cool or calm and can appear farther away.',
    'Neutral colors such as grays and beiges can sit between warm and cool or lean toward either temperature.',
    'Neutral colors can reduce visual demand and give saturated actions or alerts more emphasis.',
    'Warm and cool associations are tendencies. Context, culture, and surrounding colors affect how people respond.',
  ],
};
