# Tool Development Guide

Interactive tools are the heart of the Color Theory Lessons app. This guide explains how to build, register, and style new tools.

## Creating a New Tool

All tool components are located in `src/components/tools/`.

### 1. The Standard Tool Component
New tools should follow a specific React functional component pattern.

```tsx
import React, { useState } from 'react';
import styles from './YourTool.module.css';

interface YourToolProps {
  interactive?: boolean;     // Can the user change its state?
  onComplete?: () => void;   // Callback for finishing a challenge
  onStageChange?: ExerciseStageChangeHandler; // Reports the active task
}

export function YourTool({ interactive = true, onComplete }: YourToolProps) {
  const [isFinished, setIsFinished] = useState(false);

  // Logic to handle user interaction
  const handleInteraction = () => {
    if (!interactive) return;
    // ...
    if (/* condition for success */) {
      setIsFinished(true);
      onComplete?.();
    }
  };

  return (
    <div className={styles.container}>
      {/* Your Tool UI */}
    </div>
  );
}
```

## Exercise stage contract

Every lesson exercise has at least one stage. Define each stage with an `id`, `title`, and `instruction` from `ExerciseStageDefinition` in `src/components/tools/exercise-stage.ts`. The ID is a stable content identifier such as `hue` or `contrast-check`; do not use its array index or visible position as the ID.

Use `ExerciseToolProps`, `useExerciseStages`, and `ExerciseStage` for evaluative tools. The hook owns the active position, result, completed-stage IDs, advancement, and final completion callback. The component renders the shared `Stage X of Y` progress pattern, including `Stage 1 of 1`, plus the title, instruction, result, retry action, completion message, and next action. Answer values remain in the tool so its retry handler can either preserve the current work or reset it when the exercise requires a fresh attempt.

```tsx
const stages = [
  {
    id: 'identify-role',
    title: 'Identify the color role',
    instruction: 'Choose the semantic role used by the highlighted color.',
  },
] satisfies readonly ExerciseStageDefinition[];

export function YourTool({ onComplete, onStageChange }: ExerciseToolProps) {
  const stage = useExerciseStages({ stages, onComplete, onStageChange });

  return (
    <ExerciseStage
      controller={stage}
      incorrectFeedback="Review the highlighted element and try again."
      completionFeedback="Exercise complete."
    >
      {/* Inputs and the explicit Check action */}
    </ExerciseStage>
  );
}
```

Call `markIncorrect` or `markPassed` only from an explicit Check action for an evaluative stage. A failed result stays on the same stage. `advance` ignores calls until the current stage passes. `onComplete` fires once when the final stage passes, not when an earlier stage passes or when the learner merely selects an input. This submission behavior follows the inventory and exceptions tracked in #183.

`ToolRenderer` passes `onStageChange` from `LessonPlayer` to staged tools. The callback reports the active stage ID, title, instruction, position, and total. `LessonPlayer` uses the ID to select stage hints. A challenge hint can remain challenge-wide as a string or use `{ text, stageId }` to associate it with one stable stage ID. Do not add a second hint control inside a tool.

### Mapping activity content to stages

- An exploratory activity with one continuous goal is one stage, even when it contains several controls. It still renders `Stage 1 of 1`. Completion can follow the documented exploration requirement instead of a correct answer.
- Repeated items that practice the same skill belong to one stage. For example, classifying several swatches with the same rule is one classification stage.
- Tasks that test different skills are separate stages. Render only the active task's instruction, inputs, answer-specific feedback, and hints. Later tasks must not be present in the rendered page.
- A completed stage remains represented by its completed progress segment. Its inputs and answers are replaced by the next stage rather than remaining visible.

### Results, focus, and announcements

`ExerciseStage` exposes result and completion text through one polite status region. Supply feedback that identifies the result and the learner's next action. When the learner selects the next-stage action, `useExerciseStages` moves focus to the new stage heading. The heading references the new instruction with `aria-describedby`, so the title and instruction are announced once through the focus change. Do not add another live announcement for the same transition.

The final stage shows its completion feedback in the same status region. It has no next-stage action. The lesson flow can offer its quiz or finish action only after the tool calls `onComplete`.

Challenge prompts should state the number and sequence of stages without copying the detailed stage instructions. Stage instructions belong in the stage definitions, where they remain aligned with the active inputs and hints.

