import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_7: LessonConfig = {
  id: 'u6-l7', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l7'],
  interactionType: 'system-stress',
  reviewTags: ['review', 'color-systems', 'capstone-prep', 'stress-test'],
  steps: [
    {
      text: 'A stress test checks a color system in contexts that place different demands on its roles. A palette that works in a marketing mockup may lose hierarchy in dark mode, make chart series hard to distinguish, or hide alert differences under color vision deficiency simulation.',
    },
    {
      text: 'Apply your system to five contexts: light mode, dark mode, chart view, alert stack, and simulated color vision deficiency. These contexts test surfaces, text hierarchy, semantic states, data encoding, and distinctions affected by color perception.',
    },
    {
      text: 'A consistency audit checks how roles and tokens are used across the system. Look for role drift (one role used for two meanings), role duplication (two roles used for one meaning), and local values that bypass shared tokens.',
    },
    {
      text: 'Before shipping, check hierarchy (can you identify the primary action?), text contrast (does normal text meet 4.5:1 and large text meet 3:1?), semantic clarity (can you distinguish success, warning, and error without color alone?), dark mode (does each role retain its purpose?), chart readability (can you distinguish the series?), color vision deficiency simulation (do labels, shapes, or patterns preserve meaning?), and token propagation (does changing a token update every context that uses it?).',
    },
    {
      text: 'This exercise draws on Units 1 through 6. Use visual hierarchy, the additive color model, color formats, color perception, accessibility checks, and semantic roles to evaluate the system in each context.',
    },
  ],
  challenge: {
      prompt: 'Complete two stages in order: find the weaknesses across all five contexts, then classify each finding.',
      hints: [
        'Toggle between all five contexts before marking anything. The same issue might appear in multiple views.',
        'Ask: does hierarchy still work? Are states distinct? Is anything too loud or too faint?',
        'For each issue, classify the root cause: role drift, missing role definition, or token override.',
        'Check the chart and alert views for differences that become harder to distinguish under color vision deficiency simulation.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What can a multi-context stress test reveal that a single mockup cannot?',
      choices: [
        { stableId: 'a-single-mockup-is-sufficient-if-the-palette-looks-good', label: 'A single mockup is sufficient if the palette looks good', isCorrect: false, explanation: 'One mockup cannot show whether roles work in dark mode, charts, alerts, and color vision deficiency simulation.' },
        { stableId: 'different-contexts-exercise-different-roles-weaknesses-invisible', label: 'Problems with roles that appear only in dark mode, charts, alerts, or color vision deficiency simulation', isCorrect: true, explanation: 'Testing modes, chart views, alerts, and color vision deficiency simulation exposes problems that a single mockup does not show.' },
        { stableId: 'clients-prefer-seeing-multiple-mockups', label: 'Clients prefer seeing multiple mockups', isCorrect: false, explanation: 'Client presentation preferences do not test how color roles function across contexts.' },
        { stableId: 'each-context-requires-a-completely-different-palette', label: 'Each context requires a completely different palette', isCorrect: false, explanation: 'The same semantic roles should persist across contexts, with token values adapted where needed.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'What does a consistency audit check?',
      choices: [
        { stableId: 'whether-all-hex-values-are-unique', label: 'Whether all hex values are unique', isCorrect: false, explanation: 'Roles can share a hex value when their meanings are compatible. The audit checks how roles and tokens are used.' },
        { stableId: 'whether-roles-and-tokens-are-applied-consistently-one-role-per-m', label: 'Whether each meaning has one role, each role has one meaning, and token changes propagate across contexts', isCorrect: true, explanation: 'Each meaning should map to one role, each role should keep one meaning, and token changes should reach every component that uses them.' },
        { stableId: 'whether-the-palette-uses-fewer-than-ten-colors', label: 'Whether the palette uses fewer than ten colors', isCorrect: false, explanation: 'Color count is not what a consistency audit measures.' },
        { stableId: 'whether-the-design-matches-a-trend-report', label: 'Whether the design matches a trend report', isCorrect: false, explanation: 'Trend alignment is not an aspect of consistency auditing.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What should a designer verify before calling a color system finished?',
      choices: [
        { stableId: 'whether-the-hex-values-are-memorable', label: 'Whether the hex values are memorable', isCorrect: false, explanation: 'Memorability of hex values is not a quality criterion.' },
        { stableId: 'whether-the-colors-look-good-in-a-brand-presentation', label: 'Whether the colors look good in a brand presentation', isCorrect: false, explanation: 'A brand presentation does not show whether the system works in dark mode, charts, alerts, or color vision deficiency simulation.' },
        { stableId: 'whether-the-design-team-likes-the-hues', label: 'Whether the design team likes the hues', isCorrect: false, explanation: 'The team\'s hue preferences do not test contrast, hierarchy, or semantic meaning.' },
        { stableId: 'hierarchy-readability-semantic-clarity-dark-mode-chart-readabili', label: 'Hierarchy, text contrast, semantic clarity, dark mode, chart readability, and non-color cues', isCorrect: true, explanation: 'Review the system\'s hierarchy, text contrast, semantic states, themes, charts, and non-color cues.' },
      ],
    },
  ],
  keyPoints: [
    'Stress-test roles in light mode, dark mode, charts, alerts, and color vision deficiency simulation instead of relying on a single mockup.',
    'Audit roles and meanings for one-to-one mapping, then check components for local values outside the token system.',
    'Before release, verify hierarchy, required text contrast, non-color status cues, theme roles, chart series, color vision distinctions, and token propagation.',
    'The final evaluation combines earlier work on hierarchy, additive color, formats, perception, accessibility, and semantic roles.',
  ],
};
