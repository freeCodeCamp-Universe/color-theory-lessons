import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColorSpaceLabTool } from './ColorSpaceLabTool.tsx';
import { DISPLAY_P3_SAMPLES, isDisplayP3OutsideSrgb } from './color-space-lab-data.ts';

afterEach(cleanup);

const SORT_ANSWERS = [
  ['#0B57D0', 'value'],
  ['--color-text-primary', 'role'],
  ['wide-gamut display', 'context'],
  ['chart bar fill', 'context'],
  ['rgb(34, 34, 34)', 'value'],
  ['--color-success-bg', 'role'],
  ['SVG icon fill', 'context'],
  ['#22c55e', 'value'],
  ['--color-border', 'role'],
] as const;

function answerSortChallenge() {
  SORT_ANSWERS.forEach(([label, answer]) => {
    fireEvent.change(screen.getByRole('combobox', { name: `Category for ${label}` }), {
      target: { value: answer },
    });
  });
}

function answerGamutChallenge() {
  DISPLAY_P3_SAMPLES.forEach((sample) => {
    fireEvent.change(screen.getByRole('combobox', { name: `Gamut mapping for ${sample.label}` }), {
      target: { value: isDisplayP3OutsideSrgb(sample.p3Channels) ? 'maps' : 'within' },
    });
  });
}

describe('ColorSpaceLabTool samples', () => {
  it('defines a Display P3 value and an sRGB fallback for every sample', () => {
    expect(DISPLAY_P3_SAMPLES).toHaveLength(5);

    DISPLAY_P3_SAMPLES.forEach((sample) => {
      expect(sample.p3).toMatch(/^color\(display-p3 (?:0|1|0\.\d+)(?: (?:0|1|0\.\d+)){2}\)$/);
      expect(sample.srgbFallback).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  it('classifies samples from their Display P3 channels', () => {
    const classifications = Object.fromEntries(
      DISPLAY_P3_SAMPLES.map((sample) => [sample.id, isDisplayP3OutsideSrgb(sample.p3Channels)]),
    );

    expect(classifications).toEqual({
      'vivid-orange': true,
      'bright-green': true,
      'deep-pink': true,
      'soft-blue': false,
      'muted-coral': false,
    });
  });

  it('renders the P3 value without a saturation filter and explains matching previews', () => {
    render(<ColorSpaceLabTool interactive />);

    const p3Preview = screen.getByTestId('display-p3-preview');
    expect(p3Preview.style.getPropertyValue('--p3-color')).toBe('color(display-p3 1 0.25 0)');
    expect(p3Preview.style.getPropertyValue('--srgb-fallback')).toBe('#FF1B00');
    expect(p3Preview.style.filter).toBe('');
    expect(screen.getByText(/may render these panels alike/)).toBeInTheDocument();
    expect(screen.getByText(/Outside sRGB: this sample needs gamut mapping/)).toBeInTheDocument();
  });
});

describe('ColorSpaceLabTool challenge', () => {
  it('does not complete after classification without gamut decisions', () => {
    const onComplete = vi.fn();
    render(<ColorSpaceLabTool interactive onComplete={onComplete} />);

    answerSortChallenge();
    fireEvent.click(screen.getByRole('button', { name: 'check challenge' }));

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByText('Correct classifications: 9/9. Correct gamut decisions: 0/5.')).toBeInTheDocument();
  });

  it('does not complete after gamut decisions without classification', () => {
    const onComplete = vi.fn();
    render(<ColorSpaceLabTool interactive onComplete={onComplete} />);

    answerGamutChallenge();
    fireEvent.click(screen.getByRole('button', { name: 'check challenge' }));

    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByText('Correct classifications: 0/9. Correct gamut decisions: 5/5.')).toBeInTheDocument();
  });

  it('completes after both tasks are correct', () => {
    const onComplete = vi.fn();
    render(<ColorSpaceLabTool interactive onComplete={onComplete} />);

    answerSortChallenge();
    answerGamutChallenge();
    fireEvent.click(screen.getByRole('button', { name: 'check challenge' }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText(/Both tasks are correct/)).toBeInTheDocument();
  });
});
