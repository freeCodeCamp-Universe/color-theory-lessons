# Accessible visual-content contract

This contract covers lesson previews, lesson tools, lesson quiz swatches, milestone challenges, shared lesson and milestone shells, and Palette Builder. The inventory assigns implementation to the child issues of #53. General keyboard, focus, landmark, zoom, and reflow work belongs to #54.

## Classifications

- **Informative:** The visual teaches or displays information that is not present in adjacent text. Supply an authored name when the visible heading is insufficient, a description of the visible evidence, and any color names and values that a sighted learner can inspect.
- **Assessment:** The learner must interpret the visual. Describe observable evidence, available controls, selected values, and submitted results. Do not name the expected choice, target value, faulty region, or repair before submission.
- **Decorative:** The visual repeats adjacent text or adds styling only. Put `aria-hidden="true"` on the smallest non-interactive wrapper. Add `focusable="false"` to decorative SVG elements. Never hide a wrapper that contains a control.

A visual can contain items from more than one class. Apply the treatment to each item instead of classifying the entire tool by its most important item.

## Authored data

| Content | Authoring location | Fields |
|---|---|---|
| Lesson step panel | `LessonStep.panel.accessibility` | `classification`, optional `accessibleName`, `accessibleDescription`, optional `colors` |
| Lesson quiz swatch | `QuizItem.colorSwatches[]` | visible `label`, visible `color`, and `accessibleDescription` |
| Milestone quiz swatch | `MilestoneQuestion` | visible `swatchColor` and `swatchDescription` |
| Milestone challenge visual | `MilestoneChallengePart.visualAccessibility` | `classification`, optional `accessibleName`, `accessibleDescription`, optional `colors` |
| Tool-owned state | The tool component or its typed scenario data | visible label, current value, authored description, and status message |

`VisualAccessibility` is a discriminated union. Decorative entries cannot carry a description. Informative and assessment entries require `accessibleDescription`. The `colors` array stores the same human-readable name and value shown in the visual; it does not replace a description of relationships, order, contrast, pattern, or state.

## Assessment descriptions

Describe the evidence needed to perform the task, but stop before interpreting it for the learner.

- Safe: "A muted, lighter rose-red swatch. Color value: #C48B9F."
- Unsafe: "The second swatch has lower saturation, so choose Saturation."
- Safe: "The footer uses dark gray text on a near-black background."
- Unsafe before submission: "The footer is the low-contrast region."

Keep target and current state separate. A matching task can expose an authored description of the target and the learner's current numeric values without exposing the target's exact hidden answer. Submitted feedback can name the correct relationship after grading.

## Rendering and announcements

Use `VisualDescription` for text that should be available to assistive technology without duplicating it visually. Associate it with the visual through native structure or `aria-describedby`. A visible label remains the accessible name when it already names the item. Hide a color chip, dot, ring, gradient, status glyph, or SVG path when adjacent text and the authored description already provide its information.

Use `StatusAnnouncement` at the component that owns a meaningful state change. Announce a selected or changed value when the control does not expose it natively, assessment results after Check, stage changes, retry state, and completion. Keep the message short and replace the same live-region text; do not append a transcript. Use polite priority for progress and results. Reserve assertive priority for an error that prevents the current action. Do not announce initial static content, pointer movement, unchanged values, or content that has just received focus.

## Lesson interaction inventory

Each row lists the rendered visual items, followed by their classifications in the same order.

