import axe from 'axe-core';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { AppProvider } from './state/app-provider.tsx';
import { AXE_CONTRAST_RULES, formatAccessibilityViolations } from './accessibility-test-config.ts';
import { LessonPlayer } from './components/lesson/LessonPlayer.tsx';
import StepPanelRenderer from './components/lesson/StepPanelRenderer.tsx';
import { InterfaceMockup } from './components/milestone/InterfaceMockup.tsx';
import { ChartTunerTool } from './components/tools/ChartTunerTool.tsx';
import { ExerciseStage } from './components/tools/ExerciseStage.tsx';
import { ThemeSandboxTool } from './components/tools/ThemeSandboxTool.tsx';
import { useExerciseStages } from './components/tools/useExerciseStages.ts';
import { PaletteBuilderPage } from './pages/PaletteBuilderPage.tsx';
import { getLessonQuizSignature } from './lessons/quiz-utils.ts';
import { lesson1_2 } from './lessons/unit-1/lesson-1-2.ts';
import { HSL_DIMENSION_PREVIEWS } from './lessons/preview-accessibility.ts';
import type { StepPanelConfig } from './types/lesson.ts';

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

async function expectNoComponentAxeViolations() {
  const results = await axe.run(document.body, {
    rules: Object.fromEntries(
      [...AXE_CONTRAST_RULES, 'region'].map((rule) => [rule, { enabled: false }]),
    ),
  });

  expect(formatAccessibilityViolations(results.violations)).toEqual([]);
}

function StageTransitionCheck() {
  const controller = useExerciseStages({
    stages: [
      { id: 'first', title: 'First stage', instruction: 'Complete the first stage.', nextActionLabel: 'continue' },
      { id: 'second', title: 'Second stage', instruction: 'Complete the second stage.' },
    ],
  });

  return (
    <ExerciseStage controller={controller} passedFeedback="First stage passed.">
      {controller.result === 'idle' && <button onClick={controller.markPassed}>pass stage</button>}
    </ExerciseStage>
  );
}

function renderQuiz() {
  sessionStorage.setItem('color-theory-course-lesson-session:u1-l2', JSON.stringify({
    version: 2,
    phase: 'quiz',
    stepIndex: lesson1_2.steps.length - 1,
    challengeDone: true,
    quizIndex: 0,
    answers: [],
    selectedChoice: null,
    submitted: false,
    quizSignature: getLessonQuizSignature(lesson1_2),
  }));

  return render(
    <MemoryRouter>
      <AppProvider>
        <LessonPlayer lesson={lesson1_2} />
      </AppProvider>
    </MemoryRouter>,
  );
}

describe('visual accessibility verification', () => {
  it('keeps informative and decorative visual treatments distinct', async () => {
    const informativePanel: StepPanelConfig = {
      type: 'hsl-slider-preview',
      dimension: 'h',
      accessibility: HSL_DIMENSION_PREVIEWS.h,
    };
    const decorativePanel: StepPanelConfig = {
      type: 'hsl-slider-preview',
      dimension: 'h',
      accessibility: { classification: 'decorative' },
    };
    const informative = render(<StepPanelRenderer panel={informativePanel} />);

    expect(screen.getByRole('group', { name: 'Hue adjustment preview' }))
      .toHaveAccessibleDescription(
        'Hue is the active control. Moving it changes the color family while Saturation stays at 70% and Lightness stays at 55%.'
      );
    await expectNoComponentAxeViolations();

    informative.unmount();
    const decorative = render(<StepPanelRenderer panel={decorativePanel} />);
    expect(decorative.container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    await expectNoComponentAxeViolations();
  });

  it('keeps quiz swatches answer-safe while exposing their visible values', async () => {
    renderQuiz();

    const swatch = screen.getByRole('img', { name: 'vivid red' });
    expect(swatch).toHaveAccessibleDescription(
      'A vivid, strongly saturated red swatch. Color value: #E53935.',
    );
    expect(swatch).not.toHaveAccessibleDescription(/saturation changes the most/i);
    await expectNoComponentAxeViolations();
  });

  it('announces a live tool result after the displayed theme changes', async () => {
    render(<ThemeSandboxTool interactive />);

    fireEvent.change(screen.getByLabelText('Background'), {
      target: { value: '#000000' },
    });

    expect(screen.getAllByRole('status')[0]).toHaveTextContent(
      'Theme preview. Background #000000; surface #252542;',
    );
    await expectNoComponentAxeViolations();
  });

  it('announces and focuses the next exercise stage after a transition', async () => {
    render(<StageTransitionCheck />);

    fireEvent.click(screen.getByRole('button', { name: 'pass stage' }));
    expect(screen.getByRole('status')).toHaveTextContent('First stage passed.');
    fireEvent.click(screen.getByRole('button', { name: 'continue' }));

    const heading = screen.getByRole('heading', { name: 'Second stage' });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(heading).toHaveAccessibleDescription('Stage 2 of 2 Complete the second stage.');
    await expectNoComponentAxeViolations();
  });

  it('exposes the chart visual and its data alternative', async () => {
    render(<ChartTunerTool interactive />);

    expect(screen.getByRole('img', { name: 'Grouped bar chart data' }))
      .toHaveAccessibleDescription(/Revenue: Jan 80, Feb 65, Mar 90, Apr 72, May 88/);
    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia simulation' }));
    expect(screen.getAllByRole('status')[0]).toHaveTextContent('Deuteranopia simulation selected.');
    await expectNoComponentAxeViolations();
  });

  it('keeps the milestone preview connected to its visual equivalent', async () => {
    render(<InterfaceMockup />);

    expect(screen.getByText('interface mockup').closest('[data-authored-visual]'))
      .toHaveAccessibleDescription(/The navigation header is saturated blue, #1E40AF/);
    await expectNoComponentAxeViolations();
  });

  it('keeps each Palette Builder contrast row readable without its decorative swatches', async () => {
    const user = userEvent.setup();
    render(<PaletteBuilderPage />);

    const input = screen.getByRole('textbox', { name: 'Hex color value' });
    await user.clear(input);
    await user.type(input, '#000000');
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: '+ add color' }));
    await user.click(screen.getByRole('button', { name: 'Edit custom 1 — #808080' }));
    const editInput = screen.getAllByRole('textbox', { name: 'Hex color value' })[1];
    await user.clear(editInput);
    await user.type(editInput, '#ffffff');
    await user.keyboard('{Enter}');

    const row = screen.getByText(/foreground primary #000000 on background custom 1 #FFFFFF/i)
      .closest('[class*="matrixCell"]');
    expect(row).toBeInTheDocument();
    expect(row).toHaveTextContent('text size: 18px');
    expect(row?.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
    await expectNoComponentAxeViolations();
  });
});
