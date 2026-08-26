import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson1_2: LessonConfig = {
  id: 'u1-l2',
  unitId: 'unit-1',
  title: LESSON_TITLES['u1-l2'],
  interactionType: 'slider-explore',
  reviewTags: ['foundations', 'hue', 'saturation', 'lightness'],
  steps: [
    {
      text: 'The HSL color model describes a color with three values: hue, saturation, and lightness. Each value controls a different part of the model.',
    },
    {
      text: 'Hue identifies a color family, such as red, orange, yellow, green, blue, or purple. In HSL, hue is represented by an angle around the color wheel.',
      panel: { type: 'hsl-slider-preview', dimension: 'h' },
    },
    {
      text: 'In HSL, saturation controls how vivid or muted a color appears. With hue and lightness fixed, lowering saturation moves the color toward gray.',
      panel: { type: 'hsl-slider-preview', dimension: 's' },
    },
    {
      text: 'In HSL, lightness controls how light or dark a color appears. At 0% the color is black, and at 100% it is white. With hue and saturation fixed, changing lightness produces lighter or darker versions of the color.',
      panel: { type: 'hsl-slider-preview', dimension: 'l' },
    },
    {
      text: 'Change one HSL value while the other two stay fixed. This isolates the effect of hue, saturation, or lightness on the resulting color.',
    },
  ],
  challenge: {
      prompt: 'Complete three stages in order: match the hue, then the saturation, then the lightness.',
      hints: [
        {
          stageId: 'hue',
          text: 'A change from one color family to another means the hue changed.',
        },
        {
          stageId: 'saturation',
          text: 'Compare how vivid or muted the colors look while hue and lightness remain fixed. That difference comes from saturation.',
        },
        {
          stageId: 'lightness',
          text: 'Lightness is the changing value when one color is darker or lighter and the other two values match.',
        },
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'A designer changes a button\'s color from vivid red to muted dusty rose. Which HSL value changes the most?',
      colorSwatches: [
        { label: 'vivid red', color: '#E53935' },
        { label: 'dusty rose', color: '#C48B9F' },
      ],
      choices: [
        { stableId: 'hue', label: 'Hue', isCorrect: false, explanation: 'The colors remain in nearby red hue ranges. Their hue angles differ by about 22 degrees.' },
        { stableId: 'saturation', label: 'Saturation', isCorrect: true, explanation: 'Saturation drops by about 45 percentage points, the largest change among the three HSL values.' },
        { stableId: 'lightness', label: 'Lightness', isCorrect: false, explanation: 'Lightness rises by about 10 percentage points, which is smaller than the saturation change.' },
        { stableId: 'contrast', label: 'Contrast', isCorrect: false, explanation: 'Contrast compares a color with another color or background. It is not an HSL value.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which HSL change makes a color darker while its hue and saturation stay fixed?',
      choices: [
        { stableId: 'decreasing-hue', label: 'Decreasing hue', isCorrect: false, explanation: 'Changing hue changes the color family while lightness stays fixed.' },
        { stableId: 'increasing-saturation', label: 'Increasing saturation', isCorrect: false, explanation: 'Increasing saturation makes the color more vivid while lightness stays fixed.' },
        { stableId: 'decreasing-saturation', label: 'Decreasing saturation', isCorrect: false, explanation: 'Decreasing saturation makes the color more muted while lightness stays fixed.' },
        { stableId: 'decreasing-lightness', label: 'Decreasing lightness', isCorrect: true, explanation: 'Lightness controls how dark or light the color appears while hue and saturation stay the same.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which HSL value differs most between these two blue swatches?',
      colorSwatches: [
        { label: 'sky blue', color: '#87CEEB' },
        { label: 'deep navy', color: '#1A237E' },
      ],
      choices: [
        { stableId: 'hue', label: 'Hue', isCorrect: false, explanation: 'Their hues differ by 38 degrees, but both remain in the blue range.' },
        { stableId: 'saturation', label: 'Saturation', isCorrect: false, explanation: 'Their saturation values are close: 71% and 66%.' },
        { stableId: 'lightness', label: 'Lightness', isCorrect: true, explanation: 'Sky blue has 73% lightness, while deep navy has 30% lightness.' },
        { stableId: 'temperature', label: 'Temperature', isCorrect: false, explanation: 'Temperature is not one of the three HSL values.' },
      ],
    },
  ],
  keyPoints: [
    'The HSL color model describes a color with hue, saturation, and lightness.',
    'Hue identifies a color family and is represented by an angle around the color wheel.',
    'Saturation controls how vivid or muted a color appears. With hue and lightness fixed, lowering saturation moves the color toward gray.',
    'Lightness controls how light or dark a color appears. At 0% the color is black, and at 100% it is white.',
    'Holding two HSL values fixed isolates the effect of changing the third value.',
  ],
};
