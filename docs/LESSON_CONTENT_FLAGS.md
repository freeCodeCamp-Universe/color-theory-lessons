# Lesson Content Flags

This file mirrors `LESSON_CONTENT.md`. Quoted text is copied from the current lesson definitions without rewriting. Flags identify passages for editorial review; they do not prescribe replacements.

Intentional overlap between lesson steps and `keyPoints` is not flagged as repetition. Shared lesson metadata and activity structure are not treated as structural violations.

- **Lessons audited:** 34
- **Flagged text fields:** 462

## unit-1

### u1-l1: What Color Does in Interface Design

- **Source:** `src/lessons/unit-1/lesson-1-1.ts`
- **Flagged items:** 8

#### Flagged items

1. **steps[4].text:** Color used without a purpose — just to add variety — can make an interface feel noisy and harder to use. Every color choice should earn its place.

   - **Flags:** Rule 1: em dash (2); Dramatic or copywriter-style wording

2. **challenges[1].hints[1]:** Look at which element your eye lands on first — that one is probably using emphasis.

   - **Flags:** Rule 1: em dash (1)

3. **quizItems[2].choices[1].explanation:** These colors are carrying specific meaning, not just visual interest.

   - **Flags:** Contrast-formula wording

4. **quizItems[3].prompt:** Which of these is an example of color used decoratively rather than functionally?

   - **Flags:** Contrast-formula wording

5. **quizItems[3].choices[1].explanation:** This communicates a specific error state — it is functional.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[3].choices[2].explanation:** Blue links are a learned convention — they communicate interactivity.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[3].choices[4].explanation:** Green here signals a completed action — that is status communication.

   - **Flags:** Rule 1: em dash (1)

8. **keyPoints[2]:** Red, orange, and yellow tend to signal urgency, energy, or danger; blue and green tend to signal calm, safety, or progress — but these are conventions, not universal rules.

   - **Flags:** Rule 1: em dash (1)

### u1-l2: Hue, Saturation, and Lightness

- **Source:** `src/lessons/unit-1/lesson-1-2.ts`
- **Flagged items:** 10

#### Flagged items

1. **steps[2].text:** Hue refers to the colour family — red, orange, yellow, green, blue, or purple. When we say "it's a blue" or "it's a red," we're talking about hue.

   - **Flags:** Rule 1: em dash (1)

2. **steps[5].text:** Use the sliders to explore each dimension. Only one slider is unlocked at a time — adjust it and notice what shifts and what stays the same.

   - **Flags:** Rule 1: em dash (1)

3. **challenges[1].hints[1]:** Look at whether the color family changed — that's hue.

   - **Flags:** Rule 1: em dash (1)

4. **quizItems[1].choices[1].explanation:** The color family stayed in the red range — hue did not change significantly.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

5. **quizItems[1].choices[2].explanation:** Going from vivid to soft and dusty is a saturation decrease — the color becomes less intense.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[3].explanation:** Dusty rose is lighter than vivid red, but the defining shift here is intensity, not just lightness.

   - **Flags:** Contrast-formula wording

7. **quizItems[3].choices[1].explanation:** Both are in the blue family — hue is similar.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[3].choices[2].explanation:** Both can be fairly saturated blues — saturation alone does not explain sky vs navy.

   - **Flags:** Rule 1: em dash (1)

9. **keyPoints[1]:** Hue is the color family — red, orange, blue, green. It is measured as a degree on a 360° wheel.

   - **Flags:** Rule 1: em dash (1)

10. **keyPoints[5]:** Each HSL axis can be adjusted independently — changing one does not automatically change the others.

   - **Flags:** Rule 1: em dash (1)

### u1-l3: Contrast and Readability

- **Source:** `src/lessons/unit-1/lesson-1-3.ts`
- **Flagged items:** 11

#### Flagged items

1. **steps[2].text:** Contrast matters everywhere text appears: labels, buttons, nav links, helper text, placeholder text. Weak contrast makes content feel effortful to read.

   - **Flags:** Absolute or broad claim requiring qualification

2. **challenges[1].prompt:** A dashboard card has three low-contrast problems: a muted label, faint helper text, and a light button on a light surface. Adjust the colors until all three areas are clearly readable.

   - **Flags:** Intensifier or unsupported degree

3. **challenges[1].hints[1]:** Focus on lightness difference first — hue changes alone rarely fix contrast.

   - **Flags:** Rule 1: em dash (1)

4. **challenges[1].successCriteria:** All three problem areas reach clearly readable contrast.

   - **Flags:** Intensifier or unsupported degree

5. **quizItems[1].prompt:** True or false: two very different hues always have strong, readable contrast.

   - **Flags:** Intensifier or unsupported degree; Absolute or broad claim requiring qualification

6. **quizItems[1].choices[1].explanation:** Readability depends on lightness difference, not hue difference. Two colors can share a very similar lightness level and be nearly unreadable together.

   - **Flags:** Intensifier or unsupported degree

7. **quizItems[1].choices[2].explanation:** Hue alone does not determine contrast. Red and green at the same lightness can have very weak readable contrast.

   - **Flags:** Intensifier or unsupported degree

8. **quizItems[2].choices[2].explanation:** A very dark foreground on a very light background creates strong lightness contrast — the most reliable source of readability.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

9. **quizItems[2].choices[3].explanation:** Both colors are bright and light — lightness difference is too small for reliable readability.

   - **Flags:** Rule 1: em dash (1)

10. **keyPoints[1]:** Contrast is the perceptible difference between foreground and background — primarily driven by lightness difference.

   - **Flags:** Rule 1: em dash (1)

11. **keyPoints[3]:** Contrast is a property of a color pair, not a single color — a color can be high-contrast on one background and invisible on another.

   - **Flags:** Rule 1: em dash (1)

### u1-l4: Warm and Cool Colors in Practice

- **Source:** `src/lessons/unit-1/lesson-1-4.ts`
- **Flagged items:** 11

#### Flagged items

1. **description:** Understand warm and cool color tendencies as a useful design lens — not a rigid rule.

   - **Flags:** Rule 1: em dash (1)

2. **steps[3].text:** Neutrals are essential to most good interfaces. They provide breathing room and keep stronger colors from overpowering the layout.

   - **Flags:** Inflated importance claim

3. **challenges[1].hints[1]:** Focus on the overall hue family — orange-to-red is warm, blue-to-green is cool.

   - **Flags:** Rule 1: em dash (1)

4. **challenges[1].hints[2]:** When in doubt about a color's temperature, compare it to a clearly warm or cool reference.

   - **Flags:** Intensifier or unsupported degree

5. **quizItems[2].choices[3].explanation:** A warm accent in a cool palette stands out immediately and reads as a signal, not just a visual choice.

   - **Flags:** Contrast-formula wording

6. **quizItems[3].choices[1].label:** Warm colors always mean danger or error.

   - **Flags:** Absolute or broad claim requiring qualification

7. **quizItems[3].choices[1].explanation:** Red is often used for errors by convention, but orange and yellow are common for CTAs and warnings — context determines meaning.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[3].choices[2].label:** Cool colors always feel more professional.

   - **Flags:** Absolute or broad claim requiring qualification

9. **quizItems[3].choices[3].explanation:** Temperature is a tool, not a rule. The effect of warm vs cool always depends on the surrounding palette and the product's goals.

   - **Flags:** Absolute or broad claim requiring qualification

10. **keyPoints[4]:** Neutrals can lean warm (beige, warm gray) or cool (blue-gray) — they are not temperature-neutral by default.

   - **Flags:** Rule 1: em dash (1)

11. **keyPoints[5]:** Temperature tendencies are starting points, not fixed rules; context and pairing always shape the final effect.

   - **Flags:** Absolute or broad claim requiring qualification

### u1-l5: Visual Hierarchy Through Color

- **Source:** `src/lessons/unit-1/lesson-1-5.ts`
- **Flagged items:** 13

#### Flagged items

1. **steps[2].text:** Color is one of the fastest tools for creating emphasis. A small amount of accent color draws the eye immediately — but only when the rest of the design steps back.

   - **Flags:** Rule 1: em dash (1); Dramatic or copywriter-style wording

2. **steps[3].text:** When everything is equally loud — same saturation, same weight, same contrast — the design has no hierarchy. The user does not know where to look first.

   - **Flags:** Rule 1: em dash (2)

3. **steps[4].text:** Good hierarchy usually means some elements step back so one element can step forward. Supporting elements use muted, lower-contrast colors. The focal point uses the design's strongest color signal.

   - **Flags:** Dramatic or copywriter-style wording

4. **steps[5].text:** The interactive tool shows three identical buttons — no hierarchy at all. Use it to assign each one a role and create a clear visual order before the challenge.

   - **Flags:** Rule 1: em dash (1)

5. **challenges[1].prompt:** A screen shows three buttons: Submit, Save Draft, and Cancel. Right now they all look the same. Make Submit clearly primary without making the design feel broken or unbalanced.

   - **Flags:** Intensifier or unsupported degree

6. **challenges[1].hints[1]:** The primary action should use the strongest accent. The others should step back.

   - **Flags:** Dramatic or copywriter-style wording

7. **challenges[1].hints[3]:** Cancel or destructive actions can use a subtle red, or simply be a text link.

   - **Flags:** Intensifier or unsupported degree

8. **challenges[1].successCriteria:** Submit is clearly dominant, secondary actions are visually subordinate, no element fights for equal emphasis.

   - **Flags:** Intensifier or unsupported degree; Dramatic or copywriter-style wording

9. **quizItems[1].prompt:** A designer uses five different accent colors across a single screen — purple, teal, orange, red, and gold. What is the most likely hierarchy problem?

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[1].choices[4].explanation:** Five saturated accents might have plenty of contrast individually — the problem is that none is clearly dominant.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree; Contrast-formula wording

11. **quizItems[3].choices[2].explanation:** Same color means the same emphasis signal — size alone does not create enough hierarchy difference.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[4].label:** Outlined, muted, or text-only — visually subordinate.

   - **Flags:** Rule 1: em dash (1)

13. **keyPoints[4]:** Accent colors lose their impact if overused — restraint is what makes an accent read as emphasis.

   - **Flags:** Rule 1: em dash (1)

### u1-l6: Basic Color Relationships and Harmony

- **Source:** `src/lessons/unit-1/lesson-1-6.ts`
- **Flagged items:** 9

#### Flagged items

1. **steps[4].text:** Triadic palettes use three hues equally spaced around the wheel. They can feel dynamic, but in interfaces they require careful restraint — only one hue should dominate.

   - **Flags:** Rule 1: em dash (1)

