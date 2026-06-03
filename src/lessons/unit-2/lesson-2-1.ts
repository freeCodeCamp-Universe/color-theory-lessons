import type { LessonConfig } from '../../types/lesson.ts';

export const lesson2_1: LessonConfig = {
  id: 'u2-l1',
  unitId: 'unit-2',
  title: 'Two Ways Color Mixes',
  description: 'Discover the fundamental difference between color made from light and color made from pigment.',
  learningGoal: 'Correctly classify common examples as additive or subtractive and explain the difference in plain language.',
  estimatedMinutes: 11,
  prerequisites: [],
  conceptsIntroduced: ['additive color', 'subtractive color', 'RGB', 'pigment', 'light emission', 'light absorption'],
  interactionType: 'additive-sort',
  glossaryTerms: ['additive color', 'subtractive color', 'pigment', 'RGB'],
  reviewTags: ['foundations', 'additive', 'subtractive', 'color-models'],
  steps: [
    {
      id: 's1',
      text: 'Color is not created the same way everywhere. A glowing screen and a painted wall both show color, but they are doing completely different things to produce it.',
    },
    {
      id: 's2',
      text: 'Additive color starts from darkness and builds up by adding light. Screens, projectors, and LEDs emit red, green, and blue light. Combine more of them and the result gets brighter — add all three at full intensity and you get white.',
      highlights: ['additive color'],
    },
    {
      id: 's3',
      text: 'Subtractive color starts from light hitting a material. Pigments and inks absorb some wavelengths and reflect others back to your eye. Mix more pigments together and more light gets absorbed — results tend to get darker and muddier.',
      highlights: ['subtractive color'],
    },
    {
      id: 's4',
      text: 'This is why paint intuition does not transfer to screen design. On a screen, mixing more color channels adds brightness. With pigment, mixing more colors removes it. The rules run in opposite directions.',
    },
    {
      id: 's5',
      text: 'Look at the two diagrams in the sorting tool. The dark one shows light combining — colors brighten toward white. The light one shows pigment combining — colors darken toward black. Sort the examples shown into the correct model.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Sort each example into the correct color model. Ask yourself: is this object emitting light, or reflecting light that hits it?',
      type: 'sort',
      hints: [
        'If it glows on its own — phone, monitor, projector — it is additive.',
        'If it relies on external light to be seen — paint, ink, printed paper — it is subtractive.',
        'LED signs and projector beams are light sources, even though they project onto surfaces.',
      ],
      successCriteria: 'At least 6 of 8 examples correctly classified.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which color model describes how a laptop display creates color?',
      choices: [
        { id: 'a', label: 'Additive — it emits RGB light', isCorrect: true, explanation: 'A laptop screen controls red, green, and blue light emissions. More light means brighter color.' },
        { id: 'b', label: 'Subtractive — it absorbs wavelengths', isCorrect: false, explanation: 'Absorption describes pigments and inks, not screens. Screens emit light.' },
        { id: 'c', label: 'Both equally', isCorrect: false, explanation: 'A laptop display uses only the additive model. It emits light rather than reflecting it.' },
        { id: 'd', label: 'Neither — screens use a different system', isCorrect: false, explanation: 'Screens are a classic example of the additive model in action.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A painter mixes red, yellow, and blue paint together. What is the most likely result compared to mixing the same colors as light?',
      choices: [
        { id: 'a', label: 'The paint result will be brighter and closer to white', isCorrect: false, explanation: 'Mixing pigments absorbs more light — the result gets darker, not brighter.' },
        { id: 'b', label: 'Both will produce the same color', isCorrect: false, explanation: 'Additive and subtractive mixing follow opposite rules and produce very different results.' },
        { id: 'c', label: 'The paint result will be darker and muddier', isCorrect: true, explanation: 'Each additional pigment absorbs more wavelengths, making the mix darker. Light does the opposite — combining adds brightness.' },
        { id: 'd', label: 'Paint mixing always produces black', isCorrect: false, explanation: 'Mixing many pigments tends toward a dark muddy brown or gray, not necessarily pure black.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which statement correctly describes the difference between additive and subtractive color?',
      choices: [
        { id: 'a', label: 'They are different names for the same visual process', isCorrect: false, explanation: 'They are fundamentally different: one adds light, the other subtracts it through absorption.' },
        { id: 'b', label: 'Additive adds light and gets brighter; subtractive absorbs light and gets darker', isCorrect: true, explanation: 'This is the core distinction. Screens add light channels. Pigments remove light through absorption.' },
        { id: 'c', label: 'Additive is for print; subtractive is for screens', isCorrect: false, explanation: 'It is the other way around. Screens use additive color. Print and paint use subtractive color.' },
        { id: 'd', label: 'Subtractive color is only used by professional printers', isCorrect: false, explanation: 'Subtractive color includes everyday materials like watercolor, markers, and any printed page.' },
      ],
    },
  ],
  keyPoints: [
    'Screens use additive color: red, green, and blue light are combined to make colors.',
    'Adding all three RGB primaries at full intensity produces white — the presence of all light.',
    'Physical materials use subtractive color: pigments absorb (subtract) wavelengths and reflect the rest.',
    'Mixing all subtractive primaries fully produces black — all wavelengths absorbed.',
    'The two models are opposites: more light is added on screens; more wavelengths are removed in pigments.',
  ],
};
