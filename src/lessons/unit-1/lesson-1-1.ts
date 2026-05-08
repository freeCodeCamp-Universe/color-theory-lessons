import type { LessonConfig } from '../../types/lesson.ts';

export const lesson1_1: LessonConfig = {
  id: 'u1-l1',
  unitId: 'unit-1',
  title: 'What Color Does in Interface Design',
  description: 'Discover how color guides attention, groups content, and communicates meaning in real interfaces.',
  learningGoal: 'Explain at least two practical jobs that color performs in a UI.',
  estimatedMinutes: 12,
  prerequisites: [],
  conceptsIntroduced: ['emphasis', 'grouping', 'status-color', 'visual-cue', 'readability'],
  interactionType: 'before-after',
  glossaryTerms: ['emphasis', 'grouping', 'status color', 'visual cue', 'readability'],
  reviewTags: ['foundations', 'visual-vocabulary', 'color-function'],
  steps: [
    {
      id: 's1',
      text: 'Designers do not use color only to make things look nice. In digital products, color helps users notice what matters first. Notice the example on the right — it shows what this looks like in a real interface.',
      panel: { type: 'before-after-preview', mockup: 'purposeful' },
    },
    {
      id: 's2',
      text: 'Color can group related items and separate sections, making it easier to scan a page without reading every word.',
      highlights: ['grouping', 'separate sections'],
      panel: { type: 'before-after-preview', mockup: 'purposeful' },
    },
    {
      id: 's3',
      text: 'Color communicates status: green often means success, red means error, yellow means caution. These patterns are learned expectations.',
      highlights: ['status'],
      panel: { type: 'before-after-preview', mockup: 'purposeful' },
    },
    {
      id: 's4',
      text: 'Color used without a purpose — just to add variety — can make an interface feel noisy and harder to use. Every color choice should earn its place.',
      panel: { type: 'before-after-preview', mockup: 'noisy' },
    },
    {
      id: 's5',
      text: 'Click each colored element in the interface and identify what its color is doing.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'For each highlighted area, identify what the color is doing: drawing attention, grouping items, signaling status, separating sections, or serving no clear purpose.',
      type: 'identify-problem',
      hints: [
        'Look at which element your eye lands on first — that one is probably using emphasis.',
        'If similar items share a color and different items don\'t, that\'s grouping.',
        'Green, red, and yellow often carry status meaning by convention.',
      ],
      successCriteria: 'Correctly identifies the purpose of color in at least 4 of 6 areas.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'A button is bright gold on a dark background while all other buttons are gray. What is the color doing?',
      choices: [
        { id: 'a', label: 'Drawing attention to the primary action', isCorrect: true, explanation: 'The contrast singles out this button as the most important action on the screen.' },
        { id: 'b', label: 'Making the design more colorful', isCorrect: false, explanation: 'Adding color for variety does not explain why this specific button stands out.' },
        { id: 'c', label: 'Signaling that the button is disabled', isCorrect: false, explanation: 'Disabled states are typically muted, not bright.' },
        { id: 'd', label: 'Grouping the button with other gold elements', isCorrect: false, explanation: 'If it were grouping, there would be other gold elements to group with.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A form has red text below an input field. A green checkmark appears after the field is filled correctly. What role is color playing here?',
      choices: [
        { id: 'a', label: 'Decoration', isCorrect: false, explanation: 'These colors are carrying specific meaning, not just visual interest.' },
        { id: 'b', label: 'Grouping', isCorrect: false, explanation: 'Grouping would mean clustering related items, not labeling individual states.' },
        { id: 'c', label: 'Status communication', isCorrect: true, explanation: 'Red for error and green for success are conventional status signals.' },
        { id: 'd', label: 'Separating sections', isCorrect: false, explanation: 'Section separation uses color to define regions, not to mark individual field states.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which of these is an example of color used decoratively rather than functionally?',
      choices: [
        { id: 'a', label: 'A red border around an invalid form field', isCorrect: false, explanation: 'This communicates a specific error state — it is functional.' },
        { id: 'b', label: 'Blue text that indicates a clickable link', isCorrect: false, explanation: 'Blue links are a learned convention — they communicate interactivity.' },
        { id: 'c', label: 'A randomly colored sidebar that matches no other element', isCorrect: true, explanation: 'If the color connects to no meaning, grouping, or emphasis, it is decorative.' },
        { id: 'd', label: 'A green success banner after a form is submitted', isCorrect: false, explanation: 'Green here signals a completed action — that is status communication.' },
      ],
    },
  ],
  keyPoints: [
    'Color communicates meaning before a viewer reads a single word.',
    'Red, orange, and yellow tend to signal urgency, energy, or danger; blue and green tend to signal calm, safety, or progress — but these are conventions, not universal rules.',
    'Color meaning is shaped by cultural context and can differ across audiences.',
    'Using color as the only carrier of meaning (with no text, icon, or pattern backup) is an accessibility risk.',
    'Every color in a product is either communicating something or adding visual noise.',
  ],
};