2. **challenges[1].prompt:** A wellness startup wants a calm, trust-building UI palette — think healthcare, finance, or mindfulness. Build a 3-color starter palette using a relationship that supports that mood. When your palette is locked, you will be asked to explain your choice.

   - **Flags:** Rule 1: em dash (1)

3. **quizItems[1].choices[2].explanation:** A triadic relationship uses three hues equally spaced — not just a pair.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

4. **quizItems[2].choices[1].explanation:** Color itself does not take up space — its visual weight is what matters.

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[2].choices[3].explanation:** Memory is not the issue. Hierarchy and coherence are.

   - **Flags:** Contrast-formula wording

6. **quizItems[2].choices[4].label:** Unrelated colors always clash visually.

   - **Flags:** Absolute or broad claim requiring qualification

7. **quizItems[3].choices[1].explanation:** Equal saturation everywhere and no dominant direction produces a noisy, hierarchy-free design.

   - **Flags:** Absolute or broad claim requiring qualification

8. **quizItems[3].choices[2].explanation:** Softening everything does not solve the problem — it just removes all hierarchy.

   - **Flags:** Rule 1: em dash (1)

9. **keyPoints[4]:** Harmony comes from intentional relationships between colors — not from luck or random selection.

   - **Flags:** Rule 1: em dash (1)

## unit-2

### u2-l1: Two Ways Color Mixes

- **Source:** `src/lessons/unit-2/lesson-2-1.ts`
- **Flagged items:** 18

#### Flagged items

1. **description:** Discover the fundamental difference between color made from light and color made from pigment.

   - **Flags:** Inflated importance claim

2. **steps[1].text:** Color is not created the same way everywhere. A glowing screen and a painted wall both show color, but they are doing completely different things to produce it.

   - **Flags:** Absolute or broad claim requiring qualification

3. **steps[2].text:** Additive color starts from darkness and builds up by adding light. Screens, projectors, and LEDs emit red, green, and blue light. Combine more of them and the result gets brighter — add all three at full intensity and you get white.

   - **Flags:** Rule 1: em dash (1)

4. **steps[3].text:** Subtractive color starts from light hitting a material. Pigments and inks absorb some wavelengths and reflect others back to your eye. Mix more pigments together and more light gets absorbed — results tend to get darker and muddier.

   - **Flags:** Rule 1: em dash (1)

5. **steps[5].text:** Look at the two diagrams in the sorting tool. The dark one shows light combining — colors brighten toward white. The light one shows pigment combining — colors darken toward black. Sort the examples shown into the correct model.

   - **Flags:** Rule 1: em dash (2)

6. **challenges[1].hints[1]:** If it glows on its own — phone, monitor, projector — it is additive.

   - **Flags:** Rule 1: em dash (2)

7. **challenges[1].hints[2]:** If it relies on external light to be seen — paint, ink, printed paper — it is subtractive.

   - **Flags:** Rule 1: em dash (2)

8. **quizItems[1].choices[1].label:** Additive — it emits RGB light

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].choices[2].label:** Subtractive — it absorbs wavelengths

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[1].choices[3].explanation:** A laptop display uses only the additive model. It emits light rather than reflecting it.

   - **Flags:** Contrast-formula wording

11. **quizItems[1].choices[4].label:** Neither — screens use a different system

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[2].choices[1].explanation:** Mixing pigments absorbs more light — the result gets darker, not brighter.

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[2].choices[2].explanation:** Additive and subtractive mixing follow opposite rules and produce very different results.

   - **Flags:** Intensifier or unsupported degree

14. **quizItems[2].choices[3].explanation:** Each additional pigment absorbs more wavelengths, making the mix darker. Light does the opposite — combining adds brightness.

   - **Flags:** Rule 1: em dash (1)

15. **quizItems[2].choices[4].label:** Paint mixing always produces black

   - **Flags:** Absolute or broad claim requiring qualification

16. **quizItems[3].choices[1].explanation:** They are fundamentally different: one adds light, the other subtracts it through absorption.

   - **Flags:** Inflated importance claim

17. **keyPoints[2]:** Adding all three RGB primaries at full intensity produces white — the presence of all light.

   - **Flags:** Rule 1: em dash (1)

18. **keyPoints[4]:** Mixing all subtractive primaries fully produces black — all wavelengths absorbed.

   - **Flags:** Rule 1: em dash (1)

### u2-l2: How RGB Light Works

- **Source:** `src/lessons/unit-2/lesson-2-2.ts`
- **Flagged items:** 10

#### Flagged items

1. **description:** Learn how screens build every color from red, green, and blue light channels — and predict what common combinations produce.

   - **Flags:** Rule 1: em dash (1)

2. **steps[2].text:** With all channels at zero, you get black — no light at all. With all three at full intensity, you get white. This is additive color: more light means brighter, and combining all three at maximum is the brightest possible result.

   - **Flags:** Rule 1: em dash (1)

3. **steps[3].text:** Channel pairs create predictable results. Red and green together produce yellow. Green and blue together produce cyan. Red and blue together produce magenta. These are the additive secondaries — worth knowing by feel, not just memorization.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

4. **steps[4].text:** Equal values across all three channels produce neutral grays. Low equal values make dark gray. High equal values make light gray. Even a small difference between channels gives the neutral a color cast — useful for warm or cool surfaces.

   - **Flags:** Rule 1: em dash (1)

5. **steps[5].text:** Use the RGB mixer to explore how channels combine. The challenge asks you to recreate five interface colors — think through which channels should be high, low, or equal before reaching for the slider.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[2].prompt:** What does it mean on a screen when all three RGB channels are set to the same value — say, R:100 G:100 B:100?

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[2].choices[2].label:** The result is always white

   - **Flags:** Absolute or broad claim requiring qualification

8. **quizItems[2].choices[3].explanation:** Equal RGB channels always produce a neutral — no channel dominates, so no color cast appears. The lightness depends on how high the values are.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

9. **keyPoints[1]:** RGB has three channels — red, green, and blue — each ranging from 0 (off) to 255 (full).

   - **Flags:** Rule 1: em dash (2)

10. **keyPoints[4]:** Channel intensity is independent — changing one channel changes the color without forcing changes to the others.

   - **Flags:** Rule 1: em dash (1)

### u2-l3: Why Paint Logic Fails on Screens

- **Source:** `src/lessons/unit-2/lesson-2-3.ts`
- **Flagged items:** 13

#### Flagged items

1. **description:** Unlearn the most common mistaken intuitions borrowed from paint and pigment — and replace them with screen-first thinking.

   - **Flags:** Rule 1: em dash (1)

2. **steps[1].text:** Many beginners apply paint intuition to screen design. This is understandable — paint is familiar. But screens are not layering wet pigment. They are controlling emitted light, and that changes how mixing, darkening, and brightening all work.

   - **Flags:** Rule 1: em dash (1)

3. **steps[2].text:** With paint, mixing more colors absorbs more wavelengths and tends to produce darker, muddier results. With screen color, raising more channels adds more light — the result gets brighter, not muddier. More color on screen moves toward white, not mud.

   - **Flags:** Rule 1: em dash (1)

4. **steps[3].text:** When a screen color looks dark, it is because the channel values are low — there is little light. Brightening it means raising the values, not thinning or diluting the color the way you would add water to paint.

   - **Flags:** Rule 1: em dash (1)

5. **challenges[1].hints[2]:** On screens, "darker" means lower channel values — less light. It does not mean more pigment.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[2].explanation:** Screens control red, green, and blue light. RGB describes that emitted light directly — it is not a convention but a physical fact about display hardware.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[2].choices[1].label:** Nothing — black works the same way on screen as in paint.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].choices[2].explanation:** There is no "mixing" of pigment on a screen. Dark screen colors have lower R, G, B values — less light, not more black paint.

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[2].choices[3].explanation:** Black is a valid screen color. The issue is describing darkening as pigment mixing when it is actually channel reduction.

   - **Flags:** Contrast-formula wording

10. **quizItems[3].choices[1].explanation:** This is correct screen logic — adjusting a specific channel to shift the color temperature.

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[3].choices[2].explanation:** This is correct screen logic — equal channels neutralize into gray.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[4].explanation:** This is correct screen logic — dark colors have low R, G, B values because there is little light.

   - **Flags:** Rule 1: em dash (1)

13. **keyPoints[3]:** The two mental models are not interchangeable — applying paint logic to screens produces wrong predictions.

   - **Flags:** Rule 1: em dash (1)

### u2-l4: Subtractive Color for Digital Designers

- **Source:** `src/lessons/unit-2/lesson-2-4.ts`
- **Flagged items:** 13

#### Flagged items

1. **description:** Understand why physical materials can look different from on-screen previews — and why that gap is not a mistake.

   - **Flags:** Rule 1: em dash (1)

2. **steps[2].text:** A screen can display extremely vivid colors because it emits light directly. Print inks and paint can only reflect incoming light — they cannot reproduce that brightness. This creates a predictable gap between screen previews and physical results.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

3. **steps[3].text:** The range of colors a device or medium can reproduce is called its gamut. Screens have a wide gamut because they emit light. Most print processes have a narrower gamut — some screen colors simply cannot be recreated with ink.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

4. **steps[4].text:** For screen-first designers, this matters whenever work crosses into physical materials — packaging, printed cards, branded merchandise, signage. The difference is not a printing error. It is a fundamental difference between two color models.

   - **Flags:** Rule 1: em dash (1); Inflated importance claim

5. **challenges[1].prompt:** For each scenario, select all the correct reasons why the screen color and the physical version look different. Some reasons are wrong — do not select those.

   - **Flags:** Rule 1: em dash (1)

6. **challenges[1].hints[2]:** The gap is not always a mistake — it can be a natural consequence of different models.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

7. **quizItems[1].choices[1].label:** Additive — the ink emits RGB light

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[2].label:** Subtractive — the ink absorbs some wavelengths and reflects others

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].choices[3].label:** Neither — print uses a completely separate model

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[2].choices[1].explanation:** Hex values describe RGB light. Print uses ink and a different gamut — the same hex will look different in print, not the same.

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[3].choices[1].explanation:** This is unrelated — blue in RGB is an additive primary, not a subtractive one.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[2].explanation:** Even screen-first designers encounter physical color — icons become stickers, brand colors go on merchandise, app colors appear in print. Knowing why the gap exists prevents false expectations.

   - **Flags:** Rule 1: em dash (1)

13. **keyPoints[2]:** Screens generally have a wider gamut than print — some screen colors simply cannot be reproduced in ink.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

### u2-l5: Seeing Pixels as Light, Not Paint

- **Source:** `src/lessons/unit-2/lesson-2-5.ts`
- **Flagged items:** 16

#### Flagged items

