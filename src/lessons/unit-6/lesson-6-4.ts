import type { LessonConfig } from '../../types/lesson.ts';

export const lesson6_4: LessonConfig = {
  id: 'u6-l4', unitId: 'unit-6',
  title: 'Dark Mode and Theme Pairing',
  interactionType: 'dark-translator',
  glossaryTerms: ['dark mode', 'inverse text', 'light mode', 'mode adaptation', 'surface depth', 'theme pairing', 'tonal separation'],
  reviewTags: ['dark-mode', 'theme', 'hierarchy', 'adaptation'],
  steps: [
    { id: 's1', text: 'Dark mode is not the inverse of light mode. Inverting light values produces unnatural results: pure black backgrounds feel harsh, pure white text creates intense halation, and surfaces that were separated in light mode may blur together in dark mode.', highlights: ['dark mode', 'light mode', 'theme pairing'] },
    { id: 's2', text: 'Dark theme backgrounds are typically a very dark but not pure-black neutral — something in the range of #0f172a to #1e293b, for example. The exact values will depend on your palette; what matters is avoiding pure black and leaving room for surface layers above it.', highlights: ['surface depth', 'tonal separation'] },
    { id: 's3', text: 'Text in dark mode is usually a soft off-white rather than pure white. As a starting point, primary text might be around #f8fafc while secondary text is around #94a3b8 — still high contrast against the dark surface, but less fatiguing than full-brightness white.', highlights: ['inverse text'] },
    { id: 's4', text: 'Accent colors often need to be lighter or less saturated in dark mode. A vivid blue that read well on a white background may feel overwhelming on a dark surface. Mode adaptation means reviewing each role, not just toggling a switch.', highlights: ['mode adaptation'] },
    { id: 's5', text: 'In the dark translator, you start with a light theme and assign a dark equivalent for each role. The preview toggles live between modes. Your task: maintain hierarchy, readable text, and distinct semantic states in both.' },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Assign dark theme equivalents for each semantic role. The preview must show clear hierarchy and readable text in both light and dark modes.',
      type: 'system-build',
      hints: [
        'Keep dark backgrounds in the #0f172a–#334155 range for usable depth.',
        'Lighten your accent slightly for dark mode — vivid colors intensify on dark backgrounds.',
        'Check secondary text contrast in dark mode — it can fall below threshold even if primary text passes.',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why is simple inversion not a reliable dark mode strategy?',
      choices: [
        { id: 'a', label: 'CSS cannot invert values', isCorrect: false, explanation: 'CSS can invert values — that is not the problem.' },
        { id: 'b', label: 'Inverted colors never pass contrast', isCorrect: false, explanation: 'Inverted colors can pass contrast — but they often fail for structural reasons.' },
        { id: 'c', label: 'Inverted values often collapse surface separation, create harsh extremes, and can break semantic meaning', isCorrect: true, explanation: 'A value that was light on dark may invert to something too similar to another role.' },
        { id: 'd', label: 'Users dislike inverted themes', isCorrect: false, explanation: 'User preference is not the reason inversion fails technically.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why might a saturated accent color need adjustment in dark mode?',
      choices: [
        { id: 'a', label: 'Colors always need to match exactly across modes', isCorrect: false, explanation: 'Matching exactly across modes is not the goal — visual balance is.' },
        { id: 'b', label: 'Vivid colors appear more intense on dark backgrounds — they can dominate or feel aggressive where they felt balanced in light mode', isCorrect: true, explanation: 'Correct. Dark backgrounds amplify perceived saturation, requiring accent colors to be softened.' },
        { id: 'c', label: 'Dark mode requires desaturated colors', isCorrect: false, explanation: 'Dark mode does not require full desaturation — just appropriate adjustment.' },
        { id: 'd', label: 'Browsers change color values in dark mode', isCorrect: false, explanation: 'Browsers do not change color values — perception changes due to the dark context.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What makes surfaces in a dark theme \'separated\'?',
      choices: [
        { id: 'a', label: 'Using slightly different dark values for each surface layer — page, card, raised panel — so depth and hierarchy remain visible', isCorrect: true, explanation: 'Correct. Subtle lightness differences between surface layers create depth without being jarring.' },
        { id: 'b', label: 'Adding white borders to each layer', isCorrect: false, explanation: 'Borders can help, but tonal separation is the primary technique for dark surfaces.' },
        { id: 'c', label: 'Inverting the light theme surface values', isCorrect: false, explanation: 'Inversion rarely produces good dark surface separation.' },
        { id: 'd', label: 'Using pure black for all backgrounds', isCorrect: false, explanation: 'Pure black for all backgrounds eliminates all separation between layers.' },
      ],
    },
  ],
  keyPoints: [
    'Dark mode is not light-mode inversion — surfaces, text, and accents all need intentional dark-theme values.',
    'Use very dark but not pure-black backgrounds (e.g. #0f172a) to allow card and panel layers to appear above.',
    'Text should be soft off-white in dark mode, not pure white, to reduce glare and halation.',
    'Accent colors often need lighter or less-saturated values in dark mode — vivid colors intensify on dark surfaces.',
    'Check contrast in both modes separately — what passes in light mode may fail in dark mode.',
  ],
};
