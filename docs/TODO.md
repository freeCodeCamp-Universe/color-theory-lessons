# Repository TODOs

> **Tracking reminder:** Before resuming work from this file, convert every remaining TODO into a GitHub issue, then remove this file. Track future work in GitHub Issues instead.

## Audit learner-facing lesson language

- **Status:** In progress
- **Lesson progress:** 5 of 34 lessons complete
- **Key-point progress:** 0 of 34 lessons complete
- **Area:** Lesson content and Review-page summaries
- **References:** `docs/LESSON_CONTENT_FLAGS.md`, lesson definitions, and lesson-specific tool components

### Scope

- Review lessons in curriculum order.
- Review step text, challenge prompts, hints, quiz questions, answer explanations, and learner-facing tool instructions and status messages.
- Apply the `no-ai-slop` rules and check factual accuracy.
- Keep functional or interface work in separate TODO entries rather than expanding a prose edit into an implementation change.
- Review Review-page `keyPoints` as the second phase, after all lesson language is complete.

### Phase 1: Lesson language progress

#### Unit 1: Seeing and Describing Color

- [x] 1.1 What Color Does in Interface Design
- [x] 1.2 Hue, Saturation, and Lightness
- [x] 1.3 Contrast and Readability
- [x] 1.4 Warm and Cool Colors in Practice
- [x] 1.5 Visual Hierarchy Through Color
- [ ] 1.6 Basic Color Relationships and Harmony

#### Unit 2: How Screens Make Color

- [ ] 2.1 Two Ways Color Mixes
- [ ] 2.2 How RGB Light Works
- [ ] 2.3 Why Paint Logic Fails on Screens
- [ ] 2.4 Subtractive Color for Digital Designers
- [ ] 2.5 Seeing Pixels as Light, Not Paint

#### Unit 3: Digital Color in Code

- [ ] 3.1 Why Digital Design Needs Color Formats
- [ ] 3.2 HEX and RGB
- [ ] 3.3 HSL and HSLA
- [ ] 3.4 Alpha, Transparency, and Layered Color
- [ ] 3.5 Gradients, CSS Color Usage, and Theme Building
- [ ] 3.6 Design Tokens and Role-Based Color Systems

#### Unit 4: Human Vision and Color Perception

- [ ] 4.1 How Humans Perceive Color
- [ ] 4.2 Types of Color Vision Deficiency
- [ ] 4.3 Seeing Through Simulated Eyes
- [ ] 4.4 What Color Perception Means for Design

#### Unit 5: Accessible Color in Practice

- [ ] 5.1 Text Contrast in Practice
- [ ] 5.2 Non-Text Contrast for Controls and Graphics
- [ ] 5.3 Color-Only Problems and Redundant Cues
- [ ] 5.4 Accessible Patterns for Real Interfaces
- [ ] 5.5 Accessibility Audit Workflow
- [ ] 5.6 Inclusive Testing and Review

#### Unit 6: Color Systems and Advanced Topics

- [ ] 6.1 From Individual Colors to Color Systems
- [ ] 6.2 Building Semantic Color Roles for UI
- [ ] 6.3 Brand Constraints and Hierarchy
- [ ] 6.4 Dark Mode and Theme Pairing
- [ ] 6.5 Color for Charts and Data Visualization
- [ ] 6.6 Color Spaces and Modern Screens
- [ ] 6.7 Final System Review and Stress Test

### Phase 2: Review-page key points

- **Status:** Not started
- **Progress:** 0 of 34 lessons complete
- **Starts after:** All 34 lesson-language reviews are complete.

- Review each lesson's `keyPoints` in curriculum order after all 34 lessons are complete.
- Check each summary against the final approved lesson content.
- Correct outdated terminology, factual conflicts, em dashes, vague claims, and unsupported wording.
- Keep the summaries useful as review material rather than copying lesson steps verbatim.
- Do not interrupt the lesson-language audit to update key points early.