1. **description:** Connect additive color to how displays actually work — and how that changes the way interface colors are perceived.

   - **Flags:** Rule 1: em dash (1)

2. **steps[2].text:** From a normal viewing distance your eye blends all those tiny elements into a single unified color. You do not see the individual parts — only the combined result. Zoom into a screen photo and the subpixels become visible; step back and they vanish into a smooth swatch.

   - **Flags:** Rule 1: em dash (1); Dramatic or copywriter-style wording

3. **steps[3].text:** Because screen color is made from emitted light rather than reflected pigment, it can appear luminous in a way paint cannot match. The display is literally sending light straight to your eyes — not bouncing ambient light off an inert surface.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

4. **steps[4].text:** This luminous quality changes depending on surrounding color. On a dark background, a vivid accent has high contrast with its surroundings and appears to stand out — almost to glow. On a light background, the same accent competes with brightness already present and reads as less intense.

   - **Flags:** Rule 1: em dash (1)

5. **challenges[1].hints[3]:** The accent's RGB values do not change — only the context does.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[2].label:** The display emits light directly to the viewer's eyes — something paint and ink cannot do.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[2].explanation:** Emitted light reaches the eye directly. Paint only reflects ambient light — an indirect, weaker signal.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[4].label:** Screens always display brighter colors than any physical material.

   - **Flags:** Absolute or broad claim requiring qualification

9. **quizItems[1].choices[4].explanation:** Not always — a printed color in direct sunlight can rival screen brightness. The difference is the mechanism: emission vs reflection.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

10. **quizItems[3].choices[1].label:** True — screens layer digital paint in the RGB color space.

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[3].choices[2].label:** False — screens emit light. A painted surface reflects ambient light. They produce color through different physical mechanisms.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[3].label:** True — both screens and paint are creating color for the viewer's eye in the same way.

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[3].choices[4].explanation:** Whether LCD, OLED, or LED, all modern display technologies emit controlled light rather than reflecting pigment.

   - **Flags:** Contrast-formula wording

14. **keyPoints[1]:** Dark interfaces use near-black or very dark surfaces as primary backgrounds.

   - **Flags:** Intensifier or unsupported degree

15. **keyPoints[2]:** A dark background amplifies perceived saturation — colors that look moderate on white can appear intense on dark.

   - **Flags:** Rule 1: em dash (1)

16. **keyPoints[3]:** Luminous colors (light, warm, or vivid values on very dark surfaces) can cause eye strain and feel harsh.

   - **Flags:** Intensifier or unsupported degree

## unit-3

### u3-l1: Why Digital Design Needs Color Formats

- **Source:** `src/lessons/unit-3/lesson-3-1.ts`
- **Flagged items:** 16

#### Flagged items

1. **description:** Discover why digital interfaces require precise coded color values — and explore the three most common formats by clicking through a real UI mockup.

   - **Flags:** Rule 1: em dash (1)

2. **steps[1].text:** In digital products, the computer needs exact instructions. A vague description like "nice soft blue" cannot be reproduced reliably. Anywhere a color appears — a button, a background, a border — it needs a precise value that means the same thing to every tool and every browser.

   - **Flags:** Rule 1: em dash (2)

3. **steps[2].text:** Designers encounter color values in many places: CSS files, design tool inspectors, browser dev tools, component libraries, and design token files. In all of them, the color is expressed as a specific format — not a feeling, but a number.

   - **Flags:** Rule 1: em dash (1)

4. **steps[3].text:** Three formats are especially common: HEX, RGB, and HSL. They all describe the same visible colors — just in different ways. HEX is compact and common in CSS. RGB maps directly to screen light channels. HSL matches how designers often describe adjustments.

   - **Flags:** Rule 1: em dash (1)

5. **steps[4].text:** One important thing: a single visible color can be expressed in multiple valid formats. The swatch does not change — only the representation does. HEX #1E40AF, rgb(30, 64, 175), and hsl(224, 71%, 40%) can all describe the same blue.

   - **Flags:** Rule 1: em dash (1)

6. **challenges[1].hints[1]:** Click directly on any colored region — background, button, text, border.

   - **Flags:** Rule 1: em dash (1)

7. **challenges[1].hints[3]:** You do not need to memorize the values — focus on the structure of each format.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[1].explanation:** The reason is not about preference — it is about reproducibility. A vague description cannot be reliably implemented across tools, screens, and contributors.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

9. **quizItems[1].choices[2].explanation:** A specific format like #1E40AF means the same blue everywhere — in CSS, design tools, and browsers — with no guesswork.

   - **Flags:** Rule 1: em dash (2); Absolute or broad claim requiring qualification

10. **quizItems[2].choices[1].label:** No — each visible color has exactly one correct format

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[2].choices[2].label:** Yes — HEX, RGB, and HSL can all describe the same visible color

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[2].choices[4].label:** Yes, but only HEX and RGB — HSL is a different color system

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[3].choices[3].explanation:** A HEX value is implementation-ready — it produces the same color in every browser, design tool, and handoff document with no interpretation required.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

14. **quizItems[3].choices[4].explanation:** This references a named token, which is useful if the token is defined — but without knowing the actual value, it cannot be implemented.

   - **Flags:** Rule 1: em dash (1)

15. **keyPoints[1]:** Digital products need exact color values — a description like "soft blue" cannot be reliably reproduced across tools, browsers, or contributors.

   - **Flags:** Rule 1: em dash (1)

16. **keyPoints[5]:** Choosing a format is not a design decision — it is a representation choice; different tools and workflows favor different formats.

   - **Flags:** Rule 1: em dash (1)

### u3-l2: HEX and RGB

- **Source:** `src/lessons/unit-3/lesson-3-2.ts`
- **Flagged items:** 25

#### Flagged items

1. **description:** Explore the two most common digital color formats by editing RGB sliders and HEX values in a live dual editor — then match three target UI colors.

   - **Flags:** Rule 1: em dash (1)

2. **steps[1].text:** RGB describes a color by stating how much red, green, and blue light to mix. Each channel runs from 0 (none) to 255 (full). rgb(0, 0, 0) is no light at all — black. rgb(255, 255, 255) is all three channels at full — white.

   - **Flags:** Rule 1: em dash (2)

3. **steps[2].text:** HEX is a compact way to encode the same three channels. A six-character HEX value like #1E40AF splits into three pairs: the first two are red, the next two are green, the last two are blue — each pair in base-16 notation.

   - **Flags:** Rule 1: em dash (1)

4. **steps[3].text:** When all three RGB channels are equal — like rgb(120, 120, 120) — the result is always a neutral gray. No single channel dominates, so no hue appears. The same is true for #808080 or any HEX where both pairs in each channel match.

   - **Flags:** Rule 1: em dash (2); Absolute or broad claim requiring qualification

5. **steps[5].text:** RGBA adds a fourth value — the alpha channel — to RGB. It controls opacity, from 0 (fully transparent) to 1 (fully opaque). When you see rgba(30, 64, 175, 0.5), the color is that same blue at 50% opacity.

   - **Flags:** Rule 1: em dash (2)

6. **challenges[1].hints[2]:** Watch which channel dominates in the target — that tells you which slider to push higher.

   - **Flags:** Rule 1: em dash (1)

7. **challenges[1].hints[3]:** Equal channel values always produce a neutral. If the target has a clear hue, at least one channel must be different.

   - **Flags:** Absolute or broad claim requiring qualification

8. **quizItems[1].prompt:** What do equal RGB channel values always produce?

   - **Flags:** Absolute or broad claim requiring qualification

9. **quizItems[1].choices[1].explanation:** When R, G, and B are equal, no single channel dominates and no hue appears. The result is a neutral — ranging from black at 0,0,0 to white at 255,255,255.

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[1].choices[3].label:** A very dark color

   - **Flags:** Intensifier or unsupported degree

11. **quizItems[1].choices[3].explanation:** Low equal values give a dark neutral, but equal values at higher settings produce lighter neutrals. The key result is always neutral, not always dark.

   - **Flags:** Absolute or broad claim requiring qualification

12. **quizItems[1].choices[4].label:** An error — RGB must have at least one dominant channel

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[2].choices[1].explanation:** F4 in hex is 244 in decimal — close to the maximum of 255. High equal channel values produce a very light neutral. #1A1A1A has channels of only 26, producing a very dark neutral.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

14. **quizItems[2].choices[3].explanation:** F4 is 244 and 1A is 26. These are very different channel values producing very different brightness levels.

   - **Flags:** Intensifier or unsupported degree

15. **quizItems[2].choices[4].explanation:** When all three pairs are the same, the channel order does not matter — the result is neutral and brightness is all that varies. #F4F4F4 is clearly the lighter one.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

16. **quizItems[3].choices[4].label:** Neither — you should use HSL for any channel change

   - **Flags:** Rule 1: em dash (1)

17. **quizItems[4].choices[1].label:** No — HEX values must always be six characters

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

18. **quizItems[4].choices[1].explanation:** Shorthand HEX with three characters is perfectly valid in CSS. #ABC expands to #AABBCC, where each single digit is simply doubled.

   - **Flags:** Intensifier or unsupported degree

19. **quizItems[4].choices[2].label:** Yes — it is shorthand for #AABBCC

   - **Flags:** Rule 1: em dash (1)

20. **quizItems[4].choices[2].explanation:** Shorthand HEX works when each channel digit in the six-character form is repeated. #ABC expands to #AABBCC — A→AA, B→BB, C→CC.

   - **Flags:** Rule 1: em dash (1)

21. **quizItems[4].choices[4].label:** Yes — but only if A, B, and C are valid hex digits

   - **Flags:** Rule 1: em dash (1)

22. **quizItems[4].choices[4].explanation:** A, B, and C happen to be valid hex digits (10, 11, 12), but the answer misses the key rule: shorthand is valid for any three-character hex value, not just those using A, B, C specifically.

   - **Flags:** Contrast-formula wording

23. **keyPoints[1]:** RGB describes color as three channel values — red, green, blue — each from 0 (none) to 255 (full).

   - **Flags:** Rule 1: em dash (2)

24. **keyPoints[2]:** Equal channel values always produce a neutral: rgb(0,0,0) is black, rgb(255,255,255) is white, anything in between with equal values is a gray.

   - **Flags:** Absolute or broad claim requiring qualification

