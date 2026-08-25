import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_6: LessonConfig = {
  id: 'u6-l6', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l6'],
  interactionType: 'color-space-lab',
  reviewTags: ['color-spaces', 'srgb', 'display-p3', 'context', 'wide-gamut'],
  steps: [
    {
      text: 'Before stress-testing your color system in the next lesson, consider the color space used by each value. In CSS, the HEX, RGB, and HSL formats introduced in Unit 3 represent sRGB colors. This color space provides a common baseline for web content and displays.',
    },
    {
      text: 'Display P3 has a wider gamut than sRGB, so it can specify some colors that sRGB cannot. CSS represents these colors with color(display-p3 ...). When a screen cannot reproduce a specified color, the browser maps it into the screen\'s gamut. Start with an sRGB declaration for browsers that cannot parse Display P3 syntax. Use @media (color-gamut: p3) when the Display P3 declaration should apply only to wide-gamut displays.',
    },
    {
      text: 'Scalable Vector Graphics (SVG) is a language for two-dimensional graphics such as icons. The HTML Canvas element provides a surface that JavaScript can use to draw charts and other graphics. WebGL uses the Canvas element to render interactive three-dimensional graphics in the browser. These contexts accept explicit color values, so use the same semantic roles to choose values across them.',
    },
    {
      text: 'Surrounding colors affect how a color looks. For example, the same gray can look lighter on a dark background and darker on a light background. This effect is called simultaneous contrast. Test color systems in complete interface layouts as well as swatch grids.',
    },
    {
      text: 'A Display P3 color outside the sRGB gamut can lose chroma or otherwise change appearance when it is mapped to an sRGB display. Test wide-gamut colors on both display types, and do not rely on a difference that disappears after gamut mapping.',
    },
  ],
  challenge: {
      prompt: 'Sort each item as a raw value, semantic role, or usage context. Then decide whether each Display P3 sample needs gamut mapping for sRGB output.',
      hints: [
        'A raw value is a specific number like #0B57D0 or rgb(34, 34, 34).',
        'A semantic role is a token name like --color-text-primary or --color-success-bg.',
        'A usage context identifies where the color appears or how it is rendered: a wide-gamut display, a Canvas chart fill, or an SVG icon fill.',
        'Use the gamut result under each sample to decide whether it needs mapping for sRGB output.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which color space should a web design provide as its baseline?',
      choices: [
        { stableId: 'display-p3-because-it-has-more-vivid-colors', label: 'Display P3, because its gamut is wider', isCorrect: false, explanation: 'Display P3 includes colors outside sRGB, but an sRGB fallback is still needed for browsers that cannot parse Display P3 syntax. Display gamut is a separate concern handled with the color-gamut media feature.' },
        { stableId: 'srgb-because-it-is-supported-by-virtually-all-screens', label: 'sRGB, because it is widely supported in CSS and by displays', isCorrect: true, explanation: 'The HEX, RGB, and HSL formats in CSS represent sRGB colors, and sRGB displays are widespread. Start with an sRGB declaration, then use @media (color-gamut: p3) for a Display P3 override intended only for wide-gamut displays.' },
        { stableId: 'neither-css-automatically-picks-the-right-one', label: 'Neither, because CSS selects the color space automatically', isCorrect: false, explanation: 'CSS does not replace an sRGB declaration with Display P3 automatically. The author must specify a Display P3 color.' },
        { stableId: 'it-depends-on-which-browser-the-user-prefers', label: 'It depends on which browser the user prefers', isCorrect: false, explanation: 'The device gamut and its CSS support affect the result. A browser preference does not choose the color space.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why can the same hex color look different in different interface contexts?',
      choices: [
        { stableId: 'browsers-apply-different-color-profiles-randomly', label: 'Browsers apply different color profiles randomly', isCorrect: false, explanation: 'Random color-profile changes do not explain a repeatable difference caused by surrounding colors.' },
        { stableId: 'surrounding-colors-influence-perception-a-neutral-looks-warmer-o', label: 'Surrounding colors affect how light, dark, warm, or cool a color looks', isCorrect: true, explanation: 'Simultaneous contrast changes a color\'s appearance in response to the colors around it.' },
        { stableId: 'hex-values-shift-when-loaded-in-different-files', label: 'Hex values shift when loaded in different files', isCorrect: false, explanation: 'The numeric value stays the same when the file changes. Its appearance can still vary with the display and its surroundings.' },
        { stableId: 'color-memory-is-inaccurate', label: 'Color memory is inaccurate', isCorrect: false, explanation: 'Color memory does not explain the immediate change seen when one color is placed against different neighbors.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What should you do when using Display P3 colors on the web?',
      choices: [
        { stableId: 'never-use-saturated-colors', label: 'Avoid all saturated colors', isCorrect: false, explanation: 'Saturated sRGB and Display P3 colors are valid. Check whether each color keeps its intended role after gamut mapping.' },
        { stableId: 'standard-srgb-is-always-safer-and-should-be-used-exclusively', label: 'Use sRGB values exclusively', isCorrect: false, explanation: 'Display P3 can add colors outside sRGB. An sRGB declaration covers browsers that cannot parse Display P3 syntax, while a color-gamut media query controls whether the P3 override applies on a wide-gamut display.' },
        { stableId: 'colors-may-appear-more-vivid-than-expected-use-restrained-satura', label: 'Provide sRGB fallbacks and test across display gamuts', isCorrect: true, explanation: 'A Display P3 color outside sRGB must be gamut-mapped on an sRGB display, which can reduce its chroma or otherwise change its appearance.' },
        { stableId: 'wide-gamut-displays-are-only-for-photographers', label: 'Reserve wide-gamut colors for photography', isCorrect: false, explanation: 'Wide-gamut CSS colors can be used in any web interface. They are not limited to photographs.' },
      ],
    },
  ],
  keyPoints: [
    'HEX, RGB, and HSL values in CSS represent sRGB colors, which provide a common baseline for web content and displays.',
    'Display P3 can specify colors outside sRGB. Start with an sRGB declaration for browsers that cannot parse Display P3 syntax.',
    'SVG, Canvas, and WebGL accept explicit color values. Use the same semantic roles to choose values across these contexts.',
    'Surrounding colors can change how a color looks through simultaneous contrast. Test complete interface layouts as well as swatch grids.',
    'A Display P3 color outside sRGB can lose chroma or otherwise change when mapped to an sRGB display. Test wide-gamut colors on both display types.',
  ],
};
