import { useState } from 'react';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChallengeHints } from '../lesson/ChallengeHints.tsx';
import { lesson2_2 } from '../../lessons/unit-2/lesson-2-2.ts';
import { AdditiveSortTool } from './AdditiveSortTool.tsx';
import { BackgroundShiftTool } from './BackgroundShiftTool.tsx';
import { LogicFixerTool } from './LogicFixerTool.tsx';
import { MismatchExplainerTool } from './MismatchExplainerTool.tsx';
import { RGBMixerTool } from './RGBMixerTool.tsx';

afterEach(() => cleanup());

function RGBMixerWithHints() {
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  return (
    <>
      <span data-testid="active-stage">{activeStageId}</span>
      <ChallengeHints
        hints={lesson2_2.challenge?.hints ?? []}
        activeStageId={activeStageId}
        resetKey="u2-l2:0"
      />
      <RGBMixerTool onStageChange={(stage) => setActiveStageId(stage.id)} />
    </>
  );
}

describe('Unit 2 exercise stages', () => {
  it('provides screen-reader equivalents for the five Unit 2 tool visuals', () => {
    render(<AdditiveSortTool />);
    expect(screen.getByText(/Red, green, and blue light overlap/)).toBeInTheDocument();
    expect(screen.getByText(/Cyan, magenta, and yellow pigments overlap/)).toBeInTheDocument();
    cleanup();

    render(<RGBMixerTool />);
    expect(screen.getByText(/vivid pink with a warm red cast/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /warm pink accent target color/i })).toHaveAccessibleDescription(/vivid pink/i);
    cleanup();

    render(<LogicFixerTool />);
    expect(screen.getByText(/Paint uses pigments that absorb and reflect light/)).toBeInTheDocument();
    cleanup();

    render(<MismatchExplainerTool />);
    expect(screen.getByText(/screen swatch is #1a5fe8/i)).toBeInTheDocument();
    cleanup();

    render(<BackgroundShiftTool />);
    expect(screen.getByText(/Zoomed out. One blue swatch represents/)).toBeInTheDocument();
    expect(screen.getByText(/same vivid blue accent, #3b82f6/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'zoom in' }));
    expect(screen.getByText('Pixel explorer zoomed in to RGB subpixels.')).toHaveAttribute('role', 'status');
    const correctChoice = screen.getByRole('button', { name: /accent has greater luminance contrast/i });
    fireEvent.click(correctChoice);
    expect(correctChoice).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps the additive and subtractive sort as one retryable stage', () => {
    const onComplete = vi.fn();
    render(<AdditiveSortTool onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    for (const label of ['Phone screen', 'Watercolor painting', 'LED billboard', 'Oil painting', 'Printed magazine', 'Laptop display', 'Printed flyer', 'Projector beam']) {
      fireEvent.click(within(screen.getByText(label).parentElement as HTMLElement).getByRole('button', { name: 'subtractive' }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    for (const label of ['Phone screen', 'Watercolor painting', 'LED billboard', 'Oil painting', 'Printed magazine', 'Laptop display', 'Printed flyer', 'Projector beam']) {
      expect(within(screen.getByText(label).parentElement as HTMLElement).getByRole('button', { name: 'subtractive' })).toHaveAttribute('aria-pressed', 'true');
    }

    const answers = {
      'Phone screen': 'additive', 'Watercolor painting': 'subtractive', 'LED billboard': 'additive',
      'Oil painting': 'subtractive', 'Printed magazine': 'subtractive', 'Laptop display': 'additive',
      'Printed flyer': 'subtractive', 'Projector beam': 'additive',
    } as const;
    for (const [label, answer] of Object.entries(answers)) {
      fireEvent.click(within(screen.getByText(label).parentElement as HTMLElement).getByRole('button', { name: answer }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'check answers' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('requires prediction before matching each RGB target and advances only on command', () => {
    const onComplete = vi.fn();
    render(<RGBMixerTool onComplete={onComplete} />);

    const targets = [
      { prediction: 'Red high, blue in the middle, green low', rgb: [220, 45, 110] },
      { prediction: 'Blue high, green in the middle, red low', rgb: [155, 195, 230] },
      { prediction: 'Red, green, and blue close to equal', rgb: [115, 115, 122] },
      { prediction: 'Red and green high, blue low', rgb: [240, 195, 10] },
      { prediction: 'Blue high, green in the middle, red low', rgb: [18, 28, 72] },
    ] as const;

    expect(screen.getByText('Stage 1 of 10')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Red, green, and blue close to equal' }));
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    expect(screen.getByRole('button', { name: 'try stage again' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    targets.forEach(({ prediction, rgb }, index) => {
      fireEvent.click(screen.getByRole('button', { name: prediction }));
      fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'mix this target →' }));

      for (const [channel, value] of [['Red', rgb[0]], ['Green', rgb[1]], ['Blue', rgb[2]]] as const) {
        fireEvent.change(screen.getByRole('slider', { name: channel }), { target: { value } });
      }
      fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
      if (index < targets.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: 'next target →' }));
      }
    });

    expect(screen.getByText('Stage 10 of 10')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('offers only the hint for the active RGB stage', async () => {
    render(<RGBMixerWithHints />);

    await waitFor(() => expect(screen.getByTestId('active-stage')).toHaveTextContent('predict-warm-pink'));
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText('Warm pink needs the most red, some blue, and less green.')).toBeInTheDocument();
    expect(screen.queryByText('For pale sky blue, keep blue highest, green next, and red lowest.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'show next hint' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Red high, blue in the middle, green low' }));
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    fireEvent.click(screen.getByRole('button', { name: 'mix this target →' }));

    await waitFor(() => expect(screen.getByTestId('active-stage')).toHaveTextContent('match-warm-pink'));
    expect(screen.queryByText('Warm pink needs the most red, some blue, and less green.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText('Warm pink needs the most red, some blue, and less green.')).toBeInTheDocument();

    for (const [channel, value] of [['Red', 220], ['Green', 45], ['Blue', 110]] as const) {
      fireEvent.change(screen.getByRole('slider', { name: channel }), { target: { value } });
    }
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    fireEvent.click(screen.getByRole('button', { name: 'next target →' }));

    await waitFor(() => expect(screen.getByTestId('active-stage')).toHaveTextContent('predict-pale-sky-blue'));
    fireEvent.click(screen.getByRole('button', { name: 'show hint' }));
    expect(screen.getByText('For pale sky blue, keep blue highest, green next, and red lowest.')).toBeInTheDocument();
    expect(screen.queryByText('Warm pink needs the most red, some blue, and less green.')).not.toBeInTheDocument();
  });

  it('keeps logic scenarios on their current stage after a failed retry', () => {
    const onComplete = vi.fn();
    render(<LogicFixerTool onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: 'I’ll raise the R, G, and B values until the color looks darker.' }));
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    const correctAnswers = [
      'I’ll reduce the R, G, and B values so the display outputs less light for this color.',
      'With blue off, full-intensity red and green light produce yellow, not brown.',
      'Raising all three channel values adds light and moves the color toward white.',
    ];
    correctAnswers.forEach((answer, index) => {
      fireEvent.click(screen.getByRole('button', { name: answer }));
      fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
      if (index < correctAnswers.length - 1) fireEvent.click(screen.getByRole('button', { name: 'next stage →' }));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('requires every correct mismatch factor before advancing', () => {
    const onComplete = vi.fn();
    render(<MismatchExplainerTool onComplete={onComplete} />);

    const stageAnswers = [
      [
        'The screen emits light, while the printed ink reflects light from the surroundings.',
        'The brochure’s printer, inks, and paper may have a gamut that does not include the screen blue.',
      ],
      [
        'Paint pigments absorb and reflect incoming light, while phone screens emit light from RGB subpixels.',
        'The wall surface and finish affect how ambient light reflects off the color.',
      ],
      [
        'A print gamut that does not include the orange used in the app.',
        'The screen creates orange with emitted RGB light, while the printed inks absorb and reflect incoming light.',
      ],
    ];

    fireEvent.click(screen.getByRole('button', { name: stageAnswers[0][0] }));
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    stageAnswers.forEach((answers, index) => {
      for (const answer of index === 0 ? answers.slice(1) : answers) {
        fireEvent.click(screen.getByRole('button', { name: answer }));
      }
      fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
      if (index < stageAnswers.length - 1) fireEvent.click(screen.getByRole('button', { name: 'next stage →' }));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('advances background comparisons only after the learner passes a stage', () => {
    const onComplete = vi.fn();
    render(<BackgroundShiftTool onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /light background amplifies the accent/i }));
    fireEvent.click(screen.getByRole('button', { name: 'check' }));
    expect(screen.getByText('Stage 1 of 3')).toBeInTheDocument();
    expect(screen.getAllByText(/displayed background does not reflect the accent/i)).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));

    const answers = [
      /accent has greater luminance contrast against the dark background/i,
      /orange has greater luminance contrast against the near-black background/i,
      /green has greater luminance contrast against the dark background/i,
    ];
    answers.forEach((answer, index) => {
      fireEvent.click(screen.getByRole('button', { name: answer }));
      fireEvent.click(screen.getByRole('button', { name: 'check' }));
      if (index < answers.length - 1) fireEvent.click(screen.getByRole('button', { name: 'next stage →' }));
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
