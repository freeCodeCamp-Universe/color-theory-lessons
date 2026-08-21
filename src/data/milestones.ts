import type { MilestoneConfig } from '../types/milestone.ts';

const milestone1: MilestoneConfig = {
  id: 'milestone-1',
  unitId: 'unit-1',
  title: 'Read the Interface',
  description: 'Classify five parts of an interface, then answer three questions about emphasis, contrast, and visual hierarchy.',
  estimatedMinutes: 12,
  heroVisual: 'interface-mockup',
  passThreshold: 4,
  parts: [
    {
      kind: 'challenge',
      id: 'm1-c1',
      title: 'Read the Interface',
      description: 'Classify five interface regions by their color roles.',
      challengeType: 'read-interface',
      briefing: 'Assign a color role to each listed region. You need at least 4 of 5 correct to finish the challenge.',
      successMessage: 'You correctly classified at least four of the five interface regions.',
      pointValue: 3,
    },
    {
      kind: 'quiz',
      id: 'm1-qz',
      title: 'Concept Check',
      description: 'Answer three questions about emphasis, contrast, and section separation.',
      questions: [
        {
          id: 'm1-q1',
          prompt: 'Which color treatment most clearly creates one focal point?',
          choices: [
            { id: 'a', label: 'Give every action a different saturated color', isCorrect: false, explanation: 'Several saturated colors create competing signals instead of one focal point.' },
            { id: 'b', label: 'Use the same accent treatment on every action', isCorrect: false, explanation: 'Matching treatments give the actions equal color emphasis.' },
            { id: 'c', label: 'Use one saturated accent while nearby elements use neutral colors', isCorrect: true, explanation: 'The single accent differs from its surroundings, so it receives the most color emphasis.' },
            { id: 'd', label: 'Make every element low contrast against its background', isCorrect: false, explanation: 'Low contrast can make content harder to distinguish and does not establish a focal point.' },
          ],
        },
        {
          id: 'm1-q2',
          prompt: 'A footer label has a low contrast ratio against its dark background. What is the most direct fix?',
          choices: [
            { id: 'a', label: 'Change the typeface to monospace', isCorrect: false, explanation: 'Changing the typeface does not repair the color pair\'s contrast ratio.' },
            { id: 'b', label: 'Increase the contrast ratio between the text and background', isCorrect: true, explanation: 'Changing the text color, the background color, or both can raise their contrast ratio.' },
            { id: 'c', label: 'Change only the text hue', isCorrect: false, explanation: 'A hue change does not guarantee a higher contrast ratio.' },
            { id: 'd', label: 'Make the text smaller', isCorrect: false, explanation: 'Smaller text is harder to read and does not improve the color pair\'s contrast ratio.' },
          ],
        },
        {
          id: 'm1-q3',
          prompt: 'What can a different background color do for one section of a page?',
          choices: [
            { id: 'a', label: 'Guarantee that every text color in the section is readable', isCorrect: false, explanation: 'Each text and background pair still needs its own contrast check.' },
            { id: 'b', label: 'Give every element in the section equal emphasis', isCorrect: false, explanation: 'Elements can still use different color treatments to establish hierarchy within the section.' },
            { id: 'c', label: 'Show that every element in the section is interactive', isCorrect: false, explanation: 'A section background groups or separates content; it does not make each element interactive.' },
            { id: 'd', label: 'Separate that section from the content around it', isCorrect: true, explanation: 'A background change creates a visible boundary between page sections.' },
          ],
        },
      ],
    },
  ],
};

