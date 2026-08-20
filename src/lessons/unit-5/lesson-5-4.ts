import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_4: LessonConfig = {
  id: 'u5-l4', unitId: 'unit-5',
  title: LESSON_TITLES['u5-l4'],
  interactionType: 'pattern-repair',
  reviewTags: ['patterns', 'forms', 'alerts', 'charts', 'accessibility'],
  steps: [
    { text: 'Individual repairs are useful. But patterns are more powerful. If the form validation pattern across your whole product uses a red border + error icon + inline message, every form gets the repair for free.' },
    { text: 'Links embedded in body text need underlines or another non-color cue. A color-only link shift is easy to miss — especially in long paragraphs, on tinted backgrounds, or for users with deutan CVD.' },
    { text: "Alerts and notifications should combine a color tint with an icon and a structured heading. 'Error: Payment failed. Please check your card details.' is stronger than a red box with white text alone." },
    { text: 'Chart palettes for dashboards should be chosen with CVD robustness in mind: high contrast between series, direct labels, and pattern fills where needed. A color-only legend for a five-series chart is one of the most common data visualization accessibility failures.' },
    { text: 'In the pattern repair workshop, fix each real interface module. See the before-and-after comparison. Think about whether your fix would scale across the whole product — not just this one screen.' },
  ],
  challenge: { prompt: 'Repair each interface pattern — form, link paragraph, alert stack, and chart — so each one communicates clearly without relying solely on color.', hints: ['For the form: add an error icon and a message text, not just a border color.', 'For links: add an underline. Color plus underline is the standard.', 'For the chart: add direct labels or patterns to series, not just a color legend.'] },
  quizItems: [
    { id: 'q1', prompt: 'What makes a reusable accessible pattern better than a one-off fix?', choices: [{ id: 'a', label: 'Patterns require more time to build', isCorrect: false, explanation: 'Time investment is not the advantage.' }, { id: 'b', label: 'Once defined, the accessible pattern scales across the whole product automatically — every instance gets the improvement', isCorrect: true, explanation: 'One good form validation pattern fixes every form. One-off fixes only fix what you touched.' }, { id: 'c', label: 'Patterns are only useful in large teams', isCorrect: false, explanation: 'Patterns benefit any product regardless of team size.' }, { id: 'd', label: 'One-off fixes are more precise', isCorrect: false, explanation: 'One-off fixes are more narrow, not more precise.' }] },
    { id: 'q2', prompt: 'Why do links embedded in body text typically need an underline?', choices: [{ id: 'a', label: 'Underlines are required by all design systems', isCorrect: false, explanation: 'Not all design systems require underlines, but they are strongly recommended.' }, { id: 'b', label: 'Color alone may not distinguish a link from surrounding text — an underline is a non-color cue that confirms interactivity', isCorrect: true, explanation: 'Correct. Underlines provide a non-color signal that confirms the element is a link.' }, { id: 'c', label: 'Underlines improve font rendering', isCorrect: false, explanation: 'Underlines are a semantic indicator, not a rendering aid.' }, { id: 'd', label: 'Color-only links always fail WCAG', isCorrect: false, explanation: 'Color-only links can pass if the contrast between link and body text is high enough, but underlines are the safer, more robust choice.' }] },
    { id: 'q3', prompt: 'A dashboard chart uses five series with unique hues and a color-only legend. What is the strongest improvement?', choices: [{ id: 'a', label: 'Use brighter hues with higher saturation', isCorrect: false, explanation: 'Brighter is still color-only.' }, { id: 'b', label: 'Add direct labels to each series and ensure high contrast between adjacent series', isCorrect: true, explanation: 'Direct labels remove the need for a legend entirely and work under CVD conditions.' }, { id: 'c', label: 'Reduce the number of colors to three', isCorrect: false, explanation: 'Fewer colors help, but without direct labels it is still color-only.' }, { id: 'd', label: 'Use a tooltip-only label system', isCorrect: false, explanation: 'Tooltips require hover interaction and are not reliably accessible.' }] },
  ],
  keyPoints: [
    'Accessible patterns scale better than one-off fixes — define the pattern once and every instance benefits.',
    'Links in body text should have an underline or other non-color cue to confirm interactivity.',
    'Alerts should combine color tint, an icon, and structured message text — not background tint alone.',
    'Chart palettes need direct labels or patterns to remain readable under CVD conditions.',
    'System-level accessibility thinking connects color, structure, icon, text, and redundancy into reliable, repeatable design decisions.',
  ],
};
