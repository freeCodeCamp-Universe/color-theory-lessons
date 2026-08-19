import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_2: LessonConfig = {
  id: 'u3-l2',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l2'],
  interactionType: 'hex-rgb-editor',
  glossaryTerms: ['channel', 'HEX', 'RGBA', 'shorthand HEX'],
  reviewTags: ['formats', 'HEX', 'RGB'],
  steps: [
    {
      text: 'RGB describes a color by stating how much red, green, and blue light to mix. Each channel runs from 0 (none) to 255 (full). rgb(0, 0, 0) is no light at all — black. rgb(255, 255, 255) is all three channels at full — white.',
    },
    {
      text: 'HEX is a compact way to encode the same three channels. A six-character HEX value like #1E40AF splits into three pairs: the first two are red, the next two are green, the last two are blue — each pair in base-16 notation.',
    },
    {
      text: 'When all three RGB channels are equal — like rgb(120, 120, 120) — the result is always a neutral gray. No single channel dominates, so no hue appears. The same is true for #808080 or any HEX where both pairs in each channel match.',
    },
    {
      text: 'Shorthand HEX compresses a value where each pair repeats: #AABBCC can be written as #ABC. This only works when each pair has two identical digits. #1E40AF cannot be shortened because none of its pairs repeat.',
    },
    {
      text: 'RGBA adds a fourth value — the alpha channel — to RGB. It controls opacity, from 0 (fully transparent) to 1 (fully opaque). When you see rgba(30, 64, 175, 0.5), the color is that same blue at 50% opacity.',
    },
  ],
  challenge: {
      prompt:
        'Use the editor to match three target UI colors. Adjust the sliders or type a HEX value. Load each preset to explore how values map to visible results.',
      hints: [
        'Start with the preset closest to the target, then fine-tune.',
        'Watch which channel dominates in the target — that tells you which slider to push higher.',
        'Equal channel values always produce a neutral. If the target has a clear hue, at least one channel must be different.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What do equal RGB channel values always produce?',
      choices: [
        {
          id: 'a',
          label: 'A neutral gray (or white or black)',
          isCorrect: true,
          explanation:
            'When R, G, and B are equal, no single channel dominates and no hue appears. The result is a neutral — ranging from black at 0,0,0 to white at 255,255,255.',
        },
        {
          id: 'b',
          label: 'A saturated color with medium brightness',
          isCorrect: false,
          explanation:
            'Equal channel values suppress all hue. Only when channels differ does a color appear.',
        },
        {
          id: 'c',
          label: 'A very dark color',
          isCorrect: false,
          explanation:
            'Low equal values give a dark neutral, but equal values at higher settings produce lighter neutrals. The key result is always neutral, not always dark.',
        },
        {
          id: 'd',
          label: 'An error — RGB must have at least one dominant channel',
          isCorrect: false,
          explanation:
            'There is no such rule. Equal channel values are perfectly valid and produce neutrals.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which value is likely closer to white: #F4F4F4 or #1A1A1A?',
      choices: [
        {
          id: 'a',
          label: '#F4F4F4',
          isCorrect: true,
          explanation:
            'F4 in hex is 244 in decimal — close to the maximum of 255. High equal channel values produce a very light neutral. #1A1A1A has channels of only 26, producing a very dark neutral.',
        },
        {
          id: 'b',
          label: '#1A1A1A',
          isCorrect: false,
          explanation:
            '1A in hex is only 26 in decimal. All three channels near zero produce dark neutrals, not light ones.',
        },
        {
          id: 'c',
          label: 'They would appear identical',
          isCorrect: false,
          explanation:
            'F4 is 244 and 1A is 26. These are very different channel values producing very different brightness levels.',
        },
        {
          id: 'd',
          label: 'You cannot tell without knowing which channel is R, G, or B',
          isCorrect: false,
          explanation:
            'When all three pairs are the same, the channel order does not matter — the result is neutral and brightness is all that varies. #F4F4F4 is clearly the lighter one.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which format is generally easier to reason about when you want to increase only the blue in a color?',
      choices: [
        {
          id: 'a',
          label: 'HEX, because the pair positions are fixed',
          isCorrect: false,
          explanation:
            'While HEX does have fixed positions, you would need to calculate base-16 values mentally. RGB sliders are more direct for intentional single-channel adjustments.',
        },
        {
          id: 'b',
          label: 'RGB, because each channel is a separate decimal number you can adjust directly',
          isCorrect: true,
          explanation:
            'RGB gives you three independent decimal values. Increasing the blue value directly raises blue light. HEX encodes the same data but requires converting from base-16 mentally.',
        },
        {
          id: 'c',
          label: 'Both are equally easy',
          isCorrect: false,
          explanation:
            'They encode the same information, but RGB is more readable for direct single-channel adjustments because you work in decimal, not base-16.',
        },
        {
          id: 'd',
          label: 'Neither — you should use HSL for any channel change',
          isCorrect: false,
          explanation:
            'HSL is useful for hue, saturation, and lightness adjustments, but when you specifically want to change one light channel, RGB is the more direct choice.',
        },
      ],
    },
    {
      id: 'q4',
      prompt: 'Can #ABC be a valid HEX color value?',
      choices: [
        {
          id: 'a',
          label: 'No — HEX values must always be six characters',
          isCorrect: false,
          explanation:
            'Shorthand HEX with three characters is perfectly valid in CSS. #ABC expands to #AABBCC, where each single digit is simply doubled.',
        },
        {
          id: 'b',
          label: 'Yes — it is shorthand for #AABBCC',
          isCorrect: true,
          explanation:
            'Shorthand HEX works when each channel digit in the six-character form is repeated. #ABC expands to #AABBCC — A→AA, B→BB, C→CC.',
        },
        {
          id: 'c',
          label: 'Only in older CSS versions',
          isCorrect: false,
          explanation:
            'Three-character HEX has been valid in CSS since CSS1 and remains fully supported today.',
        },
        {
          id: 'd',
          label: 'Yes — but only if A, B, and C are valid hex digits',
          isCorrect: false,
          explanation:
            'A, B, and C happen to be valid hex digits (10, 11, 12), but the answer misses the key rule: shorthand is valid for any three-character hex value, not just those using A, B, C specifically.',
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