const milestone2: MilestoneConfig = {
  id: 'milestone-2',
  unitId: 'unit-2',
  title: 'Mix for Screen',
  description: 'Predict how RGB channels combine, then answer three questions about screen color.',
  estimatedMinutes: 14,
  passThreshold: 4,
  parts: [
    {
      kind: 'challenge',
      id: 'm2-c1',
      title: 'Channel Prediction',
      description: 'Identify dominant RGB channels and predict the results of additive mixes.',
      challengeType: 'channel-prediction',
      briefing: 'For each of the four rounds, identify the dominant channel and predict the additive mix. You need at least 6 of 8 correct to finish the challenge.',
      successMessage: 'You correctly predicted at least six of the eight RGB channel and additive mix results.',
      pointValue: 3,
    },
    {
      kind: 'quiz',
      id: 'm2-qz',
      title: 'Concept Check',
      description: 'Answer three questions about RGB channels and additive color.',
      questions: [
        {
          id: 'm2-q1',
          prompt: 'Why do screens use the RGB color model?',
          choices: [
            { id: 'a', label: 'Screens typically create colors by combining red, green, and blue light', isCorrect: true, explanation: 'A screen controls red, green, and blue light to produce the colors in each pixel.' },
            { id: 'b', label: 'RGB can represent more colors than every other color model', isCorrect: false, explanation: 'A display\'s gamut determines which colors it can reproduce. The RGB model describes how its three light channels combine.' },
            { id: 'c', label: 'RGB describes how printers combine cyan, magenta, yellow, and black inks', isCorrect: false, explanation: 'Printers commonly use subtractive CMYK inks. Screens use additive RGB light.' },
            { id: 'd', label: 'Browsers accept only RGB color values', isCorrect: false, explanation: 'Browsers accept several color formats, including hexadecimal and HSL values.' },
          ],
        },
        {
          id: 'm2-q2',
          prompt: 'In additive color, what happens as you increase all three channels equally?',
          choices: [
            { id: 'a', label: 'The color gets lighter and moves toward white', isCorrect: true, explanation: 'Raising all three channels adds red, green, and blue light. At full intensity, the mix is white.' },
            { id: 'b', label: 'The color always becomes more saturated', isCorrect: false, explanation: 'Raising all three channels together moves the color toward white, which reduces its saturation.' },
            { id: 'c', label: 'The hue shifts toward magenta', isCorrect: false, explanation: 'Magenta requires more red and blue than green. Equal channel changes do not create that balance.' },
            { id: 'd', label: 'The color changes from additive to subtractive', isCorrect: false, explanation: 'The mixing model depends on whether light or physical materials produce the color, not on the channel values.' },
          ],
        },
        {
          id: 'm2-q3',
          prompt: 'What does red light mixed with green light produce when both are at full intensity?',
          choices: [
            { id: 'a', label: 'Yellow', isCorrect: true, explanation: 'In additive mixing, full red and green light produce yellow.' },
            { id: 'b', label: 'Blue', isCorrect: false, explanation: 'Blue is the third RGB channel. It is not part of this mix.' },
            { id: 'c', label: 'Black', isCorrect: false, explanation: 'Black represents no emitted light, while this mix uses two channels at full intensity.' },
            { id: 'd', label: 'Brown', isCorrect: false, explanation: 'Full red and green light produce yellow, not brown.' },
          ],
        },
      ],
    },
  ],
};

const milestone3: MilestoneConfig = {
  id: 'milestone-3',
  unitId: 'unit-3',
  title: 'Build a UI Palette in Code',
  description: 'Build a small theme from scratch with HSL controls, then answer practical token and format questions.',
  estimatedMinutes: 18,
  passThreshold: 5,
  parts: [
    {
      kind: 'challenge',
      id: 'm3-c1',
      title: 'Theme From Scratch',
      description: 'Create five core theme roles from HSL controls.',
      challengeType: 'theme-from-scratch',
      briefing: 'Build background, surface, text, and accent roles so readability and hierarchy checks pass.',
      successMessage: 'You built a coherent, role-based palette from a single starting hue.',
      pointValue: 4,
    },
    {
      kind: 'quiz',
      id: 'm3-qz',
      title: 'Concept Check',
      description: 'Three conceptual checks from Unit 3.',
      questions: [
        {
          id: 'm3-q1',
          prompt: 'Why are semantic token names (like --text-primary) better than visual names (like --dark-gray)?',
          choices: [
            { id: 'a', label: 'Semantic names stay valid when color values change', isCorrect: true, explanation: 'Role-based naming survives theme changes and refactors.' },
            { id: 'b', label: 'Semantic names render faster', isCorrect: false, explanation: 'Naming has no runtime rendering speed advantage.' },
            { id: 'c', label: 'Visual names provide better accessibility by default', isCorrect: false, explanation: 'Accessibility depends on chosen values and checks, not naming style.' },
            { id: 'd', label: 'Visual names are invalid CSS variables', isCorrect: false, explanation: 'Both are valid syntax; semantics are the difference.' },
          ],
        },
        {
          id: 'm3-q2',
          prompt: 'What does alpha in an RGBA color control?',
          choices: [
            { id: 'a', label: 'Transparency/opacity of the color layer', isCorrect: true, explanation: 'Alpha controls how much of the background shows through.' },
            { id: 'b', label: 'Hue angle', isCorrect: false, explanation: 'Hue is not encoded by alpha.' },
            { id: 'c', label: 'Saturation amount', isCorrect: false, explanation: 'Saturation belongs to HSL/HSV models.' },
            { id: 'd', label: 'Contrast ratio target', isCorrect: false, explanation: 'Contrast is computed from foreground/background luminance.' },
          ],
        },
        {
          id: 'm3-q3',
          prompt: 'What makes gradients risky for body text readability?',
          choices: [
            { id: 'a', label: 'Contrast varies across the gradient region', isCorrect: true, explanation: 'Text may pass in one area and fail in another.' },
            { id: 'b', label: 'Browsers cannot anti-alias gradient backgrounds', isCorrect: false, explanation: 'Gradients are fully supported in modern rendering.' },
            { id: 'c', label: 'Gradients disable semantic tokens', isCorrect: false, explanation: 'Tokens and gradients are unrelated mechanisms.' },
            { id: 'd', label: 'Gradients require CMYK values', isCorrect: false, explanation: 'Web gradients are not CMYK-based.' },
          ],
        },
      ],
    },
  ],
};

