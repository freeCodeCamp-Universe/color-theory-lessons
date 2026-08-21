/**
 * Canonical review-tag taxonomy.
 *
 * Keys are the exact strings used in every lesson's `reviewTags` array.
 * Values are the learner-facing section headings shown on the Review page.
 *
 * Rules:
 *  - All keys must be lower-kebab-case (exception: established acronyms
 *    that appear as-is in the CSS/design world: HEX, HSL, RGB, WCAG).
 *  - No two keys may map to the same label.
 *  - Every tag that appears in any lesson file must have an entry here.
 */
export const TAG_LABELS: Record<string, string> = {
  // ── Unit 1: Seeing and Describing Color ────────────────────────────────
  'color-function':    'Color Function in UI',
  'contrast':          'Contrast',
  'emphasis':          'Emphasis',
  'foundations':       'Foundations',
  'harmony':           'Harmony and Relationships',
  'hierarchy':         'Visual Hierarchy',
  'hue':               'Hue',
  'lightness':         'Lightness',
  'palette':           'Palette',
  'readability':       'Readability',
  'saturation':        'Saturation',
  'temperature':       'Color Temperature',
  'visual-vocabulary': 'Visual Vocabulary',

  // ── Unit 2: How Screens Make Color ─────────────────────────────────────
  'additive':          'Additive Color',
  'color-models':      'Color Models',
  'display':           'Displays and Pixels',
  'interface':         'Interface Design',
  'mental-models':     'Mental Models',
  'perception':        'Color Perception',
  'practical':         'Practical Application',
  'print':             'Print and Physical Media',
  'RGB':               'RGB',
  'screens':           'Screens',
  'subtractive':       'Subtractive Color',

  // ── Unit 3: Digital Color in Code ──────────────────────────────────────
  'alpha':             'Alpha and Transparency',
  'design-adjustment': 'Design Adjustment',
  'design-systems':    'Design Systems',
  'formats':           'Color Formats',
  'gradients':         'Gradients',
  'HEX':               'HEX',
  'HSL':               'HSL',
  'implementation':    'Implementation',
  'layering':          'Layering',
  'semantic-color':    'Semantic Color',
  'theme':             'Theming',
  'tokens':            'Design Tokens',

  // ── Unit 4: Human Vision and Color Perception ──────────────────────────
  'accessibility':     'Accessibility',
  'biology-basics':    'Biology Basics',
  'cvd':               'Color Vision Deficiency',
  'interface-review':  'Interface Review',
  'observation':       'Observation',
  'simulation':        'Simulation',
  'ui-patterns':       'UI Patterns',
  'vision':            'Vision',

  // ── Unit 5: Accessible Color in Practice ───────────────────────────────
  'alerts':            'Alerts and Notifications',
  'audit':             'Accessibility Auditing',
  'backup-cues':       'Backup Cues',
  'charts':            'Charts and Data',
  'color-only':        'Color as the Only Indicator',
  'components':        'Component Design',
  'controls':          'Interactive Controls',
  'forms':             'Forms',
  'inclusive-design':  'Inclusive Design',
  'patterns':          'Accessible Patterns',
  'process':           'Design Process',
  'redundancy':        'Redundancy',
  'states':            'UI States',
  'testing':           'Testing',
  'text':              'Text',
  'user-research':     'User Research',
  'wcag':              'WCAG Guidelines',
  'workflow':          'Workflow',

  // ── Unit 6: Color Systems and Advanced Topics ──────────────────────────
  'adaptation':        'Adaptation',
  'balance':           'Balance',
  'brand':             'Brand Color',
  'capstone-prep':     'Capstone Preparation',
  'color-spaces':      'Color Spaces',
  'color-systems':     'Color Systems',
  'consistency':       'Consistency',
  'context':           'Context',
  'dark-mode':         'Dark Mode',
  'data-visualization':'Data Visualization',
  'display-p3':        'Display P3',
  'neutrals':          'Neutral Colors',
  'review':            'Review',
  'roles':             'Color Roles',
  'srgb':              'sRGB',
  'stress-test':       'Stress Testing',
  'wide-gamut':        'Wide Gamut',
};
