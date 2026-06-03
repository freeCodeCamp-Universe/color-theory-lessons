import type { LessonConfig } from '../../types/lesson.ts';

export const lesson1_5: LessonConfig = {
  id: 'u1-l5',
  unitId: 'unit-1',
  title: 'Visual Hierarchy Through Color',
  description: 'See how designers use color to guide attention, define emphasis, and create a clear scanning path.',
  learningGoal: 'Improve a cluttered interface by reducing noise and strengthening one clear focal point.',
  estimatedMinutes: 14,
  prerequisites: ['u1-l3'],
  conceptsIntroduced: ['hierarchy', 'focal point', 'primary action', 'secondary action', 'accent color', 'de-emphasis'],
  interactionType: 'before-after',
  glossaryTerms: ['hierarchy', 'focal point', 'primary action', 'secondary action', 'accent color'],
  reviewTags: ['hierarchy', 'emphasis', 'foundations'],
  steps: [
    {
      id: 's1',
      text: 'Not every element should compete equally for attention. Hierarchy means giving each element a clear role: primary, supporting, or background.',
      highlights: ['hierarchy'],
    },
    {
      id: 's2',
      text: 'Color is one of the fastest tools for creating emphasis. A small amount of accent color draws the eye immediately — but only when the rest of the design steps back.',
      highlights: ['emphasis', 'accent color'],
    },
    {
      id: 's3',
      text: 'When everything is equally loud — same saturation, same weight, same contrast — the design has no hierarchy. The user does not know where to look first.',
    },
    {
      id: 's4',
      text: 'Good hierarchy usually means some elements step back so one element can step forward. Supporting elements use muted, lower-contrast colors. The focal point uses the design\'s strongest color signal.',
      highlights: ['focal point'],
    },
    {
      id: 's5',
      text: 'The interactive tool shows three identical buttons — no hierarchy at all. Use it to assign each one a role and create a clear visual order before the challenge.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'A screen shows three buttons: Submit, Save Draft, and Cancel. Right now they all look the same. Make Submit clearly primary without making the design feel broken or unbalanced.',
      type: 'fix-interface',
      hints: [
        'The primary action should use the strongest accent. The others should step back.',
        'Secondary actions work well as ghost buttons or lower-saturation versions.',
        'Cancel or destructive actions can use a subtle red, or simply be a text link.',
      ],
      successCriteria: 'Submit is clearly dominant, secondary actions are visually subordinate, no element fights for equal emphasis.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'A designer uses five different accent colors across a single screen — purple, teal, orange, red, and gold. What is the most likely hierarchy problem?',
      choices: [
        { id: 'a', label: 'The palette has too many cool colors.', isCorrect: false, explanation: 'The temperature mix is not the core issue here.' },
        { id: 'b', label: 'No single element has clear primary emphasis.', isCorrect: true, explanation: 'When everything is accented differently, nothing stands out. The eye does not know where to go first.' },
        { id: 'c', label: 'The colors will be hard to distinguish for colorblind users.', isCorrect: false, explanation: 'That may also be true, but the primary hierarchy problem is that everything competes equally.' },
        { id: 'd', label: 'The design lacks enough contrast.', isCorrect: false, explanation: 'Five saturated accents might have plenty of contrast individually — the problem is that none is clearly dominant.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which revision best supports a single primary action on a screen?',
      choices: [
        { id: 'a', label: 'Use the accent color only for the primary button; make others gray or outlined.', isCorrect: true, explanation: 'Reserving the accent for one element immediately signals its importance.' },
        { id: 'b', label: 'Make all buttons the same bright color so they all get attention.', isCorrect: false, explanation: 'Equal emphasis means no emphasis. The user still cannot tell which action matters most.' },
        { id: 'c', label: 'Add more colors to make secondary actions more interesting.', isCorrect: false, explanation: 'More colors create more visual noise, not clearer hierarchy.' },
        { id: 'd', label: 'Reduce all button contrast so nothing stands out too much.', isCorrect: false, explanation: 'Reducing all contrast makes every action feel equally unimportant.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'On a well-designed screen, the primary CTA uses the accent color. What should the secondary actions typically look like?',
      choices: [
        { id: 'a', label: 'More saturated than the primary to create balance.', isCorrect: false, explanation: 'More saturation would challenge the primary for attention, not support it.' },
        { id: 'b', label: 'The same color as the primary but smaller.', isCorrect: false, explanation: 'Same color means the same emphasis signal — size alone does not create enough hierarchy difference.' },
        { id: 'c', label: 'Bright red so users notice there is a secondary option.', isCorrect: false, explanation: 'Red carries a danger/destructive meaning and would create the wrong signal for a neutral secondary action.' },
        { id: 'd', label: 'Outlined, muted, or text-only — visually subordinate.', isCorrect: true, explanation: 'Secondary actions need to be available without competing. Lower contrast and less visual weight keep them supportive.' },
      ],
    },
  ],
  keyPoints: [
    'Visual hierarchy means the most important element receives the most visual weight; everything else is subordinate.',
    'Primary actions get the most prominent color; secondary actions are quieter; tertiary actions recede further.',
    'A focal point is created by giving one element a distinctly different color from its surroundings.',
    'Accent colors lose their impact if overused — restraint is what makes an accent read as emphasis.',
    'Hierarchy works not because some colors are inherently louder, but because they stand out relative to the rest.',
  ],
};
