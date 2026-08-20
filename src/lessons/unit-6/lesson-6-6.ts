import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_6: LessonConfig = {
  id: 'u6-l6', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l6'],
  interactionType: 'color-space-lab',
  reviewTags: ['color-spaces', 'sRGB', 'Display-P3', 'context', 'wide-gamut'],
  steps: [
    {
      text: 'Before stress-testing your color system in the next lesson, you need to understand one more layer: the color space your values live in. sRGB is the standard color space for most web work. It defines the range of colors that virtually every screen can display. When you write a HEX, RGB, or HSL value in CSS, you are working in sRGB by default.',
    },
    {
      text: "Display P3 is a wider color space available on many modern screens — especially Apple devices. It can represent more vivid colors than sRGB. If a user's screen does not support P3, those extra-vivid colors are clipped back to the nearest sRGB equivalent. Design for sRGB first, then enhance with P3 where supported.",
    },
    {
      text: 'Colors appear not only in CSS but in SVG graphics, HTML Canvas elements, and WebGL scenes. A chart bar in Canvas, an icon fill in SVG, a 3D surface in WebGL — each rendering context uses explicit color values. The context changes, but the need for thoughtful color decisions does not.',
    },
    {
      text: 'Color does not exist in isolation. The same hex value looks different depending on surroundings: a neutral gray on white looks warm; the same gray on a blue background looks cool. This context effect — also called simultaneous contrast — means your system must be tested in real layouts, not just in swatch grids.',
    },
    {
      text: 'Wide-gamut displays can make carefully chosen colors appear overwhelming on newer hardware. A saturated cyan or vivid orange that looks fine on a standard sRGB screen may appear even more intense on a P3 display. Use restrained saturation and test across display types.',
    },
  ],
  challenge: {
      prompt: 'Sort items into three categories: raw value, semantic role, or rendering/device context. Then identify which colors might be risky in a sRGB-only environment.',
      hints: [
        'A raw value is a specific number like #0B57D0 or rgb(34, 34, 34).',
        'A semantic role is a token name like --color-text-primary or --color-success-bg.',
        'A rendering context is where the color appears: Display P3, Canvas chart fill, SVG icon fill.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which is the safer baseline for most web design work?',
      choices: [
        { stableId: 'display-p3-because-it-has-more-vivid-colors', label: 'Display P3 — because it has more vivid colors', isCorrect: false, explanation: 'P3 offers wider gamut, but not all screens support it. sRGB is the safe baseline that works everywhere.' },
        { stableId: 'srgb-because-it-is-supported-by-virtually-all-screens', label: 'sRGB — because it is supported by virtually all screens', isCorrect: true, explanation: 'sRGB is the universal default. Design in sRGB first, then enhance with P3 where supported.' },
        { stableId: 'neither-css-automatically-picks-the-right-one', label: 'Neither — CSS automatically picks the right one', isCorrect: false, explanation: 'CSS uses sRGB by default. The designer still needs to be aware of the color space.' },
        { stableId: 'it-depends-on-which-browser-the-user-prefers', label: 'It depends on which browser the user prefers', isCorrect: false, explanation: 'sRGB is the safe universal baseline regardless of browser.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why can the same hex color look different in different interface contexts?',
      choices: [
        { stableId: 'browsers-apply-different-color-profiles-randomly', label: 'Browsers apply different color profiles randomly', isCorrect: false, explanation: 'Browsers do not apply random color profiles — the effect is perceptual.' },
        { stableId: 'surrounding-colors-influence-perception-a-neutral-looks-warmer-o', label: 'Surrounding colors influence perception — a neutral looks warmer or cooler depending on adjacent hues', isCorrect: true, explanation: 'Simultaneous contrast means every color is perceived relative to its neighbors.' },
        { stableId: 'hex-values-shift-when-loaded-in-different-files', label: 'Hex values shift when loaded in different files', isCorrect: false, explanation: 'Hex values are exact — they do not shift between files.' },
        { stableId: 'color-memory-is-inaccurate', label: 'Color memory is inaccurate', isCorrect: false, explanation: 'Color memory can be inaccurate, but simultaneous contrast is a perceptual phenomenon, not a memory one.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What is the practical design lesson of wide-gamut displays?',
      choices: [
        { stableId: 'never-use-saturated-colors', label: 'Never use saturated colors', isCorrect: false, explanation: 'Saturated colors are not forbidden — they should be used with awareness of display variation.' },
        { stableId: 'standard-srgb-is-always-safer-and-should-be-used-exclusively', label: 'Standard sRGB is always safer and should be used exclusively', isCorrect: false, explanation: 'Wide gamut is increasingly common and worth preparing for, not avoiding.' },
        { stableId: 'colors-may-appear-more-vivid-than-expected-use-restrained-satura', label: 'Colors may appear more vivid than expected — use restrained saturation and test on multiple display types', isCorrect: true, explanation: 'Wide-gamut displays can make carefully chosen colors appear overwhelming on newer hardware.' },
        { stableId: 'wide-gamut-displays-are-only-for-photographers', label: 'Wide-gamut displays are only for photographers', isCorrect: false, explanation: 'Wide-gamut displays are standard on many consumer devices including phones and laptops.' },
      ],
    },
  ],
  keyPoints: [
    'sRGB is the default color space for web work — supported by virtually all screens and the safe baseline.',
    'Display P3 can represent more vivid colors, but unsupported devices clip them back to sRGB. Design for sRGB first.',
    'Colors appear in CSS, SVG, Canvas, and WebGL contexts — the rendering context changes but the need for thoughtful decisions does not.',
    'Context effect: the same hex looks different depending on surroundings. Test in real layouts, not just swatch grids.',
    'Wide-gamut displays can make saturated colors appear overwhelming — use restrained saturation and test across display types.',
  ],
};