| Interaction type | Visual items | Classification | Required equivalent or treatment | Owner |
|---|---|---|---|---|
| `before-after` | Purposeful/noisy interface previews; color-role mockup and selectable regions; action-hierarchy preview and role selections; repeated interface primitives | Informative; assessment; assessment; decorative | Describe regions, role colors, emphasis, grouping, and the current preview without identifying expected selections; expose selected roles and hide repeated primitives | #102 |
| `slider-explore` | Target color; current color; hue, saturation, and lightness controls and values; slider gradients | Assessment; informative; informative; decorative | Describe target evidence without exact hidden values; expose current HSL values and match result; hide redundant track art | #102 |
| `contrast-checker` | Three text/background previews; ratio, threshold, and submitted result; lightness controls and values; slider gradients | Informative; informative; informative; decorative | Associate each preview, color pair, ratio, threshold, and submitted result with its lightness control; hide redundant track art | #102 |
| `temperature-sorter` | Named color swatches; temperature selections and submitted result; interface goals and palette-direction selections; selection borders and result glyphs | Assessment; assessment; assessment; decorative | Expose each visible name and value, its current temperature or palette-direction selection, submitted result, retry, and completion without preclassifying it | #102 |
| `color-wheel` | Hue wheel and base/related hue markers; relationship controls and description; palette and role mockup; relationship question and result; wheel segments and repeated swatches | Informative; informative; informative; assessment; decorative | Name the base hue, relationship, related hues, values, and palette roles without answering the relationship question; hide repeated wheel and swatch primitives | #102 |
| `additive-sort` | Additive and subtractive mixing diagrams with process labels and combined results; example classifications and submitted result; overlapping circles | Informative; assessment; decorative | Describe primaries, process, and visible combined result; expose current classifications and announce sorting result and completion; hide circle art after description | #103 |
| `rgb-mixer` | Target swatch; current mixed color; RGB channel controls and values; repeated swatch fills | Assessment; informative; informative; decorative | Describe target appearance without hidden channel answers; expose current values and match state; hide repeated swatch fills after their equivalent | #103 |
| `logic-fixer` | Paint-logic and screen-logic comparison; incorrect color-logic statements; rewrite choices and submitted result; comparison styling | Informative; assessment; assessment; decorative | Describe the comparison without selecting a rewrite; expose the selected rewrite and announce result, retry, and completion | #103 |
| `mismatch-explainer` | Screen and material-simulation swatches; emitted/reflected-light labels and scenario text; selectable mismatch factors and submitted result; repeated swatch fills | Assessment; informative; assessment; decorative | Describe each visible comparison without identifying the explanatory factors; expose selected factors and announce validation without naming the answers early | #103 |
| `background-shift` | Pixel/subpixel explorer and zoom state; same accent on two backgrounds; background and accent values; explanation choices and result; pixel grid and repeated swatches | Informative; assessment; informative; assessment; decorative | Describe the normal and zoomed pixel views and each background comparison without interpreting its cause; expose values, zoom state, and submitted result | #103 |
| `format-reveal` | Eight interface regions; selected region; color-format values; decorative region fills | Informative; informative; informative; decorative | Give each region a name, description, and HEX/RGB/HSL values; expose selection; hide fills once described | #106 |
| `hex-rgb-editor` | Target swatch; current swatch; HEX/RGB inputs and values; preset swatches | Assessment; informative; informative; informative | Describe target appearance without exact hidden answer; expose current values, invalid input, preset values, match result, and next target | #106 |
| `hsl-playground` | Target and current colors; hue wheel; HSL controls and format values; wheel and track art | Assessment; informative; informative; informative; decorative | Describe target evidence, expose the current HSL, HEX, and RGB state, and announce validation and completion; hide redundant wheel and track art | #106 |
| `alpha-layer` | Foreground, background, and blended result; overlay preview and optional text-contrast result; repeated layer fills | Informative; informative; decorative | Name colors, values, alpha, order, and blended result; describe composition and text-contrast changes; hide repeated fills after their equivalent | #106 |
| `theme-sandbox` | Interface preview; role swatches and values; gradient preview and endpoints; contrast results; decorative chips | Informative; informative; informative; informative; decorative | Summarize assigned roles, preview surfaces, contrast, and gradient endpoints; announce role, gradient, and contrast changes | #106 |
| `token-map` | Derived role-color swatches and values; generated interface preview; validation state; duplicate chips | Informative; informative; informative; decorative | Expose the base controls, derived roles, preview summary, validation, and completion; hide duplicate chips after their names and values | #106 |
| `eye-diagram` | Text-only visual-pathway stages and review controls | No visual-content item | No visual alternative is needed; expose the ordered stage, active stage, review state, and completion through text and the shared exercise shell | #101 |
| `vision-cards` | Vision-concept text cards and collapsed/expanded state; card accent swatches | Informative; decorative | Name each concept, expose its expanded state, and announce exploration progress and completion; hide the repeated accent swatches | #101 |
| `interface-gallery` | Interface status, chart, and form in each simulation; active simulation; filter decoration | Informative; informative; decorative | Describe distinctions visible in every mode and announce mode changes without claiming a universal lived experience | #101 |
| `color-only-detector` | Color-only and redundant-cue examples; selectable assessment regions; state dots and icons | Assessment; assessment; decorative | Describe observable cues without naming failures; expose control names, selected state, result, progress, and completion | #101 |
| `text-contrast-lab` | Text/background swatches; sample text; ratio, size, and pass state; status glyph | Informative; informative; informative; decorative | Associate role names, values, raw ratio, threshold, and result with inputs; announce changes | #108 |
| `component-checker` | Input-border, icon-button, focus-ring, and toggle-track previews; values and contrast results; repeated control and glyph details | Informative; informative; decorative | Describe the identifying visual part, adjacent colors, ratio, and result; announce validation and hide repeated details after their equivalent | #108 |
| `state-workshop` | Success, warning, error, and information previews; applied icon, label, and border cues; repeated state dots | Assessment; informative; decorative | Describe visible cues without naming the required repair; expose selected cues and announce repaired state | #108 |
| `pattern-repair` | Before/after form, link, alert, and chart examples; repair controls and state; pattern fills and icons | Assessment; assessment; decorative | Describe structure, cue type, and colors without stating the repair; announce checks, retry, and completion | #108 |
| `audit-flow` | Text-only audit questions and answer controls | No visual-content item | No visual alternative is needed; expose selection, stage, validation, and completion state through the controls and shared exercise shell | #108 |
| `inclusive-review` | Dashboard status, chart, and form mockup; active simulation; checklist selections and result; filter definitions and repeated primitives | Assessment; informative; assessment; decorative | Describe visible evidence and simulation changes without naming the expected checklist answers; announce progress, result, retry, and completion | #108 |
| `system-comparison` | Two system previews and selectable regions; region color values; decorative layout blocks | Assessment; informative; decorative | Give regions control names and values without naming the inconsistency; announce result and completion | #104 |
| `role-builder` | Role swatches and controls; generated interface preview; validation state; repeated chips | Assessment; informative; informative; decorative | Expose role names, current values, preview summary, validation, and completion without assigning answers early | #104 |
| `brand-pressure` | Fixed brand and editable supporting-role swatches; generated interface preview; contrast and pressure state; duplicate swatches and meter fill | Informative; informative; informative; decorative | Describe brand and supporting colors, values, preview changes, contrast, pressure, validation, and completion | #104 |
| `dark-translator` | Light and dark previews; role values and controls; contrast state; decorative chips | Informative; informative; informative; decorative | Summarize each theme, assigned values, surface hierarchy, and contrast; announce changes and results | #104 |
| `chart-tuner` | Grouped bar chart; series colors and pattern fills; normal/simulated state; optional data table; repeated bars and swatch chips | Informative; informative; informative; informative; decorative | Supply series, month, value, color, and pattern data; describe the active simulation; hide repeated chart primitives after the data-table equivalent | #104 |
| `color-space-lab` | sRGB and Display P3 comparison swatches and values; CSS, SVG, and canvas-style examples; selected sample and gamut result; repeated swatches and drawing primitives | Informative; informative; informative; decorative | Describe each comparison, example, value, selected sample, and gamut result; hide redundant swatches and drawing primitives | #104 |
| `system-stress` | System preview across scenarios; finding list and validation state; decorative preview blocks | Assessment; informative; decorative | Describe current scenario and observable preview state without naming findings early; announce findings and completion | #104 |

