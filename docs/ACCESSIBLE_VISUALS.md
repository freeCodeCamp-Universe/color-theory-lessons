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
| `before-after` | Purposeful/noisy interface and hierarchy comparison; selectable assessment version; repeated dots, bars, and glyphs | Informative; assessment; decorative | Describe regions, role colors, emphasis, grouping, and current version without identifying the expected selection; hide repeated primitives | #102 |
| `slider-explore` | Target color; current color; hue, saturation, and lightness tracks; slider gradients and target markers | Assessment; informative; decorative | Describe target evidence without exact hidden values; expose current HSL values and match result; hide redundant track art and markers | #102 |
| `contrast-checker` | Foreground/background swatches; ratio and threshold result; preview text; status glyph | Informative; informative; informative; decorative | Associate names, values, ratio, level, and changed result with controls; hide the repeated glyph | #102 |
| `temperature-sorter` | Named color swatches; warm/cool placement and submitted result; drag decoration | Assessment; assessment; decorative | Expose each visible name and value, its selected group, result, retry, and completion without preclassifying it | #102 |
| `color-wheel` | Hue wheel and base marker; relationship markers and connectors; related palette and mockup; rings and ticks | Informative; informative; informative; decorative | Name the base hue, relationship, related hues, values, and palette roles; hide repeated wheel primitives | #102 |
| `additive-sort` | Additive and subtractive mixing diagrams; process labels and combined results; overlapping circles | Informative; assessment; decorative | Describe primaries, process, and visible combined result; announce sorting result and completion; hide circle art after description | #103 |
| `rgb-mixer` | Target swatch; current mixed color; RGB channel controls and values; channel gradients | Assessment; informative; informative; decorative | Describe target appearance without hidden channel answers; expose current values and match state; hide redundant gradients | #103 |
| `logic-fixer` | Screen-versus-print scenarios; process diagrams and color results; selected explanation state; diagram primitives | Assessment; informative; assessment; decorative | Describe visible evidence and changed scenario without naming the correct model; announce result, retry, and completion | #103 |
| `mismatch-explainer` | Pixel/subpixel view; zoomed RGB channels; selected explanation and result; pixel-grid decoration | Informative; informative; assessment; decorative | Describe the normal and zoomed views, expose zoom state, and announce validation without naming the answer early | #103 |
| `background-shift` | Same accent on two backgrounds; background and accent values; explanation choices; repeated swatches | Assessment; informative; assessment; decorative | Describe each comparison without interpreting the cause; expose values and announce submitted result | #103 |
| `format-reveal` | Eight interface regions; selected region; color-format values; decorative region fills | Informative; informative; informative; decorative | Give each region a name, description, and HEX/RGB/HSL values; expose selection; hide fills once described | #106 |
| `hex-rgb-editor` | Target swatch; current swatch; HEX/RGB inputs and values; checker or status glyph | Assessment; informative; informative; decorative | Describe target appearance without exact hidden answer; expose current values, invalid input, match result, and next target | #106 |
| `hsl-playground` | Target and current colors; HSL controls and values; slider gradients and markers | Assessment; informative; informative; decorative | Describe target evidence, expose current HSL state, and announce validation and completion; hide track art | #106 |
| `alpha-layer` | Foreground, background, and blended result; layer stack and scrim preview; checkerboard and layer decoration | Informative; informative; decorative | Name colors, values, alpha, order, and blended result; describe composition changes; hide repeated texture | #106 |
| `theme-sandbox` | Light/dark interface preview; role swatches and values; gradient preview; decorative chips | Informative; informative; informative; decorative | Summarize assigned roles, theme, contrast, and gradient endpoints; announce theme and contrast changes | #106 |
| `token-map` | Source colors; semantic-token mapping; derived interface preview; connector lines and duplicate chips | Assessment; assessment; informative; decorative | Expose source values, selected mappings, derived roles, validation, and completion without preassigning roles | #106 |
| `eye-diagram` | Eye and brain pathway diagram; current pathway stage; arrows, glow, and anatomical decoration | Informative; informative; decorative | Describe the ordered pathway and active stage; announce each revealed stage and completion; hide decorative anatomy | #101 |
| `vision-cards` | Vision-concept illustrations; collapsed/expanded card state; card accent graphics | Informative; informative; decorative | Name and describe each concept and expose expanded state; announce exploration progress and completion | #101 |
| `interface-gallery` | Interface status, chart, and form in each simulation; active simulation; filter decoration | Informative; informative; decorative | Describe distinctions visible in every mode and announce mode changes without claiming a universal lived experience | #101 |
| `color-only-detector` | Color-only and redundant-cue examples; selectable assessment regions; state dots and icons | Assessment; assessment; decorative | Describe observable cues without naming failures; expose control names, selected state, result, progress, and completion | #101 |
| `text-contrast-lab` | Text/background swatches; sample text; ratio, size, and pass state; status glyph | Informative; informative; informative; decorative | Associate role names, values, raw ratio, threshold, and result with inputs; announce changes | #108 |
| `component-checker` | Component previews for border, icon, focus, and status; values and contrast results; repeated glyphs | Informative; informative; decorative | Describe the identifying visual part, adjacent colors, ratio, and result; announce validation | #108 |
| `state-workshop` | Default, selected, error, and success previews; applied cue set; decorative state chips | Assessment; informative; decorative | Describe visible cues without naming the required repair; expose selected cues and announce repaired state | #108 |
| `pattern-repair` | Before/after form, link, alert, and chart examples; repair controls and state; pattern fills and icons | Assessment; assessment; decorative | Describe structure, cue type, and colors without stating the repair; announce checks, retry, and completion | #108 |
| `audit-flow` | Interface audit scenarios; highlighted evidence and current stage; decorative highlights | Assessment; assessment; decorative | Describe observable evidence without preselecting findings; announce selection, stage, validation, and completion | #108 |
| `inclusive-review` | Review scenarios and interface previews; selected evidence and result; decorative chips | Assessment; assessment; decorative | Describe visible evidence without naming the expected answer; announce progress, result, retry, and completion | #108 |
| `system-comparison` | Two system previews and selectable regions; region color values; decorative layout blocks | Assessment; informative; decorative | Give regions control names and values without naming the inconsistency; announce result and completion | #104 |
| `role-builder` | Role swatches and controls; generated interface preview; validation state; repeated chips | Assessment; informative; informative; decorative | Expose role names, current values, preview summary, validation, and completion without assigning answers early | #104 |
| `brand-pressure` | Brand palette and adapted interface; pressure/scenario state; decorative brand shapes | Informative; informative; decorative | Describe brand and functional colors, values, preview changes, validation, and completion | #104 |
| `dark-translator` | Light and dark previews; role values and controls; contrast state; decorative chips | Informative; informative; informative; decorative | Summarize each theme, assigned values, surface hierarchy, and contrast; announce changes and results | #104 |
| `chart-tuner` | Multi-series chart; data points; normal/simulated state; lines, dots, fills, and legend chips | Informative; informative; informative; decorative | Supply series, month, value, and color data; describe active simulation and emphasis; hide chart primitives after the alternative | #104 |
| `color-space-lab` | CSS, SVG, and canvas-style color examples; gamut and simulation states; graph axes and swatches | Informative; informative; decorative | Describe each example, value, gamut result, and simulation change; hide redundant drawing primitives | #104 |
| `system-stress` | System preview across scenarios; finding list and validation state; decorative preview blocks | Assessment; informative; decorative | Describe current scenario and observable preview state without naming findings early; announce findings and completion | #104 |

