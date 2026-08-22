import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson4_2: LessonConfig = {
  id: 'u4-l2',
  unitId: 'unit-4',
  title: LESSON_TITLES['u4-l2'],
  interactionType: 'vision-cards',
  reviewTags: ['cvd', 'perception', 'accessibility'],
  steps: [
    {
      text: 'Color vision deficiency (CVD) is an umbrella term for differences in how people distinguish colors. Cone cells contain light-sensitive molecules called photopigments. This lesson focuses on CVD types that involve differences in these photopigments or in cone function.',
    },
    {
      text: 'Protan, deutan, and tritan categories describe which cone photopigment is affected. Protan types involve the long-wavelength-sensitive (L) cones; deutan types involve the medium-wavelength-sensitive (M) cones; tritan types involve the short-wavelength-sensitive (S) cones. In inherited red-green CVD, "-anomaly" describes altered photopigment sensitivity, while "-anopia" describes loss of function from one cone photopigment.',
      panel: { type: 'vision-cards-preview', expandedNames: ['Protanopia', 'Deuteranopia', 'Tritanopia'] },
    },
    {
      text: 'Deuteranomaly is the most common inherited type of CVD. Red-green CVD as a group occurs in about 1 in 12 males with Northern European ancestry and is less common in many other populations. Inherited tritan types occur in fewer than 1 in 10,000 people.',
      panel: { type: 'vision-cards-preview', expandedNames: ['Deuteranomaly', 'Protanomaly'] },
    },
    {
      text: 'Achromatopsia affects fewer than 1 in 30,000 people. Complete achromatopsia causes a lack of color discrimination because all three cone types lack function. In incomplete achromatopsia, some cone function remains and color discrimination varies. Both forms can also reduce visual acuity and cause sensitivity to light.',
      panel: { type: 'vision-cards-preview', expandedNames: ['Achromatopsia'] },
    },
    {
      text: 'Design for differences in color vision rather than trying to diagnose viewers. You do not know how each user perceives color, so check whether information remains available without a particular color distinction. CVD simulations can reveal risks, but they only approximate users\' experiences.',
    },
  ],
  challenge: {
      prompt:
        'Expand each vision type card to learn about its color effects and a common design risk.',
      hints: [
        'Click a card header to expand it. Each card describes the type, its color effects, and a design risk.',
        'There are six cards: two protan types, two deutan types, tritanopia, and achromatopsia. Expand all of them.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Is color vision deficiency one single condition?',
      choices: [
        {
          stableId: 'yes-all-cvd-is-red-green-color-blindness',
          label: 'Yes, all CVD is red-green color blindness',
          isCorrect: false,
          explanation:
            '"Red-green color blindness" describes protan and deutan types. CVD also includes tritan types and achromatopsia.',
        },
        {
          stableId: 'no-there-are-multiple-types-and-severities-each-affecting-differ',
          label:
            'No, there are multiple types and severities that affect different color distinctions',
          isCorrect: true,
          explanation:
            'CVD includes protan, deutan, tritan, and achromatic types. Within some categories, people can have altered photopigment sensitivity or a loss of function.',
        },
        {
          stableId: 'yes-all-cvd-causes-complete-inability-to-see-any-color',
          label: 'Yes, all CVD causes a complete inability to see any color',
          isCorrect: false,
          explanation:
            'Complete achromatopsia causes a lack of color discrimination. Most CVD types make specific colors harder to distinguish instead of removing all color perception.',
        },
        {
          stableId: 'no-but-all-types-affect-only-the-blue-yellow-axis',
          label: 'No, but all types affect only blue-yellow distinctions',
          isCorrect: false,
          explanation:
            'Tritan types affect blue-yellow, but protan and deutan types affect red-green distinctions. Multiple axes are involved across the different types.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which CVD category specifically affects blue-yellow distinctions?',
      choices: [
        {
          stableId: 'protan-types-protanopia-protanomaly',
          label: 'Protan types (protanopia/protanomaly)',
          isCorrect: false,
          explanation:
            'Protan types involve the L-cone photopigment and affect red-green distinctions.',
        },
        {
          stableId: 'deutan-types-deuteranopia-deuteranomaly',
          label: 'Deutan types (deuteranopia/deuteranomaly)',
          isCorrect: false,
          explanation:
            'Deutan types involve the M-cone photopigment and affect red-green distinctions.',
        },
        {
          stableId: 'tritan-types-tritanopia-tritanomaly',
          label: 'Tritan types (tritanopia/tritanomaly)',
          isCorrect: true,
          explanation:
            'Tritan types involve the S-cone photopigment and make several blue-yellow color distinctions harder.',
        },
        {
          stableId: 'achromatopsia',
          label: 'Achromatopsia',
          isCorrect: false,
          explanation:
            'Achromatopsia can reduce or eliminate color discrimination across the spectrum, not only blue-yellow distinctions.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Why is relying only on your own color perception risky when designing?',
      choices: [
        {
          stableId: 'because-your-monitor-may-not-be-calibrated-correctly',
          label: 'Because your monitor may not be calibrated correctly',
          isCorrect: false,
          explanation:
            'Display calibration can change a screen\'s output, but two people viewing the same display can still perceive its colors differently.',
        },
        {
          stableId: 'because-your-vision-may-not-represent-other-users-experience-cvd',
          label:
            'Because users may perceive colors differently, and CVD is common enough to design for',
          isCorrect: true,
          explanation:
            'Red-green CVD alone affects about 1 in 12 males with Northern European ancestry. You cannot determine a user\'s color perception by looking at them, so information should not depend on everyone distinguishing the same colors.',
        },
        {
          stableId: 'because-design-tools-do-not-show-accurate-colors',
          label: 'Because design tools do not show accurate colors',
          isCorrect: false,
          explanation:
            'A design tool can display the requested color values accurately while users still perceive those colors differently.',
        },
        {
          stableId: 'because-color-perception-degrades-with-age-for-everyone',
          label: 'Because color perception degrades with age for everyone',
          isCorrect: false,
          explanation:
            'Changes in the eye with age can affect color perception, but people of any age can have CVD. A design should work when users distinguish colors differently.',
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
