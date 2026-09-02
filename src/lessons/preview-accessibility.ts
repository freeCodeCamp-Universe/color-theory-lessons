import type { DescribedVisual } from '../types/accessibility.ts';

export const BEFORE_AFTER_PREVIEWS = {
  purposeful: {
    classification: 'informative',
    accessibleName: 'Purposeful interface color preview',
    accessibleDescription:
      'The dark navigation background separates settings from the page content. The gold start learning button draws attention, the green Unit 1 complete badge communicates status, and the blue border groups the Lesson 2 card.',
  },
  noisy: {
    classification: 'informative',
    accessibleName: 'Noisy interface color preview',
    accessibleDescription:
      'The settings link, start learning button, Unit 1 complete badge, and Lesson 2 card use unrelated saturated colors. These competing signals keep the primary action from standing out.',
  },
} satisfies Record<'purposeful' | 'noisy', DescribedVisual>;

export const HSL_DIMENSION_PREVIEWS = {
  h: {
    classification: 'informative',
    accessibleName: 'Hue adjustment preview',
    accessibleDescription:
      'The color lab includes a hue wheel plus Saturation and Lightness sliders. Hue is active, so the wheel changes the color family. Saturation stays at 70% and Lightness stays at 55%.',
  },
  s: {
    classification: 'informative',
    accessibleName: 'Saturation adjustment preview',
    accessibleDescription:
      'The color lab includes a hue wheel plus Saturation and Lightness sliders. Saturation is active. The hue wheel stays fixed at 200 degrees, and Lightness stays at 55%. Moving Saturation changes how vivid or muted the color appears.',
  },
  l: {
    classification: 'informative',
    accessibleName: 'Lightness adjustment preview',
    accessibleDescription:
      'The color lab includes a hue wheel plus Saturation and Lightness sliders. Lightness is active. The hue wheel stays fixed at 200 degrees, and Saturation stays at 70%. Moving Lightness changes how light or dark the color appears.',
  },
} satisfies Record<'h' | 's' | 'l', DescribedVisual>;

export const COLOR_WHEEL_PREVIEWS = {
  analogous: {
    classification: 'informative',
    accessibleName: 'Analogous color-wheel preview',
    accessibleDescription:
      'The base hue is 210 degrees. The related hues sit 30 degrees on either side at 180 and 240 degrees.',
  },
  complementary: {
    classification: 'informative',
    accessibleName: 'Complementary color-wheel preview',
    accessibleDescription:
      'The base hue is 210 degrees. The related hue sits opposite it at 30 degrees, a separation of 180 degrees.',
  },
  triadic: {
    classification: 'informative',
    accessibleName: 'Triadic color-wheel preview',
    accessibleDescription:
      'The base hue is 210 degrees. The two related hues are 90 and 330 degrees, placing all three hues 120 degrees apart.',
  },
} satisfies Record<'analogous' | 'complementary' | 'triadic', DescribedVisual>;

export const RGB_MIXER_PREVIEWS = {
  extremes: {
    classification: 'informative',
    accessibleName: 'RGB channel extremes preview',
    accessibleDescription:
      'Black has red, green, and blue channels at 0. White has all three channels at 255.',
  },
  'channel-pairs': {
    classification: 'informative',
    accessibleName: 'Additive RGB channel pairs preview',
    accessibleDescription:
      'Full red and green make yellow, full green and blue make cyan, and full red and blue make magenta.',
  },
  'neutral-grays': {
    classification: 'informative',
    accessibleName: 'Neutral RGB grays preview',
    accessibleDescription:
      'Dark gray uses 64 in every channel, mid gray uses 128 in every channel, and light gray uses 210 in every channel.',
  },
} satisfies Record<'extremes' | 'channel-pairs' | 'neutral-grays', DescribedVisual>;

export const HSL_PLAYGROUND_PREVIEW = {
  classification: 'informative',
  accessibleName: 'HSL format preview',
  accessibleDescription:
    'The same blue color is shown as HSL, HEX, and RGB. The Hue, Saturation, and Lightness controls identify which part of the color each number changes.',
} satisfies DescribedVisual;

export const VISION_CARD_PREVIEWS = {
  coneTypes: {
    classification: 'informative',
    accessibleName: 'Color vision cone-function cards',
    accessibleDescription:
      'The expanded Protanopia, Deuteranopia, and Tritanopia cards associate each name with loss of function from the L-cone, M-cone, or S-cone photopigment.',
  },
  commonTypes: {
    classification: 'informative',
    accessibleName: 'Common inherited color vision cards',
    accessibleDescription:
      'The expanded Deuteranomaly and Protanomaly cards describe altered M-cone and L-cone photopigment sensitivity and the red-green distinctions each type can affect.',
  },
  achromatopsia: {
    classification: 'informative',
    accessibleName: 'Achromatopsia card',
    accessibleDescription:
      'The expanded Achromatopsia card describes reduced color discrimination, visual acuity, and light sensitivity, plus the design risk of relying on hue without enough lightness contrast.',
  },
} satisfies Record<'coneTypes' | 'commonTypes' | 'achromatopsia', DescribedVisual>;

export const INTERFACE_GALLERY_PREVIEWS = {
  protanopia: {
    classification: 'informative',
    accessibleName: 'Interface under Protanopia simulation',
    accessibleDescription:
      'The Active and Error badge backgrounds appear similar under the Protanopia simulation. Their visible text labels still distinguish the two statuses.',
  },
  tritanopia: {
    classification: 'informative',
    accessibleName: 'Interface under Tritanopia simulation',
    accessibleDescription:
      'Blue and green areas appear more similar under the Tritanopia simulation. Text labels remain available for the navigation and status badges.',
  },
  deuteranopia: {
    classification: 'informative',
    accessibleName: 'Interface under Deuteranopia simulation',
    accessibleDescription:
      'The red and green Monthly data bars appear similar under the Deuteranopia simulation. The bars have no labels or patterns to distinguish their series.',
  },
} satisfies Record<'protanopia' | 'tritanopia' | 'deuteranopia', DescribedVisual>;
