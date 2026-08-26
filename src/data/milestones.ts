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
      briefing: 'This challenge has one stage: classify five interface regions by color role. You need at least four correct.',
      successMessage: 'You completed the classification stage with at least four correct interface roles.',
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
      briefing: 'This challenge has two stages: predict dominant channels, then predict additive mixes. You need at least three of four correct in each stage.',
      successMessage: 'You passed both RGB stages with at least three correct channel predictions and three correct additive mixes.',
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
  description: 'Build a five-role interface theme with HSL controls, then answer three questions about role tokens, alpha, and gradients.',
  estimatedMinutes: 18,
  passThreshold: 5,
  parts: [
    {
      kind: 'challenge',
      id: 'm3-c1',
      title: 'Theme From Scratch',
      description: 'Set background, surface, primary text, secondary text, and accent colors with HSL controls.',
      challengeType: 'theme-from-scratch',
      briefing: 'This challenge has three stages: text readability, surface separation, then accent visibility.',
      successMessage: 'Your theme passed the text readability, surface separation, and accent visibility stages.',
      pointValue: 4,
    },
    {
      kind: 'quiz',
      id: 'm3-qz',
      title: 'Concept Check',
      description: 'Answer three questions about role tokens, alpha, and gradients.',
      questions: [
        {
          id: 'm3-q1',
          prompt: 'Why is a role token name such as --color-text-primary more reusable than a visual name such as --dark-gray?',
          choices: [
            { id: 'a', label: 'It still describes the token\'s purpose when a theme assigns it a different color', isCorrect: true, explanation: 'A role name describes where the color is used, so its meaning remains accurate when the stored value changes.' },
            { id: 'b', label: 'It makes the color render faster than a visually named token', isCorrect: false, explanation: 'A token\'s name does not change how quickly the browser renders its value.' },
            { id: 'c', label: 'It guarantees that every color assigned to the token has enough contrast', isCorrect: false, explanation: 'Role tokens organize color values, but each text and background pair still needs a contrast check.' },
            { id: 'd', label: 'It is valid CSS syntax, while a name such as --dark-gray is not', isCorrect: false, explanation: 'Both examples are valid CSS custom property names. The difference is whether the name describes a purpose or a visual value.' },
          ],
        },
        {
          id: 'm3-q2',
          prompt: 'What does alpha control in a CSS color?',
          choices: [
            { id: 'a', label: 'The color\'s opacity, from fully transparent to fully opaque', isCorrect: true, explanation: 'Alpha controls how much of the background shows through the color.' },
            { id: 'b', label: 'The color\'s position around the hue wheel', isCorrect: false, explanation: 'Hue controls the color family. Alpha does not change the hue value.' },
            { id: 'c', label: 'The color\'s saturation', isCorrect: false, explanation: 'Saturation controls color intensity. Alpha controls opacity.' },
            { id: 'd', label: 'The contrast ratio that the color must meet', isCorrect: false, explanation: 'A contrast ratio is calculated from the final foreground and background colors. Alpha does not set a target ratio.' },
          ],
        },
        {
          id: 'm3-q3',
          prompt: 'Why must you check body text contrast across a gradient?',
          choices: [
            { id: 'a', label: 'The colors behind the text change across the gradient, so the contrast ratio can also change', isCorrect: true, explanation: 'Text can meet a contrast target over one part of a gradient and miss it over another part.' },
            { id: 'b', label: 'Browsers cannot render smooth text over a gradient', isCorrect: false, explanation: 'Browsers can render text over gradients. The concern is the changing contrast between the text and the colors behind it.' },
            { id: 'c', label: 'A gradient prevents components from using role tokens', isCorrect: false, explanation: 'Components can use role tokens and gradients together. One does not disable the other.' },
            { id: 'd', label: 'CSS gradients accept only CMYK color values', isCorrect: false, explanation: 'CSS gradients accept web color values such as HEX, RGB, and HSL. They do not require CMYK values.' },
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
  description: 'Find interface elements that rely on color alone, choose fixes, then answer three questions about Unit 4.',
  estimatedMinutes: 16,
  passThreshold: 5,
  parts: [
    {
      kind: 'challenge',
      id: 'm4-c1',
      title: 'Simulation Spotter',
      description: 'Find three elements that use color as their only cue and choose a second cue for each one.',
      challengeType: 'simulation-spotter',
      briefing: 'This challenge has two stages: identify the color-only examples, then choose repairs for them.',
      successMessage: 'You identified all three color-only designs and chose a valid non-color repair for each one.',
      pointValue: 4,
    },
    {
      kind: 'quiz',
      id: 'm4-qz',
      title: 'Concept Check',
      description: 'Answer three questions about cone cells, color-only cues, and chart fixes.',
      questions: [
        {
          id: 'm4-q1',
          prompt: 'Which photoreceptor cells support color vision?',
          choices: [
            { id: 'a', label: 'Cones', isCorrect: true, explanation: 'Cones are photoreceptor cells that support color vision.' },
            { id: 'b', label: 'Rods', isCorrect: false, explanation: 'Rods support vision in dim light and contribute little to color vision under typical daylight conditions.' },
            { id: 'c', label: 'The optic nerve', isCorrect: false, explanation: 'The optic nerve carries visual signals from the retina toward the brain. It is not a photoreceptor cell.' },
            { id: 'd', label: 'The iris', isCorrect: false, explanation: 'The iris controls how much light enters the eye. It is not a photoreceptor cell.' },
          ],
        },
        {
          id: 'm4-q2',
          prompt: 'Why should an interface not use color as the only cue for information?',
          choices: [
            { id: 'a', label: 'Users may perceive colors differently, so the information can become ambiguous', isCorrect: true, explanation: 'A label, icon, pattern, or shape keeps the information available when a user cannot distinguish the colors.' },
            { id: 'b', label: 'Every user sees colors in grayscale in dim light', isCorrect: false, explanation: 'Color perception can change in dim light, but users do not all see every interface in grayscale.' },
            { id: 'c', label: 'CSS does not allow color to communicate a state', isCorrect: false, explanation: 'CSS can style states with color. The problem occurs when color is the only cue that communicates the state.' },
            { id: 'd', label: 'Screen readers announce the wrong color names', isCorrect: false, explanation: 'Screen readers do not determine meaning from an element\'s rendered color. The interface needs text or programmatic information that communicates the state.' },
          ],
        },
        {
          id: 'm4-q3',
          prompt: 'Which change lets viewers distinguish red and green chart series without relying on hue?',
          choices: [
            { id: 'a', label: 'Add labels or patterns that identify each series', isCorrect: true, explanation: 'Labels or patterns distinguish the series when their hues look alike.' },
            { id: 'b', label: 'Increase the saturation of both colors', isCorrect: false, explanation: 'Two saturated colors can still look alike under protan or deutan color vision deficiency.' },
            { id: 'c', label: 'Make every chart bar wider', isCorrect: false, explanation: 'Making every bar wider does not identify which series each bar represents.' },
            { id: 'd', label: 'Move the chart legend to the top', isCorrect: false, explanation: 'Changing the legend position does not add a second cue to the chart marks.' },
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
  description: 'Repair four accessibility failures, then answer four questions about accessible color.',
  estimatedMinutes: 18,
  passThreshold: 6,
  parts: [
    {
      kind: 'challenge',
      id: 'm5-c1',
      title: 'Accessibility Rescue',
      description: 'Repair text contrast, color-only information, focus visibility, and icon contrast.',
      challengeType: 'accessibility-rescue',
      briefing: 'This challenge has four stages: body text contrast, required-field cue, focus indicator, then icon contrast.',
      successMessage: 'You passed all four repair stages: body text, required-field cue, focus indicator, and icon contrast.',
      pointValue: 4,
    },
    {
      kind: 'quiz',
      id: 'm5-qz',
      title: 'Concept Check',
      description: 'Answer four questions about the accessibility checks from Unit 5.',
      questions: [
        {
          id: 'm5-q1',
          prompt: 'At WCAG Level AA, what is the minimum contrast ratio for normal-size text?',
          choices: [
            { id: 'a', label: '4.5:1', isCorrect: true, explanation: 'WCAG Level AA requires at least 4.5:1 contrast for normal-size text.' },
            { id: 'b', label: '3:1', isCorrect: false, explanation: 'At Level AA, 3:1 is the minimum for large text and for visual information needed to identify controls or states.' },
            { id: 'c', label: '2:1', isCorrect: false, explanation: '2:1 is below the 4.5:1 minimum for normal-size text.' },
            { id: 'd', label: '7:1', isCorrect: false, explanation: '7:1 is the Level AAA minimum for normal-size text, not the Level AA minimum.' },
          ],
        },
        {
          id: 'm5-q2',
          prompt: 'What does WCAG 1.4.1, Use of Color, require?',
          choices: [
            { id: 'a', label: 'Do not rely on color as the only means of conveying information', isCorrect: true, explanation: 'Information conveyed through color must also have another visual cue.' },
            { id: 'b', label: 'Use only grayscale for interface states', isCorrect: false, explanation: 'WCAG permits color when another visual cue communicates the same information.' },
            { id: 'c', label: 'Avoid red and green in every interface', isCorrect: false, explanation: 'WCAG does not ban specific hue pairs. It requires another visual cue when color communicates information.' },
            { id: 'd', label: 'Provide an audio cue for every form state', isCorrect: false, explanation: 'Use of Color requires another visual means of communicating information, not an audio cue for every state.' },
          ],
        },
        {
          id: 'm5-q3',
          prompt: 'What does a visible focus indicator communicate?',
          choices: [
            { id: 'a', label: 'Which element currently has keyboard focus', isCorrect: true, explanation: 'The indicator shows sighted keyboard users where their next interaction will occur.' },
            { id: 'b', label: 'Which controls are disabled', isCorrect: false, explanation: 'Disabled styling communicates availability, while a focus indicator identifies the current keyboard target.' },
            { id: 'c', label: 'Which field has a validation error', isCorrect: false, explanation: 'Error styling communicates validation status, while a focus indicator identifies the current keyboard target.' },
            { id: 'd', label: 'Which element was activated most recently', isCorrect: false, explanation: 'Focus can move without activating an element. The indicator identifies the element that currently has focus.' },
          ],
        },
        {
          id: 'm5-q4',
          prompt: 'How can a team apply the same accessible repair to every instance of a component?',
          choices: [
            { id: 'a', label: 'Update the shared component or pattern', isCorrect: true, explanation: 'Every instance that uses the shared component receives the same repair.' },
            { id: 'b', label: 'Fix one page without changing the shared component', isCorrect: false, explanation: 'A page-specific change leaves other instances of the component unchanged.' },
            { id: 'c', label: 'Record the problem without changing the component', isCorrect: false, explanation: 'Recording the problem does not apply the repair to any component instance.' },
            { id: 'd', label: 'Remove every accent color from the interface', isCorrect: false, explanation: 'Color can remain when contrast passes and another visual cue communicates the same information.' },
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
  description: 'Audit semantic color roles, repair a dark theme, and answer four questions about maintaining color systems.',
  estimatedMinutes: 20,
  passThreshold: 7,
  parts: [
    {
      kind: 'challenge',
      id: 'm6-c1',
      title: 'Semantic Audit',
      description: 'Match eight palette swatches to their semantic roles.',
      challengeType: 'semantic-audit',
      briefing: 'This challenge has two stages: assign semantic roles, then identify the palette conflict. At least seven role assignments must be correct.',
      successMessage: 'You passed the role-assignment stage and identified the weak luminance separation between warning and error.',
      pointValue: 3,
    },
    {
      kind: 'challenge',
      id: 'm6-c2',
      title: 'Dark Theme Repair',
      description: 'Adjust text, surface, and action colors in a dark theme.',
      challengeType: 'dark-mode-stress',
      briefing: 'This challenge has three stages: text contrast, surface hierarchy, then action contrast.',
      successMessage: 'The text, card surface, and action passed their three contrast stages.',
      pointValue: 3,
    },
    {
      kind: 'quiz',
      id: 'm6-qz',
      title: 'Concept Check',
      description: 'Answer four questions about role consistency, dark themes, charts, and system maintenance.',
      questions: [
        {
          id: 'm6-q1',
          prompt: 'A product uses its success color for confirmation messages and decorative borders. What problem does this cause?',
          choices: [
            { id: 'a', label: 'The color no longer identifies success consistently', isCorrect: true, explanation: 'Using the success color for decoration gives one role two meanings: status and decoration.' },
            { id: 'b', label: 'The browser treats every border as a status message', isCorrect: false, explanation: 'Browsers render the assigned color but do not infer a semantic status from it.' },
            { id: 'c', label: 'Every decorative border must meet 3:1 contrast', isCorrect: false, explanation: 'Decorative borders are not required to meet the 3:1 non-text contrast criterion. The problem is the color role changing meaning.' },
            { id: 'd', label: 'The token creates a new color value each time it is used', isCorrect: false, explanation: 'Reusing a token repeats its stored value. It does not generate new values.' },
          ],
        },
        {
          id: 'm6-q2',
          prompt: 'Why can direct color inversion produce a poor dark theme?',
          choices: [
            { id: 'a', label: 'Surface layers and text pairs can lose their hierarchy and readability', isCorrect: true, explanation: 'Each dark-theme role needs a value chosen for its new background and neighboring surfaces.' },
            { id: 'b', label: 'CSS cannot invert custom property values', isCorrect: false, explanation: 'CSS can transform rendered colors. The problem is whether the transformed role values still work together.' },
            { id: 'c', label: 'Inversion always changes every color to pure black or pure white', isCorrect: false, explanation: 'Inversion maps each channel to its opposite value. It does not limit the result to black and white.' },
            { id: 'd', label: 'An inverted palette works only on self-emissive displays', isCorrect: false, explanation: 'Surface hierarchy and text contrast can fail on any display type.' },
          ],
        },
        {
          id: 'm6-q3',
          prompt: 'Which chart treatment keeps two series identifiable when their colors look alike?',
          choices: [
            { id: 'a', label: 'Give each series a direct label and a different line style', isCorrect: true, explanation: 'Labels and line styles identify each series without requiring the viewer to distinguish its hue.' },
            { id: 'b', label: 'Increase the saturation of both series colors', isCorrect: false, explanation: 'Two saturated colors can still look alike under a color vision deficiency simulation.' },
            { id: 'c', label: 'Move the color legend above the chart', isCorrect: false, explanation: 'Changing the legend position does not add a non-color distinction to the series.' },
            { id: 'd', label: 'Animate each series when the chart loads', isCorrect: false, explanation: 'A one-time animation does not keep the series identifiable while someone reads the chart.' },
          ],
        },
        {
          id: 'm6-q4',
          prompt: 'After a color system launches, how should a team keep role use consistent?',
          choices: [
            { id: 'a', label: 'Review new components for role drift and token overrides', isCorrect: true, explanation: 'A consistency audit finds roles that changed meaning and local values that bypass shared tokens.' },
            { id: 'b', label: 'Prevent every token from changing after launch', isCorrect: false, explanation: 'Tokens can change when product needs change. The same role should keep a defined meaning across components.' },
            { id: 'c', label: 'Add a new accent token for each release', isCorrect: false, explanation: 'Adding accents on a schedule does not address role drift or local overrides.' },
            { id: 'd', label: 'Replace the full palette once a year', isCorrect: false, explanation: 'A fixed replacement schedule does not test whether roles and tokens are used consistently.' },
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
