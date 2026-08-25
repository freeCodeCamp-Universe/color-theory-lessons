import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson4_1: LessonConfig = {
  id: 'u4-l1',
  unitId: 'unit-4',
  title: LESSON_TITLES['u4-l1'],
  interactionType: 'eye-diagram',
  reviewTags: ['perception', 'vision', 'biology-basics'],
  steps: [
    {
      text: 'You have learned to describe color, mix it on screen, and express it in code. Every color decision also involves the person looking at the screen. A display emits light, and your visual system turns that light into the color you perceive. Perceived color depends on the display, the viewing conditions, and processing by the eyes and brain.',
    },
    {
      text: 'Light entering the eye is focused onto the retina at the back of the eye. The retina contains two types of photoreceptor cells: rods and cones. Rods support vision in dim light and contribute little to color vision under typical daylight conditions. Cones support color vision.',
    },
    {
      text: 'Most people have three types of cones, named S, M, and L for the ranges of wavelengths to which they are most sensitive. These ranges overlap, and each cone signals how much light it absorbs. The visual system compares the activity of the three cone types as part of color perception.',
    },
    {
      text: 'Photoreceptors convert light into electrical signals. Other retinal cells process those signals, which then travel through the optic nerve to areas of the brain involved in vision. The brain also uses surrounding colors and other visual context when producing color appearance. In simultaneous contrast, the same color can look different against different surrounding colors.',
    },
    {
      text: 'People can differ in cone sensitivity, lens transmission, and neural processing. As a result, two people viewing the same interface under the same conditions may perceive its colors differently. Designers should not assume that a color will appear identical to every viewer.',
    },
  ],
  challenge: {
      prompt:
        'Click through each part of the visual pathway to reveal how it contributes to color perception.',
      hints: [
        'Start with the light source and follow the path into the eye.',
        'Read the design implication for each step before moving on.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which cells in the retina are most relevant to color perception?',
      choices: [
        {
          stableId: 'rods',
          label: 'Rods',
          isCorrect: false,
          explanation:
            'Rods are sensitive to low-light conditions but are not primarily responsible for color vision.',
        },
        {
          stableId: 'cones',
          label: 'Cones',
          isCorrect: true,
          explanation:
            'Cones are the photoreceptor cells that support color vision. Most people have three types, named S, M, and L for their wavelength sensitivity ranges.',
        },
        {
          stableId: 'the-optic-nerve',
          label: 'The optic nerve',
          isCorrect: false,
          explanation:
            'The optic nerve carries signals from the retina toward the brain. It is not a photoreceptor cell.',
        },
        {
          stableId: 'the-cornea',
          label: 'The cornea',
          isCorrect: false,
          explanation:
            'The cornea helps focus incoming light. It is not one of the retina\'s photoreceptor cells.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What does the optic nerve do?',
      choices: [
        {
          stableId: 'it-converts-light-into-electrical-signals',
          label: 'It converts light into electrical signals',
          isCorrect: false,
          explanation:
            'Photoreceptor cells called rods and cones convert light into electrical signals in the retina.',
        },
        {
          stableId: 'it-carries-visual-signals-from-the-retina-to-the-brain',
          label: 'It carries visual signals from the retina to the brain',
          isCorrect: true,
          explanation:
            'The optic nerve carries electrical signals from the retina toward the brain. Other parts of the visual pathway relay those signals to brain areas involved in vision.',
        },
        {
          stableId: 'it-adjusts-the-amount-of-light-entering-the-eye',
          label: 'It adjusts the amount of light entering the eye',
          isCorrect: false,
          explanation:
            'The iris changes the size of the pupil to control how much light enters the eye. The optic nerve carries signals from the retina toward the brain.',
        },
        {
          stableId: 'it-filters-out-ultraviolet-light',
          label: 'It filters out ultraviolet light',
          isCorrect: false,
          explanation:
            'The cornea and lens absorb most ultraviolet light. The optic nerve carries signals from the retina toward the brain.',
        },
      ],
    },
    {
      id: 'q3',
      prompt:
        'Why might the same interface color appear different to different viewers?',
      choices: [
        {
          stableId: 'because-screen-calibration-always-differs-between-devices',
          label: 'Only because display calibration can differ between devices',
          isCorrect: false,
          explanation:
            'Display calibration can affect the light a screen emits, but people can perceive the same light differently because their visual systems vary.',
        },
        {
          stableId: 'because-color-perception-is-constructed-by-each-person-s-visual-',
          label:
            'Because color perception is constructed by each person\'s visual system, which varies',
          isCorrect: true,
          explanation:
            'Cone sensitivity, light transmission through the eye, and neural processing can vary between viewers. These differences can change how each person perceives the same light from a display.',
        },
        {
          stableId: 'because-css-renders-colors-differently-in-each-browser',
          label: 'Because CSS renders colors differently in each browser',
          isCorrect: false,
          explanation:
            'Browser rendering does not explain why two people can perceive the same displayed color differently. Variation in their visual systems can change the color they perceive.',
        },
        {
          stableId: 'because-colors-change-over-time-due-to-phosphor-decay',
          label: 'Because colors change over time due to phosphor decay',
          isCorrect: false,
          explanation:
            'Phosphor aging can alter the output of an older phosphor-based display, but it does not explain why two viewers can perceive the same displayed color differently.',
        },
      ],
    },
  ],
  keyPoints: [
    'A display emits light, and the visual system turns that light into perceived color. The display, viewing conditions, eyes, and brain all contribute to color perception.',
    'Cones support color vision. Rods support vision in dim light and contribute little to color vision under typical daylight conditions.',
    'Most people have S, M, and L cone types with overlapping wavelength sensitivity ranges. The visual system compares their activity as part of color perception.',
    'Photoreceptors convert light into electrical signals. The optic nerve carries processed retinal signals toward brain areas involved in vision.',
    'Cone sensitivity, lens transmission, and neural processing can vary between people, so two viewers may perceive the same interface colors differently.',
  ],
};