25. **keyPoints[4]:** Shorthand HEX (#ABC) is valid only when each pair in the full six-character form is a repeated digit — #ABC expands to #AABBCC.

   - **Flags:** Rule 1: em dash (1)

### u3-l3: HSL and HSLA

- **Source:** `src/lessons/unit-3/lesson-3-3.ts`
- **Flagged items:** 12

#### Flagged items

1. **steps[2].text:** Hue is a degree on the color wheel (0-360). Saturation is a percentage — 0% is fully muted gray, 100% is fully vivid. Lightness is also a percentage — 0% is black, 100% is white, 50% is the purest version of that hue.

   - **Flags:** Rule 1: em dash (2)

2. **steps[5].text:** The playground shows the same color in all three formats simultaneously — HSL, HEX, and RGB. Adjust the sliders and watch how each format updates. Then match three target colors using HSL controls.

   - **Flags:** Rule 1: em dash (1)

3. **challenges[1].hints[2]:** A very muted target means low saturation. A very light target means high lightness.

   - **Flags:** Intensifier or unsupported degree

4. **challenges[1].hints[3]:** If the target looks gray, saturation is near zero — focus on lightness to match brightness.

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[2].choices[1].explanation:** In HSL, you raise lightness. In RGB, you would need to increase all three channels in a balanced way — less intuitive and harder to predict.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[2].choices[3].label:** HSL is always more practical than RGB

   - **Flags:** Absolute or broad claim requiring qualification

7. **quizItems[3].choices[1].label:** Accent — the emphasis level of the color

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[3].choices[2].label:** Alpha — the opacity of the color from 0 (transparent) to 1 (opaque)

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[3].choices[3].label:** Angle — the rotation of hue on the color wheel

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[3].choices[4].label:** Amplitude — how strong the color signal is

   - **Flags:** Rule 1: em dash (1)

11. **keyPoints[1]:** HSL describes color as hue (0-360°), saturation (0-100%), and lightness (0-100%) — mapping directly to how designers describe visible changes.

   - **Flags:** Rule 1: em dash (1)

12. **keyPoints[5]:** The same color can be viewed in HSL, HEX, and RGB simultaneously — they are interconvertible representations of the same visual result.

   - **Flags:** Rule 1: em dash (1)

### u3-l4: Alpha, Transparency, and Layered Color

- **Source:** `src/lessons/unit-3/lesson-3-4.ts`
- **Flagged items:** 9

#### Flagged items

1. **steps[3].text:** This is important: the perceived result is relational. A dark overlay at 50% opacity looks subtle on a dark background but heavy on a light background. You cannot judge a transparent color in isolation — the background always matters.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

2. **steps[4].text:** Transparency can also create accessibility problems. Semi-transparent text over a textured or variable background may become unreadable in some areas. Always test overlays in realistic contexts, not just on a blank page.

   - **Flags:** Contrast-formula wording; Absolute or broad claim requiring qualification

3. **challenges[1].hints[1]:** A modal scrim is usually a dark color at around 40-60% opacity — enough to dim the background without hiding it completely.

   - **Flags:** Rule 1: em dash (1)

4. **challenges[1].hints[2]:** Hover states are typically subtle — try a light or dark overlay at low opacity (10-20%).

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[1].choices[4].explanation:** The hue does not disappear. The perceived result is a mix of both layers — the hue is still present, but the final appearance depends on what is underneath.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[3].choices[1].explanation:** This is the highest possible contrast pairing — very safe for readability.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

7. **keyPoints[2]:** Alpha (0-1) controls how transparent a color is — 0 is invisible, 1 is fully opaque.

   - **Flags:** Rule 1: em dash (1)

8. **keyPoints[3]:** The perceived result of a semi-transparent color depends on the background underneath — you cannot judge it in isolation.

   - **Flags:** Rule 1: em dash (1)

9. **keyPoints[6]:** Always test overlays on realistic backgrounds, not just on a blank canvas.

   - **Flags:** Contrast-formula wording; Absolute or broad claim requiring qualification

### u3-l5: Gradients, CSS Color Usage, and Theme Building

- **Source:** `src/lessons/unit-3/lesson-3-5.ts`
- **Flagged items:** 14

#### Flagged items

1. **steps[1].text:** In this lesson, treat colors as assignments in a UI: background, surface, text, border, accent, success, warning, and error. The task is practical: place each color where it belongs so the interface reads clearly and consistently.

   - **Flags:** Intensifier or unsupported degree

2. **steps[2].text:** A gradient is a controlled transition between two or more colors. CSS supports linear-gradient (a direction-based blend) and radial-gradient (a center-outward blend). Gradients can add hierarchy, depth, or energy — but they should serve a purpose, not just decorate.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

3. **steps[3].text:** In CSS, roles are usually assigned through custom properties. Instead of repeating "#2563EB" in many rules, assign a role variable and apply it to buttons, links, and focus rings. This keeps the lesson focused on implementation rather than one-off values.

   - **Flags:** Contrast-formula wording

4. **steps[5].text:** The theme sandbox lets you assign colors to common roles and apply a gradient to a hero panel. Build a coherent theme where text is readable, accents are purposeful, and the gradient supports — not fights — the rest of the interface.

   - **Flags:** Rule 1: em dash (2)

5. **challenges[1].hints[1]:** Start with the background and surface — these set the overall tone.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[1].explanation:** Values are raw numbers. Roles describe purpose. A system uses role names so the same logic can apply even when values change — for example, in a dark theme.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[2].label:** They are the same thing — just different terms used by designers and developers

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].prompt:** Are gradients always decorative?

   - **Flags:** Absolute or broad claim requiring qualification

9. **quizItems[2].choices[1].label:** Yes — gradients are purely visual style and never affect usability

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

10. **quizItems[2].choices[2].label:** No — gradients can support hierarchy, emphasis, or data encoding when used deliberately

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[2].choices[3].label:** No — gradients are required for accessible contrast

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[2].explanation:** Shared roles mean one change — like updating the primary action color — propagates automatically to every button, link, and focus ring in the system.

   - **Flags:** Rule 1: em dash (2)

13. **quizItems[3].choices[4].label:** Using gradients instead of flat colors everywhere

   - **Flags:** Absolute or broad claim requiring qualification

14. **keyPoints[2]:** Gradients are controlled transitions between colors — useful for hierarchy, depth, or energy, but they should serve a function.

   - **Flags:** Rule 1: em dash (1)

### u3-l6: Design Tokens and Role-Based Color Systems

- **Source:** `src/lessons/unit-3/lesson-3-6.ts`
- **Flagged items:** 7

#### Flagged items

1. **description:** Learn how design tokens separate color meaning from raw values — and see how changing one base value can update an entire interface.

   - **Flags:** Rule 1: em dash (1)

2. **steps[2].text:** Tokens work at different levels. An alias token points to a base value — like --blue-600: #1E40AF. A role token assigns meaning to an alias — like --color-action-primary: var(--blue-600). The role name describes usage, not appearance.

   - **Flags:** Rule 1: em dash (2)

3. **quizItems[1].choices[3].explanation:** Tokens do not check contrast. They organize color decisions — but designers still need to verify accessibility.

   - **Flags:** Rule 1: em dash (1)

4. **quizItems[2].choices[1].explanation:** The visible color changes because the value behind the token changed. What stays the same is the role — the purpose the token serves.

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[2].choices[4].label:** Nothing — everything changes when a token value changes

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[3].choices[2].explanation:** This is an alias token — it names a palette step but does not describe a usage role.

   - **Flags:** Rule 1: em dash (1)

7. **keyPoints[3]:** Changing a base value propagates automatically to every component that references the token — this is theme propagation.

   - **Flags:** Rule 1: em dash (1)

## unit-4

### u4-l1: How Humans Perceive Color

- **Source:** `src/lessons/unit-4/lesson-4-1.ts`
- **Flagged items:** 12

#### Flagged items

1. **steps[1].text:** You have learned to describe color, mix it on screen, and express it in code. But there is another side to every color decision: the person looking at the screen. A digital screen emits light. But when you see a color, you are not seeing the screen itself — you are seeing the result of your eye and brain interpreting that light. Color is a perceptual experience, not a physical property of the display.

   - **Flags:** Rule 1: em dash (1)

2. **steps[3].text:** Humans typically have three cone types, each most sensitive to a different range of wavelengths — broadly corresponding to long (red), medium (green), and short (blue). The brain compares the signals from these three cone types to construct the experience of color.

   - **Flags:** Rule 1: em dash (1)

3. **steps[4].text:** The retina sends signals along the optic nerve to the visual cortex in the brain, where the final experience of color is assembled. Context, memory, and surrounding colors all influence the result. Simultaneous contrast — where a color looks different depending on its neighbors — is one example.

   - **Flags:** Rule 1: em dash (2)

4. **steps[5].text:** Because color perception depends on each individual's visual system, two people looking at the same interface may not perceive it identically. Good design accounts for this variation rather than assuming all viewers share the same experience.

   - **Flags:** Contrast-formula wording

5. **challenges[1].hints[2]:** Each step has a short design implication — read it before moving on.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[2].choices[1].explanation:** That conversion happens in the photoreceptor cells — rods and cones — in the retina.

   - **Flags:** Rule 1: em dash (2)

7. **quizItems[3].choices[1].label:** Because screen calibration always differs between devices

   - **Flags:** Absolute or broad claim requiring qualification

8. **quizItems[3].choices[1].explanation:** Display differences can contribute, but the more fundamental reason is that each person's visual system constructs color perception differently.

   - **Flags:** Inflated importance claim

9. **quizItems[3].choices[2].explanation:** Each viewer's visual system — including cone sensitivity, optical lens characteristics, and neural processing — produces a slightly different perceptual experience from the same physical input.

   - **Flags:** Rule 1: em dash (2)

10. **keyPoints[1]:** A screen emits light, but color is constructed by the eye and brain — it is a perceptual experience, not a physical screen property.

   - **Flags:** Rule 1: em dash (1)

11. **keyPoints[3]:** Three cone types — sensitive to different wavelength ranges — allow the brain to distinguish colors by comparing their relative signals.

   - **Flags:** Rule 1: em dash (2)

12. **keyPoints[5]:** Because each person's visual system is slightly different, two viewers may not perceive the same interface color identically — good design accounts for this variation.

   - **Flags:** Rule 1: em dash (1)

### u4-l2: Types of Color Vision Deficiency

- **Source:** `src/lessons/unit-4/lesson-4-2.ts`
- **Flagged items:** 20

#### Flagged items

1. **description:** Learn that color vision deficiency is not one single condition — multiple types and severities exist, each affecting different color distinctions.

   - **Flags:** Rule 1: em dash (1)

2. **learningGoal:** Name the major categories of CVD, describe which cone type is affected, and explain why design must be robust rather than diagnostic.

   - **Flags:** Vague or banned quality label; Contrast-formula wording

3. **steps[1].text:** Color vision deficiency (CVD) refers to differences in how certain color distinctions are perceived, due to variation in cone function. It is not a single condition — there are multiple types and a range of severities.

   - **Flags:** Rule 1: em dash (1)