const milestone4: MilestoneConfig = {
  id: 'milestone-4',
  unitId: 'unit-4',
  title: 'Design Beyond Your Own Eyes',
  description: 'Use simulation and pattern-level reasoning to detect fragile interfaces, then confirm key Unit 4 concepts.',
  estimatedMinutes: 16,
  passThreshold: 5,
  parts: [
    {
      kind: 'challenge',
      id: 'm4-c1',
      title: 'Simulation Spotter',
      description: 'Find elements that fail under deuteranopia simulation and choose practical fixes.',
      challengeType: 'simulation-spotter',
      briefing: 'Flag the fragile elements and choose a valid fix strategy for each one.',
      successMessage: 'You combined detection and repair thinking under simulated vision constraints.',
      pointValue: 4,
    },
    {
      kind: 'quiz',
      id: 'm4-qz',
      title: 'Concept Check',
      description: 'Three conceptual checks from Unit 4.',
      questions: [
        {
          id: 'm4-q1',
          prompt: 'Which retinal cells are primarily responsible for color perception?',
          choices: [
            { id: 'a', label: 'Cones', isCorrect: true, explanation: 'Cone cells drive color discrimination.' },
            { id: 'b', label: 'Rods', isCorrect: false, explanation: 'Rods are dominant in low-light and do not provide full color vision.' },
            { id: 'c', label: 'Optic discs', isCorrect: false, explanation: 'Optic disc structure is not the color receptor mechanism.' },
            { id: 'd', label: 'Iris fibers', isCorrect: false, explanation: 'Iris controls pupil size, not color encoding.' },
          ],
        },
        {
          id: 'm4-q2',
          prompt: 'Why is color-only communication risky even for users without CVD?',
          choices: [
            { id: 'a', label: 'Environmental and device conditions can reduce color discernment', isCorrect: true, explanation: 'Glare, poor displays, and quick scanning can all weaken color-only cues.' },
            { id: 'b', label: 'All users see colors in grayscale at night', isCorrect: false, explanation: 'Perception changes are contextual, not absolute grayscale conversion.' },
            { id: 'c', label: 'Color-only states are invalid under CSS standards', isCorrect: false, explanation: 'The issue is usability/accessibility, not CSS validity.' },
            { id: 'd', label: 'Screen readers read colors incorrectly', isCorrect: false, explanation: 'Screen readers do not rely on color rendering for semantics.' },
          ],
        },
        {
          id: 'm4-q3',
          prompt: 'What is the strongest general fix for red/green chart confusion?',
          choices: [
            { id: 'a', label: 'Add labels or patterns so series are not distinguished by hue alone', isCorrect: true, explanation: 'Redundant non-color cues preserve distinction under simulation.' },
            { id: 'b', label: 'Increase saturation of both colors', isCorrect: false, explanation: 'Higher saturation does not reliably solve red/green confusion.' },
            { id: 'c', label: 'Use thinner lines', isCorrect: false, explanation: 'Line thickness does not establish semantic distinction.' },
            { id: 'd', label: 'Move chart legend to the top', isCorrect: false, explanation: 'Legend placement alone does not solve color-only ambiguity.' },
          ],
        },
      ],
    },
  ],
};

