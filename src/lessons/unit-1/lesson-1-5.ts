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
      text: 'Visual hierarchy organizes interface elements by importance. It directs attention first to the main content or action, then to supporting information, while background elements remain less prominent.',
      highlights: ['hierarchy'],
    },
    {
      id: 's2',
      text: 'Color can create emphasis when one element differs from its surroundings. Reserving an accent color for the focal point makes it more prominent than nearby elements that use neutral or muted colors.',
      highlights: ['emphasis', 'accent color'],
    },
    {
      id: 's3',
      text: 'Applying saturated accent colors to several elements gives each of them a strong color signal. Color then no longer indicates which element should receive attention first.',
    },
    {
      id: 's4',
      text: 'Supporting elements can use neutral or less saturated colors while maintaining readable contrast with their backgrounds. The focal point can use the accent color to distinguish it from those supporting elements.',
      highlights: ['focal point'],
    },
    {
      id: 's5',
      text: 'The exercise applies visual hierarchy to three actions: Submit, Save Draft, and Cancel. Their styling should reflect their relative importance as primary, secondary, and tertiary actions.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Assign a visual role to each action so Submit receives the most emphasis, Save Draft remains available without competing with it, and Cancel receives the least emphasis.',
      type: 'fix-interface',
      hints: [
        'Only one action should use the filled accent treatment.',
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
