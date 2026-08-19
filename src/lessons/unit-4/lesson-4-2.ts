import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson4_2: LessonConfig = {
  id: 'u4-l2',
  unitId: 'unit-4',
  title: LESSON_TITLES['u4-l2'],
  interactionType: 'vision-cards',
  glossaryTerms: [
    'color vision deficiency',
    'protanopia',
    'protanomaly',
    'deuteranopia',
    'deuteranomaly',
    'tritanopia',
    'tritanomaly',
    'achromatopsia',
    'simulation',
  ],
  reviewTags: ['CVD', 'perception', 'accessibility'],
  steps: [
    {
      text: 'Color vision deficiency (CVD) refers to differences in how certain color distinctions are perceived, due to variation in cone function. It is not a single condition — there are multiple types and a range of severities.',
    },
    {
      text: 'CVD is grouped by which cone type is affected. Protan types involve the red-sensitive cone; deutan types involve the green-sensitive cone; tritan types involve the blue-sensitive cone. The suffix "-opia" indicates absence or very low function; "-anomaly" indicates reduced sensitivity.',
      panel: { type: 'vision-cards-preview', expandedNames: ['Protanopia', 'Deuteranopia', 'Tritanopia'] },
    },
    {
      text: 'Deuteranomaly — reduced green cone sensitivity — is the most common form of CVD, affecting roughly 5–8% of males with Northern European ancestry. Deuteranopia (absent green cones) and protanopia (absent red cones) are less common. Tritan types are rare.',
      panel: { type: 'vision-cards-preview', expandedNames: ['Deuteranomaly', 'Protanomaly'] },
    },
    {
      text: 'Achromatopsia is a rare condition (affecting roughly 1 in 30,000 people) where very limited or no cone function is present. Individuals with achromatopsia perceive only brightness — all hues appear as shades of gray. This is distinct from the partial cone differences that characterize most CVD types.',
      panel: { type: 'vision-cards-preview', expandedNames: ['Achromatopsia'] },
    },
    {
      text: 'As a designer, your goal is robustness, not diagnosis. You cannot know which viewers have CVD or which type — and the percentages are significant enough that assuming all viewers share your color experience is risky. Simulation tools help you see how your interface looks under various CVD conditions.',
    },
  ],
  challenge: {
      prompt:
        'Expand each vision type card to learn about the condition, the common design risk, and which colors are most affected.',
      hints: [
        'Click a card header to expand it. Each card shows a description, a design risk, and the affected colors.',
        'There are six card types — protan, deutan, tritan, and achromatopsia variants. Expand all of them.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Is color vision deficiency one single condition?',
      choices: [
        {
          id: 'a',
          label: 'Yes — all CVD is red-green color blindness',
          isCorrect: false,
          explanation:
            '"Red-green color blindness" is a common simplification, but CVD includes multiple types affecting different cone types, plus tritan types affecting blue-yellow, and achromatopsia affecting all hues.',
        },
        {
          id: 'b',
          label:
            'No — there are multiple types and severities, each affecting different color distinctions',
          isCorrect: true,
          explanation:
            'CVD includes protan, deutan, tritan, and achromatic types, each with absent (-opia) and reduced (-anomaly) severity variants.',
        },
        {
          id: 'c',
          label: 'Yes — all CVD causes complete inability to see any color',
          isCorrect: false,
          explanation:
            'Only achromatopsia involves very limited hue perception. Most CVD types reduce or shift specific color distinctions, not all color perception.',
        },
        {
          id: 'd',
          label: 'No — but all types affect only the blue-yellow axis',
          isCorrect: false,
          explanation:
            'Tritan types affect blue-yellow, but protan and deutan types affect red-green distinctions. Multiple axes are involved across the different types.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which CVD type involves difficulty with blue-yellow distinctions?',
      choices: [
        {
          id: 'a',
          label: 'Protan types (protanopia/protanomaly)',
          isCorrect: false,
          explanation:
            'Protan types affect the red-sensitive cone, weakening red-green distinctions.',
        },
        {
          id: 'b',
          label: 'Deutan types (deuteranopia/deuteranomaly)',
          isCorrect: false,
          explanation:
            'Deutan types affect the green-sensitive cone, also weakening red-green distinctions.',
        },
        {
          id: 'c',
          label: 'Tritan types (tritanopia/tritanomaly)',
          isCorrect: true,
          explanation:
            'Tritan types affect the blue-sensitive cone. Blue and yellow become harder to distinguish.',
        },
        {
          id: 'd',
          label: 'Achromatopsia',
          isCorrect: false,
          explanation:
            'Achromatopsia involves very limited cone function overall, not specifically blue-yellow.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Why is relying only on your own color perception risky when designing?',
      choices: [
        {
          id: 'a',
          label: 'Because your monitor may not be calibrated correctly',
          isCorrect: false,
          explanation:
            'Display calibration is a factor, but the core issue is that your visual system may not represent other users\' experience.',
        },
        {
          id: 'b',
          label:
            'Because your vision may not represent other users\' experience — CVD is common enough to design for',
          isCorrect: true,
          explanation:
            'CVD affects a significant percentage of users. Designing only for your own perception excludes users whose experience differs — and you cannot tell which users they are.',
        },
        {
          id: 'c',
          label: 'Because design tools do not show accurate colors',
          isCorrect: false,
          explanation:
            'Modern design tools generally show accurate colors. The issue is perceptual variation across users.',
        },
        {
          id: 'd',
          label: 'Because color perception degrades with age for everyone',
          isCorrect: false,
          explanation:
            'While optical properties do change with age, the main reason is that CVD is a significant population-level variation in color experience.',
        },
      ],
    },
  ],
  keyPoints: [
    'Color vision deficiency is not one condition — it includes protan, deutan, and tritan types, each with absent and reduced-sensitivity variants.',
    'Protan types affect red-sensitive cones; deutan types affect green-sensitive cones; tritan types affect blue-sensitive cones.',
    'Deuteranomaly (reduced green sensitivity) is the most common form of CVD.',
    'Achromatopsia is rare and involves very limited cone function — hues appear as shades of gray.',
    'Your goal as a designer is robustness, not diagnosis: make interfaces that work for a range of color experiences, not just your own.',
  ],
};
