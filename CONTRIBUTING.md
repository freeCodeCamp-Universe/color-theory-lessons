# Contributing

Thank you for contributing to Color Theory Lessons. This guide covers the
repository workflow. Read the [development standards](docs/DEVELOPMENT.md)
before changing the application, and use the
[content](docs/CONTENT_GUIDE.md) and [tool](docs/TOOL_GUIDE.md) guides when
working in those areas.

## Set up the project

1. Fork the repository and clone your fork.
2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a branch for one issue or focused change:

   ```sh
   git switch -c <type>/<short-description>
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

Set `VITE_DEV_MODE=1` when you need direct access to every lesson and
milestone. Leave it unset when checking the learner progression rules.

## Make the change

- Keep each pull request focused on one issue or related change.
- Follow the code, testing, and accessibility requirements in the
  [development standards](docs/DEVELOPMENT.md).
- Update the relevant documentation when adding or changing a lesson, tool,
  route, interaction type, or milestone challenge type.
- Use conventional commit messages, such as
  `fix: preserve lesson progress on reload` or
  `docs: explain milestone configuration`.

For learner-facing changes, verify the affected behavior against the project's
WCAG 2.2 Level AAA target. The
[accessible visual-content contract](docs/ACCESSIBLE_VISUALS.md) applies to
lesson previews, lesson tools, quiz swatches, milestone challenges, and the
Palette Builder.

## Verify the change

Run the checks that apply to the change before opening a pull request:

```sh
npm run lint
npm test
npm run test:e2e
npm run build
```

Automated checks do not replace manual verification of learner-facing
behavior. Use a browser and keyboard when changing controls, focus,
responsive presentation, contrast, motion, or visual cues. Use a screen reader
when changing accessible names, descriptions, roles, values, states, live
regions, focus movement, validation, or completion flows. Record the manual
checks and their results in the pull request.

## Open a pull request

1. Update your branch from `main` with a merge commit. Do not rebase the pull
   request branch:

   ```sh
   git fetch upstream
   git merge upstream/main
   ```

2. Resolve any conflicts, rerun the affected checks, and push your branch.
3. Open the pull request against `main` with a conventional commit title.
4. Link the issue, describe the change, and list the automated and manual
   verification you completed.
5. Keep unrelated changes out of the pull request. Report a separate problem
   in an existing issue when one covers it; otherwise, open a new issue.

Respond to review feedback with additional commits. If `main` changes while
the pull request is open, update the branch with another merge commit.

Maintainers merge accepted pull requests with squash merge.
