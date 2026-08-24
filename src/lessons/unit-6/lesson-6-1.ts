import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_1: LessonConfig = {
  id: 'u6-l1', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l1'],
  interactionType: 'system-comparison',
  reviewTags: ['color-systems', 'roles', 'consistency'],
  steps: [
    { text: 'Choosing a new color for every button, card, and state makes an interface inconsistent. When the same blue represents a primary action on one screen and an informational note on another, color no longer distinguishes those roles.' },
    { text: 'Unit 3 introduced role assignment within one interface. A color system applies those roles across screens and flows so each role keeps the same meaning throughout a product.' },
    { text: 'A color system becomes inconsistent when one role represents two meanings, two roles represent the same meaning, or local overrides replace shared tokens. Your job in this unit is to find and correct these patterns.' },
    { text: 'The number of roles depends on what the product needs. Start with roles that have a defined purpose, then add a role when the interface requires a new meaning that the existing roles do not cover.' },
    { text: 'The comparison tool shows two versions of the same interface: one with ad-hoc color choices and one that uses defined color roles. Click each highlighted area in the ad-hoc version to compare its value with the corresponding role.' },
  ],
  challenge: {
      prompt: 'Find every visual inconsistency in the ad-hoc interface. For each one, the tool will show which role assignment would make the two versions consistent.',
      hints: [
        'Compare the primary action, success badge, card backgrounds, and secondary text in the two versions.',
        'Each highlighted area in the ad-hoc version uses a different value from the corresponding role in the consistent version.',
        'Check all four highlighted areas in the ad-hoc version.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the main advantage of semantic color roles over storing decisions as hex values?',
      choices: [
        { stableId: 'hex-values-are-harder-to-type', label: 'Hex values are harder to type', isCorrect: false, explanation: 'Ease of typing is not the reason semantic roles are used.' },
        { stableId: 'semantic-roles-describe-what-a-color-does-making-decisions-reusa', label: 'Semantic roles describe what a color does, making decisions reusable and product-consistent', isCorrect: true, explanation: 'Correct. A name such as \'action-primary\' identifies the color\'s purpose even when its hex value changes.' },
        { stableId: 'semantic-roles-use-less-memory', label: 'Semantic roles use less memory', isCorrect: false, explanation: 'Reducing memory use is not the purpose of semantic color roles.' },
        { stableId: 'hex-values-cannot-be-changed-later', label: 'Hex values cannot be changed later', isCorrect: false, explanation: 'A hex value can be replaced later. Semantic roles are useful because they document the purpose of a color.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A product uses the same bright blue for primary buttons, informational callouts, and decorative dividers. What is the risk?',
      choices: [
        { stableId: 'the-blue-may-go-out-of-fashion', label: 'The blue may go out of fashion', isCorrect: false, explanation: 'Visual trends are not the primary risk here.' },
        { stableId: 'the-blue-carries-too-many-different-meanings-users-cannot-tell-w', label: 'The blue represents unrelated roles, so color no longer distinguishes interactive elements from decorative ones', isCorrect: true, explanation: 'Correct. Reusing one color for unrelated roles removes the distinction that the color could provide.' },
        { stableId: 'blue-is-not-accessible', label: 'Blue is not accessible', isCorrect: false, explanation: 'Blue is not inherently inaccessible. Its use must provide sufficient contrast, and information cannot rely on blue alone. The problem here is assigning the same blue to unrelated roles.' },
        { stableId: 'decorative-elements-should-always-match-buttons', label: 'Using one blue keeps the interface consistent because the hex value matches', isCorrect: false, explanation: 'Repeating a hex value does not create semantic consistency when the color represents unrelated roles.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which name most clearly identifies a color\'s purpose in a design system?',
      choices: [
        { stableId: '2563eb', label: '#2563EB', isCorrect: false, explanation: 'A hex value tells you the color but not its purpose.' },
        { stableId: 'blue-500', label: 'blue-500', isCorrect: false, explanation: 'A scale name describes position but not function.' },
        { stableId: 'action-primary-bg', label: 'action-primary-bg', isCorrect: true, explanation: 'This name identifies the color as a background for primary actions.' },
        { stableId: 'accent', label: 'accent', isCorrect: false, explanation: 'Without a documented definition, \'accent\' does not identify a specific purpose such as a primary-action background.' },
      ],
    },
  ],
  keyPoints: [
    'Unit 3 taught role assignment in implementation; Unit 6 applies role governance across full products.',
    'System inconsistency usually comes from role drift, overlap, and local overrides rather than single bad color picks.',
    'Consistent role boundaries make interfaces predictable across screens, states, and teams.',
    'A compact role set can scale when governance is clear and changes propagate through shared tokens.',
  ],
};
