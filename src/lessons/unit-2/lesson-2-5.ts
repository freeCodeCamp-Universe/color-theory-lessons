import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson2_5: LessonConfig = {
  id: 'u2-l5',
  unitId: 'unit-2',
  title: LESSON_TITLES['u2-l5'],
  interactionType: 'background-shift',
  reviewTags: ['additive', 'display', 'perception', 'interface'],
  steps: [
    {
      text: 'A display forms an image with a grid of pixels. Each pixel typically combines red, green, and blue subpixels whose light output is controlled independently.',
    },
    {
      text: 'At a normal viewing distance, the subpixels are too small to distinguish. Their light combines in your visual system, so you perceive one color per pixel. Magnifying a screen reveals the individual red, green, and blue subpixels.',
    },
    {
      text: 'A display forms its image by directing controlled light toward the viewer. Paint depends on ambient light and reflects only part of it. This difference can make a bright screen accent appear luminous in dim surroundings.',
    },
    {
      text: 'Surrounding luminance affects how a color appears. The bright accents in this lesson have greater luminance contrast against a dark background, so they can look brighter and more prominent. The same accents have less luminance contrast against a light background and can appear less prominent.',
    },
    {
      text: 'Use the pixel explorer to see how subpixels combine into a perceived color. Then in the challenge, compare the same accent on a dark and light background and pick the explanation that best describes what you see.',
    },
  ],
  challenge: {
    prompt: 'This exercise has three stages: vivid blue, vivid orange, then vivid green. At each stage, compare the same accent on dark and light backgrounds and choose why it appears more prominent in one context.',
    hints: [
      'Compare the luminance of the accent with the luminance of each background.',
      'For these accents, the contrast is greater when the surrounding area is near-black than when it is near-white.',
      'The accent\'s RGB values do not change. Only the background changes.',
    ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the practical reason a screen color can appear to glow?',
      choices: [
        { stableId: 'it-is-printed-with-luminescent-ink', label: 'It is printed with luminescent ink.', isCorrect: false, explanation: 'Screens do not use ink. They emit light directly.' },
        { stableId: 'the-display-emits-light-directly-to-the-viewer-s-eyes-something-', label: 'The display directs light toward the viewer\'s eyes, while paint and ink reflect ambient light.', isCorrect: true, explanation: 'A screen sends controlled light toward the viewer. Paint and ink depend on ambient light and reflect part of it.' },
        { stableId: 'screens-use-special-high-brightness-pigments-inside-the-glass', label: 'Screens use special high-brightness pigments inside the glass.', isCorrect: false, explanation: 'Screens do not form images by layering colored pigment. They use light-emitting or light-controlling elements.' },
        { stableId: 'screens-always-display-brighter-colors-than-any-physical-materia', label: 'Every screen color is brighter than every color on a physical surface.', isCorrect: false, explanation: 'Brightness depends on the display, its settings, and the ambient illumination. The consistent difference is how the image is produced: a screen controls light, while a physical surface reflects it.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why can the same accent color feel stronger on a dark background than on a light one?',
      choices: [
        { stableId: 'dark-backgrounds-make-all-colors-appear-warmer', label: 'Dark backgrounds make all colors appear warmer.', isCorrect: false, explanation: 'Background darkness affects perceived contrast and vividness, not warmth specifically.' },
        { stableId: 'the-contrast-between-the-bright-accent-and-the-dark-surroundings', label: 'The bright accent has greater luminance contrast with the dark background.', isCorrect: true, explanation: 'The accent\'s RGB values remain fixed. Its greater luminance contrast with the dark background makes it more prominent.' },
        { stableId: 'a-dark-background-reduces-the-saturation-of-neighboring-colors-a', label: 'A dark background reduces the accent\'s encoded saturation.', isCorrect: false, explanation: 'The accent\'s RGB values and encoded saturation do not change. Its appearance changes because the background changes the surrounding luminance.' },
        { stableId: 'the-accent-s-rgb-values-increase-automatically-when-placed-on-a-', label: 'The accent\'s RGB values increase automatically when placed on a dark background.', isCorrect: false, explanation: 'RGB values are fixed. The perception changes because of contrast with surroundings, not because the values change.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A screen and a painted surface produce color through the same physical process. True or false?',
      choices: [
        { stableId: 'true-screens-layer-digital-paint-in-the-rgb-color-space', label: 'True. Screens layer digital paint in the RGB color space.', isCorrect: false, explanation: 'Screens control light rather than layering pigment.' },
        { stableId: 'false-screens-emit-light-a-painted-surface-reflects-ambient-ligh', label: 'False. Screens control light, while painted surfaces reflect ambient light.', isCorrect: true, explanation: 'Displays form images with controlled light. Paint absorbs some wavelengths from ambient light and reflects others.' },
        { stableId: 'true-both-screens-and-paint-are-creating-color-for-the-viewer-s-', label: 'True. Both produce color for the viewer through the same process.', isCorrect: false, explanation: 'Both result in perceived color, but they send light to the eye through different physical processes.' },
        { stableId: 'it-depends-on-the-type-of-screen-technology-used', label: 'It depends on the type of screen technology used.', isCorrect: false, explanation: 'LCD pixels modulate light from a backlight, while emissive displays generate light at their pixels. Both form images with controlled light rather than reflected pigment.' },
      ],
    },
  ],
  keyPoints: [
    'A display pixel typically combines independently controlled red, green, and blue subpixels.',
    'At a normal viewing distance, subpixel light combines in your visual system, so you perceive one color per pixel.',
    'Displays direct controlled light toward the viewer, while paint and ink reflect ambient light.',
    'A bright accent has greater luminance contrast against a dark background, which can make it appear more prominent.',
    'Changing the background can change an accent’s perceived prominence without changing its RGB values.',
  ],
};
