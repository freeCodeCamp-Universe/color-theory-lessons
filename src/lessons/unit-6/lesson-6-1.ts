import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_1: LessonConfig = {
  id: 'u6-l1', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l1'],
  interactionType: 'system-comparison',
  reviewTags: ['color-systems', 'roles', 'consistency'],
  steps: [
    { text: 'A designer picking a new color for every button, card, and state creates an interface that slowly becomes inconsistent. When the same blue means \'primary action\' on one screen and \'informational note\' on another, users lose confidence.' },
    { text: 'Unit 3 covered assigning roles in a single interface. Here, the scope expands: a color system governs those roles across many screens, flows, and teams so meaning stays stable product-wide.' },
    { text: 'System-level failures are usually governance failures: one role used for two meanings, two roles used for one meaning, or local overrides that drift from shared tokens. Your job in this unit is to detect and correct those patterns early.' },
    { text: 'A minimal system does not need to be large. Even a compact set of 8–12 roles can support a full product when each role has a clear boundary and change decisions are applied consistently.' },
    { text: 'The comparison tool shows two versions of the same interface: one with ad-hoc color choices, and one with a consistent role-based system. Click the inconsistencies in the ad-hoc version to reveal what broke and why.' },
  ],
  challenge: {
      prompt: 'Identify every visual inconsistency in the ad-hoc interface version and explain which semantic role assignment would fix it.',
      hints: [
        'Look for: same element with different colors on different screens, accent used for both interactive and decorative purposes, success and info colors that are too similar.',
        'Each inconsistency can be traced back to a missing role or a role used for two different purposes.',
        'A good system has one clear answer for "what color should this button be?"',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What is the main advantage of semantic color roles over storing decisions as hex values?',
      choices: [
        { stableId: 'hex-values-are-harder-to-type', label: 'Hex values are harder to type', isCorrect: false, explanation: 'Ease of typing is not the reason semantic roles are used.' },
        { stableId: 'semantic-roles-describe-what-a-color-does-making-decisions-reusa', label: 'Semantic roles describe what a color does, making decisions reusable and product-consistent', isCorrect: true, explanation: 'Correct. \'action-primary\' tells the whole team what that color is for, regardless of its current hex value.' },
        { stableId: 'semantic-roles-use-less-memory', label: 'Semantic roles use less memory', isCorrect: false, explanation: 'Memory usage is not affected by how color names are organized.' },
        { stableId: 'hex-values-cannot-be-changed-later', label: 'Hex values cannot be changed later', isCorrect: false, explanation: 'Hex values can always be changed — that is not the advantage of semantic roles.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A product uses the same bright blue for primary buttons, informational callouts, and decorative dividers. What is the risk?',
      choices: [
        { stableId: 'the-blue-may-go-out-of-fashion', label: 'The blue may go out of fashion', isCorrect: false, explanation: 'Visual trends are not the primary risk here.' },
        { stableId: 'the-blue-carries-too-many-different-meanings-users-cannot-tell-w', label: 'The blue carries too many different meanings — users cannot tell what is interactive and what is decorative', isCorrect: true, explanation: 'Correct. When one color does too many jobs, users cannot tell what is interactive and what is purely visual.' },
        { stableId: 'blue-is-not-accessible', label: 'Blue is not accessible', isCorrect: false, explanation: 'Blue can be accessible — the issue here is overuse and mixed meaning, not the hue itself.' },
        { stableId: 'decorative-elements-should-always-match-buttons', label: 'Decorative elements should always match buttons', isCorrect: false, explanation: 'Decorative elements should generally not match interactive elements — that is the source of the problem.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which name is more useful in a design system?',
      choices: [
        { stableId: '2563eb', label: '#2563EB', isCorrect: false, explanation: 'A hex value tells you the color but not its purpose.' },
        { stableId: 'blue-500', label: 'blue-500', isCorrect: false, explanation: 'A scale name describes position but not function.' },
        { stableId: 'action-primary-bg', label: 'action-primary-bg', isCorrect: true, explanation: 'This tells every designer and developer what the color is for, which prevents misuse and inconsistency.' },
        { stableId: 'accent', label: 'accent', isCorrect: false, explanation: 'Too vague — every component might interpret \'accent\' differently.' },
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