## Milestone challenge inventory

| Challenge type | Visual items | Classification | Required equivalent or treatment | Owner |
|---|---|---|---|---|
| `read-interface` | InterfaceMockup regions; role-classification controls; color and hierarchy details; repeated layout blocks | Assessment; assessment; informative; decorative | Describe each region's visible color, contrast, and emphasis without naming its role; announce score and completion | #110 |
| `channel-prediction` | RGB target values and channel choices; additive-mix values and answer swatches; repeated swatch chips | Assessment; assessment; decorative | Describe answer-swatch appearance without disclosing channel or mix answers; expose the visible RGB values and announce each stage and result | #110 |
| `theme-from-scratch` | Theme preview; HSL role controls; contrast and surface state; decorative role chips | Assessment; assessment; informative; decorative | Summarize current role values and preview evidence; announce validation, stage, retry, and completion | #110 |
| `simulation-spotter` | Normal/simulated color chips for six interface examples; selectable color-only examples; repair choices; repeated chips | Assessment; assessment; assessment; decorative | Describe observable color and cue changes without identifying failures or repairs; expose the simulation, selection, repair, result, and stage state | #110 |
| `accessibility-rescue` | Text, form, focus, and icon previews; repair controls; ratios and cue state; repeated status glyphs | Assessment; assessment; informative; decorative | Describe visible evidence without giving repair values; expose current state and announce validation and repair count | #110 |
| `semantic-audit` | Eight palette swatches; semantic-role assignments; palette conflict choices; duplicate swatch chips | Assessment; assessment; assessment; decorative | Expose swatch values, current assignments, and conflict choices without naming expected roles or the conflict before submission | #110 |
| `dark-mode-stress` | Dark theme preview; text, surface, and action controls; contrast and hierarchy state; decorative chips | Assessment; assessment; informative; decorative | Summarize current colors and preview evidence without target answers; announce validation, stages, retry, and completion | #110 |