## Milestone challenge inventory

| Challenge type | Visual items | Classification | Required equivalent or treatment | Owner |
|---|---|---|---|---|
| `read-interface` | InterfaceMockup regions; role-classification controls; color and hierarchy details; repeated layout blocks | Assessment; assessment; informative; decorative | Describe each region's visible color, contrast, and emphasis without naming its role; announce score and completion | #110 |
| `channel-prediction` | RGB target swatches and mixes; channel/mix choices; overlapping channel circles | Assessment; assessment; decorative | Describe target appearance and visible mix evidence without channel answers; announce each stage and result | #110 |
| `theme-from-scratch` | Theme preview; HSL role controls; contrast and surface state; decorative role chips | Assessment; assessment; informative; decorative | Summarize current role values and preview evidence; announce validation, stage, retry, and completion | #110 |
| `simulation-spotter` | Simulated interface states; selectable color-only examples; repair previews; filter decoration | Assessment; assessment; assessment; decorative | Describe observable changes and cues without identifying failures or repairs; announce result and stage | #110 |
| `accessibility-rescue` | Text, form, focus, and icon previews; repair controls; ratios and cue state; repeated status glyphs | Assessment; assessment; informative; decorative | Describe visible evidence without giving repair values; expose current state and announce validation and repair count | #110 |
| `semantic-audit` | Eight palette swatches; semantic-role assignments; conflict preview; decorative chips | Assessment; assessment; assessment; decorative | Expose swatch names and values, current assignments, and preview evidence without naming expected roles or conflict | #110 |
| `dark-mode-stress` | Dark theme preview; text, surface, and action controls; contrast and hierarchy state; decorative chips | Assessment; assessment; informative; decorative | Summarize current colors and preview evidence without target answers; announce validation, stages, retry, and completion | #110 |

## Shared shell inventory

| Surface | Visual items | Classification | Required equivalent or treatment | Owner |
|---|---|---|---|---|
| LessonPlayer | Progress dots and current phase | Informative; decorative | Expose phase and position through one progress value; hide individual dots; announce phase and completion changes | #105 |
| StepPanelRenderer | Seven authored lesson previews | Informative or assessment | Render `panel.accessibility`; keep preview-specific remediation with the owning unit issue | #105 |
| ToolRenderer | Loading state and the active tool | Informative | Keep the loading message named; pass stage and completion state to the lesson shell without duplicate announcements | #105 |
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