### Completion criteria

- All 34 lessons have been reviewed in order.
- Approved changes are present in the lesson definitions and lesson-specific tool copy.
- Functional findings discovered during the audit have their own scoped TODO entries.
- Every lesson with `keyPoints` has been reviewed against its final lesson content.
- Review-page summaries do not contradict the corresponding lessons.
- The audit preserves intentional separation between lesson prose and post-completion review material.
- Both progress counts agree with their completed work.

## Make hints user-invoked across all lessons

- **Status:** Open
- **Area:** All lesson challenges
- **Sources:** `src/components/lesson/LessonPlayer.tsx`, `Challenge.hints` in all 34 lesson definitions

### Problem

Every lesson defines challenge hints, and `LessonPlayer` renders the full hint list directly below each challenge prompt. Learners see the answers and guidance before deciding whether they need help. The same behavior appears in both places where `LessonPlayer` renders a challenge.

### Expected behavior

- Use one hint interaction for every lesson challenge.
- Hide the complete hint list when a challenge first appears.
- Provide a learner-invoked control that reveals the next hint.
- Reveal hints one at a time and keep earlier hints for the current stage visible.
- Remove or disable the control after the final hint appears.
- Support challenges with no hints.
- Allow each hint to be mapped to a stage in a multi-stage exercise.
- Expose the active exercise stage to the shared hint interaction.
- Offer only hints mapped to the active stage, plus any challenge-wide hints with no stage mapping.
- Hide hints from completed stages and do not expose hints for later stages.
- Reset revealed hints when the exercise advances to a new stage.
- Reset revealed hints when the learner opens a different lesson or restarts the current lesson.
- Make the control keyboard accessible and announce newly revealed hints to screen readers.

### Acceptance criteria

- None of the 34 lessons displays a hint when its challenge prompt first renders.
- Each learner request reveals one additional hint in source order.
- The hue, saturation, and lightness targets in Unit 1, Lesson 2 each expose only their mapped hint.
- Advancing a multi-stage exercise resets the hint interaction for the new stage.
- Both challenge render paths in `LessonPlayer` use the same hint interaction.
- Tests cover challenges with zero, one, and multiple hints, including stage transitions.
- Existing challenge completion and quiz progression continue to work.

## Standardize stage structure across exercise tools

- **Status:** Open
- **Area:** All interactive lesson and milestone exercise tools
- **Sources:** `src/components/tools/`, `src/components/tools/ToolRenderer.tsx`, challenge prompts, and milestone challenge renderers
- **Related issue:** Coordinate stage changes with the user-invoked hints TODO so hints follow the active stage.

### Problem

Exercise tools do not use one shared structure or vocabulary for their tasks. Some multi-part exercises show every task at once, and aggregate scoring can let a learner pass without completing one of the skills the exercise is meant to assess. Learners should see where they are in an exercise and work through one defined stage at a time.

### Expected behavior

- Treat every exercise as one or more named stages.
- Use the wording `Stage X of Y` consistently across exercise tools.
- Show one current stage at a time when an exercise contains multiple distinct tasks.
- Give each stage its own instruction, inputs, check action, result, and retry behavior.
- Require every stage to pass instead of combining unrelated tasks into one aggregate score.
- Provide a clear action for moving to the next stage after the current stage passes.
- Call the exercise completion callback only after the final stage passes.
- Keep completed-stage progress visible without exposing answers from later stages.
- Make challenge prompts state the number and sequence of stages without repeating the detailed tool instructions.
- Expose the active stage to the shared hint interaction so only relevant hints are available.
- Announce stage changes, results, and completion to screen readers.
- Preserve keyboard focus in a predictable location when the exercise advances.

### Acceptance criteria

