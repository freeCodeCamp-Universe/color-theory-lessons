import type { LessonConfig } from '../../types/lesson.ts';

export const lesson2_4: LessonConfig = {
  id: 'u2-l4',
  unitId: 'unit-2',
  title: 'Subtractive Color for Digital Designers',
  description: 'Understand why physical materials can look different from on-screen previews — and why that gap is not a mistake.',
  learningGoal: 'Explain why a screen color and its printed equivalent differ, using the correct model for each.',
  estimatedMinutes: 11,
  prerequisites: ['u2-l3'],
  conceptsIntroduced: ['subtractive primary', 'absorption', 'reflection', 'surface', 'medium', 'print preview', 'material color', 'color gamut'],
  interactionType: 'mismatch-explainer',
  glossaryTerms: ['absorption', 'reflection', 'color gamut', 'subtractive primary'],
  reviewTags: ['subtractive', 'print', 'color-models', 'practical'],
  steps: [
    {
      id: 's1',
      text: 'Pigments and inks do not shine light out at the viewer. They absorb some wavelengths of incoming light and reflect others back to your eye. The result depends on both the material and the quality of the light hitting it.',
      highlights: ['absorb', 'reflect'],
    },
    {
      id: 's2',
      text: 'A screen can display extremely vivid colors because it emits light directly. Print inks and paint can only reflect incoming light — they cannot reproduce that brightness. This creates a predictable gap between screen previews and physical results.',
    },
    {
      id: 's3',
      text: 'The range of colors a device or medium can reproduce is called its gamut. Screens have a wide gamut because they emit light. Most print processes have a narrower gamut — some screen colors simply cannot be recreated with ink.',
      highlights: ['gamut'],
    },
    {
      id: 's4',
      text: 'For screen-first designers, this matters whenever work crosses into physical materials — packaging, printed cards, branded merchandise, signage. The difference is not a printing error. It is a fundamental difference between two color models.',
    },
    {
      id: 's5-pantone',
      text: 'Because screens vary in calibration and gamut, no screen preview is a reliable reference for what ink on paper will look like. Physical color standards like Pantone exist to solve this: a numbered swatch looks the same regardless of which screen was used to design it, giving everyone in the production chain a shared ground truth.',
      highlights: ['Pantone'],
    },
    {
      id: 's6',
      text: 'The comparison tool shows the same color as a screen swatch and an approximation of how it might appear in print. In the challenge, you will identify the correct reasons why the two versions differ.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'For each scenario, select all the correct reasons why the screen color and the physical version look different. Some reasons are wrong — do not select those.',
      type: 'identify-problem',
      hints: [
        'Think about what each medium is actually doing: emitting light vs reflecting it.',
        'The gap is not always a mistake — it can be a natural consequence of different models.',
        'Surface finish, ambient lighting, and gamut limits are all real factors.',
      ],
      successCriteria: 'All correct reasons selected and no incorrect reasons selected across all scenarios.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'A printed brochure shows a company\'s brand color. Which color model best describes how that color is produced?',
      choices: [
        { id: 'a', label: 'Additive — the ink emits RGB light', isCorrect: false, explanation: 'Ink does not emit light. It absorbs some wavelengths and reflects others.' },
        { id: 'b', label: 'Subtractive — the ink absorbs some wavelengths and reflects others', isCorrect: true, explanation: 'Print is a subtractive process. The ink absorbs certain wavelengths of incoming light and reflects the rest to the viewer\'s eye.' },
        { id: 'c', label: 'Neither — print uses a completely separate model', isCorrect: false, explanation: 'Print is a classic example of subtractive color, using CMYK inks that absorb light selectively.' },
        { id: 'd', label: 'Both equally', isCorrect: false, explanation: 'Print is subtractive. Screens are additive. They are distinct models, not a mix.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A designer is shipping a brand color to both a website and a printed packaging run. What is the most reliable way to ensure both versions look intentionally matched?',
      choices: [
        { id: 'a', label: 'Export the same hex value to the print file.', isCorrect: false, explanation: 'Hex values describe RGB light. Print uses ink and a different gamut — the same hex will look different in print, not the same.' },
        { id: 'b', label: 'Use a physical color standard like a Pantone swatch as the shared reference.', isCorrect: true, explanation: 'A numbered physical swatch looks the same regardless of which screen was used to design it. It gives everyone in the production chain a shared ground truth.' },
        { id: 'c', label: 'Adjust screen brightness until the screen matches the print sample by eye.', isCorrect: false, explanation: 'Monitor brightness affects perception but does not change the print output. The gap is in the medium, not the display setting.' },
        { id: 'd', label: 'Use a slightly different hue in print to compensate for the expected dullness.', isCorrect: false, explanation: 'This creates two mismatched brand colors instead of one reliable reference. A color standard is the right tool for cross-media consistency.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A developer says: "I only build web apps, so subtractive color has nothing to teach me." What is the strongest counterargument?',
      choices: [
        { id: 'a', label: 'Web apps sometimes use blue, which is a subtractive primary.', isCorrect: false, explanation: 'This is unrelated — blue in RGB is an additive primary, not a subtractive one.' },
        { id: 'b', label: 'Understanding the subtractive model explains why screen-to-physical gaps exist, which matters whenever work crosses media.', isCorrect: true, explanation: 'Even screen-first designers encounter physical color — icons become stickers, brand colors go on merchandise, app colors appear in print. Knowing why the gap exists prevents false expectations.' },
        { id: 'c', label: 'Subtractive color affects how browsers render colors.', isCorrect: false, explanation: 'Browsers render using additive RGB. Subtractive color is not part of the browser rendering model.' },
        { id: 'd', label: 'You need to know CMYK to pass design job interviews.', isCorrect: false, explanation: 'This may or may not be true, but it is not the conceptual reason why subtractive color matters to screen designers.' },
      ],
    },
  ],
  keyPoints: [
    'Color gamut is the full range of colors a device or medium can reproduce.',
    'Screens generally have a wider gamut than print — some screen colors simply cannot be reproduced in ink.',
    'Pigments absorb certain wavelengths; the wavelengths not absorbed are what the eye perceives as color.',
    'Subtractive primaries (cyan, magenta, yellow) each absorb one third of white light when fully applied.',
    'Pantone is a standardized physical color reference system used to communicate exact color intent across screens and print, where screen preview cannot be trusted.',
  ],
};
