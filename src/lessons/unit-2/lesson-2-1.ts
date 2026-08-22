import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson2_1: LessonConfig = {
  id: 'u2-l1',
  unitId: 'unit-2',
  title: LESSON_TITLES['u2-l1'],
  interactionType: 'additive-sort',
  reviewTags: ['foundations', 'additive', 'subtractive', 'color-models'],
  steps: [
    {
      text: 'A screen and a painted wall can both show color, but they interact with light in different ways. A screen emits light, while paint changes which wavelengths of incoming light are reflected to your eyes.',
    },
    {
      text: 'Additive mixing combines emitted light. Screens, projectors, and LED signs use red, green, and blue light. Increasing a channel adds light. Combining all three channels at full intensity produces white.',
    },
    {
      text: 'Subtractive mixing begins with light striking a material. Pigments and inks absorb some wavelengths and reflect others. Mixing pigments often increases absorption, so the result tends to look darker and less saturated.',
    },
    {
      text: 'Paint-mixing intuition does not transfer directly to screen design. Increasing RGB channels adds emitted light. Mixing pigments changes which wavelengths are absorbed and reflected.',
    },
    {
      text: 'Compare the two diagrams in the sorting tool. The dark diagram shows additive mixing: overlapping light moves toward white. The light diagram shows an ideal subtractive model: overlapping pigments move toward black. Then sort each example into the correct model.',
    },
  ],
  challenge: {
      prompt: 'Sort each example into the correct color model. Decide whether it produces color with emitted light or with materials that absorb and reflect incoming light.',
      hints: [
        'Phones, monitors, projectors, and LED signs are additive because they emit light.',
        'Paint, ink, and printed paper use subtractive mixing because they absorb some wavelengths and reflect others.',
        'Classify a projector beam by its light source, not by the surface it hits.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which color model describes how a laptop display creates color?',
      choices: [
        { stableId: 'additive-it-emits-rgb-light', label: 'Additive: it emits RGB light', isCorrect: true, explanation: 'A laptop display controls the intensity of red, green, and blue subpixels. Increasing a channel adds emitted light.' },
        { stableId: 'subtractive-it-absorbs-wavelengths', label: 'Subtractive: it absorbs wavelengths', isCorrect: false, explanation: 'Subtractive mixing describes materials such as pigments and inks that absorb parts of incoming light.' },
        { stableId: 'both-equally', label: 'Both equally', isCorrect: false, explanation: 'A laptop display forms pixel colors by adding emitted RGB light. Ambient light can reflect from its surface, but that reflection does not form the pixel colors.' },
        { stableId: 'neither-screens-use-a-different-system', label: 'Neither: screens use a different system', isCorrect: false, explanation: 'The RGB light emitted by a screen uses additive mixing.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A painter mixes red, yellow, and blue paint together. What is the most likely result compared to mixing the same colors as light?',
      choices: [
        { stableId: 'the-paint-result-will-be-brighter-and-closer-to-white', label: 'The paint result will be brighter and closer to white', isCorrect: false, explanation: 'Pigment mixtures usually absorb more wavelengths and become darker, not brighter.' },
        { stableId: 'both-will-produce-the-same-color', label: 'Both will produce the same color', isCorrect: false, explanation: 'Colored light adds to the light reaching your eyes. Pigments absorb some incoming wavelengths and reflect others, so the mixtures do not produce the same result.' },
        { stableId: 'the-paint-result-will-be-darker-and-muddier', label: 'The paint result will be darker and muddier', isCorrect: true, explanation: 'Mixed pigments usually absorb a wider range of wavelengths, so the result tends to be darker and less saturated. Combining colored light adds to the light reaching your eyes.' },
        { stableId: 'paint-mixing-always-produces-black', label: 'Paint mixing always produces black', isCorrect: false, explanation: 'Mixing many pigments tends toward a dark muddy brown or gray, not necessarily pure black.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which statement correctly describes the difference between additive and subtractive color?',
      choices: [
        { stableId: 'they-are-different-names-for-the-same-visual-process', label: 'They are different names for the same visual process', isCorrect: false, explanation: 'They describe two processes. Additive mixing combines light, while subtractive mixing removes wavelengths through absorption.' },
        { stableId: 'additive-adds-light-and-gets-brighter-subtractive-absorbs-light-', label: 'Additive combines emitted light; subtractive materials absorb parts of incoming light', isCorrect: true, explanation: 'Screens control emitted RGB light. Pigments and inks absorb parts of incoming light and reflect the rest.' },
        { stableId: 'additive-is-for-print-subtractive-is-for-screens', label: 'Additive is for print; subtractive is for screens', isCorrect: false, explanation: 'It is the other way around. Screens use additive color. Print and paint use subtractive color.' },
        { stableId: 'subtractive-color-is-only-used-by-professional-printers', label: 'Subtractive color is only used by professional printers', isCorrect: false, explanation: 'Paint, markers, and printed inks all use subtractive mixing.' },
      ],
    },
  ],
  keyPoints: [
    'Screens use additive color: red, green, and blue light are combined to make colors.',
    'Combining all three RGB primaries at full intensity produces white.',
    'Pigments and inks use subtractive color: they absorb some wavelengths of incoming light and reflect others.',
    'Mixing pigments often increases absorption, so the result tends to become darker and less saturated.',
    'Increasing RGB channel values adds emitted light, while mixing pigments changes which wavelengths are absorbed and reflected.',
  ],
};
