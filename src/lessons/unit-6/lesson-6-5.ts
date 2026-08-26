import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson6_5: LessonConfig = {
  id: 'u6-l5', unitId: 'unit-6',
  title: LESSON_TITLES['u6-l5'],
  interactionType: 'chart-tuner',
  reviewTags: ['charts', 'data-visualization', 'color-systems'],
  steps: [
    { text: 'Interface colors and chart colors do different jobs. Interface colors guide navigation and communicate interface states. Chart colors encode data by representing categories, ordered values, or emphasis. Each set of colors needs to fit its purpose.' },
    { text: 'Categorical palettes use distinct hues for groups that have no order, such as product categories, countries, or team names. Too many hues, or hues that differ only slightly, make it harder to match chart marks to categories.' },
    { text: 'Sequential palettes use an ordered progression in lightness, sometimes combined with a change in saturation, to represent values such as temperature, quantity, or severity. A light-to-dark progression gives viewers a consistent cue for order. A rainbow palette can introduce uneven changes in perceived lightness.' },
    { text: 'Choose series colors that remain distinct from one another and the chart background. If red and green encode different series or meanings, some people with protan or deutan types of color vision deficiency may have trouble distinguishing them. Add direct labels, shapes, or patterns so color is not the only cue.' },
    { text: 'In the chart tuner, adjust each series color and assign a different pattern to each series. Compare the normal and deuteranopia views, then show the data table to inspect every bar by month, series, and value.' },
  ],
  challenge: {
      prompt: 'Complete three stages in order: tune the series colors, assign a different pattern to each series, then inspect the data table.',
      hints: [
        'Use differences in lightness as well as hue to separate the series.',
        'Use the simulation warning to find series pairs below the tool\'s difference threshold.',
        'Assign a different pattern to each series so the bars remain identifiable without color.',
        'Show the data table, inspect the chart values, then complete the chart.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'When is a sequential palette more appropriate than a categorical palette?',
      choices: [
        { stableId: 'always-sequential-palettes-are-more-accessible', label: 'Whenever accessibility is a priority, regardless of the data type', isCorrect: false, explanation: 'Accessibility does not determine whether the data is ordered. Sequential palettes represent values with a meaningful order.' },
        { stableId: 'when-data-has-a-meaningful-order-such-as-temperature-quantity-or', label: 'When the data has a meaningful order and the chart needs to show its progression', isCorrect: true, explanation: 'Correct. A sequential palette maps an ordered range of values to a progression in color.' },
        { stableId: 'when-data-has-no-order-and-categories-are-equal', label: 'When data has no order and categories are equal', isCorrect: false, explanation: 'Unordered categories need a categorical palette, not a sequential one.' },
        { stableId: 'for-brand-colored-charts-only', label: 'For brand-colored charts only', isCorrect: false, explanation: 'Brand palette choice is separate from categorical vs sequential decisions.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A chart uses red for \'above target\' and green for \'below target.\' What is the main risk?',
      choices: [
        { stableId: 'red-and-green-are-always-confusing-regardless-of-cvd', label: 'Every viewer will confuse the red and green marks', isCorrect: false, explanation: 'Many viewers can distinguish these colors. Some people with protan or deutan types of color vision deficiency may have difficulty telling them apart.' },
        { stableId: 'the-chart-will-fail-browser-rendering', label: 'The chart will fail browser rendering', isCorrect: false, explanation: 'Browser rendering is not affected by color choice.' },
        { stableId: 'under-protan-or-deutan-cvd-red-and-green-may-look-similar-users-', label: 'Some viewers with protan or deutan types of color vision deficiency may have difficulty distinguishing the two colors', isCorrect: true, explanation: 'Correct. These types of color vision deficiency can make some reds and greens appear more similar. Another visual cue can preserve the distinction.' },
        { stableId: 'red-is-always-too-dark-for-charts', label: 'The red marks must be darker than the green marks', isCorrect: false, explanation: 'Neither color has a fixed lightness. The result depends on the specific red and green values.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which change lets viewers identify five chart series without matching colors to a separate legend?',
      choices: [
        { stableId: 'use-five-different-shades-of-one-hue', label: 'Use five hues with similar lightness and identify them only in the legend', isCorrect: false, explanation: 'This still requires viewers to match each mark to a color in the legend.' },
        { stableId: 'add-direct-data-labels-to-each-series-so-the-legend-is-not-the-o', label: 'Place each series name next to its marks', isCorrect: true, explanation: 'Correct. Direct labels connect each series name to its marks without requiring a color match to the legend.' },
        { stableId: 'use-an-animation-to-highlight-each-series-on-hover-only', label: 'Use an animation to highlight each series on hover only', isCorrect: false, explanation: 'Hover-only identification means users cannot compare series simultaneously.' },
        { stableId: 'use-a-table-instead-of-a-chart', label: 'Use a table instead of a chart', isCorrect: false, explanation: 'A data table can provide exact values, but replacing the chart does not make its series easier to identify.' },
      ],
    },
  ],
  keyPoints: [
    'Match the palette to the data: separate unordered categories by hue and encode ordered values through a lightness progression.',
    'Combine hue and lightness differences so chart series remain separate from one another and the background.',
    'Red and green can become difficult to distinguish for people with protan or deutan types of color vision deficiency; labels, shapes, or patterns preserve the distinction without color.',
    'Direct series labels remove the need to match marks with colors in a separate legend.',
  ],
};
