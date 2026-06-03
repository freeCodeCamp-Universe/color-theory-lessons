import type { LessonConfig } from '../../types/lesson.ts';

export const lesson3_3: LessonConfig = {
  id: 'u3-l3',
  unitId: 'unit-3',
  title: 'HSL and HSLA',
  description:
    'Explore HSL as a designer-friendly color format by manipulating hue, saturation, and lightness while seeing HEX and RGB update in real time.',
  learningGoal:
    'Use HSL controls to make deliberate color adjustments and explain when HSL is more practical than RGB.',
  estimatedMinutes: 16,
  prerequisites: ['u3-l2'],
  conceptsIntroduced: [
    'HSL notation',
    'HSLA',
    'alpha',
    'tonal variation',
    'color family',
  ],
  interactionType: 'hsl-playground',
  glossaryTerms: ['HSL', 'HSLA', 'alpha', 'color family', 'tonal variation'],
  reviewTags: ['formats', 'HSL', 'design-adjustment'],
  steps: [
    {
      id: 's1',
      text: 'Unit 1 introduced hue, saturation, and lightness as visible properties. HSL turns those same properties into a practical color format you can use in code: hsl(hue, saturation%, lightness%).',
      highlights: ['HSL'],
    },
    {
      id: 's2',
      text: 'Hue is a degree on the color wheel (0-360). Saturation is a percentage — 0% is fully muted gray, 100% is fully vivid. Lightness is also a percentage — 0% is black, 100% is white, 50% is the purest version of that hue.',
      highlights: ['hue', 'saturation', 'lightness'],
      panel: { type: 'hsl-playground-preview' },
    },
    {
      id: 's3',
      text: 'HSL is often easier for design tasks because each property maps to a visible change. Want to mute a color? Lower saturation. Want a lighter version? Raise lightness. Want a nearby color? Shift hue. In RGB, these same adjustments often require changing multiple channels.',
      panel: { type: 'hsl-playground-preview' },
    },
    {
      id: 's4',
      text: 'HSLA adds an alpha value for transparency, just like RGBA. hsla(220, 60%, 50%, 0.5) is that blue at 50% opacity. The "A" stands for alpha in both cases.',
      highlights: ['HSLA', 'alpha'],
    },
    {
      id: 's5',
      text: 'The playground shows the same color in all three formats simultaneously — HSL, HEX, and RGB. Adjust the sliders and watch how each format updates. Then match three target colors using HSL controls.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt:
        'Match three target colors using the HSL sliders. All three formats update live so you can see how your HSL changes translate to HEX and RGB.',
      type: 'match-target',
      hints: [
        'Start with hue to get the right color family, then adjust saturation and lightness.',
        'A very muted target means low saturation. A very light target means high lightness.',
        'If the target looks gray, saturation is near zero — focus on lightness to match brightness.',
      ],
      successCriteria: 'All three targets matched.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which HSL property would you change to make a vivid blue more muted?',
      choices: [
        {
          id: 'a',
          label: 'Hue',
          isCorrect: false,
          explanation:
            'Hue shifts the color family. To mute the color without changing its family, lower saturation.',
        },
        {
          id: 'b',
          label: 'Saturation',
          isCorrect: true,
          explanation:
            'Lowering saturation moves the color toward gray, making it more muted while keeping the same hue and lightness.',
        },
        {
          id: 'c',
          label: 'Lightness',
          isCorrect: false,
          explanation:
            'Lightness changes how light or dark the color is, not how vivid or muted it appears.',
        },
        {
          id: 'd',
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
          id: 'a',
          label: 'When you want to create a lighter version of an accent color',
          isCorrect: true,
          explanation:
            'In HSL, you raise lightness. In RGB, you would need to increase all three channels in a balanced way — less intuitive and harder to predict.',
        },
        {
          id: 'b',
          label: 'When you need to set a specific red channel value',
          isCorrect: false,
          explanation:
            'RGB gives direct access to individual channels. If the task is "change the red channel," RGB is the more direct tool.',
        },
        {
          id: 'c',
          label: 'HSL is always more practical than RGB',
          isCorrect: false,
          explanation:
            'Neither format is universally better. HSL is easier for hue, saturation, and lightness tasks; RGB is more direct for channel-specific adjustments.',
        },
        {
          id: 'd',
          label: 'When you want to convert a color to grayscale',
          isCorrect: false,
          explanation:
            'Setting saturation to 0 in HSL does produce a gray, but this is a specific trick, not the general reason HSL is practical for design work.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'What does the A in HSLA represent?',
      choices: [
        {
          id: 'a',
          label: 'Accent — the emphasis level of the color',
          isCorrect: false,
          explanation: 'The A stands for alpha, which controls opacity/transparency.',
        },
        {
          id: 'b',
          label: 'Alpha — the opacity of the color from 0 (transparent) to 1 (opaque)',
          isCorrect: true,
          explanation:
            'Alpha controls how transparent or opaque the color is. It works the same way in HSLA as in RGBA.',
        },
        {
          id: 'c',
          label: 'Angle — the rotation of hue on the color wheel',
          isCorrect: false,
          explanation:
            'Hue is already expressed as a degree (angle). The A specifically adds transparency control.',
        },
        {
          id: 'd',
          label: 'Amplitude — how strong the color signal is',
          isCorrect: false,
          explanation: 'The A stands for alpha. There is no amplitude property in CSS color formats.',
        },
      ],
    },
  ],
  keyPoints: [
    'HSL describes color as hue (0-360°), saturation (0-100%), and lightness (0-100%) — mapping directly to how designers describe visible changes.',
    'HSL is often easier than RGB for design tasks: shift hue for a new color family, lower saturation to mute, raise lightness to brighten.',
    'RGB is more direct when you need to control individual light channels; neither format is universally better.',
    'HSLA adds alpha (0-1) for transparency, working exactly like the alpha in RGBA.',
    'The same color can be viewed in HSL, HEX, and RGB simultaneously — they are interconvertible representations of the same visual result.',
  ],
};
