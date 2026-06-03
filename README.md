# Color Theory Course

Browser-based color theory course for developers and designers. Six units of interactive lessons covering color perception, digital color models, accessibility, and design systems.

## Milestones

- 6 unit milestones now use mixed parts: interactive challenges + short quizzes
- Milestone scoring is point-based (`quiz correct answers + challenge pointValue`)
- Milestone 6 includes two challenge parts (`semantic-audit` and `dark-mode-stress`)

## Stack

- React 19 + TypeScript 5.9 + Vite 8
- react-router-dom v7 with `BrowserRouter`
- CSS Modules + CSS custom properties (freeCodeCamp Command-line Chic design system)
- React Context + `useReducer` for state, `localStorage` for persistence

## Dev

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

Deploys to freeCodeCamp Universe (`platform.yaml`) using `npm run build` and serves the `dist/` output as a static SPA.

## Structure

```
src/
  components/   # layout, nav, shared UI, tool components
  data/         # static data (units, milestones, glossary)
  lessons/      # lesson configs organized by unit (unit-1 through unit-6)
  pages/        # route-level page components (Home, Lesson, Milestone, PaletteBuilder, Glossary, Review, Settings)
  state/        # app-context.tsx, persistence.ts
  types/        # TypeScript interfaces
  utils/        # color conversion and analysis utilities
```

## License

Copyright (c) freeCodeCamp.

This project is licensed under the [BSD 3-Clause License](LICENSE).
