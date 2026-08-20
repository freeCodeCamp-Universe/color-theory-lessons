# Content Creation Guide

This guide explains how to add new lessons, milestones, and glossary terms to the Color Theory Lessons app.

## Adding a New Lesson

All lesson content is stored as TypeScript data objects in `src/lessons/`.

### 1. Create the Lesson File
Navigate to the appropriate unit folder (e.g., `src/lessons/unit-1/`) and create a new file named `lesson-X-Y.ts`.

```typescript
import type { LessonConfig } from '../../types/lesson.ts';

export const lessonX_Y: LessonConfig = {
  id: 'uX-lY',            // Unique ID (e.g., 'u1-l7')
  unitId: 'unit-X',       // Parent unit ID
  title: 'Lesson Title',
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
        { id: 'a', label: 'Correct Choice', isCorrect: true, explanation: 'Why this is right.' },
        { id: 'b', label: 'Wrong Choice', isCorrect: false, explanation: 'Why this is wrong.' }
      ]
    }
  ],
  reviewTags: ['foundations'] // For grouping in the Review page
};
```

### 2. Register the Lesson
Import and add your new lesson to the `lessonRegistry` array in `src/lessons/lesson-registry.ts`.

```typescript
import { lessonX_Y } from './unit-X/lesson-X-Y.ts';

export const lessonRegistry: LessonConfig[] = [
  // ... existing lessons
  lessonX_Y,
];
```

### 3. Update the Unit Configuration
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
