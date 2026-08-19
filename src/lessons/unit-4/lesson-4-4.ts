import type { LessonConfig } from '../../types/lesson.ts';

export const lesson4_4: LessonConfig = {
  id: 'u4-l4',
  unitId: 'unit-4',
  title: 'What Color Perception Means for Design',
  interactionType: 'color-only-detector',
  glossaryTerms: [
    'color-dependent meaning',
    'ambiguous element',
    'perceptual robustness',
  ],
  reviewTags: ['color-alone', 'observation', 'accessibility', 'ui-patterns'],
  steps: [
    {
      id: 's1',
      text: 'Now that you understand how CVD changes what people see, look at common interface patterns through that lens. Some designs survive color perception differences just fine. Others fall apart — and the reason is almost always the same: the meaning lives entirely in the hue.',
    },
    {
      id: 's2',
      text: 'Status indicators are a classic example. A red dot for error and a green dot for success may look distinct to most people, but under deuteranopia simulation those two hues converge. Without any other visual signal, the dots become indistinguishable.',
      highlights: ['ambiguous element'],
    },
    {
      id: 's3',
      text: 'Form fields that signal errors with only a red border face the same problem. The color shift may be invisible or subtle under certain CVD types. Diagnose the failure first: error meaning is present, but encoded in a single fragile channel.',
    },
    {
      id: 's4',
      text: 'Charts and data visualizations are especially vulnerable. When series are distinguished only by hue, a CVD simulation can make two or three series look identical. This is not just a theoretical concern — it directly blocks comprehension.',
      highlights: ['color-dependent meaning'],
    },
    {
      id: 's5',
      text: 'Notice the pattern: designs that rely on a single visual channel (hue) to carry meaning are fragile. Your outcome here is diagnostic: name where meaning depends on hue alone and why that creates ambiguity. In the next unit, you will learn the repair techniques and guidelines for building robust alternatives.',
      highlights: ['perceptual robustness'],
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt:
        'Review the six UI examples. Click the ones where meaning would become ambiguous if the viewer could not distinguish the hues used.',
      type: 'identify-problem',
      hints: [
        'Imagine the colors shift so that reds and greens look the same. Which elements lose their meaning?',
        'Three of the six examples rely on hue alone. The others have a backup signal.',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why do status dots with only red and green hues break down under CVD?',
      choices: [
        {
          id: 'a',
          label: 'Red and green are ugly together',
          isCorrect: false,
          explanation:
            'Aesthetics are not the issue. The problem is that deuteranopia and protanopia make red and green look very similar, removing the only distinction.',
        },
        {
          id: 'b',
          label:
            'Under protan and deutan CVD, those hues converge and the dots become indistinguishable',
          isCorrect: true,
          explanation:
            'When the sole distinguishing feature is a red-green hue difference, CVD that affects red-green perception removes that distinction entirely.',
        },
        {
          id: 'c',
          label: 'Screens cannot display red and green at the same time',
          isCorrect: false,
          explanation:
            'Screens display both fine. The issue is how certain visual systems perceive them, not how the display produces them.',
        },
        {
          id: 'd',
          label: 'The dots are too small to see color clearly',
          isCorrect: false,
          explanation:
            'Size can affect perception, but the core issue is that hue is the only differentiator and that hue difference disappears under certain CVD types.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What makes a chart series robust against color perception differences?',
      choices: [
        {
          id: 'a',
          label: 'Using only blue and orange, since those are safe for everyone',
          isCorrect: false,
          explanation:
            'No two-color pair is universally safe across all CVD types. Robustness comes from pairing color with other visual cues.',
        },
        {
          id: 'b',
          label:
            'Pairing hue with other visual signals like labels, patterns, or line styles',
          isCorrect: true,
          explanation:
            'When color is not the only way to tell series apart, the chart remains comprehensible even when hue differences are reduced or lost.',
        },
        {
          id: 'c',
          label: 'Using maximum saturation for every series',
          isCorrect: false,
          explanation:
            'High saturation does not solve the problem — two saturated colors can still look the same under CVD.',
        },
        {
          id: 'd',
          label: 'Avoiding color entirely and using only gray shades',
          isCorrect: false,
          explanation:
            'Removing color entirely is unnecessarily restrictive. The goal is pairing color with other cues, not eliminating it.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'What is the common pattern behind designs that break down when color perception varies?',
      choices: [
        {
          id: 'a',
          label: 'They use too many colors',
          isCorrect: false,
          explanation:
            'The number of colors is not the issue. Even two colors can fail if hue is the only distinguishing signal.',
        },
        {
          id: 'b',
          label:
            'They rely on hue difference as the only visual signal carrying meaning',
          isCorrect: true,
          explanation:
            'When meaning lives entirely in hue and that hue distinction is lost, nothing else communicates the information.',
        },
        {
          id: 'c',
          label: 'They do not use enough contrast',
          isCorrect: false,
          explanation:
            'Contrast is a related but separate concern. An element can have good lightness contrast but still rely on hue alone for its meaning.',
        },
        {
          id: 'd',
          label: 'They use old-fashioned color choices',
          isCorrect: false,
          explanation:
            'The failure is structural, not aesthetic. Modern and traditional palettes alike can carry meaning only through hue.',
        },
      ],
    },
  ],
  keyPoints: [
    'Designs that rely on hue alone to carry meaning are fragile — they break when color perception varies.',
    'Status indicators, form validation, and chart series are the most common patterns that depend on hue difference.',
    'Under protan and deutan simulation, red-green distinctions collapse; under tritan, blue-yellow distinctions collapse.',
    'This lesson is about diagnosis: identify where meaning is hue-only and where ambiguity appears.',
    'Noticing where color carries meaning is the first step; the next unit covers concrete repair methods.',
  ],
};