const milestone5: MilestoneConfig = {
  id: 'milestone-5',
  unitId: 'unit-5',
  title: 'Accessibility Rescue',
  description: 'Repair a multi-issue interface accessibility scenario, then complete a focused concept quiz.',
  estimatedMinutes: 18,
  passThreshold: 6,
  parts: [
    {
      kind: 'challenge',
      id: 'm5-c1',
      title: 'Accessibility Rescue',
      description: 'Fix mixed WCAG failures in a compact interface.',
      challengeType: 'accessibility-rescue',
      briefing: 'Repair text contrast, color-only signaling, focus visibility, and icon contrast in one pass.',
      successMessage: 'You repaired multiple accessibility failure categories in a single workflow.',
      pointValue: 4,
    },
    {
      kind: 'quiz',
      id: 'm5-qz',
      title: 'Concept Check',
      description: 'Four conceptual checks from Unit 5.',
      questions: [
        {
          id: 'm5-q1',
          prompt: 'What is the standard minimum contrast for normal body text?',
          choices: [
            { id: 'a', label: '4.5:1', isCorrect: true, explanation: 'WCAG AA for normal text is 4.5:1.' },
            { id: 'b', label: '3:1', isCorrect: false, explanation: '3:1 applies to large text or certain non-text elements.' },
            { id: 'c', label: '2:1', isCorrect: false, explanation: '2:1 is too low for readable body text.' },
            { id: 'd', label: '7:1 mandatory for all text', isCorrect: false, explanation: '7:1 is enhanced AAA, not universal minimum AA.' },
          ],
        },
        {
          id: 'm5-q2',
          prompt: 'What does WCAG 1.4.1 (Use of Color) primarily require?',
          choices: [
            { id: 'a', label: 'Do not rely on color as the only means of conveying information', isCorrect: true, explanation: 'Critical meaning must also be available via non-color cues.' },
            { id: 'b', label: 'Use only grayscale for UI states', isCorrect: false, explanation: 'Color use is allowed when not the sole signal.' },
            { id: 'c', label: 'Avoid red and green entirely', isCorrect: false, explanation: 'Hue restrictions are not blanket bans.' },
            { id: 'd', label: 'Always provide audio cues for form states', isCorrect: false, explanation: 'Requirement is about not relying solely on color.' },
          ],
        },
        {
          id: 'm5-q3',
          prompt: 'Why is visible focus styling essential?',
          choices: [
            { id: 'a', label: 'Keyboard users need to track current interaction target', isCorrect: true, explanation: 'Without visible focus, keyboard navigation becomes unusable.' },
            { id: 'b', label: 'It improves animation smoothness', isCorrect: false, explanation: 'Focus visibility is about operability, not animation.' },
            { id: 'c', label: 'It reduces bundle size', isCorrect: false, explanation: 'No direct relation to bundle size.' },
            { id: 'd', label: 'It replaces semantic HTML', isCorrect: false, explanation: 'Semantic HTML and focus visibility are complementary.' },
          ],
        },
        {
          id: 'm5-q4',
          prompt: 'What is the most scalable way to reduce repeated accessibility regressions?',
          choices: [
            { id: 'a', label: 'Fix patterns/components once so improvements propagate', isCorrect: true, explanation: 'Pattern-level remediation scales across screens.' },
            { id: 'b', label: 'Fix only the highest-traffic page', isCorrect: false, explanation: 'Single-page fixes do not address systemic recurrence.' },
            { id: 'c', label: 'Increase QA time without design changes', isCorrect: false, explanation: 'Process alone cannot replace robust components.' },
            { id: 'd', label: 'Remove all accent colors', isCorrect: false, explanation: 'Color can remain if used accessibly with proper cues and contrast.' },
          ],
        },
      ],
    },
  ],
};