- Every interactive exercise tool uses the shared stage wording and progress pattern.
- Single-task exercises identify themselves as `Stage 1 of 1`.
- Multi-stage exercises render only the active stage and require each stage to pass.
- A successful stage cannot compensate for a failed or unanswered stage.
- Stage-specific hints reset and update when the active stage changes.
- Keyboard and screen-reader users receive the stage title, position, result, and next action.
- Tests cover a single-stage exercise, a multi-stage exercise, failure and retry within one stage, stage advancement, and final completion.

## Audit test coverage for main application behaviours

- **Status:** Open
- **Area:** Automated test suite

### Problem

The test suite has not been audited against an inventory of the application's main behaviours. Test counts and line coverage cannot show whether the primary learner flows are protected from regressions.

### Work

- List the main behaviours a learner can perform from entering the app through completing the course.
- Map each behaviour to its existing unit, component, integration, or end-to-end tests.
- Record each behaviour that has no test or only partial coverage.
- Add tests for every uncovered main behaviour at the narrowest level that verifies the result.
- Reserve end-to-end tests for flows that cross routing, interaction, persistence, and completion boundaries.
- Document any behaviour intentionally left to manual testing and explain why automation is unsuitable.

### Acceptance criteria

- Every main application behaviour appears in the coverage inventory.
- Each inventoried behaviour has an automated test or a documented manual-testing exception.
- New tests verify user-visible outcomes instead of implementation details.
- The complete test suite passes after the identified gaps are addressed.

## Make HSL examples interactive and add a hue wheel

- **Status:** Open
- **Area:** HSL lesson examples and interactive tools

### Problem

The hue, saturation, and lightness examples do not let learners change the selected value and observe the resulting color. The lesson also describes hue as an angle around a color wheel, but the HSL examples and tools do not show that circular relationship. A linear hue slider displays the numeric range without showing why the range wraps from its final degree back to its starting color.

### Expected behavior

- Show an actual hue wheel when an HSL example or tool introduces hue.
- Mark the selected hue angle on the wheel.
- Keep the wheel, numeric hue value, slider, and color swatch synchronized.
- Let learners change hue from either the wheel or the existing controls.
- Let learners change the selected value in each hue, saturation, and lightness example.
- Keep the other two HSL values fixed and visible while the selected value changes.
- Update the color swatch as soon as the learner changes a value.
- Provide keyboard controls and a text value for the selected angle.
- Reuse the same wheel behavior across HSL examples and tools.

### Acceptance criteria

- The hue example in Unit 1, Lesson 2 includes a color wheel.
- Each hue, saturation, and lightness example provides an interactive control for its selected value.
- Every example shows the current HSL values and the resulting color.
- Moving any hue control updates every other hue representation.
- Crossing the end of the angle range returns to the starting hue without a visual break.
- The wheel remains usable with a keyboard and exposes its current value to assistive technology.

## Audit the interface against Command-line Chic and add light mode

- **Status:** Open
- **Area:** Entire application interface
- **Reference:** Read the `command-line-chic` skill before starting this work.

### Problem

The interface needs a documented audit against the Command-line Chic design system. The application also needs a light color mode that preserves the same semantic roles, interaction states, and visual hierarchy as the dark mode.

A contrast inconsistency is already visible in the contrast repair lab: the exercise rejects a color pair with the same foreground and background contrast used by labels within the lab. The audit must evaluate the application's own text and controls against the requirements taught by the course.

### Work

- Read the `command-line-chic` skill and turn its rules into an audit checklist.
- Audit shared layout, typography, spacing, color tokens, controls, focus states, and interactive tools across every route.
- Inventory foreground and background pairs across navigation, lesson panels, examples, exercises, quizzes, milestones, and review pages.
- Include muted text, metadata, tool labels, instructions, placeholders, disabled controls, validation messages, and status text in the contrast inventory.
- Calculate contrast from the rendered foreground and background colors in every interaction state, rather than assuming a semantic token passes in every context.
- Record and correct cases where the interface uses a contrast pair that the course exercises would reject.
- Record each mismatch and the component or token responsible for it.
- Define light-mode values for the existing semantic color tokens.
- Replace theme-blocking color values with semantic tokens where the audit finds them.
- Add an accessible theme control for dark, light, and system preferences.
- Persist the learner's explicit preference and use the system preference when no choice has been saved.
- Apply the selected theme before the interface renders to prevent a color-mode flash.
- Check default, hover, focus, selected, disabled, success, warning, and error states in both modes.