## Shared shell inventory

| Surface | Visual items | Classification | Required equivalent or treatment | Owner |
|---|---|---|---|---|
| LessonPlayer | Progress dots and current phase | Informative; decorative | Expose phase and position through one progress value; hide individual dots; announce phase and completion changes | #105 |
| StepPanelRenderer | Seven authored lesson previews | Informative or assessment | Render `panel.accessibility`; keep preview-specific remediation with the owning unit issue | #105 |
| ToolRenderer | Loading state and the active tool | Informative | Keep the loading message named; pass stage and completion state to the lesson shell without duplicate announcements | #105 |
| ExerciseStage | Stage progress track and position; current instruction; submitted result, retry, and completion state; individual progress marks and result glyphs | Informative; informative; informative; decorative | Expose the stage title, position, instruction, and submitted state as text; announce result, retry, stage, and completion changes once; hide repeated marks and glyphs | #105 for lesson tools; #110 for milestone challenges |
| Lesson quiz | Named swatches and visible values; selected and submitted choice state | Assessment; informative | Render each `accessibleDescription`, keep the visible label and value, and announce result once | #105 |
| MilestonePlayer | Part dots, score, pass state, and transitions | Informative; decorative | Expose part position and result as text; hide individual dots; announce part, score, pass, and completion changes | #110 |
| Milestone quiz | Target swatch and value; choice result | Assessment; informative | Render `swatchDescription` without giving the answer; hide the color block after its text equivalent | #110 |
| InterfaceMockup | Navigation, hero, cards, footer, and their color hierarchy | Assessment | Move the source-comment evidence into rendered assistive text without naming classifications before submission | #110 |
| ReviewPage | Text-only key points grouped by topic | No visual-content item | No visual alternative is needed; general heading, focus, and reflow checks remain in #54 | #107 |

## Palette Builder inventory

| Visual items | Classification | Required equivalent or treatment | Owner |
|---|---|---|---|
| Picker tabs, hue ring, and current picker marker | Informative | Expose selected tab, hue, color name, value, and native control state; announce committed changes | #111 |
| Generated harmony swatches and labels | Informative | Name harmony role, color name, and value; announce additions without reading the full palette | #111 |
| Tonal suggestion swatches | Informative | Name variant type, source color, result name, and value; announce accepted suggestions | #111 |
| Editable palette grid and color controls | Informative | Expose palette position, name, value, edit state, and removal result | #111 |
| Contrast matrix rows and level badges | Informative | Identify foreground and background names and values, ratio, text size, and WCAG level | #111 |
| Accessibility suggestions and affected swatches | Informative | Associate each suggestion with the named palette colors and announce list changes | #111 |
| Light and dark role pickers | Informative | Name the theme, semantic role, assigned color, and value; announce assignments and errors | #111 |
| Light and dark theme previews | Informative | Summarize role assignments, surfaces, text, action, and current contrast state | #111 |
| Duplicate preview chips, picker gradients, ring decoration, and status glyphs | Decorative | Hide the smallest repeated element after its name, value, or status is available in text | #111 |

## Inventory maintenance

`src/accessibility-contract.test.ts` checks that every `INTERACTION_TYPES` and `MILESTONE_CHALLENGE_TYPES` value appears in this inventory with a child issue. Update the inventory and assign an owner whenever either registry gains a value. Component tests cover the discriminated data shape, visually hidden descriptions, decorative treatment, and live-region semantics. Downstream child issues remain responsible for content quality and tool-specific state behavior.