const milestone6: MilestoneConfig = {
  id: 'milestone-6',
  unitId: 'unit-6',
  title: 'Color System Capstone',
  description: 'Classify semantic roles, repair dark-mode stress failures, and validate advanced color-system reasoning.',
  estimatedMinutes: 20,
  passThreshold: 7,
  parts: [
    {
      kind: 'challenge',
      id: 'm6-c1',
      title: 'Semantic Audit',
      description: 'Map visible colors back to their intended semantic roles.',
      challengeType: 'semantic-audit',
      briefing: 'Assign role labels to swatches in this dark-mode palette, then identify the most critical semantic conflict.',
      successMessage: 'You successfully audited semantic mapping and found the system-level role conflict.',
      pointValue: 3,
    },
    {
      kind: 'challenge',
      id: 'm6-c2',
      title: 'Dark Mode Stress Repair',
      description: 'Fix dark-mode failures caused by naive value reuse/inversion.',
      challengeType: 'dark-mode-stress',
      briefing: 'Tune text, surface hierarchy, and accent visibility so the dark theme becomes readable and usable.',
      successMessage: 'You resolved key dark-mode stress failures while preserving hierarchy and action visibility.',
      pointValue: 3,
    },
    {
      kind: 'quiz',
      id: 'm6-qz',
      title: 'Concept Check',
      description: 'Four conceptual checks from Unit 6.',
      questions: [
        {
          id: 'm6-q1',
          prompt: 'What problem appears when a semantic status color is reused decoratively everywhere?',
          choices: [
            { id: 'a', label: 'Its semantic meaning gets diluted', isCorrect: true, explanation: 'Status colors should communicate state consistently, not general decoration.' },
            { id: 'b', label: 'The browser blocks status rendering', isCorrect: false, explanation: 'This is a design-system semantics issue, not a rendering rule.' },
            { id: 'c', label: 'It always fails contrast checks', isCorrect: false, explanation: 'Contrast may pass while semantics still fail.' },
            { id: 'd', label: 'It increases token count automatically', isCorrect: false, explanation: 'Overuse does not inherently change token inventory.' },
          ],
        },
        {
          id: 'm6-q2',
          prompt: 'Why is direct inversion usually a poor dark-mode strategy?',
          choices: [
            { id: 'a', label: 'It can destroy hierarchy and create unreadable pairings', isCorrect: true, explanation: 'Dark mode needs intentional tonal stepping, not blanket inversion.' },
            { id: 'b', label: 'Inverted colors are unsupported in CSS', isCorrect: false, explanation: 'CSS supports many transformations; quality is the issue.' },
            { id: 'c', label: 'Inversion removes alpha channels', isCorrect: false, explanation: 'Alpha handling depends on implementation, not inversion concept alone.' },
            { id: 'd', label: 'It only fails on OLED displays', isCorrect: false, explanation: 'Failure patterns are broader than display type.' },
          ],
        },
        {
          id: 'm6-q3',
          prompt: 'What is the strongest accessibility improvement for multi-series charts?',
          choices: [
            { id: 'a', label: 'Use direct labels and non-color differentiators like line styles', isCorrect: true, explanation: 'Redundant cues reduce dependence on hue perception.' },
            { id: 'b', label: 'Use only saturated colors', isCorrect: false, explanation: 'Saturation does not solve hue-confusion failure modes.' },
            { id: 'c', label: 'Hide lower-priority series', isCorrect: false, explanation: 'Removing data is not the preferred accessibility strategy.' },
            { id: 'd', label: 'Animate each series on load', isCorrect: false, explanation: 'Animation does not guarantee distinguishability.' },
          ],
        },
        {
          id: 'm6-q4',
          prompt: 'What is the most important ongoing practice after launching a color system?',
          choices: [
            { id: 'a', label: 'Continuously review new components against system roles and tokens', isCorrect: true, explanation: 'Systems stay healthy through governance and ongoing enforcement.' },
            { id: 'b', label: 'Freeze all tokens permanently', isCorrect: false, explanation: 'Systems should evolve while preserving semantic discipline.' },
            { id: 'c', label: 'Add a new accent every release', isCorrect: false, explanation: 'Uncontrolled expansion usually increases inconsistency.' },
            { id: 'd', label: 'Rebuild the entire palette yearly', isCorrect: false, explanation: 'Incremental maintenance is usually more stable than full resets.' },
          ],
        },
      ],
    },
  ],
};

const milestoneRegistry: MilestoneConfig[] = [milestone1, milestone2, milestone3, milestone4, milestone5, milestone6];

export function getMilestoneById(id: string): MilestoneConfig | undefined {
  return milestoneRegistry.find((milestone) => milestone.id === id);
}
