import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson2_3: LessonConfig = {
  id: 'u2-l3',
  unitId: 'unit-2',
  title: LESSON_TITLES['u2-l3'],
  interactionType: 'logic-fixer',
  reviewTags: ['additive', 'mental-models', 'color-models'],
  steps: [
    {
      text: 'Paint is a familiar reference point, but it can lead to wrong predictions about screen color. Paint changes which wavelengths of incoming light are reflected, while screens control emitted RGB light. This difference changes how each medium mixes, darkens, and brightens colors.',
    },
    {
      text: 'Mixing pigments often increases the range of wavelengths absorbed, producing darker and less saturated results. On a screen, increasing RGB channel values increases emitted light. Raising all three values moves the color toward white.',
    },
    {
      text: 'A dark screen color has low RGB channel values and emits little light. To brighten it, raise one or more channel values. This process differs from changing a paint mixture.',
    },
    {
      text: 'A mixture of red and green paint can produce brown, while equal-intensity red and green light produces yellow. The same color names can produce different results in the two models. Identify the model before predicting the result.',
    },
    {
      text: 'The tool shows statements where a designer applies paint logic to a screen problem. For each one, pick the rewrite that uses correct screen-first thinking.',
    },
  ],
  challenge: {
      prompt: 'Each statement applies paint logic to a screen problem. Pick the rewrite that uses correct screen-first reasoning.',
      hints: [
        'Ask whether the color comes from emitted light or from a material reflecting incoming light.',
        'On screens, lower RGB channel values mean less emitted light and a darker color.',
        'Terms such as "muddy," "dilute," and "absorb" usually describe pigments rather than RGB light.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Which statement best explains why screens use the RGB model?',
      choices: [
        { stableId: 'rgb-matches-the-three-pigment-primaries-used-in-print', label: 'RGB matches the three pigment primaries used in print.', isCorrect: false, explanation: 'Print commonly uses CMYK, not RGB. Color displays produce pixel colors from red, green, and blue light components.' },
        { stableId: 'rgb-channels-correspond-to-the-three-light-sources-that-displays', label: 'RGB channels represent the red, green, and blue light components of a display pixel.', isCorrect: true, explanation: 'Most color displays control red, green, and blue components at each pixel. RGB channel values describe each component\'s contribution to the displayed color.' },
        { stableId: 'rgb-is-simpler-to-work-with-than-paint-colors', label: 'RGB is simpler to work with than paint colors.', isCorrect: false, explanation: 'Simplicity is not the reason. The model corresponds to the red, green, and blue components controlled by most color displays.' },
        { stableId: 'rgb-produces-more-colors-than-other-models', label: 'RGB produces more colors than other models.', isCorrect: false, explanation: 'A display\'s gamut determines the range of colors it can reproduce. RGB matches the red, green, and blue light controlled by most color displays.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A designer says: "I will darken this button by mixing in some black, like I would with paint." What is wrong with this reasoning?',
      choices: [
        { stableId: 'nothing-black-works-the-same-way-on-screen-as-in-paint', label: 'Nothing. Black works the same way on screen as in paint.', isCorrect: false, explanation: 'On a screen, reducing RGB channel values lowers the emitted light. No black pigment is added.' },
        { stableId: 'screen-darkening-works-by-reducing-channel-values-not-mixing-pig', label: 'Screen darkening works by reducing channel values, not mixing pigment.', isCorrect: true, explanation: 'A screen color becomes darker when its RGB values are reduced, so the display emits less light.' },
        { stableId: 'black-should-be-avoided-in-digital-design', label: 'Black should be avoided in digital design.', isCorrect: false, explanation: 'Black is a valid screen color. The mistake is describing RGB channel reduction as pigment mixing.' },
        { stableId: 'buttons-should-not-be-darkened-using-color', label: 'Buttons should not be darkened using color.', isCorrect: false, explanation: 'Darkening is a valid design decision. The reasoning just needs to use screen logic, not paint logic.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Which of these is a sign that a designer is using paint logic in a screen context?',
      choices: [
        { stableId: 'i-will-raise-the-blue-channel-to-make-this-cooler', label: '"I will raise the blue channel to make this cooler."', isCorrect: false, explanation: 'Raising the blue channel can shift a screen color toward a cooler appearance.' },
        { stableId: 'equal-rgb-values-will-give-me-a-neutral-gray', label: '"Equal RGB values will give me a neutral gray."', isCorrect: false, explanation: 'In RGB notation, equal channel values represent a neutral gray.' },
        { stableId: 'mixing-more-screen-colors-will-make-the-result-muddier', label: '"Raising all three RGB channel values will make the result muddier."', isCorrect: true, explanation: 'Raising all three RGB channel values adds emitted light and moves the color toward white.' },
        { stableId: 'low-channel-values-produce-dark-colors-on-screen', label: '"Low channel values produce dark colors on screen."', isCorrect: false, explanation: 'Low RGB channel values represent little emitted light, producing a dark screen color.' },
      ],
    },
  ],
  keyPoints: [
    'Increasing RGB channel values adds emitted light; raising all three values moves the color toward white.',
    'Mixing pigments often increases the wavelengths absorbed, producing darker and less saturated results.',
    'Paint and screen models are not interchangeable. Applying paint logic to screens produces wrong predictions.',
    'Identify whether color comes from emitted light or a material before predicting how it will mix.',
    'A screen color becomes darker when its RGB values decrease and the display emits less light; no black pigment is added.',
  ],
};
