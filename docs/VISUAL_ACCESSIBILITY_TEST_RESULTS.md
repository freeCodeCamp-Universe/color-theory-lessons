# Visual accessibility test results

Issue #107 records final verification for the visual-content work in #53. General focus, keyboard, route, landmark, zoom, and reflow findings belong in #54.

## Supported screen-reader combinations

Manual checks use these browser and screen-reader combinations:

| Screen reader | Browser | Operating system |
| --- | --- | --- |
| NVDA | Firefox | Windows 11 |
| JAWS | Chrome | Windows 11 |
| VoiceOver | Safari | macOS |
| Orca | Firefox | Ubuntu LTS |

Record the exact screen-reader and browser versions in the manual-results table. Test the lesson, challenge, quiz, milestone, review, and Palette Builder flows with the keyboard and the selected screen reader.

## Automated results

`npm test` runs `src/visual-accessibility.test.tsx`. The suite checks a static informative visual, decorative treatment, an answer-safe quiz swatch, a live tool announcement, a stage transition, a milestone preview, a chart data alternative, and a Palette Builder contrast row. General route and state scans run separately in `npm run test:e2e` through `e2e/accessibility-scan.spec.ts`.

## Manual assistive-technology results

| Screen reader and version | Browser and version | Operating system | Flow | Outcome | Unresolved finding |
| --- | --- | --- | --- | --- | --- |
| Not run in this environment | Not run in this environment | Linux CI container | Lesson, challenge, quiz, milestone, review, Palette Builder | Manual screen-reader output is not available in CI. | #53 |

The unresolved manual verification remains under #53 until a tester records the selected screen reader, browser, operating-system versions, flow, and observed result. Do not treat automated results as a substitute for those checks.
