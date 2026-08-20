import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_5: LessonConfig = {
  id: 'u5-l5', unitId: 'unit-5',
  title: LESSON_TITLES['u5-l5'],
  interactionType: 'audit-flow',
  reviewTags: ['audit', 'workflow', 'process', 'inclusive-design'],
  steps: [
    {
      text: 'A contrast checker calculates a ratio — it does not decide whether a design is accessible. Judgment still requires testing in context: at real sizes, with real content, in a realistic layout. A body text color that barely passes on a chip may fail in context on a colored card.',
    },
    {
      text: 'A practical audit workflow has four stages: (1) Identify priority elements on the current screen or flow — text, controls, states, and graphics that carry meaning. (2) Check contrast ratios for text and non-text components. (3) Simulate CVD conditions and identify ambiguous elements. (4) Verify task completion — can users still accomplish their goals?',
    },
    {
      text: 'Priority elements are the ones users depend on to complete tasks: headlines, body text, buttons, input fields, links, form feedback, alerts, and chart marks. Secondary or decorative elements are lower priority. Start your audit with the elements that matter most.',
    },
    {
      text: 'After contrast checks, ask: does any element rely on color alone? A passing ratio does not fix a color-alone problem — both checks must be done separately. Then simulate at least two CVD types and walk through the core user flows.',
    },
    {
      text: 'The most valuable question during simulated review is not "do the colors look different?" but "can the user complete the task?" Run through the core user flows for this interface slice — fill a form, read a chart, understand a status indicator — and flag anywhere meaning is lost.',
    },
  ],
  challenge: {
      prompt: 'Work through the full audit checklist on the mock interface — identify priority elements, check contrast, flag color-only issues, and simulate CVD.',
      hints: [
        'Start with text elements before checking controls and graphics.',
        'A passing ratio does not fix a color-only problem — check both separately.',
        'Simulate at least two CVD modes before marking the simulation step complete.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'What does a contrast checker tool do?',
      choices: [
        {
          stableId: 'it-automatically-repairs-contrast-failures',
          label: 'It automatically repairs contrast failures',
          isCorrect: false,
          explanation: 'A checker tells you the ratio and pass/fail status — you still need to decide how to fix it.',
        },
        {
          stableId: 'it-calculates-the-contrast-ratio-between-two-colors-and-reports-',
          label: 'It calculates the contrast ratio between two colors and reports pass/fail status',
          isCorrect: true,
          explanation: 'A checker is a calculation tool, not a repair tool. It gives you data; you apply judgment.',
        },
        {
          stableId: 'it-converts-colors-to-accessible-versions-automatically',
          label: 'It converts colors to accessible versions automatically',
          isCorrect: false,
          explanation: 'No standard checker auto-converts colors. It reports ratios so you can make informed adjustments.',
        },
        {
          stableId: 'it-checks-animation-and-motion-accessibility',
          label: 'It checks animation and motion accessibility',
          isCorrect: false,
          explanation: 'Motion accessibility is a separate concern from color contrast.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What should you look for during a simulated review?',
      choices: [
        {
          stableId: 'whether-the-colors-still-look-different-from-each-other',
          label: 'Whether the colors still look different from each other',
          isCorrect: false,
          explanation: 'Colors may still be slightly different while being practically indistinguishable. The relevant question is whether tasks can be completed.',
        },
        {
          stableId: 'whether-the-user-can-still-complete-the-task-not-just-whether-co',
          label: 'Whether the user can still complete the task, not just whether colors look different',
          isCorrect: true,
          explanation: 'Task completion is the meaningful measure. A status indicator that requires perfect hue discrimination to interpret is a design problem regardless of subtle color differences.',
        },
        {
          stableId: 'whether-the-interface-looks-visually-appealing-in-simulation-mod',
          label: 'Whether the interface looks visually appealing in simulation mode',
          isCorrect: false,
          explanation: 'Aesthetic appearance under simulation is not the goal. The goal is functional clarity.',
        },
        {
          stableId: 'whether-the-page-renders-without-errors',
          label: 'Whether the page renders without errors',
          isCorrect: false,
          explanation: 'Technical rendering is a separate concern. Simulated review is about perceptual and functional accessibility.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'After contrast passes, what should you check next?',
      choices: [
        {
          stableId: 'animation-and-transition-speed',
          label: 'Animation and transition speed',
          isCorrect: false,
          explanation: 'Motion is a separate accessibility concern from color.',
        },
        {
          stableId: 'whether-any-element-still-relies-on-color-alone-to-communicate-m',
          label: 'Whether any element still relies on color alone to communicate meaning',
          isCorrect: true,
          explanation: 'Contrast and color-alone are separate concerns. A passing ratio does not fix a color-only problem.',
        },
        {
          stableId: 'typography-scale',
          label: 'Typography scale',
          isCorrect: false,
          explanation: 'Typography scale affects which contrast threshold applies, but is not the next audit step.',
        },
        {
          stableId: 'whether-the-brand-palette-is-on-trend',
          label: "Whether the brand palette is on-trend",
          isCorrect: false,
          explanation: 'Trend alignment is not an accessibility concern.',
        },
      ],
    },
  ],
  keyPoints: [
    'A contrast tool calculates ratios — it does not replace judgment. Always test in realistic context with real sizes and content.',
    'A practical screen-level audit: identify priority elements → check contrast → simulate CVD → verify task completion.',
    'Priority elements are those users depend on to complete tasks: text, buttons, inputs, feedback, alerts, chart marks.',
    'Contrast passing does not mean color-alone passing — both checks must be done separately.',
    'During simulated review, ask "can the user complete the task?" — not just "do the colors look different?"',
  ],
};