### Acceptance criteria

- The audit maps every applicable Command-line Chic rule to a verified interface or a recorded follow-up task.
- Every route, lesson example, challenge tool, quiz, milestone, and review screen works in dark and light modes.
- The theme control is keyboard accessible, has an accessible name, and shows the active preference.
- A saved preference survives a page reload, and the system setting is used when no preference is saved.
- Text, controls, focus indicators, and status colors remain distinguishable in both modes.
- All non-exempt text meets the target WCAG contrast requirement against its rendered background in both modes.
- Labels and instructions inside the contrast repair lab meet the same requirements that the exercise teaches.
- Automated tests cover theme selection, persistence, and system-preference fallback.

## Improve screen-reader descriptions for visual lesson content

- **Status:** Open
- **Area:** Lessons, quizzes, milestones, and interactive tools

### Problem

Learners encounter color swatches, diagrams, simulated interfaces, and changing visual states throughout the course. These visuals need text alternatives that communicate the same lesson information to screen-reader users. CSS backgrounds, inline SVG, and interactive components require accessible descriptions even when no `<img>` element is present.

### Work

- Inventory every informative image, color swatch, diagram, chart, simulated interface, and visual tool state.
- Identify the lesson information a sighted learner receives from each visual.
- Provide an accessible name or description that conveys the same information without revealing quiz or challenge answers early.
- Include relevant color names and values when those details are available to sighted learners.
- Mark decorative visuals as hidden from assistive technology.
- Announce meaningful changes in interactive tools, including selected values, validation results, stage changes, and completion states.
- Keep visible labels and screen-reader descriptions consistent.
- Test the lesson, challenge, quiz, milestone, and review flows with a screen reader.

### Acceptance criteria

- Every informative visual has an equivalent text description.
- Decorative visuals do not add noise to the accessibility tree.
- Quiz swatches expose the information available visually without disclosing the correct answer.
- Dynamic tools announce state changes at the point where they occur.
- A screen-reader user can understand and complete each main learner flow without relying on color or position alone.
- Automated accessibility tests cover representative static and dynamic visual components.

## Audit general application accessibility

- **Status:** Open
- **Area:** Entire application
- **Related issue:** Keep descriptions for visual lesson content in the separate screen-reader descriptions TODO.

### Problem

The application needs a documented accessibility audit across its routes and main learner flows. Visual descriptions require their own review because the course teaches through color, diagrams, and interactive visual comparisons; this issue covers the remaining application behavior and structure.

### Work

- Define the target accessibility standard and conformance level before starting the audit.
- Test every route and main learner flow with keyboard-only navigation.
- Check focus order, visible focus, skip navigation, landmarks, headings, accessible names, roles, and states.
- Check forms, buttons, links, sliders, dialogs, validation feedback, status messages, and completion announcements.
- Test zoom, text spacing, reflow, reduced motion, and system accessibility preferences.
- Check that instructions and outcomes do not rely on color, shape, position, sound, or pointer input alone.
- Run automated accessibility checks and record where manual testing is still required.
- Test representative flows with screen readers on the supported browser and operating-system combinations.
- Record each finding with its route, component, reproduction steps, learner impact, and recommended correction.

### Acceptance criteria

