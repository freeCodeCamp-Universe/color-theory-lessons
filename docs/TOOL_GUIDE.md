# Tool Development Guide

Lesson tools render the interactive challenge in each lesson. This guide explains how to build, register, style, and verify a tool.

## Creating a New Tool

All tool components are located in `src/components/tools/`.

### 1. Create the tool component

Use `ExerciseToolProps` from `src/components/tools/exercise-stage.ts`. Its `interactive` prop controls whether the learner can change the tool, `onComplete` reports that the exercise is complete, and `onStageChange` reports the active task to the lesson flow.

## Exercise stage contract

Every lesson exercise has at least one stage. Define each stage with an `id`, `title`, and `instruction` from `ExerciseStageDefinition` in `src/components/tools/exercise-stage.ts`. The ID is a stable content identifier such as `hue` or `contrast-check`; do not use its array index or visible position as the ID.

Use `ExerciseToolProps`, `useExerciseStages`, and `ExerciseStage` for evaluative tools. The hook owns the active position, result, completed-stage IDs, advancement, and final completion callback. The component renders the shared `Stage X of Y` progress pattern, including `Stage 1 of 1`, plus the title, instruction, result, retry action, completion message, and next action. Answer values remain in the tool so its retry handler can either preserve the current work or reset it when the exercise requires a fresh attempt.

```tsx
import { useState } from 'react';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import shellStyles from './ToolShell.module.css';
import { useExerciseStages } from './useExerciseStages.ts';

const stages = [
  {
    id: 'identify-role',
    title: 'Identify the color role',
    instruction: 'Choose the semantic role used by the highlighted color.',
  },
] satisfies readonly ExerciseStageDefinition[];

export function YourTool({
  interactive = true,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [answer, setAnswer] = useState('');
  const stage = useExerciseStages({ stages, onComplete, onStageChange });

  function checkAnswer() {
    if (!interactive || stage.result !== 'idle') return;

    const isCorrect = answer === 'surface';
    if (isCorrect) stage.markPassed();
    else stage.markIncorrect();
  }

  return (
    <div className={shellStyles.shell}>
      <ExerciseStage
        controller={stage}
        incorrectFeedback="Review the highlighted element and try again."
        completionFeedback="Exercise complete."
      >
        <label htmlFor="color-role">Color role</label>
        <select
          id="color-role"
          value={answer}
          disabled={!interactive || stage.result !== 'idle'}
          onChange={(event) => setAnswer(event.target.value)}
        >
          <option value="">Choose a role</option>
          <option value="surface">Surface</option>
          <option value="text">Text</option>
        </select>
        <button
          type="button"
          disabled={!interactive || stage.result !== 'idle'}
          onClick={checkAnswer}
        >
          check answer
        </button>
      </ExerciseStage>
    </div>
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

### 2. Register the tool

Complete each registration step:

1. Add a unique string key to `INTERACTION_TYPES` in `src/types/lesson.ts`. The `InteractionType` union is derived from this registry.
2. Add the interaction type to the lesson interaction inventory in `docs/ACCESSIBLE_VISUALS.md` and assign its accessibility owner. `src/accessibility-contract.test.ts` enforces this entry.
3. Add a lazy import and switch case in `src/components/tools/ToolRenderer.tsx`. Pass `interactive={true}`, `onComplete={onChallengeComplete}`, and `onStageChange` to the tool.
4. Add the matching dynamic import to `src/components/tools/tool-prefetch.ts`. Its exhaustive switch makes the TypeScript build fail when a registered type has no prefetch mapping.
5. Use the interaction type in at least one `LessonConfig`. `src/components/tools/interaction-type-coverage.test.ts` rejects unused registry entries.
6. Add the interaction to `docs/TEST_COVERAGE.md` with the focused test that owns its learner-visible behavior.

```tsx
// src/components/tools/ToolRenderer.tsx
case 'your-tool-type':
  tool = (
    <YourTool
      interactive={true}
      onComplete={onChallengeComplete}
      onStageChange={onStageChange}
    />
  );
  break;
```

## Styling & Theme Tokens

To maintain the "Command-line Chic" aesthetic, use the CSS custom properties defined in `src/index.css`.

### Common Design Tokens
| Category | Variable | Use Case |
|---|---|---|
| Backgrounds | `--primary-background` | App canvas |
| Backgrounds | `--secondary-background` | Tool shell |
| Surfaces | `--surface` | Nested panels and input groups |
| Foregrounds | `--primary-foreground` | Main text |
| Foregrounds | `--muted` | Secondary text |
| Borders | `--border`, `--border-strong` | Standard and emphasized boundaries |
| Actions | `--accent-cta`, `--cta-foreground` | Primary action background and text |
| Status | `--accent-success` | Success text and boundaries |
| Status | `--accent-danger` | Error text and boundaries |
| Typography | `--font-sans` | Body text and controls |
| Typography | `--font-mono` | Code, color values, and authored mockups |

### Best Practices
- **Styling Approach**: Prefer `.module.css` for reusable structure and repeated patterns, but inline styles are acceptable for tool-specific dynamic previews (e.g., live color swatches, generated gradients, per-role color chips).
- **Tool-Only Logic**: Keep the tool's internal state independent. The tool should not know about the lesson's current step or quiz status.
- **Shared Shell**: Wrap the tool in `shellStyles.shell` from `ToolShell.module.css`. The class supplies the shared background, boundary, spacing, control typography, and safeguards for inline text sizes below the 18px application floor.
- **Responsive Layout**: Use layouts that can shrink without overflow. The shared `shellStyles.twoColumnGrid` changes from two columns to one below 500px.

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
