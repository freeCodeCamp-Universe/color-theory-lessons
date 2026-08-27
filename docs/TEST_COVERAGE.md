# Main learner behavior test coverage

This inventory maps the application's main learner behaviors to the tests or open issues that own them. Update it whenever a route, lesson interaction type, milestone challenge type, persistence rule, or standalone learner flow changes.

## Status definitions

- **Full:** Automated tests verify the user-visible result.
- **Partial:** Automated tests verify part of the behavior. The row names the result that remains unverified and links its owner when one exists.
- **Missing:** No current automated test verifies the behavior. The row links the issue responsible for adding coverage.
- **Manual:** Automation is unsuitable for the behavior. A manual row must state the observable result, reason, procedure, and relevant environments or viewports.

There are no accepted manual-only exceptions in the current inventory. Open accessibility work that requires manual assistive-technology results remains **Missing** and is accountable to [#107](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/107), rather than being treated as completed manual coverage.

Paths in the evidence column are relative to the repository root. `npm test` runs the Vitest files, and `npm run test:e2e` runs the Playwright file against the production build.

## App entry, routes, and navigation

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Enter the app at `/` and see the course dashboard inside the app shell. | Full | `src/App.test.tsx` |
| Open a registered lesson URL and see its loading state followed by the lesson player. | Full | `src/App.test.tsx`, `src/pages/LessonPage.test.tsx` |
| Open an unknown lesson ID and see a lesson-not-found result. | Full | `src/pages/LessonPage.test.tsx` |
| Open a registered milestone URL and see the milestone player. | Full | `src/App.test.tsx`, `src/pages/MilestonePage.test.tsx` |
| Open an unknown milestone ID and see a milestone-not-found result. | Full | `src/pages/MilestonePage.test.tsx` |
| Open Palette Builder, Glossary, or Review through its public route. | Full | `src/App.test.tsx` |
| Follow `/capstone` to Milestone 6 and `/settings` back to the dashboard. | Full | `src/App.test.tsx` |
| Open an unknown app route and see the 404 page with a link back to the course. | Full | `src/App.test.tsx` |
| Recover from a render error by using the application error fallback's retry action. | Full | `src/components/ErrorBoundary.test.tsx` |
| Use desktop navigation links and identify the current page. | Full | `src/components/nav/TopNav.test.tsx` |
| Open the mobile menu, navigate from it, and have it close after navigation. | Full | `src/components/nav/TopNav.test.tsx` |
| Return home from an open mobile menu by using the course logo. | Full | `src/components/nav/TopNav.test.tsx` |
| Prevent desktop navigation from clipping by switching to the mobile control at the responsive breakpoint. | Full | `src/components/nav/TopNavStyles.test.ts`, `e2e/critical-learner-journeys.spec.ts` |
| Allow direct lesson access in development while preventing out-of-order lesson access and completion in production. | Missing | [#118](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/118) owns the environment-specific route rule and its coverage. |
| Allow direct milestone access in development while preventing out-of-order milestone access and completion in production. | Missing | [#118](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/118) owns the environment-specific route rule and its coverage. |

## Dashboard progression and reset

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Start with Unit 1 expanded while later units and lessons are visibly locked. | Full | `src/pages/HomePage.test.tsx` |
| Expand or collapse an unlocked unit from its dashboard card. | Full | `src/pages/HomePage.test.tsx` |
| Point the hero continue action to the next progression-eligible lesson. | Partial | `src/pages/HomePage.test.tsx` verifies the first lesson and an in-progress unit; after Unit 1 lessons are complete but its milestone is not, the action points to locked Unit 2. [#118](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/118) owns production progression enforcement and its coverage. |
| Show start, continue, redo, and locked lesson actions from current progress. | Full | `src/pages/HomePage.test.tsx` |
| Unlock a unit milestone after every lesson in that unit is complete. | Full | `src/pages/HomePage.test.tsx` |
| Mark a passed unit complete, expand the next unit, and expose its first lesson. | Full | `src/pages/HomePage.test.tsx`, `e2e/critical-learner-journeys.spec.ts` |
| Cancel a progress reset without changing completed work. | Full | `src/pages/HomePage.test.tsx` |
| Confirm a progress reset and return the dashboard to its initial progression state. | Full | `src/pages/HomePage.test.tsx`, `src/state/app-context.test.ts`, `src/state/app-provider.test.tsx` |
| Clear saved milestone attempts when progress is reset. | Full | `src/state/app-provider.test.tsx`, `src/state/persistence.test.ts` |
| Retain an unfinished lesson session when dashboard progress is reset. | Full | `src/state/app-provider.test.tsx` |

## Shared lesson flow

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Move forward and backward through instructional steps before entering the challenge. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| Keep quiz and completion actions unavailable until the interactive challenge reports success. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| Show the challenge prompt with hints closed initially. | Full | `src/components/lesson/LessonPlayer.test.tsx`, `src/components/lesson/ChallengeHints.test.tsx` |
| Show only hints assigned to the active exercise stage and reset hint state after a stage change. | Full | `src/components/lesson/LessonPlayer.test.tsx`, `src/components/lesson/ChallengeHints.test.tsx` |
| Select a quiz choice, submit it explicitly, see its feedback, and advance through the quiz. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| Calculate and save a quiz score from the submitted answers. | Full | `src/components/lesson/LessonPlayer.test.tsx`, `src/hooks/useLessonCompletion.test.tsx` |
| Complete a lesson without a quiz only after its tool reports success. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| See lesson completion, return to the dashboard, and redo the lesson without losing recorded completion. | Full | `src/components/lesson/LessonPlayer.test.tsx`, `e2e/critical-learner-journeys.spec.ts` |
| Continue from a completed lesson to the next lesson or, after a unit's final lesson, to its milestone. | Partial | `src/components/lesson/LessonPlayer.test.tsx` verifies the within-unit next-lesson link; the final-lesson milestone link remains unverified. |
| Resume the current instructional step after a component remount. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| Resume quiz position, earlier answers, submitted feedback, and the final score after a component remount. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| Keep saved answers attached to stable choices after choices are reordered. | Full | `src/components/lesson/LessonPlayer.test.tsx` |
| Restart only stale quiz state when quiz content changes, while preserving challenge completion. | Full | `src/components/lesson/LessonPlayer.test.tsx`, `src/lessons/quiz-utils.test.ts` |
| Complete a lesson in a browser, reload, and retain its lesson, quiz, score, and dashboard progress. | Full | `e2e/critical-learner-journeys.spec.ts` |

## Registered lesson interaction types

`src/components/tools/interaction-type-coverage.test.ts` fails if a declared interaction type has no registered lesson. `src/components/tools/tools.smoke.test.tsx` checks that every tool renders in instructional mode, and `src/components/tools/ToolRenderer.test.tsx` covers the shared stage-reporting bridge. The rows below name the tests for each tool's learner-visible exercise or completion result.

| Interaction type and learner behavior | Status | Automated test or accountable issue |
|---|---|---|
| `color-wheel`: choose a relationship, build its palette, answer the reflection, retry errors, and complete both stages. | Full | `src/components/tools/ColorWheelTool.test.tsx` |
| `rgb-mixer`: predict each target before matching it, use stage-specific hints, and advance only after checking. | Full | `src/components/tools/Unit2ExerciseStages.test.tsx` |
| `temperature-sorter`: complete the sorting and interface-goal stages in order. | Full | `src/components/tools/TemperatureSorterTool.test.tsx` |
| `contrast-checker`: repair all three pairs to their WCAG thresholds and see which pairs still fail. | Full | `src/components/tools/ContrastTool.test.tsx` |
| `before-after`: assign every interface color role, receive feedback only after checking, retry, and complete. | Full | `src/components/tools/BeforeAfterTool.test.tsx` |
| `slider-explore`: match each HSL target in order, keep wheel and slider values synchronized, and retry a failed match. | Full | `src/components/tools/HSLSliderTool.test.tsx` |
| `additive-sort`: sort additive and subtractive examples in one retryable stage. | Full | `src/components/tools/Unit2ExerciseStages.test.tsx` |
| `logic-fixer`: keep each logic scenario active after a failed check and advance after a correct retry. | Full | `src/components/tools/Unit2ExerciseStages.test.tsx` |
| `mismatch-explainer`: identify every mismatch factor before advancing. | Full | `src/components/tools/Unit2ExerciseStages.test.tsx` |
| `background-shift`: compare each background effect and advance only after a passing check. | Full | `src/components/tools/Unit2ExerciseStages.test.tsx` |
| `format-reveal`: inspect every interface element, see equivalent color formats, and complete the stage. | Full | `src/components/tools/FormatRevealTool.test.tsx` |
| `hex-rgb-editor`: match each HEX target, see the RGB readout, and complete after all three stages. | Partial | `src/components/tools/HexRgbEditorTool.test.tsx` covers the initial RGB readout and HEX-driven completion, but does not assert that the RGB readout changes after a HEX edit. |
| `hsl-playground`: use synchronized hue controls, pass one target at a time, and complete after the final target. | Full | `src/components/tools/HslPlaygroundTool.test.tsx` |
| `alpha-layer`: pass all four overlay contexts and reject a contrast result that only appears to pass after rounding. | Full | `src/components/tools/AlphaLayerTool.test.tsx` |
| `theme-sandbox`: repair all five text pairs, see their ratios and targets, and retry a failed theme. | Full | `src/components/tools/ThemeSandboxTool.test.tsx` |
| `token-map`: set a valid base, distinguish raw values from palette and role tokens, and classify every item. | Full | `src/components/tools/TokenMapTool.test.tsx`, `src/components/lesson/TokenMapLessonFlow.test.tsx` |
| `color-space-lab`: compare P3 with its sRGB fallback, classify gamut samples, and pass both stages. | Partial | `src/components/tools/ColorSpaceLabTool.test.tsx` covers a failed submission and the passing path, but does not use the retry action after failure. |
| `eye-diagram`: reveal the visual pathway in order and complete after its final stage. | Full | `src/components/tools/EyeDiagramTool.test.tsx` |
| `vision-cards`: open all six cards while keeping visible progress, then complete. | Full | `src/components/tools/Unit4ExerciseStages.test.tsx`, `src/components/tools/VisionCardsTool.test.tsx` |
| `interface-gallery`: review every required simulation mode and complete the review stage. | Full | `src/components/tools/Unit4ExerciseStages.test.tsx`, `src/components/tools/InterfaceGalleryTool.test.tsx` |
| `color-only-detector`: assess all six examples, retry an incorrect submission, and complete after correction. | Full | `src/components/tools/ColorOnlyDetectorTool.test.tsx` |
| `state-workshop`: give interface states distinct non-color cues before completion. | Full | `src/components/tools/StateWorkshopTool.test.tsx` |
| `inclusive-review`: revise every incorrect assessment using evidence visible in the interface. | Full | `src/components/tools/InclusiveReviewTool.test.tsx` |
| `text-contrast-lab`: repair all current text pairs, retry without live grading, and complete only while all pass. | Full | `src/components/tools/TextContrastLabTool.test.tsx` |
| `component-checker`: check all component repairs together and preserve edits after a failed attempt. | Full | `src/components/tools/ComponentCheckerTool.test.tsx` |
| `audit-flow`: pass four audit stages in order, retry the active stage, and complete once. | Full | `src/components/tools/AuditFlowTool.test.tsx` |
| `pattern-repair`: select and check valid non-color repairs for all four examples, with selections preserved on retry. | Full | `src/components/tools/PatternRepairTool.test.tsx` |
| `system-comparison`: identify inconsistencies, check the result, and preserve selections for retry. | Full | `src/components/tools/SystemComparisonTool.test.tsx` |
| `role-builder`: supply valid, readable, distinct semantic colors, retry failures, and complete once. | Full | `src/components/tools/RoleBuilderTool.test.tsx` |
| `brand-pressure`: satisfy editable role and fixed action-label contrast requirements before completion. | Full | `src/components/tools/BrandPressureTool.test.tsx` |
| `dark-translator`: create readable, distinct dark-theme roles and keep a completed stage locked. | Full | `src/components/tools/DarkTranslatorTool.test.tsx` |
| `chart-tuner`: finish each chart task in order, apply patterns in both views, and complete after the data table. | Full | `src/components/tools/ChartTunerTool.test.tsx` |
| `system-stress`: inspect five contexts, pass the findings and classification stages, retry, and complete once. | Full | `src/components/tools/SystemStressTestTool.test.tsx` |

## Milestones and challenge types

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Move through challenge and quiz parts, see part progress and points, and complete only after the final part. | Full | `src/components/milestone/MilestonePlayer.test.tsx` |
| Submit milestone quiz choices with native radio selection and keyboard behavior. | Full | `src/components/milestone/MilestonePlayer.test.tsx` |
| Apply each milestone's configured point values and pass threshold at the boundary. | Full | `src/components/milestone/MilestonePlayer.test.tsx`, `src/components/milestone/Milestone5Flow.test.tsx`, `src/components/milestone/Milestone6Flow.test.tsx`, `src/data/milestones.test.ts` |
| Move focus after advancing to a new milestone part, question, or final result. | Partial | `src/components/milestone/MilestonePlayer.test.tsx` verifies focus on the part summary and each new question, but does not assert focus on the final result. |
| Retry a failed milestone from a clean first part without unlocking the next unit. | Full | `src/components/milestone/MilestonePlayer.test.tsx`, `e2e/critical-learner-journeys.spec.ts` |
| Resume an unfinished milestone attempt and restore selected answers after remount or reload. | Full | `src/components/milestone/MilestonePlayer.test.tsx` and each challenge test listed below |
| Restore failed and passed milestone results while preserving the correct progression state. | Full | `src/components/milestone/MilestonePlayer.test.tsx`, `e2e/critical-learner-journeys.spec.ts` |
| Pass a milestone in the browser, reload, and retain the unlocked next unit. | Full | `e2e/critical-learner-journeys.spec.ts` |
| `read-interface`: classify five interface regions, preserve classifications on retry, restore a session, and complete on a pass. | Full | `src/components/milestone/challenges/ReadInterfaceChallenge.test.tsx` |
| `channel-prediction`: pass both RGB prediction stages, retry, and restore a session. | Full | `src/components/milestone/challenges/ChannelPredictionChallenge.test.tsx` |
| `theme-from-scratch`: pass text, surface, and accent stages, retry, and restore a session. | Full | `src/components/milestone/challenges/ThemeFromScratchChallenge.test.tsx` |
| `simulation-spotter`: identify color-only failures and repairs, retry, and restore a session. | Full | `src/components/milestone/challenges/SimulationSpotterChallenge.test.tsx` |
| `accessibility-rescue`: repair all required accessibility states, retry, and restore a session. | Full | `src/components/milestone/challenges/AccessibilityRescueChallenge.test.tsx`, `src/components/milestone/Milestone5Flow.test.tsx` |
| `semantic-audit`: assign roles, identify the conflict, retry, and restore a session. | Partial | `src/components/milestone/challenges/SemanticAuditChallenge.test.tsx` verifies role-stage retry and session restoration, while `src/components/milestone/Milestone6Flow.test.tsx` verifies whole-milestone retry; conflict-stage retry remains unverified. |
| `dark-mode-stress`: pass all three contrast stages using raw thresholds, retry, and restore a session. | Full | `src/components/milestone/challenges/DarkModeStressChallenge.test.tsx`, `src/components/milestone/Milestone6Flow.test.tsx` |

## Persistence, preferences, glossary, and Review

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Load default state when storage is empty, contains invalid JSON or a non-object value, or uses an unsupported version. | Full | `src/state/persistence.test.ts` |
| Load a structurally malformed current-version saved state without crashing the app. | Missing | [#260](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/260) owns saved-state shape validation and its regression tests. |
| Save and reload lesson, quiz, score, milestone, and preference state. | Full | `src/state/persistence.test.ts`, `src/state/app-context.test.ts`, `e2e/critical-learner-journeys.spec.ts` |
| Keep the best quiz score and avoid duplicate completion records. | Full | `src/state/app-context.test.ts`, `src/hooks/useLessonCompletion.test.tsx`, `src/hooks/useMilestoneCompletion.test.tsx` |
| Continue without crashing when saving main state fails because local storage is full or unavailable. | Full | `src/state/persistence.test.ts` |
| Continue resetting progress when milestone-session key enumeration is unavailable. | Full | `src/state/persistence.test.ts`, `src/state/app-provider.test.tsx` |
| Recover from a corrupt or unavailable lesson session and continue when lesson-session writes fail. | Missing | [#261](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/261) owns lesson player session-storage failure coverage. |
| Recover from a corrupt or unavailable milestone session and continue when milestone-session writes fail. | Missing | [#261](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/261) owns milestone player session-storage failure coverage. |
| Select light, dark, or system through the theme control and persist the preference. | Full | `src/components/nav/ThemeControl.test.tsx` |
| Follow operating-system theme changes while the preference is `system`. | Full | `src/components/nav/ThemeControl.test.tsx` |
| Apply the saved theme before React renders, then keep it through navigation and reload. | Full | `src/theme-prepaint.test.ts`, `e2e/critical-learner-journeys.spec.ts` |
| Keep application theme tokens at their required contrast in light and dark themes. | Full | `src/theme-contrast.test.ts`, `src/badge-contrast.test.ts`, `src/cta-usage.test.ts` |
| Show the Glossary empty state before any lesson is complete. | Full | `src/pages/GlossaryPage.test.tsx` |
| Unlock exactly the glossary terms related to completed lessons. | Full | `src/pages/GlossaryPage.test.tsx`, `src/data/glossary.test.ts` |
| Show Review's empty state before any lesson is complete. | Full | `src/pages/ReviewPage.test.tsx` |
| Group completed lessons under normalized, learner-facing Review topics. | Full | `src/pages/ReviewPage.test.tsx`, `src/data/reviewTags.test.ts` |

## Palette Builder

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Reject an invalid primary color and accept valid HEX, RGB, HSL, and named-swatch input with synchronized values. | Full | `src/pages/PaletteBuilderPage.test.tsx` |
| Generate analogous, complementary, and triadic suggestions with lighter, darker, and muted variants. | Full | `src/pages/PaletteBuilderPage.test.tsx`, `src/utils/color.test.ts` |
| Add a suggested color without offering that suggestion again. | Full | `src/pages/PaletteBuilderPage.test.tsx` |
| Add or edit a custom color without duplicating a color already in the palette. | Missing | [#262](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/262) owns duplicate prevention and user-visible regression tests for custom colors. |
| Edit or remove palette colors and update every dependent display. | Full | `src/pages/PaletteBuilderPage.test.tsx` |
| Reset a customized palette to its primary color. | Full | `src/pages/PaletteBuilderPage.test.tsx` |
| Classify displayed contrast pairings as fail, AA, or AAA from their WCAG ratio and update the matrix after palette changes. | Partial | `src/pages/PaletteBuilderPage.test.tsx` verifies two-color boundaries and updates; filtering pairs below 30 lightness points and limiting the display to 20 pairs remain unverified. |
| Assign automatic light and dark theme roles, change every role, and update previews and contrast checks. | Full | `src/pages/PaletteBuilderPage.test.tsx` |
| Apply an accessibility suggestion to its named role, remap edited shared colors, and remove the arranger when fewer than two colors remain. | Full | `src/pages/PaletteBuilderPage.test.tsx` |
| Expose picker state, generated colors, contrast rows, role controls, previews, and mutation announcements to screen-reader users. | Partial | Current component tests cover picker input, palette mutations, contrast rows, and role assignment, but do not verify every accessible description and live announcement. [#111](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/111) owns the unverified results. |

## Accessibility verification still owned by open issues

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Complete Format Reveal, Color-only Detector, and System Comparison with keyboard-only controls. | Missing | [#54](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/54) records the known click-only or independently unreachable controls and owns keyboard testing of every main learner flow. |
| Hear equivalent descriptions for informative visuals, quiz swatches, live tool results, stage transitions, milestone previews, chart alternatives, and Palette Builder contrast rows. | Partial | `src/components/lesson/ChallengeHints.test.tsx`, `src/components/tools/ExerciseStage.test.tsx`, and `src/components/tools/ChartTunerTool.test.tsx` verify selected status, focus, and chart-table results. [#107](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/107) owns the remaining automated assertions and screen-reader, browser, and operating-system results; Palette Builder work remains in [#111](https://github.com/freeCodeCamp-Universe/color-theory-lessons/issues/111). |

## Course completion

| Main behavior | Status | Automated test or accountable issue |
|---|---|---|
| Complete the two final milestone challenges and quiz, pass Milestone 6, and record completion once. | Full | `src/components/milestone/Milestone6Flow.test.tsx`, `e2e/critical-learner-journeys.spec.ts` |
| Reload a completed course, retain all six milestones, return to the dashboard, and see all six units marked done. | Full | `e2e/critical-learner-journeys.spec.ts` |

## Maintenance checklist

When a behavior changes:

1. Update its row and evidence in this file in the same pull request.
2. Add a row for every new public route, dashboard action, lesson phase, interaction type, milestone challenge type, persistence rule, or standalone learner flow.
3. Replace a linked open issue with its test file when the issue lands. Do not mark a row **Full** until the named test verifies the user-visible result.
4. For a **Partial** row, name the exact result that remains unverified.
5. For a **Missing** row, link the issue responsible for coverage.
6. Use **Manual** only when automation cannot verify the result. Include the observable result, why automation is unsuitable, the procedure, and the browser, operating system, assistive technology, or viewport needed to repeat it.
