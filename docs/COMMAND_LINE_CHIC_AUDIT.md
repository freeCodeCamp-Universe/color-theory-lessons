# Command-line Chic interface audit

Audit date: 2026-08-26

## Scope

This audit covers the application shell, navigation, pages, lesson and milestone players, quizzes, learner-facing tool controls, focus states, status messages, and form controls.

It does not cover authored mock interfaces, example designs, preview palettes, or deliberately failing color pairs inside tools and exercises. Those colors demonstrate course concepts and were not restyled for the application theme. Legacy visual accent tokens stay fixed across themes for that reason. For example, the failing preview text in the contrast repair lab remains below the exercise target, while the lab labels and instructions around it use the application tokens.

The installed Command-line Chic skill was compared with the current marketplace copy before the audit. `SKILL.md`, `references/color-system.md`, and `references/syntax-theme.md` now match the marketplace blob hashes `e65190e`, `4d6299e`, and `158d2b3`.

## Rule checklist

| Rule | Result | Evidence or task |
| --- | --- | --- |
| Dark-first and theme-aware | Verified | Dark remains the default design. `data-theme="dark"` and `data-theme="light"` swap semantic foreground, background, border, accent, selection, and focus roles. |
| System, dark, and light preferences | Verified | The navigation control exposes all three preferences, shows the saved value, and uses a native keyboard-operable select. |
| Preference persistence | Verified | The selected preference is stored with the existing application state. Automated tests cover selection, reload persistence, and system fallback. |
| Theme before render | Verified | The head script resolves saved or system preference before the React module loads, sets `data-theme`, `color-scheme`, and the browser theme color. |
| 18px base typography | Verified for shared UI | Page, navigation, lesson, milestone, shared exercise, and shared tool UI use the 18px root floor. Typography authored inside mocks and previews is excluded. |
| Proportional UI text | Verified for shared UI | UI labels and buttons use Lato or its sans-serif fallbacks. Monospace remains on the logo, commands, step keys, channel values, hex values, and other literal technical values. |
| AAA text contrast | Verified | Semantic text and accent pairs reach at least 7:1 on every application background where they are used. Large text therefore also exceeds its 4.5:1 AAA target. |
| Required control boundaries | Verified | Enabled form controls and outline controls use `--border-strong`, which exceeds the 3:1 non-text requirement. Decorative panel borders retain the quieter `--border` token. |
| Focus indicators | Verified | Dark mode keeps Command-line Chic blue-mid. Light mode uses the existing blue-dark counterpart because blue-mid reaches only 2.57:1 on the light surface. The minimum rendered focus contrast is 3.19:1. |
| Accent purpose | Verified | Gold is limited to CTA backgrounds. Theme-paired yellow, blue, green, red, and purple tokens communicate warning, interaction, success, danger, and emphasis. |
| Buttons | Verified | Primary actions use gold with navy text at 11.76:1. Secondary actions use a strong boundary and theme foreground text. |
| Forms | Verified | Inputs use semantic surfaces, AAA placeholder text, strong enabled boundaries, and the shared focus indicator. |
| Cards and panels | Verified | Page, lesson, milestone, and tool surfaces use adjacent neutral backgrounds and borders. No dark-mode shadow is used for depth. |
| Navigation | Verified | The 38px header uses the primary surface, an active background shift, visible focus, and a compact theme control. The logo shortens at 500px without changing its accessible destination. |
| Layout and spacing | Verified | All routes were rendered at 1280px and 320px. No route produced document-level horizontal overflow. The home unit cards switch to a two-column mobile layout so titles and actions do not collapse into narrow columns. |
| Accessible signaling | Verified | Selected, success, warning, error, completion, and disabled states retain text, symbols, borders, or labels in addition to color. |

## Contrast mismatches and corrections

| Mismatch | Responsible source | Before | Correction |
| --- | --- | --- | --- |
| Readable muted text used disabled gray on raised surfaces. | `--muted` in `src/index.css` | `#858591` on `#2a2a40`: 3.83:1 | Dark muted text uses gray-15 and light muted text uses gray-75. The minimum surface ratio is 8.21:1. Gray-45 remains available only as `--disabled`. |
| Application accent roles only contained colors intended for dark backgrounds. | Semantic accent roles in `src/index.css` | Light variants on white: 1.71:1 to 1.77:1 | Each application accent role now uses the published dark counterpart in light mode. Legacy visual tokens stay fixed for authored lesson mocks. The minimum application-surface ratio is 7.87:1 in dark mode and 7.91:1 in light mode. |
| Gold CTA color was also used as readable text. | Palette Builder status and suggestion rules | `#ffbf00` on white: 1.65:1 | Readable warning text uses yellow-light or yellow-dark. Gold remains the CTA fill only. |
| The universal blue-mid focus ring failed on light raised surfaces. | `--focus-ring` in `src/index.css` | `#198eee` on gray-10: 2.57:1 | Light mode uses blue-dark, an existing Command-line Chic token, at 7.92:1 on gray-10. Dark mode keeps blue-mid. |
| Subtle panel borders were also used to identify enabled controls. | Form controls, choice controls, theme control, Palette Builder controls | Adjacent neutral pairs: about 1.2:1 to 1.8:1 | Enabled controls use `--border-strong`. Decorative panels keep the subtle border. |
| The settings reset state used a hardcoded framework red. | `SettingsPage.module.css` | `#ef4444` | The state now uses the theme-paired danger token. |
| The not-found return link used gold as text. | `NotFoundPage.tsx` | Gold on the light page: 1.65:1 | The link now uses the theme-paired link token. |

## Verified semantic pairs

These are the lowest ratios across primary, secondary, and raised application surfaces.

| Role | Dark minimum | Light minimum |
| --- | ---: | ---: |
| Primary text | 13.97:1 | 14.61:1 |
| Secondary and muted text | 9.09:1 | 8.21:1 |
| Warning text | 8.08:1 | 8.39:1 |
| Link text | 8.08:1 | 7.92:1 |
| Success text | 7.99:1 | 8.24:1 |
| Danger text | 7.87:1 | 7.91:1 |
| Emphasis text | 8.19:1 | 7.91:1 |
| CTA text on gold | 11.76:1 | 11.76:1 |
| Focus indicator | 3.19:1 | 6.85:1 |

Disabled controls are exempt from WCAG contrast requirements. They retain explicit disabled behavior and visible text rather than relying on color alone.

## Rendered verification

The browser audit covered both color schemes for:

- Home, Palette Builder, Glossary, Review, redirects, and the not-found route.
- All 34 lesson routes.
- All six milestone routes.
- Desktop at 1280 by 900 and mobile at 320 by 700.
- The complete Unit 1 contrast repair flow, including its outer labels, instructions, unchecked status, result colors, slider labels, and action.

The route scan found no application UI text below the AAA target, no uncaught page errors, and no document-level horizontal overflow. Low-contrast text that remained in milestone mocks and the contrast repair preview was excluded by the issue scope and left unchanged.
