import type { LessonConfig } from '../../types/lesson.ts';

export const lesson4_3: LessonConfig = {
  id: 'u4-l3',
  unitId: 'unit-4',
  title: 'Seeing Through Simulated Eyes',
  interactionType: 'interface-gallery',
  glossaryTerms: ['protan', 'deutan', 'tritan', 'backup cue', 'redundancy'],
  reviewTags: ['cvd', 'simulation', 'interface-review'],
  steps: [
    {
      text: 'Simulation tools apply a color transformation to show how an interface might appear under a particular CVD type. The result is an approximation — not an exact representation of any individual\'s experience — but it is a fast, practical first check for design problems.',
    },
    {
      text: 'Under protan and deutan simulation, red and green hues converge — becoming hard to tell apart. A traffic-light status system (red = error, green = success) becomes ambiguous. The colors that relied on the red-green axis to carry meaning lose their distinction.',
      panel: { type: 'interface-gallery-preview', simulation: 'protanopia' },
    },
    {
      text: 'Under tritan simulation, blue and yellow converge. A yellow warning badge on a blue interface may become hard to distinguish. Blue links on certain backgrounds can lose their visual contrast.',
      panel: { type: 'interface-gallery-preview', simulation: 'tritanopia' },
    },
    {
      text: 'Charts and maps are especially at risk. When a bar chart uses only green and red to distinguish series, protan or deutan simulation may make both bars look the same. Text paragraphs are usually less affected because they rely on lightness contrast, not hue distinction.',
      panel: { type: 'interface-gallery-preview', simulation: 'deuteranopia' },
    },
    {
      text: 'The solution is not to avoid color — it is to add backup cues: icons, labels, patterns, or shapes that carry the same meaning. Redundancy means meaning survives even when color distinction is reduced.',
    },
  ],
  challenge: {
      prompt:
        'Switch the interface gallery through all four simulation modes. Explore each one and identify which elements become hard to distinguish.',
      hints: [
        'Switch to Deuteranopia first — it is the most common type. Notice which status indicators look similar.',
        'Under Achromatopsia, only lightness differences remain. Which elements still have meaning?',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is a simulation tool useful for in inclusive design?',
      choices: [
        {
          id: 'a',
          label: 'Diagnosing which users have CVD',
          isCorrect: false,
          explanation:
            'Simulation is for designers to review their interfaces — it does not identify which users have CVD.',
        },
        {
          id: 'b',
          label:
            'Revealing which interface areas have color-only meaning under CVD conditions',
          isCorrect: true,
          explanation:
            'Simulation helps you see which elements lose their meaning when color distinctions are reduced — making it easier to spot where backup cues are needed.',
        },
        {
          id: 'c',
          label: 'Checking whether colors are within the sRGB gamut',
          isCorrect: false,
          explanation:
            'Gamut checking is a separate concern from CVD simulation.',
        },
        {
          id: 'd',
          label: 'Automatically fixing all color-accessibility problems',
          isCorrect: false,
          explanation:
            'Simulation is a diagnostic tool — it shows problems, but does not fix them automatically.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which CVD types affect red-green distinctions?',
      choices: [
        {
          id: 'a',
          label: 'Tritan types only',
          isCorrect: false,
          explanation:
            'Tritan types affect blue-yellow distinctions, not red-green.',
        },
        {
          id: 'b',
          label: 'Protan and deutan types',
          isCorrect: true,
          explanation:
            'Protan types affect red-sensitive cones and deutan types affect green-sensitive cones — both weaken the ability to distinguish red from green.',
        },
        {
          id: 'c',
          label: 'Achromatopsia only',
          isCorrect: false,
          explanation:
            'Achromatopsia affects all hues, but protan and deutan types specifically target the red-green axis.',
        },
        {
          id: 'd',
          label: 'All CVD types equally',
          isCorrect: false,
          explanation:
            'Different CVD types affect different axes. Protan/deutan affect red-green; tritan affects blue-yellow.',
        },
      ],
    },
    {
      id: 'q3',
      prompt:
        'Why might a color-coded chart be riskier than a text paragraph under CVD simulation?',
      choices: [
        {
          id: 'a',
          label:
            'Charts use more colors than paragraphs, so they are always harder to read',
          isCorrect: false,
          explanation:
            'Using more colors is only a problem if those colors are the sole differentiating signal.',
        },
        {
          id: 'b',
          label:
            'Charts use color as the primary channel for data distinction, while paragraphs rely on lightness contrast for readability',
          isCorrect: true,
          explanation:
            'Chart series are often differentiated only by hue. Under CVD simulation, those hues may converge. Text paragraphs primarily use lightness contrast, which simulation does not eliminate.',
        },
        {
          id: 'c',
          label:
            'Text paragraphs are automatically accessible, so charts are always worse',
          isCorrect: false,
          explanation:
            'Text can also have color-only meaning problems (e.g., colored error text). The specific issue with charts is their reliance on hue alone for series identity.',
        },
        {
          id: 'd',
          label: 'Charts always have bad contrast ratios',
          isCorrect: false,
          explanation:
            'Charts can have perfectly acceptable contrast ratios, yet still fail under CVD simulation if series are distinguished by hue alone.',
        },
      ],
    },
  ],
  keyPoints: [
    'CVD simulation is an approximation that helps designers see which interface areas become ambiguous under reduced color distinction.',
    'Protan and deutan simulations collapse red-green distinctions; tritan simulations collapse blue-yellow distinctions.',
    'Charts, maps, and status indicators that rely only on hue to separate meaning are most at risk under simulation.',
    'Adding backup cues — icons, labels, patterns, or shapes — ensures meaning survives even when color distinction is reduced.',
    'Simulation is a fast first-pass check, not a replacement for testing with real users who have CVD.',
  ],
};
