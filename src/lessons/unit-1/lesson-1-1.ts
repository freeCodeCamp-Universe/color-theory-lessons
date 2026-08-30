import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';
import { BEFORE_AFTER_PREVIEWS } from '../preview-accessibility.ts';

export const lesson1_1: LessonConfig = {
  id: 'u1-l1',
  unitId: 'unit-1',
  title: LESSON_TITLES['u1-l1'],
  interactionType: 'before-after',
  reviewTags: ['foundations', 'visual-vocabulary', 'color-function'],
  steps: [
    {
      text: 'Color directs attention and communicates structure in an interface. In the example, notice which element stands out first, how the navigation is separated from the content, and which color marks progress.',
      panel: { type: 'before-after-preview', mockup: 'purposeful', accessibility: BEFORE_AFTER_PREVIEWS.purposeful },
    },
    {
      text: 'A shared color cue can mark related items as one group. A different background color can also separate navigation from the page content.',
      panel: { type: 'before-after-preview', mockup: 'purposeful', accessibility: BEFORE_AFTER_PREVIEWS.purposeful },
    },
    {
      text: 'Many interfaces use green for success, red for errors, and yellow for warnings. Users learn these meanings through repeated use, so the colors act as status cues.',
      panel: { type: 'before-after-preview', mockup: 'purposeful', accessibility: BEFORE_AFTER_PREVIEWS.purposeful },
    },
    {
      text: 'Colors without a defined role add competing signals. In the noisy example, several unrelated elements use saturated colors, so the primary action no longer stands out.',
      panel: { type: 'before-after-preview', mockup: 'noisy', accessibility: BEFORE_AFTER_PREVIEWS.noisy },
    },
    {
      text: 'The same interface can use color for several jobs at once.',
    },
  ],
  challenge: {
      prompt: 'Complete one stage by identifying the role of each colored area in the interface.',
      hints: [
        'Compare the gold button with the gray text around it. Its stronger contrast draws attention.',
        'A colored border can mark the content inside it as one group.',
        'A status color marks an outcome such as success, warning, or error.',
        'A background color can mark the boundary between navigation and page content.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'A button is bright gold on a dark background while all other buttons are gray. What is the color doing?',
      choices: [
        { stableId: 'drawing-attention-to-the-primary-action', label: 'Drawing attention to the primary action', isCorrect: true, explanation: 'The contrast singles out this button as the most important action on the screen.' },
        { stableId: 'making-the-design-more-colorful', label: 'Making the design more colorful', isCorrect: false, explanation: 'Adding color for variety does not explain why this specific button stands out.' },
        { stableId: 'signaling-that-the-button-is-disabled', label: 'Signaling that the button is disabled', isCorrect: false, explanation: 'Disabled states are typically muted, not bright.' },
        { stableId: 'grouping-the-button-with-other-gold-elements', label: 'Grouping the button with other gold elements', isCorrect: false, explanation: 'If it were grouping, there would be other gold elements to group with.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A form has red text below an input field. A green checkmark appears after the field is filled correctly. What role is color playing here?',
      choices: [
        { stableId: 'decoration', label: 'Decoration', isCorrect: false, explanation: 'The red text identifies an error, and the green checkmark identifies a valid entry. Each color communicates a field state.' },
        { stableId: 'grouping', label: 'Grouping', isCorrect: false, explanation: 'Grouping connects related items through a shared visual treatment. Here, each color identifies a different field state.' },
        { stableId: 'status-communication', label: 'Status communication', isCorrect: true, explanation: 'Red for error and green for success are conventional status signals.' },
        { stableId: 'separating-sections', label: 'Separating sections', isCorrect: false, explanation: 'Section separation uses backgrounds or boundaries to distinguish regions of a page. These colors identify the state of one field.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which example uses color without communicating an interface role?',
      choices: [
        { stableId: 'a-red-border-around-an-invalid-form-field', label: 'A red border around an invalid form field', isCorrect: false, explanation: 'The red border identifies an invalid field, so it communicates an error state.' },
        { stableId: 'blue-text-that-indicates-a-clickable-link', label: 'Blue text that indicates a clickable link', isCorrect: false, explanation: 'The blue text marks a clickable link, so it communicates interactivity.' },
        { stableId: 'a-paragraph-where-every-word-has-a-different-random-color', label: 'A paragraph where every word has a different random color', isCorrect: true, explanation: 'The colors map to no state, category, or action. They change the paragraph\'s appearance without communicating interface information.' },
        { stableId: 'a-green-success-banner-after-a-form-is-submitted', label: 'A green success banner after a form is submitted', isCorrect: false, explanation: 'The green banner identifies a successful form submission.' },
      ],
    },
  ],
  keyPoints: [
    'Color can direct attention and communicate the structure of an interface.',
    'A shared color treatment can mark related items as one group.',
    'Different background colors can separate regions such as navigation and page content.',
    'Interfaces often use green for success, red for errors, and yellow for warnings. Repeated use turns these conventions into status cues.',
    'Saturated colors on unrelated elements create competing signals and make the primary action harder to identify.',
  ],
};
