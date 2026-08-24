import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_5: LessonConfig = {
  id: 'u5-l5', unitId: 'unit-5',
  title: LESSON_TITLES['u5-l5'],
  interactionType: 'audit-flow',
  reviewTags: ['audit', 'workflow', 'process', 'inclusive-design'],
  steps: [
    {
      text: 'A contrast checker calculates the ratio between a foreground color and a background color. It does not decide whether an entire design is accessible. Check the colors used in the rendered interface and compare each ratio with the threshold for that text or component. A text color that passes on white may fail when the same text appears on a colored card.',
    },
    {
      text: 'A practical audit workflow has four stages. First, identify the text, controls, states, and graphics that users need. Second, check text and non-text contrast. Third, simulate CVD conditions, identify information conveyed by color alone, and add another visual cue. Fourth, verify whether users can still complete their tasks.',
    },
    {
      text: 'Priority elements are the ones users depend on to complete tasks: headlines, body text, buttons, input fields, links, form feedback, alerts, and chart marks. Start with the elements needed for the current task, then check the remaining content and controls that convey information. Decorative elements do not convey information and do not need the same checks.',
    },
    {
      text: 'After the contrast checks, look for elements that rely on color alone. A passing contrast ratio does not show whether another visual cue conveys the same information. Check both requirements separately. Then use CVD simulations to check how reduced color distinctions affect the main user tasks.',
    },
    {
      text: 'During a simulated review, check whether a user can complete each task, not only whether the colors look different. Follow the main tasks for the screen, such as filling in a form, reading a chart, or interpreting a status indicator. Record each place where the task becomes unclear.',
    },
  ],
  challenge: {
      prompt: 'Complete all four stages of the audit activity: identify priority elements, check contrast, choose a repair for a color-only status, and identify the impact on task completion.',
      hints: [
        'Select every element that users need to read, identify a control, or understand information.',
        'A passing contrast ratio does not provide a second visual cue. Check contrast and use of color separately.',
        'For a color-only status, choose a repair that adds text or an icon.',
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
          explanation: 'A checker calculates the ratio. You still need to choose foreground and background colors that meet the applicable requirement.',
        },
        {
          stableId: 'it-calculates-the-contrast-ratio-between-two-colors-and-reports-',
          label: 'It calculates the contrast ratio between two colors',
          isCorrect: true,
          explanation: 'Compare the calculated ratio with the threshold for the text or component being checked. The checker does not repair colors or evaluate other accessibility requirements.',
        },
        {
          stableId: 'it-converts-colors-to-accessible-versions-automatically',
          label: 'It converts colors to accessible versions automatically',
          isCorrect: false,
          explanation: 'Calculating the ratio does not change either color. You must choose and test any replacement colors.',
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
          explanation: 'Noticing a color difference does not show whether the difference still communicates the required information. Check whether the user can complete the task.',
        },
        {
          stableId: 'whether-the-user-can-still-complete-the-task-not-just-whether-co',
          label: 'Whether the user can complete the task when colors are hard to distinguish',
          isCorrect: true,
          explanation: 'If a status indicator is identified only by hue, users who cannot distinguish those hues may not know what the status means.',
        },
        {
          stableId: 'whether-the-interface-looks-visually-appealing-in-simulation-mod',
          label: 'Whether the interface looks visually appealing in simulation mode',
          isCorrect: false,
          explanation: 'A simulation is not an appearance preference test. Check whether each visual cue still communicates the information needed for the task.',
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
          explanation: 'Contrast and use of color are separate WCAG requirements. A passing ratio does not provide another visual way to convey information.',
        },
        {
          stableId: 'typography-scale',
          label: 'Typography scale',
          isCorrect: false,
          explanation: 'Text size and weight determine which contrast threshold applies. After checking contrast, this workflow checks whether information relies on color alone.',
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
    'A contrast checker calculates the ratio between a foreground color and a background color; it does not evaluate the accessibility of an entire design.',
    'A screen-level audit identifies priority elements, checks contrast, checks simulations for color-only information, and verifies task completion.',
    'Priority elements include the text, controls, states, and graphics that users need to complete the current task.',
    'A passing contrast ratio does not show whether another visual cue conveys the same information. Check contrast and use of color separately.',
    'During a simulated review, follow the main tasks and record each place where the task becomes unclear.',
  ],
};
