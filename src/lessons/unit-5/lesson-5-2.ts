import type { LessonConfig } from '../../types/lesson.ts';

export const lesson5_2: LessonConfig = {
  id: 'u5-l2', unitId: 'unit-5',
  title: 'Non-Text Contrast for Controls and Graphics',
  interactionType: 'component-checker',
  reviewTags: ['contrast', 'components', 'controls', 'WCAG'],
  steps: [
    { text: 'Text contrast is the most discussed accessibility check, but it is not the only one. Many essential interface elements are not text: input borders, icon buttons, toggles, focus rings, chart marks, and status indicators all need clear visual distinction.' },
    { text: 'A control boundary tells users what is interactive. If the border of a text input is too close in lightness to the background, users cannot tell where they are supposed to click or type.' },
    { text: 'Focus indicators are especially critical for keyboard users. If the focus ring around a button or link is too faint, keyboard navigation becomes very difficult.' },
    { text: 'Meaningful icons — icons that carry information, not just decoration — need sufficient contrast to be read reliably. A faint icon telling a user whether a feature is enabled or disabled is a real usability failure.' },
    { text: "In the component checker, adjust each element's color until it becomes clearly visible against adjacent backgrounds. Ask: 'Can the user quickly find, identify, and operate this element?' — not 'Does it look minimal and clean?'" },
  ],
  challenge: { prompt: 'Fix the visibility of each UI component — input border, icon, focus ring, toggle state — so it is clearly identifiable against its background.', hints: ['Focus on the contrast between the component edge or indicator and the adjacent background.', 'A visible focus ring should stand out clearly, not just exist.', 'Ask yourself: can a user quickly identify what is interactive and what is selected?'] },
  quizItems: [
    { id: 'q1', prompt: 'Does accessibility checking stop once text passes?', choices: [{ id: 'a', label: 'Yes — text is the most important element', isCorrect: false, explanation: 'Controls, icons, focus indicators, and graphics also need accessible contrast.' }, { id: 'b', label: 'No — controls, icons, boundaries, and meaningful graphics also need clear visual distinction', isCorrect: true, explanation: 'Correct. Text contrast is one part of a complete accessibility check.' }, { id: 'c', label: 'Yes — graphics are decorative', isCorrect: false, explanation: 'Meaningful graphics are not decorative and do need contrast.' }, { id: 'd', label: 'Yes — focus states only matter for mobile', isCorrect: false, explanation: 'Focus states are most important for keyboard users, not mobile users.' }] },
    { id: 'q2', prompt: 'Why does a visible focus state matter?', choices: [{ id: 'a', label: 'It makes the design look more polished', isCorrect: false, explanation: 'Visual polish is a secondary consideration. Function is the primary concern.' }, { id: 'b', label: 'It lets keyboard and assistive technology users track which element is currently active', isCorrect: true, explanation: 'Without a visible focus ring, keyboard navigation becomes extremely difficult.' }, { id: 'c', label: 'It improves load performance', isCorrect: false, explanation: 'Focus indicators have no impact on load performance.' }, { id: 'd', label: 'Designers prefer visible focus rings aesthetically', isCorrect: false, explanation: 'Focus rings are often hidden by designers — this is an accessibility failure, not a preference.' }] },
    { id: 'q3', prompt: 'An icon button indicates whether a setting is enabled or disabled. Its icon has low contrast against the background. Why is this a problem?', choices: [{ id: 'a', label: 'Icons are decorative and do not need contrast', isCorrect: false, explanation: 'This icon carries essential meaning — it is a graphical object, not decoration.' }, { id: 'b', label: 'The icon carries essential meaning and low contrast makes it hard to read, failing users who rely on it', isCorrect: true, explanation: 'Correct. Meaningful icons need sufficient contrast to be reliably read.' }, { id: 'c', label: 'Icons only need to be large to be accessible', isCorrect: false, explanation: 'Size helps, but contrast is also required.' }, { id: 'd', label: 'The button text label fixes the contrast problem', isCorrect: false, explanation: 'If the button has no text label, the icon IS the content.' }] },
  ],
  keyPoints: [
    'Accessibility applies to all meaningful visual elements, not just text — controls, icons, focus rings, and graphics all need contrast.',
    'Input boundaries tell users what is interactive; if they are too faint, the UI becomes confusing.',
    'Focus indicators are essential for keyboard navigation and must be clearly visible against the background.',
    'Meaningful icons that carry status or action information must have sufficient contrast to be reliably read.',
  ],
};
