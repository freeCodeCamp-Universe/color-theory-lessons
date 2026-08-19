import type { LessonConfig } from '../../types/lesson.ts';

export const lesson6_5: LessonConfig = {
  id: 'u6-l5', unitId: 'unit-6',
  title: 'Color for Charts and Data Visualization',
  interactionType: 'chart-tuner',
  glossaryTerms: ['categorical palette', 'chart contrast', 'data emphasis', 'encoding', 'sequential palette', 'visual grouping'],
  reviewTags: ['charts', 'data-visualization', 'color-systems'],
  steps: [
    { id: 's1', text: 'Interface colors and chart colors do different jobs. Interface colors guide navigation and meaning. Chart colors encode data — they represent groups, magnitudes, or emphasis. They need different design strategies.', highlights: ['encoding', 'categorical palette', 'sequential palette'] },
    { id: 's2', text: 'Categorical palettes use distinct hues for groups that have no order: product categories, countries, team names. Too many similar hues or too many fully saturated hues make categorical charts hard to read quickly.', highlights: ['categorical palette', 'visual grouping'] },
    { id: 's3', text: 'Sequential palettes move from light to dark (or low to high saturation) to represent ordered data: temperature, quantity, severity. A single hue progressing from light to dark is usually more readable than a rainbow for sequential data.', highlights: ['sequential palette', 'data emphasis'] },
    { id: 's4', text: 'Chart colors should contrast sufficiently with the chart background and with adjacent series. Red-green combinations are especially risky — use shape, pattern, or direct labels to support color in all chart contexts.', highlights: ['chart contrast'] },
    { id: 's5', text: 'In the chart tuner, adjust series colors for a bar chart and a line chart. A CVD simulation button shows the chart under deuteranopia. A similarity warning appears when series become too close. Your challenge: make both charts clear in normal view and under simulation.' },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Tune the chart series colors so both charts are readable in normal view and under CVD simulation.',
      type: 'system-build',
      hints: [
        'Aim for high contrast between adjacent series, not just different hues.',
        'If two bars look similar under deuteranopia, add direct labels to the bars.',
        'Avoid using red and green as the only distinguishing pair — use blue/orange or add patterns.',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'When is a sequential palette more appropriate than a categorical palette?',
      choices: [
        { id: 'a', label: 'Always — sequential palettes are more accessible', isCorrect: false, explanation: 'Sequential palettes are not universally superior — they are appropriate for ordered data only.' },
        { id: 'b', label: 'When data has a meaningful order — such as temperature, quantity, or severity level — and the goal is to show progression', isCorrect: true, explanation: 'Correct. Sequential palettes encode magnitude — they should not be used for unordered categories.' },
        { id: 'c', label: 'When data has no order and categories are equal', isCorrect: false, explanation: 'Unordered categories need a categorical palette, not a sequential one.' },
        { id: 'd', label: 'For brand-colored charts only', isCorrect: false, explanation: 'Brand palette choice is separate from categorical vs sequential decisions.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A chart uses red for \'above target\' and green for \'below target.\' What is the main risk?',
      choices: [
        { id: 'a', label: 'Red and green are always confusing regardless of CVD', isCorrect: false, explanation: 'Red and green are distinct to most viewers — the risk is specifically under CVD conditions.' },
        { id: 'b', label: 'The chart will fail browser rendering', isCorrect: false, explanation: 'Browser rendering is not affected by color choice.' },
        { id: 'c', label: 'Under protan or deutan CVD, red and green may look similar — users cannot tell which is which', isCorrect: true, explanation: 'Correct. Red-green is the most common CVD pair to avoid when meaning depends on the distinction.' },
        { id: 'd', label: 'Red is always too dark for charts', isCorrect: false, explanation: 'Red\'s lightness depends on the specific value used — it is not inherently too dark.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What is the most effective way to make a five-series chart readable beyond hue?',
      choices: [
        { id: 'a', label: 'Use five different shades of one hue', isCorrect: false, explanation: 'Shades of one hue are hard to distinguish when used in multi-series charts.' },
        { id: 'b', label: 'Add direct data labels to each series so the legend is not the only reference for identification', isCorrect: true, explanation: 'Direct labels work even when simulation makes hues similar.' },
        { id: 'c', label: 'Use an animation to highlight each series on hover only', isCorrect: false, explanation: 'Hover-only identification means users cannot compare series simultaneously.' },
        { id: 'd', label: 'Use a table instead of a chart', isCorrect: false, explanation: 'Tables serve a different purpose — they are not a substitute for chart accessibility.' },
      ],
    },
  ],
  keyPoints: [
    'Categorical palettes use distinct hues for unordered groups; sequential palettes use light-to-dark progression for ordered data.',
    'Chart colors need sufficient contrast with each other and with the chart background — not just different hues.',
    'Red-green only differentiation is risky — support with labels, patterns, or different shapes under CVD conditions.',
    'Direct labels on chart series are more robust than color-only legends and work under CVD simulation.',
  ],
};
