import type { LessonConfig } from '../../types/lesson.ts';

export const lesson2_2: LessonConfig = {
  id: 'u2-l2',
  unitId: 'unit-2',
  title: 'How RGB Light Works',
  description: 'Learn how screens build every color from red, green, and blue light channels — and predict what common combinations produce.',
  learningGoal: 'Use RGB sliders intentionally to recreate target interface colors by reasoning about channels, not guessing.',
  estimatedMinutes: 13,
  prerequisites: ['u2-l1'],
  conceptsIntroduced: ['red channel', 'green channel', 'blue channel', 'channel intensity', 'additive primary', 'white light', 'black background'],
  interactionType: 'rgb-mixer',
  glossaryTerms: ['red channel', 'green channel', 'blue channel', 'channel intensity', 'additive primary'],
  reviewTags: ['additive', 'RGB', 'color-models', 'screens'],
  steps: [
    {
      id: 's1',
      text: 'Every color on a screen is built from three light sources: red, green, and blue. Each is a channel, and you control its intensity from 0 (off) to 255 (full brightness). The color you see is the result of how those three channels combine.',
      highlights: ['red', 'green', 'blue'],
    },
    {
      id: 's2',
      text: 'With all channels at zero, you get black — no light at all. With all three at full intensity, you get white. This is additive color: more light means brighter, and combining all three at maximum is the brightest possible result.',
      panel: { type: 'rgb-mixer-preview', mode: 'extremes' },
    },
    {
      id: 's3',
      text: 'Channel pairs create predictable results. Red and green together produce yellow. Green and blue together produce cyan. Red and blue together produce magenta. These are the additive secondaries — worth knowing by feel, not just memorization.',
      highlights: ['yellow', 'cyan', 'magenta'],
      panel: { type: 'rgb-mixer-preview', mode: 'channel-pairs' },
    },
    {
      id: 's4',
      text: 'Equal values across all three channels produce neutral grays. Low equal values make dark gray. High equal values make light gray. Even a small difference between channels gives the neutral a color cast — useful for warm or cool surfaces.',
      panel: { type: 'rgb-mixer-preview', mode: 'neutral-grays' },
    },
    {
      id: 's5',
      text: 'Use the RGB mixer to explore how channels combine. The challenge asks you to recreate five interface colors — think through which channels should be high, low, or equal before reaching for the slider.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Recreate each target color using the R, G, and B sliders. Think about which channels should be high, low, or equal before reaching for the slider.',
      type: 'match-target',
      hints: [
        'For warm colors (reds, oranges, yellows), the red channel dominates. Yellow also needs high green.',
        'For cool colors (blues, cyans), the blue channel leads. Cyan also needs high green.',
        'Grays and neutrals come from roughly equal channels. Tilt one slightly to add warmth or coolness.',
      ],
      successCriteria: 'All five target colors matched within the allowed tolerance.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which RGB combination is most likely to produce cyan?',
      choices: [
        { id: 'a', label: 'High red, low green, high blue', isCorrect: false, explanation: 'High red and blue with low green produces magenta, not cyan.' },
        { id: 'b', label: 'Low red, high green, high blue', isCorrect: true, explanation: 'Cyan is green and blue light combined. Keeping red low prevents the mix from shifting toward white.' },
        { id: 'c', label: 'High red, high green, low blue', isCorrect: false, explanation: 'High red and green with low blue produces yellow.' },
        { id: 'd', label: 'Equal amounts of all three', isCorrect: false, explanation: 'Equal channels produce a neutral gray or white, depending on the intensity level.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'What does it mean on a screen when all three RGB channels are set to the same value — say, R:100 G:100 B:100?',
      choices: [
        { id: 'a', label: 'The color will be a warm neutral', isCorrect: false, explanation: 'A warm neutral would require slightly more red than blue. Equal channels produce a pure neutral.' },
        { id: 'b', label: 'The result is always white', isCorrect: false, explanation: 'White requires all three channels at full intensity (255). Equal values at lower levels produce grays.' },
        { id: 'c', label: 'The result is a neutral gray', isCorrect: true, explanation: 'Equal RGB channels always produce a neutral — no channel dominates, so no color cast appears. The lightness depends on how high the values are.' },
        { id: 'd', label: 'The result is black', isCorrect: false, explanation: 'Black requires all channels at 0. Equal channels at 100 produce a mid-range gray.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A designer wants a vivid purple accent. Which channels should be elevated?',
      choices: [
        { id: 'a', label: 'Red and green', isCorrect: false, explanation: 'Red and green together produce yellow, not purple.' },
        { id: 'b', label: 'Green and blue', isCorrect: false, explanation: 'Green and blue produce cyan. Purple requires red and blue.' },
        { id: 'c', label: 'Red and blue', isCorrect: true, explanation: 'Purple and magenta come from combining red and blue light. Keeping green low keeps the hue away from white or gray.' },
        { id: 'd', label: 'All three equally', isCorrect: false, explanation: 'Equal channels neutralize each other into gray or white. A vivid hue requires imbalance between channels.' },
      ],
    },
  ],
  keyPoints: [
    'RGB has three channels — red, green, and blue — each ranging from 0 (off) to 255 (full).',
    'A channel value of 0 contributes none of that primary; 255 contributes the maximum.',
    'Unequal channel values produce a hue; the dominant channel determines which direction the color leans.',
    'Channel intensity is independent — changing one channel changes the color without forcing changes to the others.',
    'High values in all three channels approach white; low values in all three approach black.',
  ],
};
