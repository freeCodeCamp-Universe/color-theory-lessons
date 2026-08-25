import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdditiveSortTool } from './AdditiveSortTool.tsx';
import { BackgroundShiftTool } from './BackgroundShiftTool.tsx';
import { LogicFixerTool } from './LogicFixerTool.tsx';
import { MismatchExplainerTool } from './MismatchExplainerTool.tsx';
import { RGBMixerTool } from './RGBMixerTool.tsx';

afterEach(() => cleanup());

describe('Unit 2 exercise stages', () => {
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
