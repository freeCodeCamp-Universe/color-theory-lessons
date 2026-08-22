import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson2_4: LessonConfig = {
  id: 'u2-l4',
  unitId: 'unit-2',
  title: LESSON_TITLES['u2-l4'],
  interactionType: 'mismatch-explainer',
  reviewTags: ['subtractive', 'print', 'color-models', 'practical'],
  steps: [
    {
      text: 'Pigments and inks do not shine light out at the viewer. They absorb some wavelengths of incoming light and reflect others back to your eye. The result depends on the material and on the wavelengths and intensity of the light striking it.',
    },
    {
      text: 'A screen emits light directly, while ink and paint absorb some wavelengths of incoming light and reflect others. A display can produce colors that a particular ink-and-paper combination cannot reproduce, so a physical result can differ from its screen preview.',
    },
    {
      text: 'The range of colors a device or medium can reproduce is called its gamut. Each display and print process has its own gamut. A color that falls inside a display’s gamut can fall outside the gamut of a specific ink, printer, and paper combination.',
    },
    {
      text: 'Screen-first designers encounter this difference when their work moves to packaging, printed cards, branded merchandise, or signage. A mismatch does not by itself prove that someone made an error. The display and the physical material produce color through different processes.',
    },
    {
      text: 'A screen preview cannot guarantee how ink will look on a physical material. A physical color standard such as a Pantone swatch gives designers and suppliers a shared target that they can compare under controlled lighting. The material, finish, lighting, and condition of the swatch can still affect its appearance.',
    },
    {
      text: 'The comparison tool shows a screen color beside a simulated material result. The simulation illustrates possible differences; it does not predict the result for a specific material. For each scenario, identify the reasons that explain the difference.',
    },
  ],
  challenge: {
      prompt: 'For each scenario, select every reason that explains why the screen color and the physical version look different.',
      hints: [
        'Compare the light each medium sends to your eyes: a screen emits light, while a physical material reflects it.',
        'A mismatch can result from the two color processes even when the designer and printer follow their specifications.',
        'Check whether the material, surface finish, ambient lighting, or gamut could change the result.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'A printed brochure shows a company\'s brand color. Which color model best describes how that color is produced?',
      choices: [
        { stableId: 'additive-the-ink-emits-rgb-light', label: 'Additive: the ink emits RGB light', isCorrect: false, explanation: 'Ink does not emit light. It absorbs some wavelengths and reflects others.' },
        { stableId: 'subtractive-the-ink-absorbs-some-wavelengths-and-reflects-others', label: 'Subtractive: the ink absorbs some wavelengths and reflects others', isCorrect: true, explanation: 'Printing uses subtractive color. The ink absorbs some wavelengths of incoming light and reflects the rest toward the viewer.' },
        { stableId: 'neither-print-uses-a-completely-separate-model', label: 'Neither: print uses a separate model', isCorrect: false, explanation: 'Printing with inks is an example of subtractive color.' },
        { stableId: 'both-equally', label: 'Both equally', isCorrect: false, explanation: 'Print is subtractive. Screens are additive. They are distinct models, not a mix.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'A brand color will appear on a website and printed packaging. What gives the print supplier the clearest physical color target?',
      choices: [
        { stableId: 'export-the-same-hex-value-to-the-print-file', label: 'Send the website’s hex value as the only print specification.', isCorrect: false, explanation: 'A hex value encodes an RGB color, not a physical ink target. The print workflow needs a suitable color conversion or physical reference.' },
        { stableId: 'use-a-physical-color-standard-like-a-pantone-swatch-as-the-share', label: 'Give the supplier a current Pantone swatch as the shared reference.', isCorrect: true, explanation: 'A physical swatch gives the designer and supplier a target to compare under controlled conditions. They must still account for the packaging material, finish, inks, and printing process.' },
        { stableId: 'adjust-screen-brightness-until-the-screen-matches-the-print-samp', label: 'Adjust the screen brightness until the preview matches a print sample by eye.', isCorrect: false, explanation: 'Changing screen brightness does not define or change the ink and material used for production.' },
        { stableId: 'use-a-slightly-different-hue-in-print-to-compensate-for-the-expe', label: 'Guess a different print hue to compensate for the expected change.', isCorrect: false, explanation: 'A guessed adjustment does not give the supplier a repeatable physical target.' },
      ],
    },
    {
      id: 'q3',
      prompt: 'Why is subtractive color useful to a developer who mainly builds web apps?',
      choices: [
        { stableId: 'web-apps-sometimes-use-blue-which-is-a-subtractive-primary', label: 'Web apps use blue, which is a subtractive primary.', isCorrect: false, explanation: 'Blue is an additive primary in RGB. The subtractive primaries used in CMY mixing are cyan, magenta, and yellow.' },
        { stableId: 'understanding-the-subtractive-model-explains-why-screen-to-physi', label: 'It explains why a digital color can change when the design moves to physical media.', isCorrect: true, explanation: 'A web product’s colors may also appear on stickers, merchandise, packaging, or printed material. Subtractive color explains why those results can differ from the screen version.' },
        { stableId: 'subtractive-color-affects-how-browsers-render-colors', label: 'Subtractive color affects how browsers render colors.', isCorrect: false, explanation: 'Browsers render using additive RGB. Subtractive color is not part of the browser rendering model.' },
        { stableId: 'you-need-to-know-cmyk-to-pass-design-job-interviews', label: 'Every design job interview tests CMYK knowledge.', isCorrect: false, explanation: 'Interview requirements do not explain how subtractive color applies when digital work moves to physical media.' },
      ],
    },
  ],
  keyPoints: [
    'A gamut is the range of colors a device or medium can reproduce.',
    'A color inside a display’s gamut can fall outside the gamut of a specific ink, printer, and paper combination.',
    'Pigments and inks absorb some wavelengths of incoming light and reflect others toward the viewer.',
    'A screen preview cannot guarantee how ink will look on a physical material.',
    'A physical color standard such as a Pantone swatch provides a shared target, but material, finish, lighting, and swatch condition still affect its appearance.',
  ],
};
