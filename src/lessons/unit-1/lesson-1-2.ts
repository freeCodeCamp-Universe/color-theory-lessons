import type { LessonConfig } from '../../types/lesson.ts';

export const lesson1_2: LessonConfig = {
  id: 'u1-l2',
  unitId: 'unit-1',
  title: 'Hue, Saturation, and Lightness',
  interactionType: 'slider-explore',
  glossaryTerms: ['hue', 'saturation', 'lightness', 'value', 'muted', 'vivid', 'tint', 'shade'],
  reviewTags: ['foundations', 'hue', 'saturation', 'lightness'],
  steps: [
    {
      id: 's1',
      text: 'The HSL color model describes a color with three values: hue, saturation, and lightness. Each value controls a different part of the model.',
    },
    {
      id: 's2',
      text: 'Hue identifies a color family, such as red, orange, yellow, green, blue, or purple. In HSL, hue is represented by an angle around the color wheel.',
      highlights: ['hue'],
      panel: { type: 'hsl-slider-preview', dimension: 'h' },
    },
    {
      id: 's3',
      text: 'In HSL, saturation controls how vivid or muted a color appears. With hue and lightness fixed, lowering saturation moves the color toward gray.',
      highlights: ['saturation', 'muted', 'vivid'],
      panel: { type: 'hsl-slider-preview', dimension: 's' },
    },
    {
      id: 's4',
      text: 'In HSL, lightness controls how light or dark a color appears. At 0% the color is black, and at 100% it is white. With hue and saturation fixed, changing lightness produces lighter or darker versions of the color.',
      highlights: ['lightness', 'value', 'tint', 'shade'],
      panel: { type: 'hsl-slider-preview', dimension: 'l' },
    },
    {
      id: 's5',
      text: 'Change one HSL value while the other two stay fixed. This isolates the effect of hue, saturation, or lightness on the resulting color.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Complete three color matches, one each for hue, saturation, and lightness.',
      type: 'match-target',
      hints: [
        'A change from one color family to another means the hue changed.',
        'Compare how vivid or muted the colors look while hue and lightness remain fixed. That difference comes from saturation.',
        'Lightness is the changing value when one color is darker or lighter and the other two values match.',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'A designer changes a button\'s color from vivid red to muted dusty rose. Which HSL value changes the most?',
      colorSwatches: [
        { label: 'vivid red', color: '#E53935' },
        { label: 'dusty rose', color: '#C48B9F' },
      ],
      choices: [
        { id: 'a', label: 'Hue', isCorrect: false, explanation: 'The colors remain in nearby red hue ranges. Their hue angles differ by about 22 degrees.' },
        { id: 'b', label: 'Saturation', isCorrect: true, explanation: 'Saturation drops by about 45 percentage points, the largest change among the three HSL values.' },
        { id: 'c', label: 'Lightness', isCorrect: false, explanation: 'Lightness rises by about 10 percentage points, which is smaller than the saturation change.' },
        { id: 'd', label: 'Contrast', isCorrect: false, explanation: 'Contrast compares a color with another color or background. It is not an HSL value.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which HSL change makes a color darker while its hue and saturation stay fixed?',
      choices: [
        { id: 'a', label: 'Decreasing hue', isCorrect: false, explanation: 'Changing hue changes the color family while lightness stays fixed.' },
        { id: 'b', label: 'Increasing saturation', isCorrect: false, explanation: 'Increasing saturation makes the color more vivid while lightness stays fixed.' },
        { id: 'c', label: 'Decreasing saturation', isCorrect: false, explanation: 'Decreasing saturation makes the color more muted while lightness stays fixed.' },
        { id: 'd', label: 'Decreasing lightness', isCorrect: true, explanation: 'Lightness controls how dark or light the color appears while hue and saturation stay the same.' },
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
        { id: 'a', label: 'Hue', isCorrect: false, explanation: 'Their hues differ by 38 degrees, but both remain in the blue range.' },
        { id: 'b', label: 'Saturation', isCorrect: false, explanation: 'Their saturation values are close: 71% and 66%.' },
        { id: 'c', label: 'Lightness', isCorrect: true, explanation: 'Sky blue has 73% lightness, while deep navy has 30% lightness.' },
        { id: 'd', label: 'Temperature', isCorrect: false, explanation: 'Temperature is not one of the three HSL values.' },
      ],
    },
  ],
  keyPoints: [
    'Hue is the color family — red, orange, blue, green. It is measured as a degree on a 360° wheel.',
    'Saturation is intensity: fully saturated colors are vivid; fully desaturated colors are neutral grays.',
    'Lightness is brightness: 0% is black, 100% is white, 50% with full saturation is the purest form of a hue.',
    'Tints are lighter versions of a hue (adding white); shades are darker versions (adding black).',
    'Each HSL axis can be adjusted independently — changing one does not automatically change the others.',
  ],
};
