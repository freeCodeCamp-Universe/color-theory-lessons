import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson3_4: LessonConfig = {
  id: 'u3-l4',
  unitId: 'unit-3',
  title: LESSON_TITLES['u3-l4'],
  interactionType: 'alpha-layer',
  reviewTags: ['formats', 'alpha', 'layering'],
  steps: [
    {
      text: 'In the previous lesson you saw how CSS adds an alpha value after a slash. Here you will apply alpha in context. A fully opaque color blocks everything behind it, while a semi-transparent color lets background values show through. Alpha controls this: 1 is fully opaque, 0 is fully transparent.',
    },
    {
      text: 'Designers use transparency for hover states, modal backdrops (scrims), disabled states, image overlays, and subtle layered surfaces. A semi-transparent color produces a different result when the background changes.',
    },
    {
      text: 'A semi-transparent layer combines with the background beneath it. For example, a black overlay at 50% opacity changes a dark background less than it changes a light background. Evaluate the composited result, not the overlay color alone.',
    },
    {
      text: 'Transparency can reduce contrast. Semi-transparent text over a textured or variable background may meet the required contrast ratio in one area and fall below it in another. Test the final text and background colors across the full range of the background.',
    },
    {
      text: 'Use the layer stack simulator. Choose a foreground color, adjust its alpha, and place it over different backgrounds to see how the perceived result changes.',
    },
  ],
  challenge: {
      prompt:
        'Create four useful overlays: a modal scrim, a card hover state, an image text overlay, and a disabled button state. Adjust the foreground color and alpha for each context.',
      hints: [
        'For the modal scrim, try a dark overlay between 40% and 60% opacity. It should dim the background while leaving it visible.',
        'For the hover state, try a light or dark overlay between 10% and 20% opacity.',
        'For text over the image, choose a dark overlay between 45% and 80% opacity.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why can the same transparent overlay look different on two different backgrounds?',
      choices: [
        {
          stableId: 'because-the-browser-renders-alpha-differently-depending-on-the-p',
          label: 'Because the browser renders alpha differently depending on the page theme',
          isCorrect: false,
          explanation:
            'Alpha rendering is consistent. The difference comes from the background color blending with the semi-transparent foreground.',
        },
        {
          stableId: 'because-the-perceived-color-is-a-blend-of-the-foreground-and-wha',
          label: 'Because the perceived color is a blend of the foreground and whatever is underneath',
          isCorrect: true,
          explanation:
            'A semi-transparent layer mixes visually with the background. A dark overlay on white looks gray, but the same overlay on a dark background is barely visible.',
        },
        {
          stableId: 'because-alpha-values-are-relative-to-screen-brightness',
          label: 'Because alpha values are relative to screen brightness',
          isCorrect: false,
          explanation:
            'Alpha is independent of screen brightness. The visual difference comes from the background color, not the display hardware.',
        },
        {
          stableId: 'because-transparent-colors-lose-their-hue-over-dark-backgrounds',
          label: 'Because transparent colors lose their hue over dark backgrounds',
          isCorrect: false,
          explanation:
            'The hue does not disappear. A semi-transparent foreground still contributes its color, and the background contributes to the final composited color.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What is a scrim in interface design?',
      choices: [
        {
          stableId: 'a-full-screen-loading-indicator',
          label: 'A full-screen loading indicator',
          isCorrect: false,
          explanation:
            'A scrim is specifically a semi-transparent overlay, often used behind modals or dialogs to dim the background content.',
        },
        {
          stableId: 'a-semi-transparent-overlay-used-to-dim-background-content-typica',
          label: 'A semi-transparent overlay used to dim background content, typically behind a modal or dialog',
          isCorrect: true,
          explanation:
            'Scrims help focus user attention on foreground content by visually reducing the prominence of the background.',
        },
        {
          stableId: 'a-border-effect-that-separates-two-interface-sections',
          label: 'A border effect that separates two interface sections',
          isCorrect: false,
          explanation: 'Borders separate sections visually, but a scrim specifically refers to a transparent overlay layer.',
        },
        {
          stableId: 'a-css-filter-that-blurs-background-content',
          label: 'A CSS filter that blurs background content',
          isCorrect: false,
          explanation: 'Blur is a separate technique. A scrim is a color overlay with transparency, not a blur filter.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which situation is riskiest for readability?',
      choices: [
        {
          stableId: 'opaque-black-text-on-a-white-background',
          label: 'Opaque black text on a white background',
          isCorrect: false,
          explanation: 'Opaque black text on a white background has a 21:1 contrast ratio, the maximum possible ratio.',
        },
        {
          stableId: 'semi-transparent-white-text-over-a-variable-photo-background',
          label: 'Semi-transparent white text over a variable photo background',
          isCorrect: true,
          explanation:
            'A variable background means the contrast changes from region to region. Some areas may pass, while others make the text nearly invisible.',
        },
        {
          stableId: 'dark-gray-text-on-a-light-gray-card',
          label: 'Dark gray text on a light gray card',
          isCorrect: false,
          explanation: 'If the contrast is sufficient, this is fine. It is predictable because both colors are opaque.',
        },
        {
          stableId: 'a-tinted-button-with-fully-opaque-text',
          label: 'A tinted button with fully opaque text',
          isCorrect: false,
          explanation: 'As long as the contrast ratio passes, fully opaque text on a solid button is reliable.',
        },
      ],
    },
  ],
  keyPoints: [
    'RGBA notation becomes useful only in context: this lesson focuses on how alpha behaves in layered interfaces.',
    'Alpha (0-1) controls how transparent a color is — 0 is invisible, 1 is fully opaque.',
    'The perceived result of a semi-transparent color depends on the background underneath — you cannot judge it in isolation.',
    'Designers use alpha for hover states, modal scrims, disabled states, image overlays, and subtle layered surfaces.',
    'Semi-transparent text over variable backgrounds (like photos) is especially risky for readability.',
    'Always test overlays on realistic backgrounds, not just on a blank canvas.',
  ],
};
