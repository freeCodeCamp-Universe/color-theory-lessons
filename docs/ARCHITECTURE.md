# Architecture Overview

This document maps the Color Theory Lessons app's main runtime paths, state stores, and rendering boundaries.

## Application structure

The app is a data-driven React single-page application. Lesson and milestone content lives in TypeScript configuration files, while players and renderers own navigation, scoring, and interactive state.

`src/App.tsx` wraps the routes with `AppProvider`, `BrowserRouter`, `AppShell`, and `ErrorBoundary`. Route pages are loaded with `React.lazy` and `Suspense`. `AppShell` supplies the top navigation, main-content landmark, skip link, route-change focus management, transient route messages, and the selected color-vision simulation.

## Lesson data and loading

The lesson path uses these layers:

- **Type definitions (`src/types/lesson.ts`)** define `LessonConfig`, the `InteractionType` union, lesson steps, challenges, quiz items, and review content.
- **Lesson files (`src/lessons/unit-X/lesson-X-Y.ts`)** export the content for one lesson: steps, challenge instructions, quiz items, review tags, and key points.
- **Unit data (`src/data/units.ts`)** defines lesson order and the milestone attached to each unit.
- **Lesson loader (`src/lessons/lesson-loader.ts`)** maps lesson IDs to dynamic imports. `LessonPage` uses it for the requested lesson, then prefetches the lesson's tool and the next lesson.
- **Lesson registry (`src/lessons/lesson-registry.ts`)** eagerly imports and validates every lesson. The Review page and content-consistency tests use this complete collection; the lesson route uses the dynamic loader instead.
- **Lesson page (`src/pages/LessonPage.tsx`)** checks route parameters and progression locks before loading the lesson and its player.
- **Lesson player (`src/components/lesson/LessonPlayer.tsx`)** manages the `steps`, `challenge`, `quiz`, and `complete` phases. It records the active lesson session in `sessionStorage` and sends completed lesson and quiz results to global progress state.

Both the eager registry and dynamic loader run `validateLessonQuiz`, which checks stable quiz identifiers before returning lesson data.

## Tool rendering

Interactive lesson exercises are selected by the lesson's `interactionType`.

- **Interaction types** are defined by the `INTERACTION_TYPES` constant and derived `InteractionType` union in `src/types/lesson.ts`.
- **Tool renderer (`src/components/tools/ToolRenderer.tsx`)** uses an exhaustive switch to map each interaction type to a lazily imported React component.
- **Shared callbacks** let tools report challenge completion and active exercise stages to `LessonPlayer`. `LessonPlayer` uses the reported stage to select staged hints; each tool owns its stage transitions and retry behavior.
- **Tool prefetching (`src/components/tools/tool-prefetch.ts`)** mirrors the renderer's mappings so `LessonPage` can request the correct tool chunk as soon as lesson data loads.

The renderer passes lesson-specific options where needed. Interactive tools otherwise share the `interactive`, `onComplete`, and `onStageChange` contract.

## Milestones

Milestones are configured in `src/data/milestones.ts` using the discriminated part types from `src/types/milestone.ts`:

- **`MilestoneQuizPart`** has `kind: 'quiz'` and a sequence of multiple-choice questions.
- **`MilestoneChallengePart`** has `kind: 'challenge'`, a typed `challengeType`, instructions, completion feedback, and a point value.
- **Milestone player (`src/components/milestone/MilestonePlayer.tsx`)** advances through question, challenge, part-summary, and complete phases. It adds correct quiz answers to earned challenge points and compares the result with the milestone's `passThreshold`.
- **Challenge renderer (`src/components/milestone/ChallengeRenderer.tsx`)** maps each `MilestoneChallengeType` to its challenge component.

The supported challenge types are:

- `read-interface`
- `channel-prediction`
- `theme-from-scratch`
- `simulation-spotter`
- `accessibility-rescue`
- `semantic-audit`
- `dark-mode-stress`

`MilestonePlayer` and the individual challenge components store active attempts in `sessionStorage`. Passing a milestone dispatches its completion to global progress state and unlocks the next unit.

## State and persistence

Global state is split across three files:

- **Context and reducer (`src/state/app-context.tsx`)** define progress, preferences, actions, and the state and dispatch hooks.
- **Provider (`src/state/app-provider.tsx`)** owns `useReducer`, saves state after changes, applies the selected theme, and responds to system-theme changes.
- **Persistence (`src/state/persistence.ts`)** validates stored data and reads or writes the versioned `color-theory-course-state` record in `localStorage`.

The global record contains completed lessons, completed quizzes, best quiz scores, completed milestones, theme preference, reduced-motion preference, and color-vision simulation preference.

Active lesson and milestone attempts use `sessionStorage` instead of the global record. This keeps in-progress phase, answer, and challenge state available after a reload in the same browser tab. The dashboard's reset control dispatches `RESET_PROGRESS`; the reducer clears completed progress, and the provider removes current lesson sessions, legacy lesson-step records, milestone sessions, and milestone-challenge sessions. Other `sessionStorage` records remain intact.

## Routing

The app uses React Router 7 with `BrowserRouter` and the default Vite base URL of `/`.

| Route | Result |
|---|---|
| `/` | Course dashboard and unit selection |
| `/lesson/:lessonId` | Progression-checked lesson route |
| `/milestone/:milestoneId` | Progression-checked unit milestone route |
| `/glossary` | Glossary terms unlocked by completed lessons |
| `/review` | Key points from completed lessons, grouped by topic |
| `/palette-builder` | Standalone palette design tool |
| `/capstone` | Redirect to `/milestone/milestone-6` |
| `/settings` | Redirect to the dashboard |
| Any unmatched path | Not-found page |

## Design system

The app uses the freeCodeCamp Command-line Chic design language:

- **Typography** uses Lato for body copy and `Hack-ZeroSlash` or a monospace fallback for code-like labels and controls.
- **Themes** follow the saved light, dark, or system preference. An inline script in `index.html` applies the initial theme before React renders to avoid a theme flash.
- **CSS Modules** scope component and page styles. Shared resets, theme tokens, base element styles, focus treatment, and reduced-motion rules live in `src/index.css`.
- **CSS custom properties** provide semantic colors, typography, spacing, and layout values. Dark and light theme values are selected with the root `data-theme` attribute.

## Build and deployment

Vite builds the static application into `dist/`. The root `platform.yaml` configures freeCodeCamp Universe to run `npm run build` and publish that directory. Deployment is a separate manual operation; pushing to `main` does not publish the site.
