import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contrastRatioWcag, hexToRgb } from '../../utils/color.ts';
import { SystemStressTestTool } from './SystemStressTestTool.tsx';

afterEach(() => cleanup());

const ANSWERS = [
  ['Low-contrast placeholder', 'Token override'],
  ['Dark action loses contrast', 'Missing role'],
  ['Chart series reuse semantic colors', 'Role drift'],
  ['Alerts rely on color alone', 'Missing role'],
] as const;

function markAllFindings() {
  for (const [finding] of ANSWERS) {
    fireEvent.click(screen.getByRole('checkbox', { name: `Mark “${finding}” as a weakness` }));
  }
}

function classify(finding: string, classification: string) {
  fireEvent.change(screen.getByRole('combobox', { name: `Classification for ${finding}` }), {
    target: { value: classification.toLowerCase().replace(' ', '-') },
  });
}

describe('SystemStressTestTool', () => {
  it('provides observable previews for all five contexts', () => {
    render(<SystemStressTestTool interactive />);

    expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    expect(screen.getByText('Placeholder color: #aaa')).toHaveStyle({ color: '#aaa' });

    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    expect(screen.getByText(/keeps its light-mode color/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Chart view' }));
    expect(screen.getByLabelText('Chart with two color-only series')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Alert stack' }));
    expect(screen.getByLabelText('Color-only alert stack')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'CVD simulation' }));
    expect(screen.getByLabelText('Chart under deuteranopia simulation')).toBeInTheDocument();
    expect(screen.getByLabelText('Alerts under deuteranopia simulation')).toBeInTheDocument();
  });

  it('keeps the required contrast examples active', () => {
    render(<SystemStressTestTool interactive />);

    expect(screen.getByPlaceholderText('Search by name')).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    const action = screen.getByRole('button', { name: 'Save changes' });
    expect(action).not.toBeDisabled();
    expect(action).toHaveStyle({ background: 'transparent', color: '#1e40af' });
    expect(action).toHaveTextContent('');
    expect(action.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(action.parentElement).toHaveStyle({ background: '#1e293b' });
    expect(contrastRatioWcag(hexToRgb('#1e40af'), hexToRgb('#1e293b'))).toBeLessThan(3);
  });

  it('reports incomplete findings without completing', () => {
    const onComplete = vi.fn();
    render(<SystemStressTestTool interactive onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark “Low-contrast placeholder” as a weakness' }));
    classify('Low-contrast placeholder', 'Token override');
    fireEvent.click(screen.getByRole('button', { name: 'Check findings' }));

    expect(screen.getByText('Complete every finding and classification. 3 remaining.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('explains incorrect classifications without completing', () => {
    const onComplete = vi.fn();
    render(<SystemStressTestTool interactive onComplete={onComplete} />);
    markAllFindings();

    for (const [finding] of ANSWERS) classify(finding, 'Token override');
    fireEvent.click(screen.getByRole('button', { name: 'Check findings' }));

    expect(screen.getByText('3 classifications are incorrect. Review the feedback and try again.')).toBeInTheDocument();
    expect(screen.getByText(/no dark-mode action role/)).toBeInTheDocument();
    expect(screen.getByText(/drifted into data-series meanings/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('completes only when every finding has the correct classification', () => {
    const onComplete = vi.fn();
    render(<SystemStressTestTool interactive onComplete={onComplete} />);
    markAllFindings();

    for (const [finding, classification] of ANSWERS) classify(finding, classification);
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Check findings' }));

    expect(screen.getByText('Stress test complete. You found and classified all four system weaknesses.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Check findings' })).not.toBeInTheDocument();
  });
});