4. **steps[2].text:** CVD is grouped by which cone type is affected. Protan types involve the red-sensitive cone; deutan types involve the green-sensitive cone; tritan types involve the blue-sensitive cone. The suffix "-opia" indicates absence or very low function; "-anomaly" indicates reduced sensitivity.

   - **Flags:** Intensifier or unsupported degree

5. **steps[3].text:** Deuteranomaly — reduced green cone sensitivity — is the most common form of CVD, affecting roughly 5–8% of males with Northern European ancestry. Deuteranopia (absent green cones) and protanopia (absent red cones) are less common. Tritan types are rare.

   - **Flags:** Rule 1: em dash (2)

6. **steps[4].text:** Achromatopsia is a rare condition (affecting roughly 1 in 30,000 people) where very limited or no cone function is present. Individuals with achromatopsia perceive only brightness — all hues appear as shades of gray. This is distinct from the partial cone differences that characterize most CVD types.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

7. **steps[5].text:** As a designer, your goal is robustness, not diagnosis. You cannot know which viewers have CVD or which type — and the percentages are significant enough that assuming all viewers share your color experience is risky. Simulation tools help you see how your interface looks under various CVD conditions.

   - **Flags:** Rule 1: em dash (1)

8. **challenges[1].hints[2]:** There are six card types — protan, deutan, tritan, and achromatopsia variants. Expand all of them.

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].choices[1].label:** Yes — all CVD is red-green color blindness

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[1].choices[2].label:** No — there are multiple types and severities, each affecting different color distinctions

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[1].choices[3].label:** Yes — all CVD causes complete inability to see any color

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[1].choices[3].explanation:** Only achromatopsia involves very limited hue perception. Most CVD types reduce or shift specific color distinctions, not all color perception.

   - **Flags:** Intensifier or unsupported degree

13. **quizItems[1].choices[4].label:** No — but all types affect only the blue-yellow axis

   - **Flags:** Rule 1: em dash (1)

14. **quizItems[2].choices[4].explanation:** Achromatopsia involves very limited cone function overall, not specifically blue-yellow.

   - **Flags:** Intensifier or unsupported degree

15. **quizItems[3].choices[2].label:** Because your vision may not represent other users' experience — CVD is common enough to design for

   - **Flags:** Rule 1: em dash (1)

16. **quizItems[3].choices[2].explanation:** CVD affects a significant percentage of users. Designing only for your own perception excludes users whose experience differs — and you cannot tell which users they are.

   - **Flags:** Rule 1: em dash (1)

17. **quizItems[3].choices[3].explanation:** Modern design tools generally show accurate colors. The issue is perceptual variation across users.

   - **Flags:** Contrast-formula wording

18. **keyPoints[1]:** Color vision deficiency is not one condition — it includes protan, deutan, and tritan types, each with absent and reduced-sensitivity variants.

   - **Flags:** Rule 1: em dash (1)

19. **keyPoints[4]:** Achromatopsia is rare and involves very limited cone function — hues appear as shades of gray.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

20. **keyPoints[5]:** Your goal as a designer is robustness, not diagnosis: make interfaces that work for a range of color experiences, not just your own.

   - **Flags:** Contrast-formula wording

### u4-l3: Seeing Through Simulated Eyes

- **Source:** `src/lessons/unit-4/lesson-4-3.ts`
- **Flagged items:** 12

#### Flagged items

1. **steps[1].text:** Simulation tools apply a color transformation to show how an interface might appear under a particular CVD type. The result is an approximation — not an exact representation of any individual's experience — but it is a fast, practical first check for design problems.

   - **Flags:** Rule 1: em dash (2)

2. **steps[2].text:** Under protan and deutan simulation, red and green hues converge — becoming hard to tell apart. A traffic-light status system (red = error, green = success) becomes ambiguous. The colors that relied on the red-green axis to carry meaning lose their distinction.

   - **Flags:** Rule 1: em dash (1)

3. **steps[5].text:** The solution is not to avoid color — it is to add backup cues: icons, labels, patterns, or shapes that carry the same meaning. Redundancy means meaning survives even when color distinction is reduced.

   - **Flags:** Rule 1: em dash (1)

4. **challenges[1].hints[1]:** Switch to Deuteranopia first — it is the most common type. Notice which status indicators look similar.

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[1].choices[1].explanation:** Simulation is for designers to review their interfaces — it does not identify which users have CVD.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[2].explanation:** Simulation helps you see which elements lose their meaning when color distinctions are reduced — making it easier to spot where backup cues are needed.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[4].explanation:** Simulation is a diagnostic tool — it shows problems, but does not fix them automatically.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].choices[2].explanation:** Protan types affect red-sensitive cones and deutan types affect green-sensitive cones — both weaken the ability to distinguish red from green.

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[3].choices[1].label:** Charts use more colors than paragraphs, so they are always harder to read

   - **Flags:** Absolute or broad claim requiring qualification

10. **quizItems[3].choices[3].label:** Text paragraphs are automatically accessible, so charts are always worse

   - **Flags:** Absolute or broad claim requiring qualification

11. **quizItems[3].choices[4].label:** Charts always have bad contrast ratios

   - **Flags:** Absolute or broad claim requiring qualification

12. **keyPoints[4]:** Adding backup cues — icons, labels, patterns, or shapes — ensures meaning survives even when color distinction is reduced.

   - **Flags:** Rule 1: em dash (2)

### u4-l4: What Color Perception Means for Design

- **Source:** `src/lessons/unit-4/lesson-4-4.ts`
- **Flagged items:** 10

#### Flagged items

1. **steps[1].text:** Now that you understand how CVD changes what people see, look at common interface patterns through that lens. Some designs survive color perception differences just fine. Others fall apart — and the reason is almost always the same: the meaning lives entirely in the hue.

   - **Flags:** Rule 1: em dash (1); Dramatic or copywriter-style wording; Absolute or broad claim requiring qualification

2. **steps[4].text:** Charts and data visualizations are especially vulnerable. When series are distinguished only by hue, a CVD simulation can make two or three series look identical. This is not just a theoretical concern — it directly blocks comprehension.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

3. **steps[5].text:** Notice the pattern: designs that rely on a single visual channel (hue) to carry meaning are fragile. Your outcome here is diagnostic: name where meaning depends on hue alone and why that creates ambiguity. In the next unit, you will learn the repair techniques and guidelines for building robust alternatives.

   - **Flags:** Vague or banned quality label

4. **quizItems[1].choices[1].explanation:** Aesthetics are not the issue. The problem is that deuteranopia and protanopia make red and green look very similar, removing the only distinction.

   - **Flags:** Intensifier or unsupported degree; Contrast-formula wording

5. **quizItems[1].choices[3].explanation:** Screens display both fine. The issue is how certain visual systems perceive them, not how the display produces them.

   - **Flags:** Contrast-formula wording

6. **quizItems[1].choices[4].label:** The dots are too small to see color clearly

   - **Flags:** Intensifier or unsupported degree

7. **quizItems[2].prompt:** What makes a chart series robust against color perception differences?

   - **Flags:** Vague or banned quality label

8. **quizItems[2].choices[3].explanation:** High saturation does not solve the problem — two saturated colors can still look the same under CVD.

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[3].choices[1].explanation:** The number of colors is not the issue. Even two colors can fail if hue is the only distinguishing signal.

   - **Flags:** Contrast-formula wording

10. **keyPoints[1]:** Designs that rely on hue alone to carry meaning are fragile — they break when color perception varies.

   - **Flags:** Rule 1: em dash (1)

## unit-5

### u5-l1: Text Contrast in Practice

- **Source:** `src/lessons/unit-5/lesson-5-1.ts`
- **Flagged items:** 14

#### Flagged items

1. **steps[1].text:** In Unit 1, you learned that lightness difference — not hue — drives readable contrast. Now we quantify that with specific thresholds. A light gray label on a white card may feel elegant, but if the luminance difference is too small, many users will struggle to read it.

   - **Flags:** Rule 1: em dash (2)

2. **steps[3].text:** Large text can tolerate slightly less contrast because its size makes it easier to perceive. Small, light, or thin text needs stronger contrast — sometimes significantly more than the minimum.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

3. **steps[4].text:** A contrast ratio is a number from 1:1 (no contrast) to 21:1 (pure black on pure white). The tool calculates this ratio from the relative luminance of both colors. A pair either passes or fails — there is no aesthetic override.

   - **Flags:** Rule 1: em dash (1)

4. **steps[5].text:** Adjust the text and background colors in the lab. Watch how the ratio changes. Fix the three failing pairs in the challenge — meet the threshold for the stated use case. Remember: checking a color chip is not the same as checking text at real size and weight.

   - **Flags:** Rule 1: em dash (1)

5. **challenges[1].hints[2]:** Changing hue alone often does not fix contrast — focus on the lightness difference.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[4].explanation:** 7:1 is considered enhanced contrast — beyond the typical minimum.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[2].choices[1].explanation:** Large text is just as readable as small text — in fact, more so.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].choices[2].explanation:** Larger forms are more legible at lower contrast ratios — the eye has more surface area to work with.

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[2].choices[3].label:** Large text is always bold and bold text is always accessible

   - **Flags:** Absolute or broad claim requiring qualification

10. **quizItems[3].choices[1].label:** Orange is always less accessible than blue

   - **Flags:** Absolute or broad claim requiring qualification

11. **quizItems[3].choices[2].label:** Contrast ratio depends on relative luminance, not hue — two different hues can have the same lightness and produce the same ratio

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[4].label:** Hue always changes contrast ratio

   - **Flags:** Absolute or broad claim requiring qualification

13. **keyPoints[3]:** Changing hue alone rarely fixes a contrast failure — focus on lightness difference.

   - **Flags:** Rule 1: em dash (1)

14. **keyPoints[4]:** Always test contrast with actual text sizes and weights in context, not only with color chip pairs.

   - **Flags:** Absolute or broad claim requiring qualification

### u5-l2: Non-Text Contrast for Controls and Graphics

- **Source:** `src/lessons/unit-5/lesson-5-2.ts`
- **Flagged items:** 17

#### Flagged items

1. **description:** Extend accessible contrast thinking beyond text to the controls, icons, boundaries, and graphics that users depend on to navigate and operate interfaces.

   - **Flags:** Overused or inflated verb

2. **steps[1].text:** Text contrast is the most discussed accessibility check, but it is not the only one. Many essential interface elements are not text: input borders, icon buttons, toggles, focus rings, chart marks, and status indicators all need clear visual distinction.

   - **Flags:** Inflated importance claim

