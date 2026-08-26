# Explicit Check audit

This audit covers every interactive lesson activity, every milestone challenge, and the shared milestone quiz flow. It classifies an activity as evaluative when the learner's work can be correct or incorrect. Exploratory activities have no answer to grade.

An evaluative activity passes this audit when selection and editing do not complete it, a Check or equivalent submit action grades the work, grading feedback is hidden until the first submission, retry keeps useful work, and completion runs only after a submitted passing attempt.

## Lesson activities

| Activity | Tool | Classification | Result |
|---|---|---|---|
| Unit 1 Lesson 1 | `before-after` color-function variant | Evaluative | Already compliant |
| Unit 1 Lesson 2 | `slider-explore` | Evaluative | Updated: retry preserves the learner's slider position |
| Unit 1 Lesson 3 | `contrast-checker` | Evaluative | Updated: pass and fail judgments now wait for Check |
| Unit 1 Lesson 4 | `temperature-sorter` | Evaluative | Updated: retry preserves both sets of classifications |
| Unit 1 Lesson 5 | `before-after` hierarchy variant | Evaluative | Already compliant |
| Unit 1 Lesson 6 | `color-wheel` | Mixed exploration and evaluation | Already compliant: palette construction uses an explicit lock action, and relationship identification uses Check |
| Unit 2 Lesson 1 | `additive-sort` | Evaluative | Updated: retry preserves all sorting assignments |
| Unit 2 Lesson 2 | `rgb-mixer` | Evaluative | Already compliant |
| Unit 2 Lesson 3 | `logic-fixer` | Evaluative | Already compliant |
| Unit 2 Lesson 4 | `mismatch-explainer` | Evaluative | Already compliant |
| Unit 2 Lesson 5 | `background-shift` | Evaluative | Already compliant |
| Unit 3 Lesson 1 | `format-reveal` | Exploratory | Not applicable: completion records that every format was inspected; there is no correct answer |
| Unit 3 Lesson 2 | `hex-rgb-editor` | Evaluative | Already compliant |
| Unit 3 Lesson 3 | `hsl-playground` | Evaluative | Already compliant |
| Unit 3 Lesson 4 | `alpha-layer` | Evaluative | Already compliant |
| Unit 3 Lesson 5 | `theme-sandbox` | Evaluative | Updated: contrast judgments now wait for Check |
| Unit 3 Lesson 6 | `token-map` | Evaluative | Updated: the classification button reports selections, not correct answers, before Check |
| Unit 4 Lesson 1 | `eye-diagram` | Exploratory | Not applicable: the learner advances through an ordered visual pathway with no graded answer |
| Unit 4 Lesson 2 | `vision-cards` | Exploratory | Not applicable: completion records that all cards were inspected |
| Unit 4 Lesson 3 | `interface-gallery` | Exploratory | Not applicable: completion records that all simulation modes were inspected |
| Unit 4 Lesson 4 | `color-only-detector` | Evaluative | Already compliant |
| Unit 5 Lesson 1 | `text-contrast-lab` | Evaluative | Updated: pair counts and pass or fail labels now wait for Check |
| Unit 5 Lesson 2 | `component-checker` | Evaluative | Updated: component counts and pass or fail labels now wait for Check |
| Unit 5 Lesson 3 | `state-workshop` | Evaluative | Updated: selected cues use neutral selection styling before Check |
| Unit 5 Lesson 4 | `pattern-repair` | Evaluative | Already compliant |
| Unit 5 Lesson 5 | `audit-flow` | Evaluative | Already compliant |
| Unit 5 Lesson 6 | `inclusive-review` | Evaluative | Updated: selected assessments no longer receive correctness styling before Check |
| Unit 6 Lesson 1 | `system-comparison` | Evaluative | Updated: targets have no identifying outline, title, or pointer styling before selection, and selected inconsistencies remain neutral before Check |
| Unit 6 Lesson 2 | `role-builder` | Evaluative | Updated: validation judgments now wait for Check |
| Unit 6 Lesson 3 | `brand-pressure` | Evaluative | Updated: contrast and pressure judgments now wait for Check |
| Unit 6 Lesson 4 | `dark-translator` | Evaluative | Updated: validation judgments now wait for Check |
| Unit 6 Lesson 5 | `chart-tuner` | Evaluative | Already compliant |
| Unit 6 Lesson 6 | `color-space-lab` | Evaluative | Already compliant |
| Unit 6 Lesson 7 | `system-stress` | Evaluative | Already compliant |

## Milestone activities

| Activity | Classification | Result |
|---|---|---|
| Milestone 1 `read-interface` | Evaluative | Updated: retry preserves all interface classifications |
| Milestone 2 `channel-prediction` | Evaluative | Updated: retry preserves predictions in both stages |
| Milestone 3 `theme-from-scratch` | Evaluative | Updated: stage judgments now wait for Check |
| Milestone 4 `simulation-spotter` | Evaluative | Already compliant |
| Milestone 5 `accessibility-rescue` | Evaluative | Updated: repair judgments now wait for Check |
| Milestone 6 `semantic-audit` | Evaluative | Updated: the role-assignment header reports assignments, not correct answers, before Check |
| Milestone 6 `dark-mode-stress` | Evaluative | Updated: contrast judgments now wait for Check |
| Milestone concept checks | Evaluative | Already compliant: all six use the shared quiz Check action and show explanations after submission |

## Shared behavior

The shared stage controller records which stage IDs have received a submitted attempt. Tools can therefore keep raw measurements visible while withholding pass or fail judgments before the first Check. After a failed attempt, retry preserves the learner's inputs but clears grading judgments and feedback until the next Check. A later stage also starts without grading feedback until its own first submission.
