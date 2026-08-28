# Content Creation Guide

This guide explains how to add new lessons, milestones, and glossary terms to the Color Theory Lessons app.

## Adding a New Lesson

All lesson content is stored as TypeScript data objects in `src/lessons/`.

### 1. Create the Lesson File
Navigate to the appropriate unit folder (e.g., `src/lessons/unit-1/`) and create a new file named `lesson-X-Y.ts`.

```typescript
import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lessonX_Y: LessonConfig = {
  id: 'uX-lY',            // Unique ID (e.g., 'u1-l7')
  unitId: 'unit-X',       // Parent unit ID
  title: LESSON_TITLES['uX-lY'],
  interactionType: 'tool-name', // Must exist in InteractionType enum
  steps: [
    { text: 'First instruction...' },
    { text: 'Second instruction...' }
  ],
  challenge: {
    prompt: 'Complete the interaction to...',
    hints: ['Hint 1', 'Hint 2']
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Question text?',
      choices: [
        { stableId: 'correct-choice', label: 'Correct Choice', isCorrect: true, explanation: 'Why this is right.' },
        { stableId: 'wrong-choice', label: 'Wrong Choice', isCorrect: false, explanation: 'Why this is wrong.' }
      ]
    }
  ],
  reviewTags: ['foundations'] // For grouping in the Review page
};
```

Each quiz choice needs a unique `stableId` within its question. Keep that ID with
the same logical choice when answers are reordered or their wording changes. The
learner-facing A, B, C, and D labels come from the choices' array order.

### 2. Add the Lesson Title

Add the lesson ID and display title to `LESSON_TITLES` in `src/lessons/lesson-titles.ts`:

```typescript
export const LESSON_TITLES: Record<string, string> = {
  // ... existing titles
  'uX-lY': 'Lesson Title',
};
```

The Home page and lesson file both read the title from this map.

### 3. Register the Lesson
Import and add your new lesson to the `lessonRegistry` array in `src/lessons/lesson-registry.ts`.

```typescript
import { lessonX_Y } from './unit-X/lesson-X-Y.ts';

export const lessonRegistry: LessonConfig[] = [
  // ... existing lessons
  lessonX_Y,
];
```

### 4. Update the Unit Configuration
Ensure the lesson's ID is included in the `lessons` array for its parent unit in `src/data/units.ts`.

## Adding a Milestone
Milestones are "capstone" challenges that appear at the end of each unit. They are defined in `src/data/milestones.ts`.

A milestone requires:
- `id`: Unique ID (e.g., `milestone-1`).
- `unitId`: The unit it belongs to.
- `title`, `description`, `estimatedMinutes`, and `passThreshold`.
- `parts`: An ordered array of milestone parts.

Each part must be one of:
- `kind: 'quiz'`: Uses `questions` with multiple-choice answers.
- `kind: 'challenge'`: Uses `challengeType`, `briefing`, `successMessage`, and `pointValue`.

### Milestone challenge types (important)

Milestone challenge parts are type-safe and must use a supported `challengeType` from `src/types/milestone.ts`.

Current supported values:
- `read-interface`
- `channel-prediction`
- `theme-from-scratch`
- `simulation-spotter`
- `accessibility-rescue`
- `semantic-audit`
- `dark-mode-stress`

When adding a new challenge type, update all three:
1. `MilestoneChallengeType` union in `src/types/milestone.ts`
2. Switch mapping in `src/components/milestone/ChallengeRenderer.tsx`
3. Milestone content in `src/data/milestones.ts`

If a challenge type is not mapped in `ChallengeRenderer`, it now renders an unavailable state and cannot be completed.

### Current milestone scoring model

Milestone pass/fail now uses points, not question counts:

- Quiz questions are worth 1 point each.
- Challenge parts award `pointValue` when completed.
- `passThreshold` is compared against total earned points.

Current configured structure in `src/data/milestones.ts`:

- Milestone 1: challenge (3 pts) + 3-question quiz, pass 4
- Milestone 2: challenge (3 pts) + 3-question quiz, pass 4
- Milestone 3: challenge (4 pts) + 3-question quiz, pass 5
- Milestone 4: challenge (4 pts) + 3-question quiz, pass 5
- Milestone 5: challenge (4 pts) + 4-question quiz, pass 6
- Milestone 6: two challenges (3 + 3 pts) + 4-question quiz, pass 7

## Adding Glossary Terms
New terms should be added to `src/data/glossary.ts`. Each entry has a `relatedLessons` array — the IDs of lessons whose completion will make that term visible in the learner's glossary. To link a term to a new lesson, add the lesson's `id` to that term's `relatedLessons` array.

## Content Best Practices
- **Quiz Explanations**: Always provide an `explanation` for both correct and incorrect choices. This is where the actual teaching happens for users who guess.
- **Incremental Difficulty**: Ensure that early steps in a lesson prepare the user for the subsequent challenge and quiz.

## Accessible visual content

Classify each visual as informative, part of an assessment, or decorative before authoring it. Use the fields and rendering patterns in [the accessible visual-content contract](ACCESSIBLE_VISUALS.md). Issue #53 owns visual descriptions; general application structure and interaction remain in #54.

### Informative and decorative visuals

- Give an informative visual an authored description of the information a sighted learner receives. Add an accessible name when the visible heading or label does not identify it.
- Include human-readable color names and the same HEX, RGB, HSL, or alpha values shown visually. A list of colors does not replace a description of their order, contrast, relationship, pattern, or current state.
- Mark decorative visuals as hidden from assistive technology. Decorative content repeats adjacent text or adds styling without teaching information. Never hide a wrapper that contains a control.
- Keep the visible label and accessible description consistent. Do not use an accessible description to introduce instructions or facts that are unavailable to sighted learners.

For lesson step panels, author `panel.accessibility`. Informative and assessment entries require `accessibleDescription`; add `accessibleName` when the visible text is insufficient and `colors` when the visual exposes named color values.

### Quiz and assessment visuals

Each lesson quiz swatch in `colorSwatches` needs a visible `label`, a visible `color` value, and an `accessibleDescription`. Each milestone quiz swatch needs its visible `swatchColor` and an authored `swatchDescription`. Write color names and values in the description when they are part of the visible evidence.

Assessment descriptions must present the evidence needed to answer without interpreting it for the learner. Describe appearance, layout, labels, current values, and non-color cues. Before submission, do not state the correct choice, target value, faulty region, classification, or repair.

- Answer-safe: "A muted, lighter rose-red swatch. Color value: #C48B9F."
- Reveals the answer: "The second swatch has lower saturation, so choose Saturation."

Keep a hidden target separate from the learner's current state. The target description can explain its visible appearance without exposing a hidden numeric answer. The current-state description can expose the learner's selected or entered values. Submitted feedback may explain the correct relationship after grading.