3. **steps[3].text:** Focus indicators are especially critical for keyboard users. If the focus ring around a button or link is too faint, keyboard navigation becomes very difficult.

   - **Flags:** Intensifier or unsupported degree; Inflated importance claim

4. **steps[4].text:** Meaningful icons — icons that carry information, not just decoration — need sufficient contrast to be read reliably. A faint icon telling a user whether a feature is enabled or disabled is a real usability failure.

   - **Flags:** Rule 1: em dash (2); Contrast-formula wording

5. **steps[5].text:** In the component checker, adjust each element's color until it becomes clearly visible against adjacent backgrounds. Ask: 'Can the user quickly find, identify, and operate this element?' — not 'Does it look minimal and clean?'

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

6. **challenges[1].prompt:** Fix the visibility of each UI component — input border, icon, focus ring, toggle state — so it is clearly identifiable against its background.

   - **Flags:** Rule 1: em dash (2); Intensifier or unsupported degree

7. **challenges[1].hints[2]:** A visible focus ring should stand out clearly, not just exist.

   - **Flags:** Intensifier or unsupported degree; Contrast-formula wording

8. **quizItems[1].choices[1].label:** Yes — text is the most important element

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].choices[2].label:** No — controls, icons, boundaries, and meaningful graphics also need clear visual distinction

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[1].choices[3].label:** Yes — graphics are decorative

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[1].choices[4].label:** Yes — focus states only matter for mobile

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[2].choices[2].explanation:** Without a visible focus ring, keyboard navigation becomes extremely difficult.

   - **Flags:** Intensifier or unsupported degree

13. **quizItems[2].choices[4].explanation:** Focus rings are often hidden by designers — this is an accessibility failure, not a preference.

   - **Flags:** Rule 1: em dash (1)

14. **quizItems[3].choices[1].explanation:** This icon carries essential meaning — it is a graphical object, not decoration.

   - **Flags:** Rule 1: em dash (1); Inflated importance claim

15. **quizItems[3].choices[2].label:** The icon carries essential meaning and low contrast makes it hard to read, failing users who rely on it

   - **Flags:** Inflated importance claim

16. **keyPoints[1]:** Accessibility applies to all meaningful visual elements, not just text — controls, icons, focus rings, and graphics all need contrast.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

17. **keyPoints[3]:** Focus indicators are essential for keyboard navigation and must be clearly visible against the background.

   - **Flags:** Intensifier or unsupported degree; Inflated importance claim

### u5-l3: Color-Only Problems and Redundant Cues

- **Source:** `src/lessons/unit-5/lesson-5-3.ts`
- **Flagged items:** 14

#### Flagged items

1. **steps[2].text:** Semantic states — success, warning, error, info — are a fundamental UI pattern. Most start with color alone: a green badge, a yellow badge, a red badge. Each state should communicate through at least two channels: a success state can use green color + a checkmark icon + the label "Success."

   - **Flags:** Rule 1: em dash (2); Inflated importance claim

2. **steps[4].text:** Charts with multiple series are especially vulnerable. Two strong fixes: direct labels placed adjacent to each line or bar (eliminating the need for a color-only legend) and pattern fills — hatching or textures — that make series distinguishable without relying on hue.

   - **Flags:** Rule 1: em dash (2)

3. **steps[5].text:** The principle is redundancy: meaning carried by two or more signals. If color fades under CVD simulation, the icon or label still communicates. A good test: if you removed all color and every element's meaning was still clear, the design is robust.

   - **Flags:** Vague or banned quality label

4. **challenges[1].prompt:** Add at least one non-color cue to each of the four semantic states. Toggle icon, label, and border style to build a more robust state system.

   - **Flags:** Vague or banned quality label

5. **quizItems[1].choices[1].explanation:** WCAG does not limit the number of colors — it requires that color is not the sole means of conveying information.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[4].explanation:** Color is encouraged — it just cannot be the only signal. The goal is redundancy, not removal.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[2].choices[1].explanation:** Green is conventionally associated with success. The weakness is not the color choice — it is relying on color alone.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].choices[2].explanation:** A green border is invisible as a "success" signal to someone who cannot perceive that hue. Adding an icon and text makes the success state robust.

   - **Flags:** Vague or banned quality label

9. **quizItems[2].choices[3].explanation:** Borders are a perfectly valid UI element. The issue is using color as the only channel.

   - **Flags:** Contrast-formula wording

10. **quizItems[2].choices[4].label:** Because success messages must always use a modal dialog

   - **Flags:** Absolute or broad claim requiring qualification

11. **quizItems[2].choices[4].explanation:** Inline success feedback is a common and appropriate pattern. The form of feedback is not the issue — the lack of backup cues is.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

12. **quizItems[3].choices[2].explanation:** Redundant cues make designs robust — if color is lost, icons and labels still communicate.

   - **Flags:** Rule 1: em dash (1); Vague or banned quality label

13. **keyPoints[1]:** WCAG 1.4.1 requires that color is not the only means of conveying information — color should support meaning, not carry it alone.

   - **Flags:** Rule 1: em dash (1)

14. **keyPoints[5]:** Redundancy means carrying meaning through two or more signals — a robust design remains clear even if color is removed.

   - **Flags:** Rule 1: em dash (1); Vague or banned quality label

### u5-l4: Accessible Patterns for Real Interfaces

- **Source:** `src/lessons/unit-5/lesson-5-4.ts`
- **Flagged items:** 12

#### Flagged items

1. **description:** Apply accessible color principles to complete, repeating interface patterns: forms, links, alerts, charts, and navigation — building habits that scale across whole products.

   - **Flags:** Rule 1: em dash (1)

2. **steps[2].text:** Links embedded in body text need underlines or another non-color cue. A color-only link shift is easy to miss — especially in long paragraphs, on tinted backgrounds, or for users with deutan CVD.

   - **Flags:** Rule 1: em dash (1)

3. **steps[5].text:** In the pattern repair workshop, fix each real interface module. See the before-and-after comparison. Think about whether your fix would scale across the whole product — not just this one screen.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

4. **challenges[1].prompt:** Repair each interface pattern — form, link paragraph, alert stack, and chart — so each one communicates clearly without relying solely on color.

   - **Flags:** Rule 1: em dash (2); Intensifier or unsupported degree

5. **challenges[1].hints[1]:** For the form: add an error icon and a message text, not just a border color.

   - **Flags:** Contrast-formula wording

6. **challenges[1].hints[3]:** For the chart: add direct labels or patterns to series, not just a color legend.

   - **Flags:** Contrast-formula wording

7. **quizItems[1].choices[2].label:** Once defined, the accessible pattern scales across the whole product automatically — every instance gets the improvement

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].choices[2].label:** Color alone may not distinguish a link from surrounding text — an underline is a non-color cue that confirms interactivity

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[2].choices[4].label:** Color-only links always fail WCAG

   - **Flags:** Absolute or broad claim requiring qualification

10. **quizItems[2].choices[4].explanation:** Color-only links can pass if the contrast between link and body text is high enough, but underlines are the safer, more robust choice.

   - **Flags:** Vague or banned quality label

11. **keyPoints[1]:** Accessible patterns scale better than one-off fixes — define the pattern once and every instance benefits.

   - **Flags:** Rule 1: em dash (1)

12. **keyPoints[3]:** Alerts should combine color tint, an icon, and structured message text — not background tint alone.

   - **Flags:** Rule 1: em dash (1)

### u5-l5: Accessibility Audit Workflow

- **Source:** `src/lessons/unit-5/lesson-5-5.ts`
- **Flagged items:** 11

#### Flagged items

1. **steps[1].text:** A contrast checker calculates a ratio — it does not decide whether a design is accessible. Judgment still requires testing in context: at real sizes, with real content, in a realistic layout. A body text color that barely passes on a chip may fail in context on a colored card.

   - **Flags:** Rule 1: em dash (1)

2. **steps[2].text:** A practical audit workflow has four stages: (1) Identify priority elements on the current screen or flow — text, controls, states, and graphics that carry meaning. (2) Check contrast ratios for text and non-text components. (3) Simulate CVD conditions and identify ambiguous elements. (4) Verify task completion — can users still accomplish their goals?

   - **Flags:** Rule 1: em dash (2)

3. **steps[4].text:** After contrast checks, ask: does any element rely on color alone? A passing ratio does not fix a color-alone problem — both checks must be done separately. Then simulate at least two CVD types and walk through the core user flows.

   - **Flags:** Rule 1: em dash (1)

4. **steps[5].text:** The most valuable question during simulated review is not "do the colors look different?" but "can the user complete the task?" Run through the core user flows for this interface slice — fill a form, read a chart, understand a status indicator — and flag anywhere meaning is lost.

   - **Flags:** Rule 1: em dash (2)

5. **challenges[1].prompt:** Work through the full audit checklist on the mock interface — identify priority elements, check contrast, flag color-only issues, and simulate CVD.

   - **Flags:** Rule 1: em dash (1)

6. **challenges[1].hints[2]:** A passing ratio does not fix a color-only problem — check both separately.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[1].explanation:** A checker tells you the ratio and pass/fail status — you still need to decide how to fix it.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[2].choices[2].label:** Whether the user can still complete the task, not just whether colors look different

   - **Flags:** Contrast-formula wording

9. **keyPoints[1]:** A contrast tool calculates ratios — it does not replace judgment. Always test in realistic context with real sizes and content.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

10. **keyPoints[4]:** Contrast passing does not mean color-alone passing — both checks must be done separately.

   - **Flags:** Rule 1: em dash (1)

11. **keyPoints[5]:** During simulated review, ask "can the user complete the task?" — not just "do the colors look different?"

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

### u5-l6: Inclusive Testing and Review

- **Source:** `src/lessons/unit-5/lesson-5-6.ts`
- **Flagged items:** 16

#### Flagged items

1. **steps[1].text:** CVD simulation is a useful approximation, but it is not a perfect substitute for user research. Different people with the same CVD type can have different experiences. Simulation gives you a fast first pass — it does not give you a complete picture.

   - **Flags:** Rule 1: em dash (1)

2. **steps[3].text:** Inclusive checks should happen early in the design process, not only as a final compliance step. Structural changes — like adding a second column to a legend or switching from color-only dots to labeled badges — are much cheaper to make before designs are locked.

   - **Flags:** Rule 1: em dash (2)

3. **steps[4].text:** User testing with people who have CVD adds value that simulation cannot provide: real reactions, task completion rates, and the nuances of individual experience. Even occasional user testing significantly improves your understanding beyond what any filter can show.

   - **Flags:** Intensifier or unsupported degree

4. **steps[5].text:** Accessible color design is not a separate phase — it is a quality lens applied throughout regular design work. Check early, simulate often, and validate with real users when possible. The goal is to make accessibility a habit, not a last-minute task.

   - **Flags:** Rule 1: em dash (1)

