import type { LessonConfig } from '../../types/lesson.ts';

export const lesson2_5: LessonConfig = {
  id: 'u2-l5',
  unitId: 'unit-2',
  title: 'Seeing Pixels as Light, Not Paint',
  description: 'Connect additive color to how displays actually work — and how that changes the way interface colors are perceived.',
  learningGoal: 'Explain why screen colors can appear luminous and why background context changes how an accent color reads.',
  estimatedMinutes: 13,
  prerequisites: ['u2-l4'],
  conceptsIntroduced: ['pixel', 'subpixel', 'display', 'emitted light', 'luminous color', 'dark interface', 'accent color'],
  interactionType: 'background-shift',
  glossaryTerms: ['pixel', 'luminous color', 'accent color', 'dark interface'],
  reviewTags: ['additive', 'display', 'perception', 'interface'],
  steps: [
    {
      id: 's1',
      text: 'A display does not paint a flat surface. It controls many tiny light-producing elements arranged in a grid. Each element can emit red, green, or blue light at a specific intensity.',
      highlights: ['light-producing elements'],
    },
    {
      id: 's2',
      text: 'From a normal viewing distance your eye blends all those tiny elements into a single unified color. You do not see the individual parts — only the combined result. Zoom into a screen photo and the subpixels become visible; step back and they vanish into a smooth swatch.',
    },
    {
      id: 's3',
      text: 'Because screen color is made from emitted light rather than reflected pigment, it can appear luminous in a way paint cannot match. The display is literally sending light straight to your eyes — not bouncing ambient light off an inert surface.',
      highlights: ['luminous', 'emitted light'],
    },
    {
      id: 's4',
      text: 'This luminous quality changes depending on surrounding color. On a dark background, a vivid accent has high contrast with its surroundings and appears to stand out — almost to glow. On a light background, the same accent competes with brightness already present and reads as less intense.',
      highlights: ['dark background', 'contrast'],
    },
    {
      id: 's5',
      text: 'Use the pixel explorer to see how subpixels combine into a perceived color. Then in the challenge, compare the same accent on a dark and light background and pick the explanation that best describes what you see.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'The same accent color is shown on a dark background and a light background. Pick the answer that best explains why one context makes it appear more vivid.',
      type: 'identify-problem',
      hints: [
        'Ask: is the display adding brightness here, or is something reducing it?',
        'Think about what "contrast" means when the surrounding area is near-black versus near-white.',
        'The accent\'s RGB values do not change — only the context does.',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the practical reason a screen color can appear to glow?',
      choices: [
        { id: 'a', label: 'It is printed with luminescent ink.', isCorrect: false, explanation: 'Screens do not use ink. They emit light directly.' },
        { id: 'b', label: 'The display emits light directly to the viewer\'s eyes — something paint and ink cannot do.', isCorrect: true, explanation: 'Emitted light reaches the eye directly. Paint only reflects ambient light — an indirect, weaker signal.' },
        { id: 'c', label: 'Screens use special high-brightness pigments inside the glass.', isCorrect: false, explanation: 'Screens do not use pigments. They use light-emitting or light-controlling elements.' },
        { id: 'd', label: 'Screens always display brighter colors than any physical material.', isCorrect: false, explanation: 'Not always — a printed color in direct sunlight can rival screen brightness. The difference is the mechanism: emission vs reflection.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why can the same accent color feel stronger on a dark background than on a light one?',
      choices: [
        { id: 'a', label: 'Dark backgrounds make all colors appear warmer.', isCorrect: false, explanation: 'Background darkness affects perceived contrast and vividness, not warmth specifically.' },
        { id: 'b', label: 'The contrast between the bright accent and the dark surroundings increases perceived vividness.', isCorrect: true, explanation: 'The accent\'s actual values do not change. The dark surround raises relative contrast, making the emitted color stand out more sharply.' },
        { id: 'c', label: 'A dark background reduces the saturation of neighboring colors and leaves only the accent.', isCorrect: false, explanation: 'Saturation values are not altered by the surrounding color. The effect is one of perceived contrast, not actual value change.' },
        { id: 'd', label: 'The accent\'s RGB values increase automatically when placed on a dark background.', isCorrect: false, explanation: 'RGB values are fixed. The perception changes because of contrast with surroundings, not because the values change.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A screen creates color by behaving like a painted surface. True or false?',
      choices: [
        { id: 'a', label: 'True — screens layer digital paint in the RGB color space.', isCorrect: false, explanation: 'Screens emit light. "Layering paint" is a metaphor borrowed from pigment, not how displays physically work.' },
        { id: 'b', label: 'False — screens emit light. A painted surface reflects ambient light. They produce color through different physical mechanisms.', isCorrect: true, explanation: 'This is the key distinction of the unit. Understanding it helps avoid paint-logic errors in screen design.' },
        { id: 'c', label: 'True — both screens and paint are creating color for the viewer\'s eye in the same way.', isCorrect: false, explanation: 'The end result is perceived color in both cases, but the underlying mechanism is completely different.' },
        { id: 'd', label: 'It depends on the type of screen technology used.', isCorrect: false, explanation: 'Whether LCD, OLED, or LED, all modern display technologies emit controlled light rather than reflecting pigment.' },
      ],
    },
  ],
  keyPoints: [
    'Dark interfaces use near-black or very dark surfaces as primary backgrounds.',
    'A dark background amplifies perceived saturation — colors that look moderate on white can appear intense on dark.',
    'Luminous colors (light, warm, or vivid values on very dark surfaces) can cause eye strain and feel harsh.',
    'Color choices made on a light canvas may need significant adjustment before they work on a dark interface.',
    'Testing on the actual dark background is the only reliable way to evaluate colors for dark mode.',
  ],
};
