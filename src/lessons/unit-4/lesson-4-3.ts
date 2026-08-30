import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';
import { INTERFACE_GALLERY_PREVIEWS } from '../preview-accessibility.ts';

export const lesson4_3: LessonConfig = {
  id: 'u4-l3',
  unitId: 'unit-4',
  title: LESSON_TITLES['u4-l3'],
  interactionType: 'interface-gallery',
  reviewTags: ['cvd', 'simulation', 'interface-review'],
  steps: [
    {
      text: 'Simulation tools apply a color transformation to approximate how an interface may appear to someone with a particular type of color vision deficiency. A simulation cannot represent every individual\'s vision, but it can reveal design problems caused by relying on color distinctions.',
    },
    {
      text: 'Under protan and deutan simulation, some red and green hues become hard to tell apart. In the gallery, the Active and Error badge backgrounds may look alike, but their text labels identify each status. A status system without those labels or another cue can become ambiguous.',
      panel: { type: 'interface-gallery-preview', simulation: 'protanopia', accessibility: INTERFACE_GALLERY_PREVIEWS.protanopia },
    },
    {
      text: 'Under tritan simulation, some blue and green hues become hard to tell apart. Some yellow hues can also look similar to reds or pinks. Interface elements that rely only on those hue differences can become ambiguous.',
      panel: { type: 'interface-gallery-preview', simulation: 'tritanopia', accessibility: INTERFACE_GALLERY_PREVIEWS.tritanopia },
    },
    {
      text: 'Charts and maps can rely on hue to distinguish data. If a bar chart uses only green and red to identify two series, a protan or deutan simulation may make the series hard to tell apart. Body text can remain readable when it has enough lightness contrast with its background and does not use hue alone to convey meaning.',
      panel: { type: 'interface-gallery-preview', simulation: 'deuteranopia', accessibility: INTERFACE_GALLERY_PREVIEWS.deuteranopia },
    },
    {
      text: 'Keep color, but add cues such as icons, labels, patterns, or shapes that carry the same information. These cues preserve the information when a viewer cannot distinguish the colors.',
    },
  ],
  challenge: {
      prompt:
        'Complete one simulation-review stage by comparing the original interface with all four simulation modes.',
      hints: [
        'Start with Deuteranopia and compare the status indicators. Which ones look similar?',
        'The complete achromatopsia simulation removes hue differences. Which elements still communicate their meaning?',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is a simulation tool useful for in inclusive design?',
      choices: [
        {
          stableId: 'diagnosing-which-users-have-cvd',
          label: 'Diagnosing which users have color vision deficiency',
          isCorrect: false,
          explanation:
            'Simulation helps designers review an interface. It does not identify whether a user has color vision deficiency.',
        },
        {
          stableId: 'revealing-which-interface-areas-have-color-only-meaning-under-cv',
          label: 'Revealing which interface areas rely on color alone',
          isCorrect: true,
          explanation:
            'Simulation shows which elements become ambiguous when color distinctions are reduced. Those elements need another cue, such as a label, icon, pattern, or shape.',
        },
        {
          stableId: 'checking-whether-colors-are-within-the-srgb-gamut',
          label: 'Checking whether colors are within the sRGB gamut',
          isCorrect: false,
          explanation:
            'Gamut checking is a separate concern from color vision deficiency simulation.',
        },
        {
          stableId: 'automatically-fixing-all-color-accessibility-problems',
          label: 'Automatically fixing all color-accessibility problems',
          isCorrect: false,
          explanation:
            'Simulation can expose a color-dependent design problem, but it does not change the design.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which types of color vision deficiency affect red-green distinctions?',
      choices: [
        {
          stableId: 'tritan-types-only',
          label: 'Tritan types only',
          isCorrect: false,
          explanation:
            'Tritan types affect blue-yellow distinctions, not red-green.',
        },
        {
          stableId: 'protan-and-deutan-types',
          label: 'Protan and deutan types',
          isCorrect: true,
          explanation:
            'Protan and deutan types affect different cone responses, but both can make red and green harder to distinguish.',
        },
        {
          stableId: 'achromatopsia-only',
          label: 'Achromatopsia only',
          isCorrect: false,
          explanation:
            'Achromatopsia causes very limited or no color perception. Protan and deutan types specifically affect red-green distinctions.',
        },
        {
          stableId: 'all-cvd-types-equally',
          label: 'All types of color vision deficiency equally',
          isCorrect: false,
          explanation:
            'Different types of color vision deficiency affect different axes. Protan and deutan types affect red-green distinctions; tritan types affect blue-yellow distinctions.',
        },
      ],
    },
    {
      id: 'q3',
      prompt:
        'Why might a color-coded chart be riskier than a text paragraph under color vision deficiency simulation?',
      choices: [
        {
          stableId: 'charts-use-more-colors-than-paragraphs-so-they-are-always-harder',
          label:
            'Charts usually contain more colors than text, so the number of colors is the main risk',
          isCorrect: false,
          explanation:
            'Using more colors is only a problem if those colors are the sole differentiating signal.',
        },
        {
          stableId: 'charts-use-color-as-the-primary-channel-for-data-distinction-whi',
          label:
            'A chart may use hue as the only way to distinguish data, while body text can remain readable through lightness contrast',
          isCorrect: true,
          explanation:
            'Chart series are often differentiated only by hue. Under color vision deficiency simulation, those hues may converge. Text paragraphs primarily use lightness contrast, which simulation does not eliminate.',
        },
        {
          stableId: 'text-paragraphs-are-automatically-accessible-so-charts-are-alway',
          label:
            'Paragraphs use fewer colors than charts, so their accessibility does not need to be checked',
          isCorrect: false,
          explanation:
            'Text can also have color-only meaning problems (e.g., colored error text). The specific issue with charts is their reliance on hue alone for series identity.',
        },
        {
          stableId: 'charts-always-have-bad-contrast-ratios',
          label: 'Chart colors only need contrast with the background, not with one another',
          isCorrect: false,
          explanation:
            'Background contrast can make each series visible, but the series can still be confused with one another. Labels, patterns, or shapes distinguish the series without relying on color.',
        },
      ],
    },
  ],
  keyPoints: [
    'Color vision deficiency simulation is an approximation that helps designers see which interface areas become ambiguous under reduced color distinction.',
    'Protan and deutan simulations can make some red and green hues hard to tell apart. Tritan simulation can make some blue and green hues hard to tell apart.',
    'Charts, maps, and status indicators can become ambiguous when hue is the only way to distinguish their meaning.',
    'Icons, labels, patterns, and shapes preserve information when a viewer cannot distinguish the colors.',
    'Simulation can expose a color-dependent design problem, but it does not change the design.',
  ],
};
