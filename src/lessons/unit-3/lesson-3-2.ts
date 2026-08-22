import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_2: LessonConfig = {
  id: 'u3-l2',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l2'],
  interactionType: 'hex-rgb-editor',
  reviewTags: ['formats', 'HEX', 'RGB'],
  steps: [
    {
      text: 'RGB describes a color by stating how much red, green, and blue light to mix. Each channel runs from 0 (none) to 255 (full). rgb(0 0 0) represents black, with all three channels at 0. rgb(255 255 255) represents white, with all three channels at 255.',
    },
    {
      text: 'HEX is a compact way to encode the same three channels. A six-digit CSS HEX value like #1E40AF splits into three pairs. The pairs represent red, green, and blue, in that order. Each pair uses base-16 notation.',
    },
    {
      text: 'In sRGB, equal red, green, and blue channel values produce a neutral color. For example, rgb(120 120 120) is gray. With no channel higher than the others, the color has no hue. #808080 follows the same pattern because each channel uses the value 80.',
    },
    {
      text: 'Shorthand HEX compresses a value where each pair repeats: #AABBCC can be written as #ABC. This only works when each pair has two identical digits. #1E40AF cannot be shortened because none of its pairs repeat.',
    },
    {
      text: 'An rgb() value can include alpha after a slash. Alpha controls opacity from 0 (fully transparent) to 1 (fully opaque). rgb(30 64 175 / 0.5) uses the same red, green, and blue values as rgb(30 64 175), with 50% opacity.',
    },
  ],
  challenge: {
    prompt:
      'Use the HEX input to match three target UI colors. Enter a three-digit or six-digit value and compare the current color with each target.',
    hints: [
      'In a six-digit value, the first pair controls red, the second controls green, and the third controls blue.',
      'HEX channel values run from 00 to FF. Raise a pair to add more of that channel.',
      'In a six-digit value, repeat the same pair three times for a neutral color.',
    ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'In sRGB, what does a color with equal red, green, and blue channel values produce?',
      choices: [
        {
          stableId: 'a-neutral-gray-or-white-or-black',
          label: 'A neutral gray (or white or black)',
          isCorrect: true,
          explanation:
            'Equal red, green, and blue values produce a neutral color. The range runs from black at rgb(0 0 0) through grays to white at rgb(255 255 255).',
        },
        {
          stableId: 'a-saturated-color-with-medium-brightness',
          label: 'A saturated color with medium brightness',
          isCorrect: false,
          explanation:
            'Equal channel values produce a neutral color, not a saturated hue.',
        },
        {
          stableId: 'a-very-dark-color',
          label: 'A dark color',
          isCorrect: false,
          explanation:
            'Low equal values produce a dark neutral, while higher equal values produce lighter neutrals. Equal values make the color neutral; the shared value determines its lightness.',
        },
        {
          stableId: 'an-error-rgb-must-have-at-least-one-dominant-channel',
          label: 'An error because RGB needs one dominant channel',
          isCorrect: false,
          explanation:
            'CSS accepts equal RGB channel values. They represent neutral colors such as black, gray, and white.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which value is likely closer to white: #F4F4F4 or #1A1A1A?',
      choices: [
        {
          stableId: 'f4f4f4',
          label: '#F4F4F4',
          isCorrect: true,
          explanation:
            'F4 in hex is 244 in decimal, 11 below the maximum of 255. #F4F4F4 is therefore a light neutral. #1A1A1A uses 26 for each channel and is a dark neutral.',
        },
        {
          stableId: '1a1a1a',
          label: '#1A1A1A',
          isCorrect: false,
          explanation:
            '1A in hex is only 26 in decimal. All three channels near zero produce dark neutrals, not light ones.',
        },
        {
          stableId: 'they-would-appear-identical',
          label: 'They would appear identical',
          isCorrect: false,
          explanation:
            'F4 is 244 and 1A is 26. The higher equal channel values make #F4F4F4 closer to white.',
        },
        {
          stableId: 'you-cannot-tell-without-knowing-which-channel-is-r-g-or-b',
          label: 'You cannot tell without knowing which channel is R, G, or B',
          isCorrect: false,
          explanation:
            'Each color repeats one channel value three times, so both colors are neutral. F4 is 244, while 1A is 26, which makes #F4F4F4 closer to white.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'In the HEX value #1E40AF, which pair would you change to adjust only the blue channel?',
      choices: [
        {
          stableId: '1e-the-first-pair',
          label: '1E, the first pair',
          isCorrect: false,
          explanation:
            'The first pair controls the red channel, so changing 1E would adjust red.',
        },
        {
          stableId: '40-the-middle-pair',
          label: '40, the middle pair',
          isCorrect: false,
          explanation:
            'The middle pair controls the green channel, so changing 40 would adjust green.',
        },
        {
          stableId: 'af-the-last-pair',
          label: 'AF, the last pair',
          isCorrect: true,
          explanation:
            'In a six-digit HEX value, the pairs represent red, green, and blue in that order. The last pair controls blue.',
        },
        {
          stableId: 'all-three-pairs',
          label: 'All three pairs',
          isCorrect: false,
          explanation:
            'Each pair controls one channel. Changing all three pairs would adjust red and green as well as blue.',
        },
      ],
    },
    {
      id: 'q4',
      prompt: 'Can #ABC be a valid HEX color value?',
      choices: [
        {
          stableId: 'no-hex-values-must-always-be-six-characters',
          label: 'No; HEX values must have six digits',
          isCorrect: false,
          explanation:
            'CSS supports three-digit HEX notation. #ABC expands to #AABBCC by repeating each digit.',
        },
        {
          stableId: 'yes-it-is-shorthand-for-aabbcc',
          label: 'Yes; it is shorthand for #AABBCC',
          isCorrect: true,
          explanation:
            'Three-digit HEX notation repeats each digit to form a pair. #ABC expands to #AABBCC: A becomes AA, B becomes BB, and C becomes CC.',
        },
        {
          stableId: 'only-in-older-css-versions',
          label: 'Only in older CSS versions',
          isCorrect: false,
          explanation:
            'Three-digit HEX notation is part of the current CSS Color specification.',
        },
        {
          stableId: 'yes-but-only-if-a-b-and-c-are-valid-hex-digits',
          label: 'Yes, because any three letters form a HEX value',
          isCorrect: false,
          explanation:
            'HEX notation accepts the digits 0 through 9 and the letters A through F. #ABC is valid because A, B, and C are within that range, not because any three letters work.',
        },
      ],
    },
  ],
  keyPoints: [
    'RGB describes color as three channel values — red, green, blue — each from 0 (none) to 255 (full).',
    'Equal channel values always produce a neutral: rgb(0,0,0) is black, rgb(255,255,255) is white, anything in between with equal values is a gray.',
    'HEX encodes the same three channels as base-16 pairs: the first two digits are red, next two green, last two blue.',
    'Shorthand HEX (#ABC) is valid only when each pair in the full six-character form is a repeated digit — #ABC expands to #AABBCC.',
    'RGBA adds a fourth value (0–1) for opacity; rgba(30, 64, 175, 0.5) is that same blue at 50% transparency.',
  ],
};
