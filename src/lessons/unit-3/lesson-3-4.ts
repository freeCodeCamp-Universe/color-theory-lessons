import type { LessonConfig } from '../../types/lesson.ts';

export const lesson3_4: LessonConfig = {
  id: 'u3-l4',
  unitId: 'unit-3',
  title: 'Alpha, Transparency, and Layered Color',
  description:
    'Go deeper on RGBA behavior by testing how opacity and layering change perceived color over different backgrounds.',
  learningGoal:
    'Use alpha deliberately and explain why the same overlay looks different on different backgrounds.',
  estimatedMinutes: 14,
  prerequisites: ['u3-l3'],
  conceptsIntroduced: [
    'alpha',
    'opacity',
    'transparency',
    'overlay',
    'scrim',
    'blend perception',
    'layered interface',
  ],
  interactionType: 'alpha-layer',
  glossaryTerms: [
    'opacity',
    'transparency',
    'overlay',
    'scrim',
    'blend perception',
    'layered interface',
  ],
  reviewTags: ['formats', 'alpha', 'transparency', 'layering'],
  steps: [
    {
      id: 's1',
      text: 'In the previous lesson you saw RGBA notation. Here you will apply it in context. A fully opaque color blocks everything behind it, while a semi-transparent color lets background values show through. Alpha controls this: 1 is fully opaque, 0 is fully transparent.',
      highlights: ['alpha', 'opacity', 'transparency'],
    },
    {
      id: 's2',
      text: 'Designers use transparency for hover states, modal backdrops (scrims), disabled states, image overlays, and subtle layered surfaces. A single semi-transparent value can feel completely different depending on the background underneath.',
      highlights: ['scrim', 'overlay'],
    },
    {
      id: 's3',
      text: 'This is important: the perceived result is relational. A dark overlay at 50% opacity looks subtle on a dark background but heavy on a light background. You cannot judge a transparent color in isolation — the background always matters.',
      highlights: ['blend perception'],
    },
    {
      id: 's4',
      text: 'Transparency can also create accessibility problems. Semi-transparent text over a textured or variable background may become unreadable in some areas. Always test overlays in realistic contexts, not just on a blank page.',
    },
    {
      id: 's5',
      text: 'Use the layer stack simulator. Choose a foreground color, adjust its alpha, and place it over different backgrounds to see how the perceived result changes.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt:
        'Create four useful overlays: a modal scrim, a card hover state, an image text overlay, and a disabled button state. Adjust the foreground color and alpha for each context.',
      type: 'fix-interface',
      hints: [
        'A modal scrim is usually a dark color at around 40-60% opacity — enough to dim the background without hiding it completely.',
        'Hover states are typically subtle — try a light or dark overlay at low opacity (10-20%).',
        'For text readability over images, you need enough overlay opacity that the text contrast passes.',
      ],
      successCriteria: 'All four overlay contexts completed.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why can the same transparent overlay look different on two different backgrounds?',
      choices: [
        {
          id: 'a',
          label: 'Because the browser renders alpha differently depending on the page theme',
          isCorrect: false,
          explanation:
            'Alpha rendering is consistent. The difference comes from the background color blending with the semi-transparent foreground.',
        },
        {
          id: 'b',
          label: 'Because the perceived color is a blend of the foreground and whatever is underneath',
          isCorrect: true,
          explanation:
            'A semi-transparent layer mixes visually with the background. A dark overlay on white looks gray, but the same overlay on a dark background is barely visible.',
        },
        {
          id: 'c',
          label: 'Because alpha values are relative to screen brightness',
          isCorrect: false,
          explanation:
            'Alpha is independent of screen brightness. The visual difference comes from the background color, not the display hardware.',
        },
        {
          id: 'd',
          label: 'Because transparent colors lose their hue over dark backgrounds',
          isCorrect: false,
          explanation:
            'The hue does not disappear. The perceived result is a mix of both layers — the hue is still present, but the final appearance depends on what is underneath.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'What is a scrim in interface design?',
      choices: [
        {
          id: 'a',
          label: 'A full-screen loading indicator',
          isCorrect: false,
          explanation:
            'A scrim is specifically a semi-transparent overlay, often used behind modals or dialogs to dim the background content.',
        },
        {
          id: 'b',
          label: 'A semi-transparent overlay used to dim background content, typically behind a modal or dialog',
          isCorrect: true,
          explanation:
            'Scrims help focus user attention on foreground content by visually reducing the prominence of the background.',
        },
        {
          id: 'c',
          label: 'A border effect that separates two interface sections',
          isCorrect: false,
          explanation: 'Borders separate sections visually, but a scrim specifically refers to a transparent overlay layer.',
        },
        {
          id: 'd',
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
          id: 'a',
          label: 'Opaque black text on a white background',
          isCorrect: false,
          explanation: 'This is the highest possible contrast pairing — very safe for readability.',
        },
        {
          id: 'b',
          label: 'Semi-transparent white text over a variable photo background',
          isCorrect: true,
          explanation:
            'A variable background means the contrast changes from region to region. Some areas may pass, while others make the text nearly invisible.',
        },
        {
          id: 'c',
          label: 'Dark gray text on a light gray card',
          isCorrect: false,
          explanation: 'If the contrast is sufficient, this is fine. It is predictable because both colors are opaque.',
        },
        {
          id: 'd',
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
