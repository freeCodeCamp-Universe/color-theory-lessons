import type { GlossaryTerm } from '../types/lesson.ts';

export const glossary: GlossaryTerm[] = [
  // ── Unit 1 ──────────────────────────────────────────────────────────────────
  {
    term: 'accent color',
    definition: 'A color used sparingly to draw attention to a specific element, such as a button or link. It needs enough contrast with surrounding surface and neutral colors to remain distinct.',
    relatedLessons: ['u1-l5', 'u2-l5'],
  },
  {
    term: 'analogous',
    definition: 'A color relationship where two or more hues sit next to each other on the color wheel. Their proximity gives the palette smaller hue changes than complementary or triadic relationships.',
    relatedLessons: ['u1-l6'],
  },
  {
    term: 'background',
    definition: 'The color or surface behind foreground content. High contrast between background and foreground text is essential for readability.',
    relatedLessons: ['u1-l3'],
  },
  {
    term: 'balance',
    definition: 'In a color palette, balance refers to distributing visual weight so no single color dominates unintentionally. A common starting point is one dominant neutral, one supporting color, and one accent.',
    relatedLessons: ['u1-l6'],
  },
  {
    term: 'complementary',
    definition: 'A color relationship where two hues sit opposite each other on the color wheel. The large difference in hue can make the pair easy to distinguish when lightness and saturation also support the contrast.',
    relatedLessons: ['u1-l6'],
  },
  {
    term: 'contrast',
    definition: 'The difference in lightness, hue, or saturation between two colors placed together. Sufficient contrast between text and its background is a core accessibility requirement.',
    relatedLessons: ['u1-l3'],
  },
  {
    term: 'cool',
    definition: 'Colors in the blue, green, and blue-purple ranges. They often feel calmer or farther away than warm colors, but context and culture affect that response.',
    relatedLessons: ['u1-l4'],
  },
  {
    term: 'emphasis',
    definition: 'The use of color to make one element stand out from others on a page. Emphasis guides the viewer\'s eye toward the most important content.',
    relatedLessons: ['u1-l1'],
  },
  {
    term: 'focal point',
    definition: 'The single most prominent element on a screen, typically the primary action or key piece of information. Strong focal points rely on contrast and limited competition from other colored elements.',
    relatedLessons: ['u1-l5'],
  },
  {
    term: 'foreground',
    definition: 'Content placed on top of a background, most commonly text or icons. Foreground elements need sufficient contrast with the background to remain legible.',
    relatedLessons: ['u1-l3'],
  },
  {
    term: 'grouping',
    definition: 'The use of shared color to signal that elements belong together. Consistent color across related items helps users build a mental model of the interface.',
    relatedLessons: ['u1-l1'],
  },
  {
    term: 'harmony',
    definition: 'A quality of a color palette where the colors feel intentionally related rather than random. Harmony is often achieved through analogous, complementary, or triadic relationships.',
    relatedLessons: ['u1-l6'],
  },
  {
    term: 'hierarchy',
    definition: 'The visual ordering of elements by importance. In color terms, primary actions are usually the most visually prominent, secondary actions are quieter, and decorative elements do not compete for attention.',
    relatedLessons: ['u1-l5'],
  },
  {
    term: 'hue',
    definition: 'The HSL value that identifies a color family, such as red, orange, green, or blue. It is represented by an angle around the color wheel.',
    relatedLessons: ['u1-l2'],
  },
  {
    term: 'HEX',
    definition: 'A color format that encodes RGB channel values as a six-character base-16 string, e.g. #1E40AF. The first two characters are red, the middle two are green, and the last two are blue. Compact and widely used in CSS and design tools.',
    relatedLessons: ['u3-l2'],
  },
  {
    term: 'lightness',
    definition: 'The HSL value that controls how light or dark a color appears. It runs from 0% for black to 100% for white.',
    relatedLessons: ['u1-l2'],
  },
  {
    term: 'muted',
    definition: 'A color that appears less vivid because its HSL saturation is lower than a more saturated version of the same hue and lightness.',
    relatedLessons: ['u1-l2'],
  },
  {
    term: 'neutral',
    definition: 'A gray, off-white, near-black, or other color with little visible hue. Neutral surfaces can give saturated actions and alerts more emphasis.',
    relatedLessons: ['u1-l4'],
  },
  {
    term: 'palette',
    definition: 'A defined set of colors used consistently across a design. A controlled palette creates visual coherence and makes it easier to maintain contrast and hierarchy.',
    relatedLessons: ['u1-l6'],
  },
  {
    term: 'palette mood',
    definition: 'The emotional tone created by the combination of hues in a palette. Warm hues tend to feel energetic or urgent; cool hues tend to feel calm or reliable.',
    relatedLessons: ['u1-l4'],
  },
  {
    term: 'primary action',
    definition: 'The action that best advances the main task on a screen, such as submitting a form. Its treatment should distinguish it from less important actions.',
    relatedLessons: ['u1-l5'],
  },
  {
    term: 'readability',
    definition: 'The ease with which a block of text can be read. Contrast, line length, typeface, size, and spacing all affect readability.',
    relatedLessons: ['u1-l1', 'u1-l3'],
  },
  {
    term: 'saturation',
    definition: 'The HSL value that controls how vivid or muted a color appears. With hue and lightness fixed, lowering saturation moves the color toward gray.',
    relatedLessons: ['u1-l2'],
  },
  {
    term: 'secondary action',
    definition: 'An available action that is less important to the current task than the primary action. Its treatment has less emphasis so it does not compete with the primary action.',
    relatedLessons: ['u1-l5'],
  },
  {
    term: 'status color',
    definition: 'A color assigned to a system state such as success, warning, error, or information. A label, icon, shape, or other visible cue must also identify the state.',
    relatedLessons: ['u1-l1'],
  },
  {
    term: 'triadic',
    definition: 'A color relationship where three hues are evenly spaced around the color wheel (120° apart). Triadic palettes are vibrant and offer strong contrast if one hue dominates and the other two are used sparingly.',
    relatedLessons: ['u1-l6'],
  },
  {
    term: 'visual cue',
    definition: 'A visible property that communicates information, such as a color, icon, label, shape, pattern, or underline.',
    relatedLessons: ['u1-l1'],
  },
  {
    term: 'vivid',
    definition: 'A color that appears more intense because its HSL saturation is higher than a more muted version of the same hue and lightness.',
    relatedLessons: ['u1-l2'],
  },
  {
    term: 'warm',
    definition: 'Colors in the red, orange, and yellow ranges. They often feel active, urgent, or closer than cool colors, but context and culture affect that response.',
    relatedLessons: ['u1-l4'],
  },

  // ── Unit 2 ──────────────────────────────────────────────────────────────────
  {
    term: 'absorption',
    definition: 'The process by which a material takes in some wavelengths of incoming light. A pigment appears colored because it absorbs some wavelengths and reflects others toward the viewer.',
    relatedLessons: ['u2-l4'],
  },
  {
    term: 'additive color',
    definition: 'A color model where colors are created by combining light. Adding all three primaries (red, green, blue) at full intensity produces white. Used by screens, projectors, and any light-emitting display.',
    relatedLessons: ['u2-l1'],
  },
  {
    term: 'additive primary',
    definition: 'One of the three base colors in the additive model: red, green, and blue. Each primary corresponds to one channel of the RGB color model.',
    relatedLessons: ['u2-l2'],
  },
  {
    term: 'blue channel',
    definition: 'The blue component of an RGB color. In common 8-bit RGB notation, it ranges from 0 to 255 and controls how much blue light the encoded color contains.',
    relatedLessons: ['u2-l2'],
  },
  {
    term: 'channel',
    definition: 'One of the three independent color components in the RGB model: red, green, and blue. Each channel is a number from 0 to 255, and the combination of all three channels produces a specific color.',
    relatedLessons: ['u2-l2'],
  },
  {
    term: 'channel intensity',
    definition: 'The strength of a single color channel in an RGB value, expressed as a number from 0 (off) to 255 (full). Combining three channel intensities produces a specific screen color.',
    relatedLessons: ['u2-l2'],
  },
  {
    term: 'gamut',
    definition: 'The range of colors that a particular device or medium can reproduce. A color inside a display\'s gamut can fall outside the gamut of a specific ink, printer, and paper combination.',
    relatedLessons: ['u2-l4', 'u6-l6'],
  },
  {
    term: 'dark interface',
    definition: 'An interface with a near-black or dark primary surface. A bright accent can have greater luminance contrast against this surface than against a light surface, which can make the accent more prominent.',
    relatedLessons: ['u2-l5'],
  },
  {
    term: 'green channel',
    definition: 'The green component of an RGB color. In common 8-bit RGB notation, it ranges from 0 to 255 and controls how much green light the encoded color contains.',
    relatedLessons: ['u2-l2'],
  },
  {
    term: 'luminous color',
    definition: 'Color produced by light directed from a display toward the viewer rather than by a material reflecting ambient light.',
    relatedLessons: ['u2-l5'],
  },
  {
    term: 'mental model',
    definition: 'An internal framework a person uses to understand how something works. In color design, many beginners apply a paint-based mental model to screens, which leads to incorrect expectations about how colors mix.',
    relatedLessons: ['u2-l3'],
  },
  {
    term: 'paint logic',
    definition: 'The intuitive but incorrect assumption that screen colors mix like paints or pigments. In paint, mixing colors produces darker results (subtractive). On screens, adding colors produces lighter results (additive).',
    relatedLessons: ['u2-l3'],
  },
  {
    term: 'pigment',
    definition: 'A physical substance that produces color by absorbing certain wavelengths of light. Pigments are used in paints, inks, and dyes. Unlike screen colors, pigment-based color depends on the light source illuminating the surface.',
    relatedLessons: ['u2-l1'],
  },
  {
    term: 'pixel',
    definition: 'The smallest addressable unit of a display. A pixel typically combines red, green, and blue subpixels whose light output is controlled independently.',
    relatedLessons: ['u2-l5'],
  },
  {
    term: 'red channel',
    definition: 'The red component of an RGB color. In common 8-bit RGB notation, it ranges from 0 to 255 and controls how much red light the encoded color contains.',
    relatedLessons: ['u2-l2'],
  },
  {
    term: 'reflection',
    definition: 'The process by which a surface bounces certain wavelengths of light back toward the viewer. The wavelengths reflected determine the color the eye perceives.',
    relatedLessons: ['u2-l4'],
  },
  {
    term: 'RGB',
    definition: 'A color model with red, green, and blue channels. In common 8-bit RGB notation, each channel ranges from 0 to 255. CSS rgb() values can include slash-separated alpha, as in rgb(30 64 175 / 0.5).',
    relatedLessons: ['u2-l1', 'u2-l2'],
  },
  {
    term: 'screen logic',
    definition: 'The correct mental model for how screen colors behave: adding light makes colors lighter, and combining all three RGB primaries at full intensity produces white. Opposite of paint logic.',
    relatedLessons: ['u2-l3'],
  },
  {
    term: 'screen-first decision',
    definition: 'A color choice evaluated on displays instead of assuming that screen colors behave like paint or printed ink.',
    relatedLessons: ['u2-l4'],
  },
  {
    term: 'shorthand HEX',
    definition: 'A three-character HEX notation valid when each pair in the six-character form is a repeated digit, e.g. #ABC expands to #AABBCC. Not applicable when any pair has two different digits.',
    relatedLessons: ['u3-l2'],
  },
  {
    term: 'subtractive color',
    definition: 'A color model in which materials absorb some wavelengths of incoming light and reflect others. Combining cyan, magenta, and yellow produces black in the ideal model, while real pigment mixtures often produce a dark brown or gray.',
    relatedLessons: ['u2-l1'],
  },
  {
    term: 'subtractive primary',
    definition: 'One of the base colors in the subtractive model: cyan, magenta, and yellow (CMY). In print, these inks are combined to reproduce a wide range of colors by absorbing different wavelengths.',
    relatedLessons: ['u2-l4'],
  },
  {
    term: 'surface color',
    definition: 'A color assigned to a page, card, panel, or other interface surface. Different surface roles can use color, borders, shadows, or spacing to show their boundaries.',
    relatedLessons: ['u6-l2'],
  },

  // ── Unit 3 ──────────────────────────────────────────────────────────────────
  {
    term: 'color format',
    definition: 'A syntax for expressing a color in code. Common CSS formats include HEX (#rrggbb), RGB (rgb(r g b)), and HSL (hsl(h s% l%)). The rgb() and hsl() functions can include alpha after a slash.',
    relatedLessons: ['u3-l1'],
  },
  {
    term: 'color value',
    definition: 'A numeric or named representation of a color in code or a design file. The displayed result also depends on the color space, display gamut, and surrounding colors.',
    relatedLessons: ['u3-l1'],
  },
  {
    term: 'implementation',
    definition: 'The code that applies a design decision. A color implementation expresses the chosen color in a format such as HEX, RGB, or HSL and assigns it to an interface element.',
    relatedLessons: ['u3-l1'],
  },
  // ── Unit 3 continued ────────────────────────────────────────────────────────
  {
    term: 'HSL',
    definition: 'A color model with hue, saturation, and lightness values. CSS hsl() can include slash-separated alpha, as in hsl(220 60% 50% / 0.5).',
    relatedLessons: ['u1-l2', 'u3-l3'],
  },
  {
    term: 'alpha',
    definition: 'A value that controls a color\'s opacity. In CSS rgb() and hsl(), an alpha value can follow a slash; 0 is fully transparent and 1 is fully opaque.',
    relatedLessons: ['u3-l2', 'u3-l3', 'u3-l4'],
  },
  {
    term: 'color family',
    definition: 'A group of colors that share the same hue but vary in saturation and lightness. For example, navy, sky blue, and baby blue all belong to the blue color family.',
    relatedLessons: ['u3-l3'],
  },
  {
    term: 'tonal variation',
    definition: 'A lighter, darker, more vivid, or more muted version of the same base color. Created by adjusting saturation and lightness while keeping the hue constant.',
    relatedLessons: ['u3-l3'],
  },
  {
    term: 'opacity',
    definition: 'How much a color or layer blocks what is behind it. An alpha value of 1 is fully opaque, while lower values let more of the background show through.',
    relatedLessons: ['u3-l4'],
  },
  {
    term: 'transparency',
    definition: 'The opposite of opacity. A transparent layer lets the background show through. In CSS, transparency is controlled by the alpha channel or the opacity property.',
    relatedLessons: ['u3-l4'],
  },
  {
    term: 'overlay',
    definition: 'A semi-transparent layer placed over other content. Used for hover states, modal backdrops, image text areas, and disabled states. The perceived color depends on both the overlay and the background.',
    relatedLessons: ['u3-l4'],
  },
  {
    term: 'scrim',
    definition: 'A semi-transparent overlay, usually dark, placed behind a modal or dialog to dim the rest of the page.',
    relatedLessons: ['u3-l4'],
  },
  {
    term: 'blend perception',
    definition: 'The way a semi-transparent color appears as a mix of the foreground and background. The same overlay produces a different blended result when the background changes.',
    relatedLessons: ['u3-l4'],
  },
  {
    term: 'layered interface',
    definition: 'An interface with stacked visual layers such as a page background, card surface, overlay, and modal. Color, transparency, borders, shadows, and spacing can distinguish one layer from another.',
    relatedLessons: ['u3-l4'],
  },
  {
    term: 'gradient',
    definition: 'A smooth transition between two or more colors. In CSS, gradients can be linear (direction-based) or radial (center-outward). Used for backgrounds, hero sections, and data visualization.',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'linear gradient',
    definition: 'A gradient that transitions along a straight line, such as from left to right or top to bottom. CSS defines it with the linear-gradient() function.',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'radial gradient',
    definition: 'A gradient that transitions outward from a center point in a circular or elliptical pattern. Defined in CSS as radial-gradient(shape, color1, color2).',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'border color',
    definition: 'The color applied to the border of an interface element such as a card, input field, or button. Border colors help define edges, separate regions, and indicate states like focus or error.',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'text color',
    definition: 'The color applied to text content. Effective text color depends on sufficient contrast against the background to ensure readability.',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'semantic color',
    definition: 'A color assigned to a purpose such as action, success, warning, or error. A semantic color supports that meaning, while a label, icon, shape, or pattern keeps the meaning available without color.',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'theme',
    definition: 'A coordinated set of color role assignments that can be applied across a product. Switching themes (e.g. light to dark) means reassigning the values behind the roles, not rewriting every component.',
    relatedLessons: ['u3-l5'],
  },
  {
    term: 'design token',
    definition: 'A human-readable name paired with a value. Components can reference a color token instead of repeating a raw color value.',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'raw value',
    definition: 'A color code written directly, such as #1E40AF or rgb(30 64 175), rather than referenced through a token name.',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'palette token',
    definition: 'A token whose name identifies a color family and step, such as --blue-600. A palette token stores a raw value that role tokens can reference.',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'variable',
    definition: 'A named container that holds a value, such as a CSS custom property (--color-primary: #2563eb). Variables allow the same value to be reused and updated from a single location.',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'alias',
    definition: 'A token whose value references another token. For example, --color-action-primary is an alias when its value is var(--blue-600).',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'role token',
    definition: 'A token whose name describes how a color is used, such as --color-action-primary. A role token is also an alias when its value references another token.',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'theme propagation',
    definition: 'The update that occurs when a referenced token value changes. Role tokens resolve to the new value, and components that use those roles render the new color.',
    relatedLessons: ['u3-l6'],
  },
  {
    term: 'sRGB',
    definition: 'The color space used by CSS HEX, RGB, and HSL colors. It provides a baseline for web content and displays.',
    relatedLessons: ['u6-l6'],
  },
  {
    term: 'Display P3',
    definition: 'A color space with a wider gamut than sRGB. A Display P3 color outside the sRGB gamut must be mapped when the output display can reproduce only sRGB colors.',
    relatedLessons: ['u6-l6'],
  },
  {
    term: 'color space',
    definition: 'A system for representing colors with defined components and a reference for interpreting their values. sRGB and Display P3 are color spaces with different gamuts.',
    relatedLessons: ['u6-l6'],
  },
  {
    term: 'Canvas',
    definition: 'A browser element that provides a drawing surface for JavaScript code. Canvas drawings can use color values for chart fills, lines, and other graphics.',
    relatedLessons: ['u6-l6'],
  },
  {
    term: 'SVG',
    definition: 'Scalable Vector Graphics, a browser format for two-dimensional graphics such as icons. Its shapes can use explicit color values for fills and strokes.',
    relatedLessons: ['u6-l6'],
  },
  {
    term: 'WebGL',
    definition: 'A browser technology that uses Canvas to render interactive three-dimensional graphics. Its surfaces, lights, and materials use explicit color values.',
    relatedLessons: ['u6-l6'],
  },
  {
    term: 'contrast checker',
    definition: 'A tool that calculates the contrast ratio between a foreground color and a background color. The result must be compared with the threshold for the rendered text or component.',
    relatedLessons: ['u5-l5'],
  },
  // ── Unit 4 ──────────────────────────────────────────────────────────────────
  {
    term: 'color perception',
    definition: 'The process by which the human eye and brain convert light signals into the experience of color. Perception is constructed by the visual system and varies between individuals.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'color vision',
    definition: 'The ability to distinguish colors through signals from cone cells and their processing in the visual system.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'cone',
    definition: 'A type of photoreceptor cell in the retina that is sensitive to color. Humans typically have three cone types, each most responsive to a different range of wavelengths.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'rod',
    definition: 'A photoreceptor cell in the retina that responds at lower light levels than cone cells. Rod signals support vision in dim conditions but do not provide hue information.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'retina',
    definition: 'The light-sensitive layer at the back of the eye that contains rods and cones. The retina converts incoming light into electrical signals sent to the brain.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'optic nerve',
    definition: 'The nerve that carries visual signals from the retina to the brain for interpretation.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'simultaneous contrast',
    definition: 'A perceptual effect where the same color appears different depending on its surrounding colors. A neutral gray looks warmer on a cool background and cooler on a warm one. This means color decisions must be tested in real layouts, not isolated swatches.',
    relatedLessons: ['u4-l1', 'u6-l6'],
  },
  {
    term: 'visual system',
    definition: 'The network of eye, optic nerve, and brain regions that together process incoming light and construct the experience of vision, including color.',
    relatedLessons: ['u4-l1'],
  },
  {
    term: 'color vision deficiency',
    definition: 'An umbrella term for differences in how people distinguish colors. It includes several types and severities involving cone photopigments or cone function.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'protanopia',
    definition: 'A protan type in which one cone photopigment has lost function. It involves long-wavelength-sensitive cones and affects red-green distinctions.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'protanomaly',
    definition: 'A protan type with altered long-wavelength-sensitive cone photopigment sensitivity. It affects red-green distinctions, with effects that vary by person.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'deuteranopia',
    definition: 'A deutan type in which one cone photopigment has lost function. It involves medium-wavelength-sensitive cones and affects red-green distinctions.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'deuteranomaly',
    definition: 'The most common inherited type of color vision deficiency. It involves altered medium-wavelength-sensitive cone photopigment sensitivity and affects red-green distinctions.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'tritanopia',
    definition: 'A tritan type involving loss of short-wavelength-sensitive cone photopigment function. It affects several blue-yellow distinctions.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'tritanomaly',
    definition: 'A tritan type with altered short-wavelength-sensitive cone photopigment sensitivity. It affects several blue-yellow distinctions.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'achromatopsia',
    definition: 'A condition that affects cone function. Complete achromatopsia causes a lack of color discrimination, while incomplete achromatopsia leaves some cone function and varying color discrimination.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'simulation',
    definition: 'A visual transformation that approximates how an interface may appear under a type of color vision deficiency. It can reveal risks but cannot predict an individual\'s experience.',
    relatedLessons: ['u4-l2'],
  },
  {
    term: 'protan',
    definition: 'The color vision deficiency category that includes protanopia and protanomaly. Protan types involve the long-wavelength-sensitive cone photopigment.',
    relatedLessons: ['u4-l3'],
  },
  {
    term: 'deutan',
    definition: 'The color vision deficiency category that includes deuteranopia and deuteranomaly. Deutan types involve the medium-wavelength-sensitive cone photopigment.',
    relatedLessons: ['u4-l3'],
  },
  {
    term: 'tritan',
    definition: 'The color vision deficiency category that includes tritanopia and tritanomaly. Tritan types involve the short-wavelength-sensitive cone photopigment.',
    relatedLessons: ['u4-l3'],
  },
  {
    term: 'redundancy',
    definition: 'Communicating the same information with more than one visual cue. A state that uses color and a label remains identifiable without the color difference.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'legend',
    definition: 'A key that maps chart marks to their series or categories. A color-only legend requires viewers to distinguish and match hues, while patterns or direct labels provide another identifying cue.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'icon',
    definition: 'A visual symbol that can identify an action or state. An icon provides a cue independent of color when its meaning is clear in context.',
    relatedLessons: ['u4-l4'],
  },
  {
    term: 'label',
    definition: 'A text string attached to an interface element that explains its state, category, or value. Labels provide a non-color channel of information.',
    relatedLessons: ['u4-l4'],
  },
  {
    term: 'pattern',
    definition: 'A repeating visual texture or fill. Different patterns can identify chart series or map areas without requiring viewers to distinguish hues.',
    relatedLessons: ['u4-l4'],
  },
  {
    term: 'selected state',
    definition: 'The visual treatment indicating an interface element is currently chosen or active. Relying only on color for selected state is a common design problem.',
    relatedLessons: ['u4-l4'],
  },
  {
    term: 'semantic state',
    definition: 'An interface state with a meaning such as success, warning, error, or information. Color can reinforce the state, but another visible cue must also identify it.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'use of color',
    definition: 'WCAG 1.4.1, which requires another visual way to convey information when color carries that information.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'chart series',
    definition: 'One data set in a chart with multiple sets. Color can distinguish series, while patterns, direct labels, shapes, or line styles provide other identifying cues.',
    relatedLessons: ['u4-l4'],
  },
  {
    term: 'direct label',
    definition: 'A series name placed next to its line, bar, or other chart mark. It identifies the series without requiring a color match to a separate legend.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'error state',
    definition: 'An interface state indicating that an action failed or a field contains invalid input. A visible message, icon, or other non-color cue must identify the error when color also conveys it.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'info state',
    definition: 'An interface state that provides information without indicating success, warning, or error. A visible label, icon, or other cue can identify it without color.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'pattern fill',
    definition: 'A repeating texture or hatch pattern applied to a chart bar, area, or region to make it distinguishable from adjacent elements without relying solely on hue.',
    relatedLessons: ['u5-l4'],
  },
  {
    term: 'success state',
    definition: 'An interface state confirming that an action completed. A visible label, icon, or other non-color cue must identify the result when color also conveys it.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'validation feedback',
    definition: 'Feedback that identifies whether an input meets its requirements and explains how to correct an error. A text message provides the information without relying on a colored border.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'warning state',
    definition: 'An interface state that alerts the user to a possible problem. A visible label, icon, or other non-color cue must identify the warning when color also conveys it.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'approximation',
    definition: 'A simulation result that represents a type of color vision deficiency without predicting any individual\'s experience.',
    relatedLessons: ['u5-l6'],
  },
  {
    term: 'inclusive design',
    definition: 'An approach that considers differences in people\'s abilities and situations throughout the design process.',
    relatedLessons: ['u5-l6'],
  },
  {
    term: 'user testing',
    definition: 'Evaluating a design by observing participants complete tasks. Testing with people who have color vision deficiency shows how individual participants interpret and use the interface.',
    relatedLessons: ['u5-l6'],
  },
  {
    term: 'workflow',
    definition: 'A repeatable sequence of steps. An accessible color review identifies important elements, checks contrast, finds color-only information, adds another visual cue, and verifies task completion.',
    relatedLessons: ['u5-l5', 'u5-l6'],
  },

  // ── Unit 5 ──────────────────────────────────────────────────────────────────
  {
    term: 'accessibility',
    definition: 'The practice of designing digital products so they can be used by people with a range of abilities, including those with low vision, color vision deficiency, motor differences, and cognitive differences.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'alert',
    definition: 'An interface pattern that presents important information such as a success confirmation, warning, or error. Its text or another visible cue must identify the message when color also conveys its type.',
    relatedLessons: ['u5-l5'],
  },
  {
    term: 'audit',
    definition: 'A structured review of a design artifact against a defined set of accessibility or quality criteria. A color audit typically checks contrast, color-only patterns, and component visibility.',
    relatedLessons: ['u5-l5'],
  },
  {
    term: 'boundary',
    definition: 'The edge or border of a UI component that defines its visible extent and helps users identify it as interactive. A low-contrast boundary makes a control harder to locate.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'color-only meaning',
    definition: 'Information communicated only through color, with no label, icon, shape, pattern, or other visible cue. This use fails WCAG 1.4.1.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'context',
    definition: 'The conditions in which a color appears, including its foreground or background partner, surrounding colors, element type, text size, and text weight. Each contrast check must use the colors from the rendered element.',
    relatedLessons: ['u5-l5'],
  },
  {
    term: 'contrast ratio',
    definition: 'A ratio from 1:1 to 21:1 calculated from the relative luminance of two colors. WCAG compares this ratio with the threshold for the rendered text, control, state, or graphic.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'luminance',
    definition: 'The calculated relative light output of a color. WCAG contrast ratios use the relative luminance of both colors rather than their hue difference.',
    relatedLessons: ['u5-l1', 'u5-l2'],
  },
  {
    term: 'dashboard',
    definition: 'A screen that presents several summaries, charts, indicators, or status panels. Each item still needs readable text and visible cues that do not depend on hue alone.',
    relatedLessons: ['u5-l4'],
  },
  {
    term: 'fail',
    definition: 'A result below the contrast-ratio threshold for the text, control, state, or graphic being checked.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'focus indicator',
    definition: 'A visible outline or highlight that shows sighted keyboard users which interactive element has focus. An author-styled indicator needs at least 3:1 contrast with adjacent colors.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'form validation',
    definition: 'Feedback that identifies whether form input meets its requirements and explains how to correct an error. A text message can provide this information without relying on a colored border.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'graphical object',
    definition: 'A graphic or part of a graphic needed to understand the content, such as an informative icon or chart mark. The required visual parts need at least 3:1 contrast with adjacent colors.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'icon contrast',
    definition: 'The contrast between the parts of an informative icon and their adjacent colors. Parts needed to understand an icon require at least 3:1 contrast when no equivalent visible text identifies it.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'inline error message',
    definition: 'An error message placed beside the form field it describes. The message identifies the error and tells the user how to correct it.',
    relatedLessons: ['u5-l4'],
  },
  {
    term: 'large text',
    definition: 'Text that is at least 18 pt at regular weight or at least 14 pt and bold. At WCAG Level AA, large text needs at least 3:1 contrast with its background.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'link distinction',
    definition: 'A persistent visual difference that identifies a link within surrounding text. An underline or font-style difference can identify the link without hue.',
    relatedLessons: ['u5-l4'],
  },
  {
    term: 'non-text contrast',
    definition: 'The WCAG requirement that visual information needed to identify controls, states, and meaningful graphics have at least 3:1 contrast with adjacent colors.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'normal text',
    definition: 'Text below the WCAG large-text size and weight thresholds. At Level AA, normal text needs at least 4.5:1 contrast with its background.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'outline',
    definition: 'A visual stroke around an element. When an outline is needed to identify a control or state, it needs at least 3:1 contrast with adjacent colors.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'pass',
    definition: 'A result that meets or exceeds the contrast-ratio threshold for the text, control, state, or graphic being checked. Other accessibility requirements still need separate checks.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'priority element',
    definition: 'An interface element that users depend on to complete a task, such as a heading, body text, button, input, status indicator, or chart mark. Priority elements should be audited first.',
    relatedLessons: ['u5-l5'],
  },
  {
    term: 'redundant cue',
    definition: 'A second visible way to communicate information carried by color. Labels, icons, shapes, patterns, and underlines can each provide a cue that does not depend on hue.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'state indicator',
    definition: 'A visible element that communicates a condition such as focused, disabled, error, or success. If color carries the state information, another visible cue must also identify it.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'state visibility',
    definition: 'The visible distinction between component states such as default, hover, active, focus, error, and success.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'text contrast',
    definition: 'The contrast ratio calculated from the relative luminance of text and its background. The required ratio depends on the rendered text size and weight.',
    relatedLessons: ['u5-l1'],
  },
  {
    term: 'user interface component',
    definition: 'An interactive control such as a button, input, checkbox, toggle, or menu. Visual information needed to identify the control or its state requires at least 3:1 contrast with adjacent colors.',
    relatedLessons: ['u5-l2'],
  },
  {
    term: 'validation state',
    definition: 'The treatment that identifies whether an input meets its requirements. A text message, icon, or other visible cue must identify the result when color also conveys it.',
    relatedLessons: ['u5-l3'],
  },
  {
    term: 'verification',
    definition: 'The audit step that checks whether a repair lets users understand the interface and complete the task in context.',
    relatedLessons: ['u5-l5'],
  },
  // ── Unit 6 ──────────────────────────────────────────────────────────────────
  {
    term: 'accent overuse',
    definition: 'Applying an accent color to so many elements that it no longer distinguishes the primary action or other focal content.',
    relatedLessons: ['u6-l3'],
  },
  {
    term: 'brand color',
    definition: 'A color defined by brand guidelines as representing an organization\'s visual identity. In product design, the brand color must be adapted to serve both brand and functional requirements.',
    relatedLessons: ['u6-l3'],
  },
  {
    term: 'categorical palette',
    definition: 'A set of distinct hues used to represent unordered groups in data visualizations. Categorical palettes encode identity, not quantity.',
    relatedLessons: ['u6-l5'],
  },
  {
    term: 'chart contrast',
    definition: 'The visible difference between chart marks and their adjacent colors. Parts needed to understand the chart require at least 3:1 contrast, and labels, shapes, or patterns can preserve series identity without hue.',
    relatedLessons: ['u6-l5'],
  },
  {
    term: 'color system',
    definition: 'A structured approach to color usage in a product, assigning colors to named roles with defined purposes. A color system promotes consistency and makes design decisions scalable.',
    relatedLessons: ['u6-l1'],
  },
  {
    term: 'component state',
    definition: 'A visual condition of an interface component, such as default, hover, pressed, focused, or disabled. The treatment shows the component\'s current response to input.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'consistency',
    definition: 'Using the same color role for the same meaning across screens and components. One role should not drift between unrelated purposes.',
    relatedLessons: ['u6-l1'],
  },
  {
    term: 'consistency audit',
    definition: 'A review of how roles and tokens are used across a color system. It finds role drift, duplicate roles, and local values that bypass shared tokens.',
    relatedLessons: ['u6-l7'],
  },
  {
    term: 'dark mode',
    definition: 'An interface theme with dark backgrounds and lighter foreground content. Each role needs a value that preserves hierarchy, contrast, and meaning; direct inversion does not guarantee those relationships.',
    relatedLessons: ['u6-l4'],
  },
  {
    term: 'data emphasis',
    definition: 'Highlighting a specific data point or series in a chart using a more vivid or contrasting color while reducing visual weight of the others, to guide viewer attention.',
    relatedLessons: ['u6-l5'],
  },
  {
    term: 'disabled',
    definition: 'A component state indicating an element is not interactive. Disabled elements typically use reduced opacity or muted color values to communicate their inactive status.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'elevated surface',
    definition: 'An interface surface that appears above another surface, such as a card or modal. A different color, border, shadow, or spacing can make its boundary visible.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'encoding',
    definition: 'Using a visual property such as color, shape, pattern, or size to represent data. When color identifies a series or value, another visible cue must preserve that information without hue.',
    relatedLessons: ['u6-l5'],
  },
  {
    term: 'hover',
    definition: 'A component state triggered when the pointer is over an interactive element. Hover state should be visually distinct from the default state to confirm interactivity.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'inverse text',
    definition: 'A text role for content placed on a dark or colored surface. Its color must meet the required contrast ratio against that surface.',
    relatedLessons: ['u6-l2', 'u6-l4'],
  },
  {
    term: 'light mode',
    definition: 'An interface theme with light backgrounds and darker foreground content. Its role values must be tested separately from the values assigned in dark mode.',
    relatedLessons: ['u6-l4'],
  },
  {
    term: 'mode adaptation',
    definition: 'The deliberate redesign of color role values for a different interface theme, such as translating a light-mode palette into a dark-mode equivalent while preserving hierarchy and meaning.',
    relatedLessons: ['u6-l4'],
  },
  {
    term: 'primary text',
    definition: 'A text role used for headings, body copy, and important labels. It has more visual emphasis than secondary text and must meet the contrast threshold for its context.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'secondary text',
    definition: 'A text role used for supporting labels, captions, and metadata. It has less visual emphasis than primary text but must still meet the contrast threshold for its context.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'semantic role',
    definition: 'A named purpose assigned to a color in a design system, such as "action", "success", or "error". Semantic roles describe what a color does, not what value it is.',
    relatedLessons: ['u6-l1'],
  },
  {
    term: 'semantic status',
    definition: 'A group of roles for feedback states such as success, warning, error, and information. Each role keeps the same meaning across components and themes.',
    relatedLessons: ['u6-l2'],
  },
  {
    term: 'sequential palette',
    definition: 'A set of colors with an ordered lightness progression, sometimes combined with a saturation change. It represents values with a meaningful order, such as quantity or severity.',
    relatedLessons: ['u6-l5'],
  },
  {
    term: 'stress test',
    definition: 'A review of a color system in light mode, dark mode, charts, alerts, and color vision deficiency simulations. Each context exercises different roles and distinctions.',
    relatedLessons: ['u6-l7'],
  },
  {
    term: 'supporting palette',
    definition: 'A set of colors that complement the primary brand color in a product, providing range for semantic roles, neutrals, and secondary actions without overusing the brand hue.',
    relatedLessons: ['u6-l3'],
  },
  {
    term: 'surface depth',
    definition: 'The visual layering of surfaces in an interface where backgrounds, cards, and elevated panels appear at progressively different lightness levels to create perceived depth.',
    relatedLessons: ['u6-l4'],
  },
  {
    term: 'system review',
    definition: 'An evaluation of a color system across its roles, themes, components, charts, alerts, and simulations. The review checks hierarchy, contrast, semantic meaning, and token use.',
    relatedLessons: ['u6-l7'],
  },
  {
    term: 'theme pairing',
    definition: 'The practice of designing light and dark mode color roles in parallel so that both themes have equivalent hierarchy, readability, and semantic clarity.',
    relatedLessons: ['u6-l4'],
  },
  {
    term: 'tonal scale',
    definition: 'A sequence of lightness steps derived from a base hue, used to generate a range of values for a role (such as action-100 through action-900) without changing hue.',
    relatedLessons: ['u6-l3'],
  },
  {
    term: 'tonal separation',
    definition: 'A lightness difference between adjacent surfaces that helps viewers distinguish one layer from another.',
    relatedLessons: ['u6-l4'],
  },
  {
    term: 'visual grouping',
    definition: 'Using color (and other Gestalt cues) to make related data elements appear to belong together in a chart or layout, aiding comprehension of structure.',
    relatedLessons: ['u6-l5'],
  },
  {
    term: 'wide-gamut display',
    definition: 'A display that can reproduce colors outside the sRGB gamut. Display P3 colors should be tested on wide-gamut and sRGB displays because gamut mapping can change their appearance.',
    relatedLessons: ['u6-l6'],
  },
];
