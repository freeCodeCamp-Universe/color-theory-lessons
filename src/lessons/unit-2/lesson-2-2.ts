import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson2_2: LessonConfig = {
  id: 'u2-l2',
  unitId: 'unit-2',
  title: LESSON_TITLES['u2-l2'],
  interactionType: 'rgb-mixer',
  reviewTags: ['additive', 'RGB', 'color-models', 'screens'],
  steps: [
    {
      text: 'Screens typically create pixel colors by combining light from red, green, and blue subpixels. In common 8-bit RGB notation, each channel ranges from 0 to 255. A higher value represents more light from that channel, and the three values together define the encoded color.',
    },
    {
      text: 'In 8-bit RGB notation, R:0 G:0 B:0 represents black, while R:255 G:255 B:255 represents white. Raising all three channel values together increases the emitted light and moves the result from black through gray toward white.',
      panel: { type: 'rgb-mixer-preview', mode: 'extremes' },
    },
    {
      text: 'At full intensity, each pair of RGB channels produces an additive secondary color. Red and green produce yellow, green and blue produce cyan, and red and blue produce magenta.',
      panel: { type: 'rgb-mixer-preview', mode: 'channel-pairs' },
    },
    {
      text: 'In RGB notation, equal values across all three channels represent neutral grays. Lower equal values make darker grays, while higher equal values make lighter grays. When the values differ, the result gains a color cast. For example, raising red above the other two shifts a gray toward red.',
      panel: { type: 'rgb-mixer-preview', mode: 'neutral-grays' },
    },
    {
      text: 'Use the RGB mixer to recreate five interface colors. Before moving a slider, predict which channels should be high, low, or close to equal.',
    },
  ],
  challenge: {
      prompt: 'Recreate each target color with the R, G, and B sliders. First predict which channels should be high, low, or close to equal.',
      hints: [
        'Warm pink needs the most red, some blue, and less green.',
        'For pale sky blue, keep blue highest, green next, and red lowest. Use the same order at lower values for dark navy.',
        'Keep the channels close together for soft gray. Warning yellow needs high red and green with little blue.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which RGB channel pattern produces cyan?',
      choices: [
        { stableId: 'high-red-low-green-high-blue', label: 'High red, low green, high blue', isCorrect: false, explanation: 'High red and blue with low green produces magenta, not cyan.' },
        { stableId: 'low-red-high-green-high-blue', label: 'Low red, high green, high blue', isCorrect: true, explanation: 'Cyan combines green and blue light. Keeping red low prevents the mix from shifting toward white.' },
        { stableId: 'high-red-high-green-low-blue', label: 'High red, high green, low blue', isCorrect: false, explanation: 'High red and green with low blue produces yellow.' },
        { stableId: 'equal-amounts-of-all-three', label: 'Equal amounts of all three', isCorrect: false, explanation: 'Equal channels represent a neutral value from black through gray to white.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'In 8-bit RGB notation, what does R:100 G:100 B:100 represent?',
      choices: [
        { stableId: 'the-color-will-be-a-warm-neutral', label: 'A warm neutral', isCorrect: false, explanation: 'Equal channel values have no RGB color cast, so this mix is not a warm neutral.' },
        { stableId: 'the-result-is-always-white', label: 'White', isCorrect: false, explanation: 'In 8-bit RGB notation, white is R:255 G:255 B:255. Lower equal values represent grays.' },
        { stableId: 'the-result-is-a-neutral-gray', label: 'A neutral gray', isCorrect: true, explanation: 'Equal RGB channel values represent a neutral because no channel is higher than the others. The value determines how light or dark the gray is.' },
        { stableId: 'the-result-is-black', label: 'Black', isCorrect: false, explanation: 'Black is R:0 G:0 B:0. Equal channel values of 100 represent a gray.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A designer wants a vivid purple accent. Which channels should be elevated?',
      choices: [
        { stableId: 'red-and-green', label: 'Red and green', isCorrect: false, explanation: 'High red and green with low blue produces yellow, not purple.' },
        { stableId: 'green-and-blue', label: 'Green and blue', isCorrect: false, explanation: 'High green and blue with low red produces cyan. Purple requires red and blue.' },
        { stableId: 'red-and-blue', label: 'Red and blue', isCorrect: true, explanation: 'Purple uses red and blue light, usually with blue higher than red, while green stays low. Equal high values of red and blue produce magenta.' },
        { stableId: 'all-three-equally', label: 'All three equally', isCorrect: false, explanation: 'Equal RGB channels represent a neutral gray or white. A purple hue requires more blue and red than green.' },
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
