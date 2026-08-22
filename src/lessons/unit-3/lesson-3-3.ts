import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_3: LessonConfig = {
  id: 'u3-l3',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l3'],
  interactionType: 'hsl-playground',
  reviewTags: ['formats', 'HSL', 'design-adjustment'],
  steps: [
    {
      text: 'Unit 1 introduced hue, saturation, and lightness as visible properties. HSL turns those same properties into a practical color format you can use in code: hsl(hue saturation% lightness%).',
    },
    {
      text: 'Hue is an angle around the color wheel from 0 to 360 degrees. Saturation and lightness are percentages. At 0% saturation, the result is gray; at 100%, it is fully saturated. At 0% lightness, the result is black; at 100%, it is white.',
      panel: { type: 'hsl-playground-preview' },
    },
    {
      text: 'Each HSL component maps to one type of adjustment. Lower saturation to mute a color, raise lightness to make it lighter, or shift hue to move around the color wheel. Comparable RGB adjustments can require changing multiple channels.',
      panel: { type: 'hsl-playground-preview' },
    },
    {
      text: 'CSS can add an alpha value after a slash to control transparency. For example, hsl(220 60% 50% / 0.5) represents that blue at 50% opacity. An alpha value of 0 is transparent, and 1 is opaque.',
    },
    {
      text: 'The playground shows the same color in HSL, HEX, and RGB at the same time. Adjust the sliders and compare how each format updates. Then match three target colors using the HSL controls.',
    },
  ],
  challenge: {
    prompt:
        'Match three target colors using the HSL sliders. The HSL, HEX, and RGB readouts update together as you adjust the color.',
      hints: [
        'Start with hue to get the right color family, then adjust saturation and lightness.',
        'A muted target has low saturation. A light target has high lightness.',
        'If the target looks gray, saturation is near zero. Focus on lightness to match how light or dark it appears.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which HSL property would you change to make a vivid blue more muted?',
      choices: [
        {
          stableId: 'hue',
          label: 'Hue',
          isCorrect: false,
          explanation:
            'Hue shifts the color family. To mute the color without changing its family, lower saturation.',
        },
        {
          stableId: 'saturation',
          label: 'Saturation',
          isCorrect: true,
          explanation:
            'Lowering saturation moves the color toward gray, making it more muted while keeping the same hue and lightness.',
        },
        {
          stableId: 'lightness',
          label: 'Lightness',
          isCorrect: false,
          explanation:
            'Lightness changes how light or dark the color is, not how vivid or muted it appears.',
        },
        {
          stableId: 'alpha',
          label: 'Alpha',
          isCorrect: false,
          explanation:
            'Alpha controls transparency, not the vividness of the color itself.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'When is HSL generally more practical than RGB for a design adjustment?',
      choices: [
        {
          stableId: 'when-you-want-to-create-a-lighter-version-of-an-accent-color',
          label: 'When you want to create a lighter version of an accent color',
          isCorrect: true,
          explanation:
            'In HSL, you raise lightness. In RGB, the same adjustment requires coordinated changes to multiple channels.',
        },
        {
          stableId: 'when-you-need-to-set-a-specific-red-channel-value',
          label: 'When you need to set a specific red channel value',
          isCorrect: false,
          explanation:
            'RGB gives direct access to individual channels. If the task is "change the red channel," RGB is the more direct tool.',
        },
        {
          stableId: 'hsl-is-always-more-practical-than-rgb',
          label: 'When you need to adjust a color\'s opacity',
          isCorrect: false,
          explanation:
            'Both HSL and RGB colors can include an alpha value for opacity. Neither format has an advantage for this adjustment.',
        },
        {
          stableId: 'when-you-want-to-convert-a-color-to-grayscale',
          label: 'When you need to enter a color supplied as RGB channel values',
          isCorrect: false,
          explanation:
            'RGB is the direct format for a color supplied as red, green, and blue channel values. Converting it to HSL adds an unnecessary step.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'In hsl(220 60% 50% / 0.5), what does 0.5 control?',
      choices: [
        {
          stableId: 'accent-the-emphasis-level-of-the-color',
          label: 'The color\'s emphasis level',
          isCorrect: false,
          explanation: 'The value after the slash controls opacity, not emphasis.',
        },
        {
          stableId: 'alpha-the-opacity-of-the-color-from-0-transparent-to-1-opaque',
          label: 'The color\'s opacity',
          isCorrect: true,
          explanation:
            'The value after the slash is alpha. A value of 0.5 makes the color 50% opaque.',
        },
        {
          stableId: 'angle-the-rotation-of-hue-on-the-color-wheel',
          label: 'The hue\'s angle',
          isCorrect: false,
          explanation:
            'The first value, 220, sets the hue angle. The value after the slash sets alpha.',
        },
        {
          stableId: 'amplitude-how-strong-the-color-signal-is',
          label: 'The saturation percentage',
          isCorrect: false,
          explanation: 'The second value, 60%, sets saturation. The value after the slash sets alpha.',
        },
      ],
    },
  ],
  keyPoints: [
    'HSL describes a color with a hue angle from 0 to 360 degrees and saturation and lightness percentages.',
    'HSL separates common design adjustments: shift hue to change the color family, lower saturation to mute a color, or raise lightness to make it lighter.',
    'RGB gives direct control over the red, green, and blue channels, while HSL gives direct control over hue, saturation, and lightness.',
    'CSS hsl() can include an alpha value after a slash, such as hsl(220 60% 50% / 0.5).',
    'HSL, HEX, and RGB can encode the same sRGB color using different notation.',
  ],
};