5. **challenges[1].hints[1]:** Read each checklist item carefully. The sample interface has real problems — look for them.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[1].label:** Yes — simulation shows exactly what every CVD user sees

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[2].label:** No — it is a useful approximation, and real user testing still adds value

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[3].label:** Yes — all protan users see the same filtered result

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].choices[4].label:** No — simulation is inaccurate and should not be used

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[2].choices[2].label:** Because structural fixes are much harder after the design is locked — catching problems early is cheaper

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[2].choices[2].explanation:** Switching from color-only dots to labeled badges is trivial in a design file and very costly in a shipped product.

   - **Flags:** Intensifier or unsupported degree

12. **quizItems[3].choices[1].label:** Nothing — simulation is sufficient for all accessibility checking

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[3].choices[2].explanation:** Even occasional user testing significantly improves understanding beyond what any filter can show.

   - **Flags:** Intensifier or unsupported degree

14. **quizItems[3].choices[3].explanation:** User testing is about usability and comprehension, not about calibrating color values.

   - **Flags:** Contrast-formula wording

15. **quizItems[3].choices[4].explanation:** User testing is typically slower than simulation — its value is depth of insight, not speed.

   - **Flags:** Rule 1: em dash (1)

16. **keyPoints[1]:** CVD simulation is a useful approximation — a valuable first-pass check — but not a perfect substitute for real user testing.

   - **Flags:** Rule 1: em dash (2)

## unit-6

### u6-l1: From Individual Colors to Color Systems

- **Source:** `src/lessons/unit-6/lesson-6-1.ts`
- **Flagged items:** 7

#### Flagged items

1. **quizItems[1].choices[4].explanation:** Hex values can always be changed — that is not the advantage of semantic roles.

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

2. **quizItems[2].choices[2].label:** The blue carries too many different meanings — users cannot tell what is interactive and what is decorative

   - **Flags:** Rule 1: em dash (1)

3. **quizItems[2].choices[3].explanation:** Blue can be accessible — the issue here is overuse and mixed meaning, not the hue itself.

   - **Flags:** Rule 1: em dash (1)

4. **quizItems[2].choices[4].label:** Decorative elements should always match buttons

   - **Flags:** Absolute or broad claim requiring qualification

5. **quizItems[2].choices[4].explanation:** Decorative elements should generally not match interactive elements — that is the source of the problem.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[3].choices[4].explanation:** Too vague — every component might interpret 'accent' differently.

   - **Flags:** Rule 1: em dash (1)

7. **keyPoints[2]:** System inconsistency usually comes from role drift, overlap, and local overrides rather than single bad color picks.

   - **Flags:** Contrast-formula wording

### u6-l2: Building Semantic Color Roles for UI

- **Source:** `src/lessons/unit-6/lesson-6-2.ts`
- **Flagged items:** 17

#### Flagged items

1. **description:** Define a compact set of semantic roles covering structure, content, interactions, and status — and connect those roles to real components.

   - **Flags:** Rule 1: em dash (1)

2. **steps[1].text:** A useful role set covers four areas: structural (backgrounds, surfaces, dividers), content (primary text, secondary text, and inverse text — text placed on dark or colored surfaces), interactive (primary action, secondary action, focus, links), and semantic (success, warning, error, info).

   - **Flags:** Rule 1: em dash (1)

3. **steps[2].text:** Text usually needs at least two levels. Primary text is used for headings and important labels. Secondary text is used for supporting information, captions, and metadata. Without this separation, everything fights for attention.

   - **Flags:** Dramatic or copywriter-style wording

4. **steps[4].text:** Interactive roles need more than a single action color. A button also has hover, focus, pressed, and disabled states. Each needs a clear visual treatment — not just a different hex, but a meaningful role.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

5. **challenges[1].hints[1]:** Start with surfaces and text — get the background and readability right before adding accent colors.

   - **Flags:** Rule 1: em dash (1)

6. **challenges[1].hints[2]:** Keep success/warning/error visually distinct — not just different hues but different enough lightness too.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

7. **quizItems[1].choices[1].explanation:** WCAG does not require two text roles — the reasoning is about visual hierarchy.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[2].label:** To create hierarchy — primary text draws attention, secondary text supports without competing

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].choices[3].explanation:** Complexity is not a goal — clear hierarchy is.

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[2].choices[1].explanation:** Brand alignment is not the issue — component state feedback is.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

11. **quizItems[2].choices[2].label:** Component state treatments — without them users cannot tell whether a button responded to their input

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[2].choices[2].explanation:** Correct. States communicate feedback — users need to know when something is being hovered, focused, or is unavailable.

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[2].choices[4].explanation:** Icons are optional — component states are not.

   - **Flags:** Rule 1: em dash (1)

14. **quizItems[3].prompt:** An interface has one surface color used everywhere — page, cards, panels, and overlays. What breaks?

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

15. **quizItems[3].choices[1].label:** Text contrast always fails

   - **Flags:** Absolute or broad claim requiring qualification

16. **quizItems[3].choices[3].label:** Visual depth and structure — without surface levels, the layout loses hierarchy and components blur together

   - **Flags:** Rule 1: em dash (1)

17. **keyPoints[4]:** Component states (hover, focus, pressed, disabled) are essential — they tell users whether their actions are registering.

   - **Flags:** Rule 1: em dash (1); Inflated importance claim

### u6-l3: Brand Constraints and Hierarchy

- **Source:** `src/lessons/unit-6/lesson-6-3.ts`
- **Flagged items:** 11

#### Flagged items

1. **steps[1].text:** Unit 1 showed that hierarchy requires restraint — accent colors lose impact when overused. Brand colors pose the same risk at a system level: chosen for marketing materials with high contrast and bold typography, they can overwhelm an interface when applied to backgrounds, small labels, icons, and states simultaneously.

   - **Flags:** Rule 1: em dash (1)

2. **challenges[1].hints[2]:** Test your primary text against your page background — this pair must pass contrast before styling anything else.

   - **Flags:** Rule 1: em dash (1)

3. **quizItems[1].choices[1].label:** Brand colors are always too dark

   - **Flags:** Absolute or broad claim requiring qualification

4. **quizItems[1].choices[1].explanation:** Brand colors vary in darkness — that is not the core limitation.

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[1].choices[2].label:** Interfaces need neutrals, surface levels, text hierarchy, states, and semantic roles — one hue cannot cover all of these without creating confusion

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[4].label:** Brand guidelines always forbid overuse

   - **Flags:** Absolute or broad claim requiring qualification

7. **quizItems[2].choices[2].label:** Contrast improves everywhere

   - **Flags:** Absolute or broad claim requiring qualification

8. **quizItems[2].choices[3].label:** Hierarchy collapses — every element competes equally for attention, making the interface hard to scan

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[3].choices[2].label:** Primary interactive elements — buttons, links, and key highlights — where it needs to attract attention

   - **Flags:** Rule 1: em dash (2)

10. **keyPoints[1]:** Brand colors are anchors, not complete systems — interfaces also need neutrals, tonal steps, and semantic roles.

   - **Flags:** Rule 1: em dash (1)

11. **keyPoints[4]:** Accent overuse occurs when the brand color appears on everything — hierarchy collapses and nothing stands out.

   - **Flags:** Rule 1: em dash (1)

### u6-l4: Dark Mode and Theme Pairing

- **Source:** `src/lessons/unit-6/lesson-6-4.ts`
- **Flagged items:** 19

#### Flagged items

1. **description:** Learn practical dark mode thinking — how to adapt a color system across themes without simply inverting every value.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

2. **steps[2].text:** Dark theme backgrounds are typically a very dark but not pure-black neutral — something in the range of #0f172a to #1e293b, for example. The exact values will depend on your palette; what matters is avoiding pure black and leaving room for surface layers above it.

   - **Flags:** Rule 1: em dash (1); Intensifier or unsupported degree

3. **steps[3].text:** Text in dark mode is usually a soft off-white rather than pure white. As a starting point, primary text might be around #f8fafc while secondary text is around #94a3b8 — still high contrast against the dark surface, but less fatiguing than full-brightness white.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

4. **steps[4].text:** Accent colors often need to be lighter or less saturated in dark mode. A vivid blue that read well on a white background may feel overwhelming on a dark surface. Mode adaptation means reviewing each role, not just toggling a switch.

   - **Flags:** Contrast-formula wording

5. **challenges[1].hints[2]:** Lighten your accent slightly for dark mode — vivid colors intensify on dark backgrounds.

   - **Flags:** Rule 1: em dash (1)

6. **challenges[1].hints[3]:** Check secondary text contrast in dark mode — it can fall below threshold even if primary text passes.

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[1].explanation:** CSS can invert values — that is not the problem.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[2].label:** Inverted colors never pass contrast

   - **Flags:** Absolute or broad claim requiring qualification

9. **quizItems[1].choices[2].explanation:** Inverted colors can pass contrast — but they often fail for structural reasons.

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[2].choices[1].label:** Colors always need to match exactly across modes

   - **Flags:** Absolute or broad claim requiring qualification

11. **quizItems[2].choices[1].explanation:** Matching exactly across modes is not the goal — visual balance is.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[2].choices[2].label:** Vivid colors appear more intense on dark backgrounds — they can dominate or feel aggressive where they felt balanced in light mode

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[2].choices[3].explanation:** Dark mode does not require full desaturation — just appropriate adjustment.

   - **Flags:** Rule 1: em dash (1)

14. **quizItems[2].choices[4].explanation:** Browsers do not change color values — perception changes due to the dark context.

   - **Flags:** Rule 1: em dash (1)

15. **quizItems[3].choices[1].label:** Using slightly different dark values for each surface layer — page, card, raised panel — so depth and hierarchy remain visible

   - **Flags:** Rule 1: em dash (2)

16. **keyPoints[1]:** Dark mode is not light-mode inversion — surfaces, text, and accents all need intentional dark-theme values.

   - **Flags:** Rule 1: em dash (1)

