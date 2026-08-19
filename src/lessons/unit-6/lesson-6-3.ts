import type { LessonConfig } from '../../types/lesson.ts';

export const lesson6_3: LessonConfig = {
  id: 'u6-l3', unitId: 'unit-6',
  title: 'Brand Constraints and Hierarchy',
  interactionType: 'brand-pressure',
  glossaryTerms: ['accent overuse', 'brand color', 'supporting palette', 'tonal scale'],
  reviewTags: ['brand', 'hierarchy', 'neutrals', 'balance'],
  steps: [
    { id: 's1', text: 'Unit 1 showed that hierarchy requires restraint — accent colors lose impact when overused. Brand colors pose the same risk at a system level: chosen for marketing materials with high contrast and bold typography, they can overwhelm an interface when applied to backgrounds, small labels, icons, and states simultaneously.', highlights: ['brand color', 'accent overuse'] },
    { id: 's2', text: 'A brand color works best as an anchor for one or two interactive roles: the primary action button, the primary link, and the highlight accent. Beyond that, neutrals and tonal steps carry the structural weight.', highlights: ['supporting palette'] },
    { id: 's3', text: 'Supporting neutrals do most of the interface work: page backgrounds, card surfaces, body text, dividers, and secondary actions. A strong neutral system gives the brand color space to stand out when it appears.' },
    { id: 's4', text: 'A tonal scale expands the brand anchor into lighter and darker variants. These variants support disabled states, hover states, and semantic variations without changing the hue family.', highlights: ['tonal scale'] },
    { id: 's5', text: 'In the brand pressure challenge, you will build around a provided brand color. Your task: keep the brand recognizable while maintaining text hierarchy, readable contrast, and clear interactive roles. A balance meter warns if the brand color dominates too much.' },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Build an interface system around the given brand color. Keep the brand visible but ensure text is readable, hierarchy is clear, and not every element uses the accent.',
      type: 'system-build',
      hints: [
        'Put the brand on the primary action button first. Everything else can be neutral until you have a clear structure.',
        'Test your primary text against your page background — this pair must pass contrast before styling anything else.',
        'If the brand color dominates too much, move it to interactive roles only and use neutrals for surfaces.',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Why is one brand color not enough to build a complete interface?',
      choices: [
        { id: 'a', label: 'Brand colors are always too dark', isCorrect: false, explanation: 'Brand colors vary in darkness — that is not the core limitation.' },
        { id: 'b', label: 'Interfaces need neutrals, surface levels, text hierarchy, states, and semantic roles — one hue cannot cover all of these without creating confusion', isCorrect: true, explanation: 'Correct. A single hue cannot serve structural, semantic, and interactive roles simultaneously without losing distinction.' },
        { id: 'c', label: 'Regulations require multiple colors', isCorrect: false, explanation: 'No regulation specifies a minimum number of colors in an interface.' },
        { id: 'd', label: 'Brand guidelines always forbid overuse', isCorrect: false, explanation: 'Brand guidelines do not typically restrict color count in this way.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A strong saturated brand color appears on page backgrounds, cards, buttons, links, icons, and badges simultaneously. What is the likely result?',
      choices: [
        { id: 'a', label: 'The brand becomes more recognizable', isCorrect: false, explanation: 'Overuse actually makes the brand feel overwhelming, not more recognizable.' },
        { id: 'b', label: 'Contrast improves everywhere', isCorrect: false, explanation: 'Contrast depends on lightness relationships, not on saturation of the dominant color.' },
        { id: 'c', label: 'Hierarchy collapses — every element competes equally for attention, making the interface hard to scan', isCorrect: true, explanation: 'Correct. When everything uses the same emphasis, nothing stands out and scanning becomes difficult.' },
        { id: 'd', label: 'Users trust the product more', isCorrect: false, explanation: 'Brand overuse typically reduces usability, which erodes trust.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What is the most effective role for a saturated brand color in an interface?',
      choices: [
        { id: 'a', label: 'Page backgrounds', isCorrect: false, explanation: 'Saturated page backgrounds make text hard to read and create visual fatigue.' },
        { id: 'b', label: 'Primary interactive elements — buttons, links, and key highlights — where it needs to attract attention', isCorrect: true, explanation: 'Brand colors earn attention, so they belong on the interactive elements that need to attract clicks.' },
        { id: 'c', label: 'All text colors', isCorrect: false, explanation: 'Saturated colors on text can reduce readability and create visual noise.' },
        { id: 'd', label: 'Chart backgrounds', isCorrect: false, explanation: 'Chart backgrounds should be neutral to avoid interfering with data encoding.' },
      ],
    },
  ],
  keyPoints: [
    'Brand colors are anchors, not complete systems — interfaces also need neutrals, tonal steps, and semantic roles.',
    'Put the brand color on primary interactive roles (buttons, links, highlights); use neutrals for structure and content.',
    'A tonal scale expands one brand hue into lighter/darker variants for states and hierarchy without introducing new hues.',
    'Accent overuse occurs when the brand color appears on everything — hierarchy collapses and nothing stands out.',
  ],
};
