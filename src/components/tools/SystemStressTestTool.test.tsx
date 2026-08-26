import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { contrastRatioWcag, hexToRgb } from '../../utils/color.ts';
import { SystemStressTestTool } from './SystemStressTestTool.tsx';

afterEach(cleanup);

const ANSWERS = [
  ['Low-contrast placeholder', 'Token override'],
  ['Warning has no semantic role', 'Missing role'],
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

function advanceToClassifications() {
  markAllFindings();
  fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
  fireEvent.click(screen.getByRole('button', { name: 'classify the findings' }));
}

describe('SystemStressTestTool', () => {
  it('provides observable previews for all five contexts', () => {
    render(<SystemStressTestTool interactive />);

    expect(screen.getByText('Search by name')).toBeInTheDocument();
    expect(screen.getByText('Placeholder color: #aaa')).toHaveStyle({ color: '#aaa' });

    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    expect(screen.getByText('Recent account activity')).toHaveStyle({ color: '#f1f5f9' });
    expect(screen.getByText('Payment method expires soon')).toHaveStyle({ color: '#f1f5f9' });
    expect(screen.getByText(/no warning role is defined/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Chart view' }));
    expect(screen.getByLabelText('Chart with two color-only series')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Alert stack' }));
    expect(screen.getByLabelText('Color-only alert stack')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Color vision deficiency simulation' }));
    expect(screen.getByLabelText('Chart under deuteranopia simulation')).toBeInTheDocument();
    expect(screen.getByLabelText('Alerts under deuteranopia simulation')).toBeInTheDocument();
  });

  it('presents the required contrast evidence without editable preview controls', () => {
    render(<SystemStressTestTool interactive />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(contrastRatioWcag(hexToRgb('#aaaaaa'), hexToRgb('#ffffff'))).toBeLessThan(4.5);
    const action = screen.getByRole('img', { name: 'Save changes action preview' });
    expect(action).toHaveStyle({ background: 'transparent', color: '#1e40af' });

    fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument();
    expect(action).toHaveStyle({ background: 'transparent', color: '#60a5fa' });
    expect(action.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(contrastRatioWcag(hexToRgb('#60a5fa'), hexToRgb('#1e293b'))).toBeGreaterThanOrEqual(3);
  });

  it('hides classifications until every finding passes the first stage', () => {
    const onComplete = vi.fn();
    render(<SystemStressTestTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /Classification for/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark “Low-contrast placeholder” as a weakness' }));
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Find every weakness before continuing. 3 remaining.')).toBeInTheDocument();
    expect(screen.queryByText('Stage 2 of 2')).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('retries incorrect classifications within the second stage', () => {
    const onComplete = vi.fn();
    render(<SystemStressTestTool interactive onComplete={onComplete} />);
    advanceToClassifications();

    expect(screen.getByText('Stage 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Classify the findings' })).toHaveFocus();
    expect(screen.queryByRole('checkbox', { name: /Mark/ })).not.toBeInTheDocument();
    for (const [finding] of ANSWERS) classify(finding, 'Token override');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('3 classifications are incorrect. Review the feedback and try again.')).toBeInTheDocument();
    expect(screen.getByText(/drifted into data-series meanings/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    expect(screen.getByRole('combobox', { name: 'Classification for Low-contrast placeholder' })).toHaveValue('token-override');
  });

  it('completes once after both stages pass', () => {
    const onComplete = vi.fn();
    const onStageChange = vi.fn();
    render(<SystemStressTestTool interactive onComplete={onComplete} onStageChange={onStageChange} />);
    advanceToClassifications();

    for (const [finding, classification] of ANSWERS) classify(finding, classification);
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Stress test complete. You found and classified all four system weaknesses.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onStageChange.mock.calls.map(([stage]) => stage.id)).toEqual([
      'find-system-weaknesses',
      'classify-system-weaknesses',
    ]);
  });
});