17. **keyPoints[2]:** Use very dark but not pure-black backgrounds (e.g. #0f172a) to allow card and panel layers to appear above.

   - **Flags:** Intensifier or unsupported degree

18. **keyPoints[4]:** Accent colors often need lighter or less-saturated values in dark mode — vivid colors intensify on dark surfaces.

   - **Flags:** Rule 1: em dash (1)

19. **keyPoints[5]:** Check contrast in both modes separately — what passes in light mode may fail in dark mode.

   - **Flags:** Rule 1: em dash (1)

### u6-l5: Color for Charts and Data Visualization

- **Source:** `src/lessons/unit-6/lesson-6-5.ts`
- **Flagged items:** 18

#### Flagged items

1. **description:** Choose and improve chart color palettes so data is easier to compare, interpret, and understand — with less dependence on color alone.

   - **Flags:** Rule 1: em dash (1)

2. **steps[1].text:** Interface colors and chart colors do different jobs. Interface colors guide navigation and meaning. Chart colors encode data — they represent groups, magnitudes, or emphasis. They need different design strategies.

   - **Flags:** Rule 1: em dash (1)

3. **steps[4].text:** Chart colors should contrast sufficiently with the chart background and with adjacent series. Red-green combinations are especially risky — use shape, pattern, or direct labels to support color in all chart contexts.

   - **Flags:** Rule 1: em dash (1)

4. **challenges[1].hints[1]:** Aim for high contrast between adjacent series, not just different hues.

   - **Flags:** Contrast-formula wording

5. **challenges[1].hints[3]:** Avoid using red and green as the only distinguishing pair — use blue/orange or add patterns.

   - **Flags:** Rule 1: em dash (1)

6. **quizItems[1].choices[1].label:** Always — sequential palettes are more accessible

   - **Flags:** Rule 1: em dash (1); Absolute or broad claim requiring qualification

7. **quizItems[1].choices[1].explanation:** Sequential palettes are not universally superior — they are appropriate for ordered data only.

   - **Flags:** Rule 1: em dash (1)

8. **quizItems[1].choices[2].label:** When data has a meaningful order — such as temperature, quantity, or severity level — and the goal is to show progression

   - **Flags:** Rule 1: em dash (2)

9. **quizItems[1].choices[2].explanation:** Correct. Sequential palettes encode magnitude — they should not be used for unordered categories.

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[2].choices[1].label:** Red and green are always confusing regardless of CVD

   - **Flags:** Absolute or broad claim requiring qualification

11. **quizItems[2].choices[1].explanation:** Red and green are distinct to most viewers — the risk is specifically under CVD conditions.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[2].choices[3].label:** Under protan or deutan CVD, red and green may look similar — users cannot tell which is which

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[2].choices[4].label:** Red is always too dark for charts

   - **Flags:** Absolute or broad claim requiring qualification

14. **quizItems[2].choices[4].explanation:** Red's lightness depends on the specific value used — it is not inherently too dark.

   - **Flags:** Rule 1: em dash (1)

15. **quizItems[3].choices[4].explanation:** Tables serve a different purpose — they are not a substitute for chart accessibility.

   - **Flags:** Rule 1: em dash (1)

16. **keyPoints[2]:** Chart colors need sufficient contrast with each other and with the chart background — not just different hues.

   - **Flags:** Rule 1: em dash (1); Contrast-formula wording

17. **keyPoints[3]:** Red-green only differentiation is risky — support with labels, patterns, or different shapes under CVD conditions.

   - **Flags:** Rule 1: em dash (1)

18. **keyPoints[4]:** Direct labels on chart series are more robust than color-only legends and work under CVD simulation.

   - **Flags:** Vague or banned quality label

### u6-l6: Color Spaces and Modern Screens

- **Source:** `src/lessons/unit-6/lesson-6-6.ts`
- **Flagged items:** 19

#### Flagged items

1. **steps[2].text:** Display P3 is a wider color space available on many modern screens — especially Apple devices. It can represent more vivid colors than sRGB. If a user's screen does not support P3, those extra-vivid colors are clipped back to the nearest sRGB equivalent. Design for sRGB first, then enhance with P3 where supported.

   - **Flags:** Rule 1: em dash (1); Overused or inflated verb

2. **steps[3].text:** Colors appear not only in CSS but in SVG graphics, HTML Canvas elements, and WebGL scenes. A chart bar in Canvas, an icon fill in SVG, a 3D surface in WebGL — each rendering context uses explicit color values. The context changes, but the need for thoughtful color decisions does not.

   - **Flags:** Rule 1: em dash (1)

3. **steps[4].text:** Color does not exist in isolation. The same hex value looks different depending on surroundings: a neutral gray on white looks warm; the same gray on a blue background looks cool. This context effect — also called simultaneous contrast — means your system must be tested in real layouts, not just in swatch grids.

   - **Flags:** Rule 1: em dash (2); Contrast-formula wording

4. **quizItems[1].choices[1].label:** Display P3 — because it has more vivid colors

   - **Flags:** Rule 1: em dash (1)

5. **quizItems[1].choices[1].explanation:** P3 offers wider gamut, but not all screens support it. sRGB is the safe baseline that works everywhere.

   - **Flags:** Absolute or broad claim requiring qualification

6. **quizItems[1].choices[2].label:** sRGB — because it is supported by virtually all screens

   - **Flags:** Rule 1: em dash (1)

7. **quizItems[1].choices[2].explanation:** sRGB is the universal default. Design in sRGB first, then enhance with P3 where supported.

   - **Flags:** Overused or inflated verb; Absolute or broad claim requiring qualification

8. **quizItems[1].choices[3].label:** Neither — CSS automatically picks the right one

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[2].choices[1].explanation:** Browsers do not apply random color profiles — the effect is perceptual.

   - **Flags:** Rule 1: em dash (1)

10. **quizItems[2].choices[2].label:** Surrounding colors influence perception — a neutral looks warmer or cooler depending on adjacent hues

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[2].choices[3].explanation:** Hex values are exact — they do not shift between files.

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[3].choices[1].label:** Never use saturated colors

   - **Flags:** Absolute or broad claim requiring qualification

13. **quizItems[3].choices[1].explanation:** Saturated colors are not forbidden — they should be used with awareness of display variation.

   - **Flags:** Rule 1: em dash (1)

14. **quizItems[3].choices[2].label:** Standard sRGB is always safer and should be used exclusively

   - **Flags:** Absolute or broad claim requiring qualification

15. **quizItems[3].choices[3].label:** Colors may appear more vivid than expected — use restrained saturation and test on multiple display types

   - **Flags:** Rule 1: em dash (1)

16. **keyPoints[1]:** sRGB is the default color space for web work — supported by virtually all screens and the safe baseline.

   - **Flags:** Rule 1: em dash (1)

17. **keyPoints[3]:** Colors appear in CSS, SVG, Canvas, and WebGL contexts — the rendering context changes but the need for thoughtful decisions does not.

   - **Flags:** Rule 1: em dash (1)

18. **keyPoints[4]:** Context effect: the same hex looks different depending on surroundings. Test in real layouts, not just swatch grids.

   - **Flags:** Contrast-formula wording

19. **keyPoints[5]:** Wide-gamut displays can make saturated colors appear overwhelming — use restrained saturation and test across display types.

   - **Flags:** Rule 1: em dash (1)

### u6-l7: Final System Review and Stress Test

- **Source:** `src/lessons/unit-6/lesson-6-7.ts`
- **Flagged items:** 18

#### Flagged items

1. **learningGoal:** Perform a comprehensive system stress test that identifies role drift, token inconsistency, and cross-context failures.

   - **Flags:** Vague or banned quality label

2. **steps[1].text:** A color system is only as good as its worst context. A palette that looks great in a marketing mockup may have weak hierarchy in dark mode, indistinguishable states in a chart, or invisible alerts under CVD simulation. A stress test exposes these hidden weaknesses.

   - **Flags:** Dramatic or copywriter-style wording

3. **steps[2].text:** Apply your system to five contexts: light mode, dark mode, chart view, alert stack, and simulated CVD. Each context exercises different roles — surfaces, text hierarchy, semantic states, data encoding, and perceptual robustness.

   - **Flags:** Rule 1: em dash (1)

4. **steps[3].text:** A consistency audit checks governance patterns across the system, not just one screen. Common failures include role drift (one role used for two meanings), role duplication (two roles doing one job), and local overrides that bypass shared tokens.

   - **Flags:** Contrast-formula wording

5. **steps[4].text:** Before shipping, verify both quality and governance: hierarchy (is the primary action clearly dominant?), readability (does all text meet contrast thresholds?), semantic clarity (do success/warning/error feel distinct?), dark mode (do all roles still work?), chart readability (are series distinguishable?), CVD robustness (do backup cues survive simulation?), and token propagation (do fixes apply consistently across contexts?).

   - **Flags:** Intensifier or unsupported degree

6. **steps[5].text:** This is a synthesis exercise — everything from Units 1 through 6 comes together. Your visual vocabulary, additive-model understanding, format knowledge, perception awareness, accessibility skills, and systems thinking all contribute to evaluating a color system holistically.

   - **Flags:** Rule 1: em dash (1); Vague or banned quality label; Dramatic or copywriter-style wording

7. **challenges[1].hints[1]:** Toggle between all five contexts before marking anything — the same issue might appear in multiple views.

   - **Flags:** Rule 1: em dash (1)

8. **challenges[1].hints[4]:** Simulation failures often appear in the chart and alert views — check those carefully.

   - **Flags:** Rule 1: em dash (1)

9. **quizItems[1].prompt:** Why should you test a color system in multiple contexts rather than a single mockup?

   - **Flags:** Contrast-formula wording

10. **quizItems[1].choices[1].explanation:** A palette can look great in one context and fail in others — dark mode, charts, and CVD simulation all exercise different roles.

   - **Flags:** Rule 1: em dash (1)

11. **quizItems[1].choices[2].label:** Different contexts exercise different roles — weaknesses invisible in one view may appear in another

   - **Flags:** Rule 1: em dash (1)

12. **quizItems[1].choices[3].explanation:** Client preference is not the reason — functional quality is.

   - **Flags:** Rule 1: em dash (1)

13. **quizItems[1].choices[4].explanation:** A well-built system uses one role set across all contexts — the test verifies that it holds up.

   - **Flags:** Rule 1: em dash (1)

14. **quizItems[2].choices[1].explanation:** Multiple roles can share a hex value — uniqueness is not the goal of a consistency audit.

   - **Flags:** Rule 1: em dash (1)

15. **quizItems[2].choices[2].label:** Whether roles and tokens are applied consistently — one role per meaning, and changes propagating across contexts

   - **Flags:** Rule 1: em dash (1)

16. **quizItems[3].choices[2].explanation:** Brand presentation is one context — a complete review covers many more.

   - **Flags:** Rule 1: em dash (1)

17. **keyPoints[1]:** A stress test applies the system across multiple contexts — light mode, dark mode, charts, alerts, CVD simulation — to find hidden weaknesses.

   - **Flags:** Rule 1: em dash (2); Dramatic or copywriter-style wording

18. **keyPoints[4]:** This is a synthesis exercise — visual vocabulary, additive model, format knowledge, perception, accessibility, and systems thinking all come together.

   - **Flags:** Rule 1: em dash (1)
