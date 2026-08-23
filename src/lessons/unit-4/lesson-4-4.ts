import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson4_4: LessonConfig = {
  id: 'u4-l4',
  unitId: 'unit-4',
  title: LESSON_TITLES['u4-l4'],
  interactionType: 'color-only-detector',
  reviewTags: ['color-only', 'observation', 'accessibility', 'ui-patterns'],
  steps: [
    {
      text: 'You have seen how CVD can change color distinctions. Now examine common interface patterns. Some designs pair hue with labels, icons, shapes, or patterns. Others use hue as the only cue, so information can become ambiguous when a viewer cannot distinguish the hues.',
    },
    {
      text: 'Consider status indicators that use a red dot for an error and a green dot for success. Protan or deutan CVD can make those hues difficult to tell apart. Without labels, icons, or other cues, a viewer may not know which status each dot represents.',
    },
    {
      text: 'A form field with only a red border also uses hue as its only error cue. A viewer who does not notice the color change may miss the error state. First identify where the hue carries information and what becomes unclear when that cue is lost.',
    },
    {
      text: 'A chart may use hue as the only way to distinguish its data series. Under a CVD simulation, two or more series can appear alike, which makes their values harder to identify.',
    },
    {
      text: 'Each example has the same problem: hue is the only visual cue carrying information. Your task is to identify where a hue difference communicates meaning and explain what becomes ambiguous when that difference is hard to perceive. Unit 5 covers how to add labels, icons, patterns, and other cues.',
    },
  ],
  challenge: {
      prompt:
        'Review the six interface examples. Select the three that use hue as the only visual cue carrying meaning.',
      hints: [
        'If the hues were hard to distinguish, which examples would lose the information they communicate?',
        'The other three examples pair hue with a label, icon, underline, border, or font weight.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt:
        'Why can red and green status dots become ambiguous for viewers with protan or deutan CVD?',
      choices: [
        {
          stableId: 'red-and-green-are-ugly-together',
          label: 'Red and green are ugly together',
          isCorrect: false,
          explanation:
            'The appearance of the color pair does not determine whether the statuses are distinguishable. Each dot needs a cue that does not depend on hue.',
        },
        {
          stableId: 'under-protan-and-deutan-cvd-those-hues-converge-and-the-dots-bec',
          label:
            'Protan and deutan CVD can reduce the hue difference, and the dots have no other identifying cue',
          isCorrect: true,
          explanation:
            'When a red-green hue difference is the only identifying feature, viewers who cannot distinguish the hues have no other way to identify each status.',
        },
        {
          stableId: 'screens-cannot-display-red-and-green-at-the-same-time',
          label: 'Screens cannot display red and green at the same time',
          isCorrect: false,
          explanation:
            'A screen can display red and green at the same time. Protan and deutan CVD affect how a viewer distinguishes those hues.',
        },
        {
          stableId: 'the-dots-are-too-small-to-see-color-clearly',
          label: 'The dots need to be larger',
          isCorrect: false,
          explanation:
            'Larger dots would still use hue as the only way to identify each status. A label, icon, or shape would add another cue.',
        },
      ],
    },
    {
      id: 'q2',
      prompt:
        'Which design lets viewers identify chart series when hue differences are hard to perceive?',
      choices: [
        {
          stableId: 'using-only-blue-and-orange-since-those-are-safe-for-everyone',
          label: 'Using only blue and orange, since those are safe for everyone',
          isCorrect: false,
          explanation:
            'Blue and orange still use hue as the only cue. Labels, patterns, or line styles provide another way to identify each series.',
        },
        {
          stableId: 'pairing-hue-with-other-visual-signals-like-labels-patterns-or-li',
          label:
            'Pairing hue with other visual signals like labels, patterns, or line styles',
          isCorrect: true,
          explanation:
            'When color is not the only way to tell series apart, the chart remains comprehensible even when hue differences are reduced or lost.',
        },
        {
          stableId: 'using-maximum-saturation-for-every-series',
          label: 'Using maximum saturation for every series',
          isCorrect: false,
          explanation:
            'Two saturated colors can still appear alike under CVD. Saturation does not add a second identifying cue.',
        },
        {
          stableId: 'avoiding-color-entirely-and-using-only-gray-shades',
          label: 'Avoiding color entirely and using only gray shades',
          isCorrect: false,
          explanation:
            'A chart can use color when labels, patterns, line styles, or other cues also identify each series.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'What is the common pattern behind designs that break down when color perception varies?',
      choices: [
        {
          stableId: 'they-use-too-many-colors',
          label: 'They use too many colors',
          isCorrect: false,
          explanation:
            'Two colors are enough to create ambiguity when viewers must distinguish their hues to understand the information.',
        },
        {
          stableId: 'they-rely-on-hue-difference-as-the-only-visual-signal-carrying-m',
          label:
            'They rely on hue difference as the only visual signal carrying meaning',
          isCorrect: true,
          explanation:
            'If a viewer cannot distinguish the hues, no second cue communicates the information.',
        },
        {
          stableId: 'they-do-not-use-enough-contrast',
          label: 'They do not use enough contrast',
          isCorrect: false,
          explanation:
            'Contrast is a related but separate concern. An element can have good lightness contrast but still rely on hue alone for its meaning.',
        },
        {
          stableId: 'they-use-old-fashioned-color-choices',
          label: 'They use old-fashioned color choices',
          isCorrect: false,
          explanation:
            'A palette\'s style does not determine whether the information is accessible. Ambiguity occurs when hue is the only cue.',
        },
      ],
    },
  ],
  keyPoints: [
    'Information can become ambiguous when hue is the only cue carrying meaning and a viewer cannot distinguish the hues.',
    'Status indicators, form validation, and chart series are interface patterns that can depend on hue differences.',
    'An element can have enough lightness contrast with its background and still rely on hue alone for its meaning.',
    'Identify where a hue difference communicates meaning and what becomes unclear when that difference is hard to perceive.',
    'Unit 5 covers how to add labels, icons, patterns, and other cues so hue is not the only cue carrying meaning.',
  ],
};
