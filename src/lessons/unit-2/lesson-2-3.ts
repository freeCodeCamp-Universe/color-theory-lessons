import type { LessonConfig } from '../../types/lesson.ts';

export const lesson2_3: LessonConfig = {
  id: 'u2-l3',
  unitId: 'unit-2',
  title: 'Why Paint Logic Fails on Screens',
  description: 'Unlearn the most common mistaken intuitions borrowed from paint and pigment — and replace them with screen-first thinking.',
  learningGoal: 'Identify at least two examples of pigment-based reasoning being misapplied to screen design and rewrite them using additive logic.',
  estimatedMinutes: 11,
  prerequisites: ['u2-l2'],
  conceptsIntroduced: ['paint logic', 'screen logic', 'mental model', 'emitted color', 'reflected color'],
  interactionType: 'logic-fixer',
  glossaryTerms: ['paint logic', 'screen logic', 'mental model'],
  reviewTags: ['additive', 'mental-models', 'color-models'],
  steps: [
    {
      id: 's1',
      text: 'Many beginners apply paint intuition to screen design. This is understandable — paint is familiar. But screens are not layering wet pigment. They are controlling emitted light, and that changes how mixing, darkening, and brightening all work.',
    },
    {
      id: 's2',
      text: 'With paint, mixing more colors absorbs more wavelengths and tends to produce darker, muddier results. With screen color, raising more channels adds more light — the result gets brighter, not muddier. More color on screen moves toward white, not mud.',
      highlights: ['muddier', 'brighter'],
    },
    {
      id: 's3',
      text: 'When a screen color looks dark, it is because the channel values are low — there is little light. Brightening it means raising the values, not thinning or diluting the color the way you would add water to paint.',
    },
    {
      id: 's4',
      text: 'Red and green paint make a brownish mess. Red and green light make yellow. The same color names produce completely opposite visible results across the two models. Knowing which model you are in changes what you predict.',
      highlights: ['yellow'],
    },
    {
      id: 's5',
      text: 'The tool shows statements where a designer applies paint logic to a screen problem. For each one, pick the rewrite that uses correct screen-first thinking.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Each statement applies paint logic to a screen problem. Pick the rewrite that uses correct screen-first reasoning.',
      type: 'identify-problem',
      hints: [
        'Ask: is this object emitting light or reflecting it? The answer changes everything.',
        'On screens, "darker" means lower channel values — less light. It does not mean more pigment.',
        'If the explanation uses words like "muddy," "dilute," or "absorb," it is probably paint logic.',
      ],
      successCriteria: 'All three scenarios correctly identified using additive reasoning.',
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which statement best explains why screens use the RGB model?',
      choices: [
        { id: 'a', label: 'RGB matches the three pigment primaries used in print.', isCorrect: false, explanation: 'Print uses CMYK, not RGB. RGB is the screen model because displays emit red, green, and blue light.' },
        { id: 'b', label: 'RGB channels correspond to the three light sources that displays physically emit.', isCorrect: true, explanation: 'Screens control red, green, and blue light. RGB describes that emitted light directly — it is not a convention but a physical fact about display hardware.' },
        { id: 'c', label: 'RGB is simpler to work with than paint colors.', isCorrect: false, explanation: 'Simplicity is not the reason. The model matches how display hardware actually works.' },
        { id: 'd', label: 'RGB produces more colors than other models.', isCorrect: false, explanation: 'The range of colors is determined by the display gamut, not by the model name. RGB is used because it reflects physical reality.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A designer says: "I will darken this button by mixing in some black, like I would with paint." What is wrong with this reasoning?',
      choices: [
        { id: 'a', label: 'Nothing — black works the same way on screen as in paint.', isCorrect: false, explanation: 'On screen, darkening means reducing channel values, not blending a black pigment in.' },
        { id: 'b', label: 'Screen darkening works by reducing channel values, not mixing pigment.', isCorrect: true, explanation: 'There is no "mixing" of pigment on a screen. Dark screen colors have lower R, G, B values — less light, not more black paint.' },
        { id: 'c', label: 'Black should be avoided in digital design.', isCorrect: false, explanation: 'Black is a valid screen color. The issue is describing darkening as pigment mixing when it is actually channel reduction.' },
        { id: 'd', label: 'Buttons should not be darkened using color.', isCorrect: false, explanation: 'Darkening is a valid design decision. The reasoning just needs to use screen logic, not paint logic.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which of these is a sign that a designer is using paint logic in a screen context?',
      choices: [
        { id: 'a', label: '"I will raise the blue channel to make this cooler."', isCorrect: false, explanation: 'This is correct screen logic — adjusting a specific channel to shift the color temperature.' },
        { id: 'b', label: '"Equal RGB values will give me a neutral gray."', isCorrect: false, explanation: 'This is correct screen logic — equal channels neutralize into gray.' },
        { id: 'c', label: '"Mixing more screen colors will make the result muddier."', isCorrect: true, explanation: 'Muddiness describes pigment mixing. On screen, more active channels add brightness, not mud. This is paint logic applied to the wrong model.' },
        { id: 'd', label: '"Low channel values produce dark colors on screen."', isCorrect: false, explanation: 'This is correct screen logic — dark colors have low R, G, B values because there is little light.' },
      ],
    },
  ],
  keyPoints: [
    'Screen logic: mixing more light makes colors brighter; combining all primaries at full strength gives white.',
    'Paint logic: mixing more pigment makes colors darker; all primaries combined approach black.',
    'The two mental models are not interchangeable — applying paint logic to screens produces wrong predictions.',
    'Designers who move between print and screen work need to consciously switch models.',
    'Black on a screen is the complete absence of emitted light, not a color mixed from other colors.',
  ],
};