### 2. Registering the Tool
There are three steps to making your tool available to lessons:

1.  **Add to InteractionType Enum**: Add a unique string key for your tool in `src/types/lesson.ts`.
2.  **Import in ToolRenderer**: Add your component import to `src/components/tools/ToolRenderer.tsx`.
3.  **Add Switch Case**: Add a new `case` to the `ToolRenderer` component that returns your tool when its `interactionType` matches.

```tsx
// src/components/tools/ToolRenderer.tsx
case 'your-tool-type':
  return (
    <YourTool 
      interactive={toolUnlocked} 
      onComplete={isChallenge ? onChallengeComplete : undefined} 
    />
  );
```

## Styling & Theme Tokens

To maintain the "Command-line Chic" aesthetic, use the CSS custom properties defined in `src/index.css`.

### Common Design Tokens
| Category | Variable | Use Case |
|---|---|---|
| Backgrounds | `--primary-background` | Main app background (Dark) |
| Surfaces | `--surface` | Tool panels, input containers |
| Foregrounds | `--primary-foreground` | Main text (Off-white) |
| Accents | `--accent-cta` | Primary actions (Yellow) |
| Accents | `--accent-success` | Correct states (Green) |
| Accents | `--accent-danger` | Error states (Red) |
| Typography | `--font-mono` | All UI text (Monospace) |

### Best Practices
- **Styling Approach**: Prefer `.module.css` for reusable structure and repeated patterns, but inline styles are acceptable for tool-specific dynamic previews (e.g., live color swatches, generated gradients, per-role color chips).
- **Tool-Only Logic**: Keep the tool's internal state independent. The tool should not know about the lesson's current step or quiz status.
- **Responsive Layout**: Tools should ideally be designed to fit within the `ToolShell` container, which provides consistent padding and border-styling.

## Required accessibility checklist

New and changed tools must meet the WCAG 2.2 Level AAA requirements in [Development Standards](DEVELOPMENT.md). Use [the accessible visual-content contract](ACCESSIBLE_VISUALS.md) for tool visuals. Issue #53 owns visual descriptions; issue #54 owns general structure, interaction, keyboard, focus, zoom, and reflow.

- Use native buttons, links, inputs, selects, fieldsets, legends, and headings when their semantics match the task. Do not recreate native behavior with a clickable `div` or `span`.
- Give every control a visible label or an equivalent accessible name. Expose its role, current value, selected or expanded state, invalid state, and disabled state when applicable.
- Support the complete task with a keyboard. Provide buttons or other keyboard controls for drag, draw, hover, or pointer-position interactions. Keep focus order predictable and the focus indicator visible.
- Keep instructions next to the controls they describe. Do not rely on color, position, shape, motion, or pointer gestures as the only instruction or result cue.
- Describe informative and assessment visuals with the authored fields and `VisualDescription` pattern in `ACCESSIBLE_VISUALS.md`. Hide only the smallest decorative element, never an interactive wrapper.
- Include color names and the values visible to sighted learners. Describe relationships, order, contrast, patterns, and the current tool state rather than listing colors alone.
- Keep assessment descriptions answer-safe. Expose observable evidence and the learner's current input, but do not identify the correct choice, target value, faulty region, or repair before submission.
- Announce validation only after the learner checks an answer. Announce retry state, stage changes, and completion once from the component that owns the change. Use the shared `ExerciseStage` status region or `StatusAnnouncement`; do not create a second live region for the same message.
- Respect `prefers-reduced-motion` and provide a static equivalent for information shown through animation.

### Accessibility verification

Add focused automated tests for the behavior introduced by the tool. Test native or programmatic roles and names, state changes, keyboard operation, answer-safe visual descriptions, validation, retry, and completion announcements. Run the focused file during development, then run the project checks named in [Development Standards](DEVELOPMENT.md).

Automated tests do not replace manual checks. Complete the changed task in a browser with only a keyboard. Use a screen reader when names, descriptions, values, states, live messages, focus movement, validation, or completion change. Confirm that focus is visible, the task does not require color or pointer input, and each meaningful change is announced once. Record the browser, viewport, keyboard path, screen reader and browser pair, and observed announcements in the pull request.
