import type { LessonConfig } from '../../types/lesson.ts';

export const lesson1_5: LessonConfig = {
  id: 'u1-l5',
  unitId: 'unit-1',
  title: 'Visual Hierarchy Through Color',
  interactionType: 'before-after',
  glossaryTerms: ['hierarchy', 'focal point', 'primary action', 'secondary action', 'accent color'],
  reviewTags: ['hierarchy', 'emphasis', 'foundations'],
  steps: [
    {
      text: 'Visual hierarchy organizes interface elements by importance. It directs attention first to the main content or action, then to supporting information, while background elements remain less prominent.',
    },
    {
      text: 'Color can create emphasis when one element differs from its surroundings. Reserving an accent color for the focal point makes it more prominent than nearby elements that use neutral or muted colors.',
    },
    {
      text: 'Applying saturated accent colors to several elements gives each of them a strong color signal. Color then no longer indicates which element should receive attention first.',
    },
    {
      text: 'Supporting elements can use neutral or less saturated colors while maintaining readable contrast with their backgrounds. The focal point can use the accent color to distinguish it from those supporting elements.',
    },
    {
      text: 'The exercise applies visual hierarchy to three actions: Submit, Save Draft, and Cancel. Their styling should reflect their relative importance as primary, secondary, and tertiary actions.',
    },
  ],
  challenge: {
      prompt: 'Assign a visual role to each action so Submit receives the most emphasis, Save Draft remains available without competing with it, and Cancel receives the least emphasis.',
      hints: [
        'Only one action should use the filled accent treatment.',
        'An outlined treatment keeps an action visible without giving it the same emphasis as a filled accent.',
        'A text-link treatment gives a tertiary action less emphasis than filled or outlined actions.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'A screen uses purple, teal, orange, red, and gold as accent colors on five different elements. What hierarchy problem is most likely?',
      choices: [
        { id: 'a', label: 'The palette has too many cool colors.', isCorrect: false, explanation: 'The temperature mix is not the core issue here.' },
        { id: 'b', label: 'No single element has clear primary emphasis.', isCorrect: true, explanation: 'Each accent creates a competing emphasis signal, so the screen does not identify one primary element.' },
        { id: 'c', label: 'The accents should all use the same hue.', isCorrect: false, explanation: 'Using one hue on five elements would still give them similar emphasis. The hierarchy problem comes from applying accent styling to too many elements.' },
        { id: 'd', label: 'The design lacks enough contrast.', isCorrect: false, explanation: 'Contrast depends on each element\'s color pair with its background, which the prompt does not specify. The hierarchy problem is that five elements receive accent emphasis.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'Which revision best supports a single primary action on a screen?',
      choices: [
        { id: 'a', label: 'Use the accent color only for the primary button; make others gray or outlined.', isCorrect: true, explanation: 'Using the filled accent treatment only on the primary action distinguishes it from the outlined and text-link actions.' },
        { id: 'b', label: 'Make all buttons the same bright color so they all get attention.', isCorrect: false, explanation: 'Giving every button the same bright treatment gives them equal color emphasis, so color does not identify a primary action.' },
        { id: 'c', label: 'Add more colors to make secondary actions more interesting.', isCorrect: false, explanation: 'Adding colors to secondary actions increases their color emphasis and makes them compete with the primary action.' },
        { id: 'd', label: 'Reduce all button contrast so nothing stands out too much.', isCorrect: false, explanation: 'Reducing every button\'s contrast does not create an order among them and can make button labels harder to read.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A screen uses a filled accent treatment for its primary action. Which treatment best fits its secondary actions?',
      choices: [
        { id: 'a', label: 'More saturated than the primary to create balance.', isCorrect: false, explanation: 'Increasing saturation would give the secondary actions stronger color emphasis and make them compete with the primary action.' },
        { id: 'b', label: 'The same color as the primary but smaller.', isCorrect: false, explanation: 'Using the primary accent color would give the secondary actions the same color signal. Size can affect hierarchy, but it would not reserve the accent treatment for the primary action.' },
        { id: 'c', label: 'Bright red so users notice there is a secondary option.', isCorrect: false, explanation: 'A bright red treatment would add another strong accent. Red is also commonly used for errors or destructive actions, which does not match a neutral secondary action.' },
        { id: 'd', label: 'Outlined or neutral, with less color emphasis than the primary action.', isCorrect: true, explanation: 'Outlined or neutral treatments keep secondary actions visible while reserving the filled accent treatment for the primary action.' },
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