- Every route and main learner flow appears in the audit record.
- All interactive controls are operable with a keyboard and expose their name, role, value, and state when applicable.
- Focus remains visible and moves in a predictable order through navigation, lessons, tools, quizzes, and milestones.
- Status changes and validation results are announced without moving focus unexpectedly.
- Pages remain usable at the audited zoom, text-spacing, and viewport settings.
- Automated checks and manual assistive-technology results are recorded separately.
- Visual-description findings remain tracked in the dedicated visual-content issue.
- Each unresolved accessibility finding has a follow-up task with a defined scope.

## Calculate WCAG ratios in the contrast repair lab

- **Status:** Open
- **Area:** Unit 1, Lesson 3 contrast exercise
- **Source:** `src/components/tools/ContrastTool.tsx`

### Problem

The contrast repair lab marks each color pair as readable by comparing its HSL lightness value with a fixed boundary. It does not calculate the WCAG contrast ratio introduced in the lesson. The three boundaries are 75% for the section label, 65% for the helper text, and 35% for the button background. The sliders also run from 5% to 95%, so learners cannot select the full HSL lightness range of 0% to 100%.

### Expected behavior

- Calculate the contrast ratio from the relative luminance of each foreground and background color.
- Display the current ratio for every problem area.
- Evaluate each text pair against the applicable WCAG Level AA threshold.
- Let every lightness slider cover the full range from 0% through 100%.
- Keep the current requirement that learners select **check** and pass all three pairs before the exercise completes.
- Update the pass and failure messages to report which pairs still fall below the required ratio.

### Acceptance criteria

- The lab uses the same WCAG contrast calculation as the application's shared color utilities.
- Each problem area displays its current contrast ratio and required threshold.
- A pair is marked as passing only when its calculated ratio meets the required threshold.
- Every slider accepts 0%, 100%, and every supported step between them.
- Selecting **check** completes the exercise only when all three pairs pass.
- Tests cover ratios immediately below, at, and above each threshold, plus both slider endpoints.

## Decouple quiz choice identity from display order

- **Status:** Open
- **Area:** Lesson quizzes and per-tab lesson persistence
- **Sources:** `src/components/lesson/LessonPlayer.tsx`, `QuizItem` in `src/types/lesson.ts`, and all lesson definitions

### Problem

Quiz choices currently use `a`, `b`, `c`, and `d` as both persistent identifiers and visible answer letters. Reordering answers therefore requires changing their IDs. An active session stores those IDs, so a reload after a release can associate an earlier answer with a different choice and produce an incorrect score.

This occurred while Unit 1, Lesson 3 was being edited: correct answers were moved away from the first position, and saved answers were interpreted against the new ID assignments after a reload.

### Expected behavior

- Give every quiz choice a stable identifier that does not depend on its array position or visible letter.
- Keep a choice's identifier unchanged when choices are reordered.
- Derive visible answer letters from the current array index.
- Do not expose internal choice identifiers as answer labels.
- Store a signature for the quiz content with each active lesson session.
- Include question identity, choice identity, choice meaning, and correctness in the signature.
- Restore quiz answers only when the stored signature matches the current quiz.
- When the signature does not match, clear the incompatible quiz answers, selection, and submitted state and restart at the first quiz question.
- Preserve completed lesson steps and challenge progress when only the quiz must restart.
- Define how existing session records without a quiz signature are migrated or invalidated.

### Acceptance criteria

- Reordering choices does not require changing their stable identifiers.
- Choices still display sequential A, B, C, and D labels after any reorder.
- Reloading an unchanged quiz restores the current question, earlier answers, selected choice, submitted feedback, and final score.
- Reloading after a harmless choice reorder keeps each saved answer attached to the same logical choice.
- Reloading after a question, choice, or correctness change restarts the quiz instead of scoring incompatible answers.
- A quiz reset caused by incompatible content does not return the learner to lesson step 1 or require repeating the challenge.
- Duplicate question or choice identifiers are detected during development or testing.
- Tests cover reloads on the second and final questions, choice reordering, content-signature changes, and migration from the previous session format.
