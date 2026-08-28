# Development Standards & Operations

This document outlines the technical standards, tech stack, and operational workflows for maintaining the Color Theory Lessons project.

## Technical Stack

- **Framework**: React 19.
- **Language**: TypeScript 5.9 with strict mode enabled.
- **Build Tool**: Vite 8.
- **Routing**: React Router 7 (`BrowserRouter`).
- **State**: React Context + `useReducer` for course progress, with `localStorage` persistence.
- **Styling**: CSS Modules and CSS custom properties.

## Operational Workflow

### Local Development

Use Node.js 22.12 or a later 22.x release. Continuous integration also runs
Node.js 22.x.
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
- **Styling**: Use the Command-line Chic variables in `src/index.css` for application UI. Literal color values are appropriate when the value is lesson content or learner-editable data.
- **Contrast Ratios**: Compare calculated ratios at full precision. For display, round down to the chosen number of decimal places so a value below a threshold is not shown as equal to that threshold.
- **Linting**: Run `npm run lint` before committing to ensure adherence to ESLint rules.

### Building & Deployment
The app is deployed via freeCodeCamp Universe, configured in `platform.yaml`.

1.  **Build**: `npm run build`. This generates a `dist/` folder.
2.  **Base Path**: The application serves from `/` (default Vite base).
3.  **Deployment**: Deployments are started manually from the repository root with the Universe CLI. Pushing to `main` does not deploy the application.

    - Deploy to production with `universe static deploy --promote`.
    - Create a preview with `universe static deploy`, then promote the latest preview with `universe static promote`.
    - List deployments with `universe static ls`.
    - Roll back production with `universe static rollback`.
    - If deployment fails with `whoami preflight failed (unauthenticated)`, run `! universe login` to complete the interactive OAuth device flow, then retry the deployment.

    The Universe CLI runs the `npm run build` command from `platform.yaml` and uploads the `dist` output directory.

## Contributing

See the [contribution guide](../CONTRIBUTING.md) for repository setup, branch and
commit conventions, verification, and pull request requirements.

## Accessibility (a11y)

The project targets WCAG 2.2 Level AAA conformance. Meeting this target requires satisfying every applicable Level A, AA, and AAA success criterion; this section is an implementation baseline, not a complete conformance checklist. Issue #54 owns the application-wide audit for structure and interaction. Issue #53 owns equivalent descriptions for visual lesson content.

### Implementation requirements

- Give each control an accessible name. Prefer visible labels and native HTML elements so the browser supplies the expected role and keyboard behavior.
- Expose the current value and state when they are not available through the native element. This includes selection, expansion, invalid state, progress, and completion.
- Keep focus order predictable and the focused item unobscured. Its visible indicator must meet the WCAG 2.2 Focus Appearance requirements for area and 3:1 contrast between the same pixels in focused and unfocused states. Move focus only when the learner needs context after a view or stage change.
- Make every action available by keyboard without requiring pointer movement, dragging, or a timed key sequence. Do not add keyboard shortcuts that conflict with browser or assistive-technology commands.
- Pair color with text, pattern, shape, iconography, or another programmatically available cue. Instructions and results must not depend on color, position, or shape alone.
- Ensure normal text has at least 7:1 contrast against its background. Large text must reach at least 4.5:1. Compare ratios at full precision.
- Respect `prefers-reduced-motion` for animation and animated transitions. Provide a non-motion way to understand any information conveyed by movement.
- Follow [the accessible visual-content contract](ACCESSIBLE_VISUALS.md) for informative, assessment, and decorative visuals. Include visible color names and values in the text alternative when sighted learners can inspect them.
- Announce validation results, stage changes, retry state, and completion from the component that owns the change. Use a polite status for progress and results, and reserve an assertive alert for an error that blocks the current action. Do not announce unchanged state or duplicate text that just received focus.

### Verification requirements

Use automated tests for programmatic roles, names, states, descriptions, live-region semantics, and keyboard events. Add focused Vitest coverage beside the component, and run the relevant file while developing:

```bash
npx vitest run src/path/to/Component.test.tsx
```

Before opening a pull request, run the full automated checks that apply to the change:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

Automated checks cannot establish reading order, focus visibility, usable keyboard flow, announcement timing, or whether a description communicates the same visual evidence. Manually verify learner-facing changes as follows:

- Use a browser and keyboard whenever controls, focus, responsive presentation, contrast, motion, or visual cues change. Complete the affected flow without a pointer and confirm focus remains visible at every step.
- Use a screen reader whenever accessible names or descriptions, roles, values, states, live regions, focus movement, quiz feedback, or stage transitions change. Confirm each change is announced once and at the point where it occurs.
- Exercise reduced-motion settings when motion changes. Check both themes and the affected viewport sizes when color, contrast, focus styling, zoom, or reflow changes.

Record the browser, viewport, keyboard flow, screen reader and browser pair, and observed announcements in the pull request. Keep visual-description findings within #53 and general structure, interaction, keyboard, focus, zoom, and reflow findings within #54.
