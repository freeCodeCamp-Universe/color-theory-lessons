# Development Standards & Operations

This document outlines the technical standards, tech stack, and operational workflows for maintaining the Color Theory Lessons project.

## Technical Stack

- **Framework**: React 19 (Latest stable release, utilizing new hooks like `useActionState` where applicable).
- **Language**: TypeScript 5.9 (Strict mode enabled, focusing on type safety for lesson and tool configurations).
- **Build Tool**: Vite 8 (Optimized for fast HMR and high-performance production builds).
- **Routing**: React Router 7 (`BrowserRouter`).
- **State**: React Context + `useReducer` (Centralized state for course progress).
- **Styling**: CSS Modules (Scoped CSS per component) and CSS Custom Properties (Theme tokens).

## Operational Workflow

### Local Development
To start the development server, run:
```bash
npm install
npm run dev
```

The app uses production progression rules by default. Set `VITE_DEV_MODE` to
any non-empty value when course development requires access to every lesson and
milestone from the dashboard and through direct routes:

```bash
VITE_DEV_MODE=1 npm run dev
```

Leave `VITE_DEV_MODE` unset when checking the learner-facing sequence. An unset
variable keeps later lessons and milestones inaccessible until their required
earlier work is complete.

### Code Standards
- **Component Design**: Favor functional components and React hooks over class components.
- **Type Safety**: Avoid using `any`. Define clear interfaces for all component props and state shapes.
- **Styling**: Maintain the "Command-line Chic" aesthetic. Avoid adding new color hex codes; instead, use the variables defined in `src/index.css`.
- **Contrast Ratios**: Compare calculated ratios at full precision. For display, round down to the chosen number of decimal places so a value below a threshold is not shown as equal to that threshold.
- **Linting**: Run `npm run lint` before committing to ensure adherence to ESLint rules.

### Building & Deployment
The app is deployed via freeCodeCamp Universe, configured in `platform.yaml`.

1.  **Build**: `npm run build`. This generates a `dist/` folder.
2.  **Base Path**: The application serves from `/` (default Vite base).
3.  **Deployment**: Handled automatically by freeCodeCamp Universe on push to `main`. Build command: `npm run build`; output directory: `dist`.

## Contributing

1.  **Feature/Bugfix**: Create a new branch for each contribution.
2.  **Documentation**: If you add a new lesson or tool, update the corresponding documentation in the `docs/` folder.
3.  **Testing**: Before submitting a PR, verify your changes in a local build to ensure no routing issues (especially if you've added new pages).
4.  **Submission**: Open a Pull Request into the `main` branch.

## Accessibility (a11y)

The project targets WCAG 2.2 Level AAA conformance. Meeting this target requires satisfying every applicable Level A, AA, and AAA success criterion; the points below are not a complete conformance checklist.

- **Contrast**: Ensure normal text has a contrast ratio of at least 7:1 against its background. Large text must reach at least 4.5:1.
- **Color Blindness**: Avoid using color as the *only* means of communicating information.
- **Keyboard**: Ensure all interactive tools can be focused and manipulated via the keyboard.
- **Motion**: Respect the `prefers-reduced-motion` media query for all animations.
