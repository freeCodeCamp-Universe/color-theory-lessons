# Architecture Overview

This document provides a technical overview of the Color Theory Lessons app's internal structure and data flow.

## Core Concepts

The application is built as a data-driven React SPA. It separates lesson content from the logic used to display and interact with that content.

### 1. The Lesson Data Pipeline

The app follows a strict hierarchy for content delivery:

- **Type Definitions (`src/types/lesson.ts`)**: Define the `LessonConfig` interface, which all lessons must adhere to.
- **Static Lessons (`src/lessons/unit-X/lesson-X-Y.ts`)**: Pure data files containing the steps, challenge, and quiz questions for a specific lesson.
- **Lesson Registry (`src/lessons/lesson-registry.ts`)**: A central index that imports all individual lesson files and exports them as a searchable array.
- **Lesson Player (`src/components/lesson/LessonPlayer.tsx`)**: The stateful component that consumes a `LessonConfig` and manages the user's progress through its phases (Steps -> Challenge -> Quiz -> Complete).

### 2. The Tool Rendering System

Interactive exercises (Tools) are decoupled from the lesson logic:

- **Interaction Type**: Each lesson specifies an `interactionType` (e.g., `'rgb-mixer'`, `'contrast-checker'`).
- **Tool Renderer (`src/components/tools/ToolRenderer.tsx`)**: A central switch-case component that maps `interactionType` strings to their corresponding React components.
- **Standardized Tool Interface**: All tools are expected to accept common props like `interactive` (boolean) and `onComplete` (callback), allowing the `LessonPlayer` to control their state.

### 3. Milestone Part System

Milestones are also data-driven, using discriminated parts in `src/types/milestone.ts`:

- **`MilestoneQuizPart`**: `kind: 'quiz'` with multiple-choice `questions`.
- **`MilestoneChallengePart`**: `kind: 'challenge'` with `challengeType`, `briefing`, `successMessage`, and `pointValue`.
- **`MilestonePlayer` (`src/components/milestone/MilestonePlayer.tsx`)**: Switches between question/challenge phases per part kind, aggregates quiz correctness plus challenge points, and evaluates pass thresholds from total points.
- **`ChallengeRenderer` (`src/components/milestone/ChallengeRenderer.tsx`)**: Maps `challengeType` values to concrete challenge components.

Current challenge mappings:

- `read-interface`
- `channel-prediction`
- `theme-from-scratch`
- `simulation-spotter`
- `accessibility-rescue`
- `semantic-audit`
- `dark-mode-stress`

`challengeType` values are compile-time constrained by the `MilestoneChallengeType` union to prevent typo-based fallbacks in milestone data.

### 4. State Management & Persistence

The app uses a centralized state pattern to track progress:

- **App Context (`src/state/app-context.tsx`)**: Uses `useReducer` to manage global state, including completed lessons, quizzes, and milestones.
- **Persistence Layer (`src/state/persistence.ts`)**: Automatically syncs the app state to `localStorage` whenever it changes, ensuring user progress is saved across sessions.
- **Reset Logic**: Users can clear their progress via the Settings page, which triggers a `RESET_PROGRESS` action in the reducer.

## Routing

The app uses `react-router-dom` with a `BrowserRouter` (configured in `src/App.tsx`) for clean URLs.

- **Base URL**: `/` (default Vite base).
- **Primary Routes**:
  - `/`: Home (Unit selection)
  - `/lesson/:id`: Interactive lesson player
  - `/milestone/:id`: Unit capstone challenges
  - `/glossary`: Terms discovered during lessons
  - `/palette-builder`: Standalone design tool

## Design System

The app implements the "Command-line Chic" design language, characterized by:

- **Monospace Typography**: Heavy use of `'Hack-ZeroSlash'`.
- **Dark Theme**: A high-contrast dark background by default.
- **CSS Modules**: Scoped styling for components to prevent class name collisions.
- **CSS Custom Properties**: Centralized theme tokens defined in `src/index.css`.
