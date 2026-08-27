import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DarkTranslatorTool } from './DarkTranslatorTool.tsx';

afterEach(() => cleanup());

const ROLE_INDEX = {
  'page-bg': 0,
  surface: 1,
  'primary-text': 2,
  'secondary-text': 3,
  action: 4,
  success: 5,
  error: 6,
} as const;

function setRole(role: keyof typeof ROLE_INDEX, value: string) {
  fireEvent.change(screen.getAllByRole('textbox')[ROLE_INDEX[role]], { target: { value } });
}

function setPassingBaseRoles() {
  setRole('page-bg', '#0f172a');
  setRole('surface', '#1e293b');
  setRole('primary-text', '#f8fafc');
  setRole('secondary-text', '#94a3b8');
  setRole('action', '#1d4ed8');
}

function setPassingRoles() {
  setPassingBaseRoles();
  setRole('success', '#14532d');
  setRole('error', '#dc2626');
}

function checkStage() {
  fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
}

describe('DarkTranslatorTool', () => {
  it('describes invalid hex values with a visible error', () => {
    render(<DarkTranslatorTool interactive />);

    const input = screen.getByRole('textbox', {
      name: 'primary-text dark-theme hex color',
    });
    fireEvent.change(input, { target: { value: 'nope' } });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute(
      'aria-describedby',
      'dark-translator-primary-text-hex-error',
    );
    expect(screen.getByText(
      'Error: enter a 3- or 6-digit hex color for primary-text.',
    )).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '#f8fafc' } });
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByText(/hex color for primary-text/)).not.toBeInTheDocument();
  });

  it('uses theme-aware semantic roles for live check results', () => {
    render(<DarkTranslatorTool interactive />);

    setPassingBaseRoles();
    setRole('success', '#22c55e');
    setRole('error', '#dc2626');
    checkStage();

    const passingResult = screen.getByText('Valid success color')
      .parentElement?.lastElementChild as HTMLElement;
    const failingResult = screen.getByText('White / success (4.5:1)')
      .parentElement?.lastElementChild as HTMLElement;
    expect(passingResult.style.color).toBe('var(--accent-success)');
    expect(failingResult.style.color).toBe('var(--accent-danger)');
  });

  it.each(['success', 'error'] as const)('does not complete with an invalid %s color', (role) => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole(role, '#invalid');
    setRole(role === 'success' ? 'error' : 'success', role === 'success' ? '#dc2626' : '#14532d');
    setPassingBaseRoles();
    checkStage();

    expect(screen.getByText(`Valid ${role} color`).parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✗ invalid');
    expect(screen.queryByText(/passes every displayed check/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('rejects duplicate success and error treatments', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole('success', '#14532d');
    setRole('error', '#14532d');
    setPassingBaseRoles();
    checkStage();

    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✗ 1.0:1');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✗ 0°');
    expect(screen.queryByText(/passes every displayed check/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('explains when a valid achromatic color cannot meet the hue requirement', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole('success', '#222222');
    setRole('error', '#14532d');
    setPassingBaseRoles();
    checkStage();

    expect(screen.getByText('Valid success color').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Valid error color').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✗ no hue (achromatic)');
    expect(screen.queryByText(/passes every displayed check/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it.each([
    ['success', 'White / success (4.5:1)'],
    ['error', 'White / error (4.5:1)'],
  ] as const)('rejects a %s badge with failing white-label contrast', (role, checkLabel) => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole(role, '#22c55e');
    setRole(role === 'success' ? 'error' : 'success', role === 'success' ? '#dc2626' : '#14532d');
    setPassingBaseRoles();
    checkStage();

    expect(screen.getByText(checkLabel).parentElement).toHaveTextContent('✗');
    expect(screen.queryByText(/passes every displayed check/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('rejects primary text that passes against the page but fails against the surface', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole('page-bg', '#000000');
    setRole('surface', '#333333');
    setRole('primary-text', '#777777');
    setRole('secondary-text', '#ffffff');
    setRole('action', '#1d4ed8');
    setRole('success', '#14532d');
    setRole('error', '#dc2626');
    checkStage();

    expect(screen.getByText('Primary text / surface (4.5:1)').parentElement).toHaveTextContent('✗ 2.8:1');
    expect(screen.queryByText(/passes every displayed check/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('rejects secondary text below 4.5:1 against the surface', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole('page-bg', '#0f172a');
    setRole('surface', '#1e293b');
    setRole('primary-text', '#f8fafc');
    setRole('secondary-text', '#64748b');
    setRole('action', '#1d4ed8');
    setRole('success', '#14532d');
    setRole('error', '#dc2626');
    checkStage();

    expect(screen.getByText('Secondary text / surface (4.5:1)').parentElement).toHaveTextContent('✗ 3.0:1');
    expect(screen.queryByText(/passes every displayed check/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('keeps 4.5:1 text readouts consistent with their threshold results', () => {
    render(<DarkTranslatorTool interactive />);

    setRole('surface', '#ffffff');
    setRole('primary-text', '#777777');
    checkStage();
    expect(screen.getByText('Primary text / surface (4.5:1)').parentElement).toHaveTextContent('✗ 4.4:1');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    setRole('primary-text', '#767676');
    expect(screen.getByText('Primary text / surface (4.5:1)').parentElement).not.toHaveTextContent('✓');
    checkStage();
    expect(screen.getByText('Primary text / surface (4.5:1)').parentElement).toHaveTextContent('✓ 4.5:1');
  });

  it('keeps 1.5:1 semantic luminance readouts consistent with their threshold results', () => {
    render(<DarkTranslatorTool interactive />);

    setRole('success', '#ffffff');
    setRole('error', '#d3d3d3');
    checkStage();
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✗ 1.4:1');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    setRole('error', '#d2d2d2');
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).not.toHaveTextContent('✓');
    checkStage();
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✓ 1.5:1');
  });

  it('keeps 1.1:1 surface readouts consistent with their threshold results', () => {
    render(<DarkTranslatorTool interactive />);

    setRole('page-bg', '#ffffff');
    setRole('surface', '#f4f4f4');
    checkStage();
    expect(screen.getByText('Surface ≠ page-bg (1.1:1)').parentElement).toHaveTextContent('✗ 1.0:1');

    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    setRole('surface', '#f3f3f3');
    expect(screen.getByText('Surface ≠ page-bg (1.1:1)').parentElement).not.toHaveTextContent('✓');
    checkStage();
    expect(screen.getByText('Surface ≠ page-bg (1.1:1)').parentElement).toHaveTextContent('✓ 1.1:1');
  });

  it('completes with valid, readable, and distinct semantic colors', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    setPassingRoles();

    expect(screen.getByText('Primary text / surface (4.5:1)').parentElement).not.toHaveTextContent('✓');
    expect(onComplete).not.toHaveBeenCalled();
    checkStage();

    expect(screen.getByText('Primary text / surface (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Secondary text / surface (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('White / success (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('White / error (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Your dark theme passes every displayed check. Compare the preview in both modes before continuing.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('keeps a completed stage locked and reports completion once', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setPassingRoles();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));
    expect(screen.getByText(/passes every displayed check/)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').every(input => input.hasAttribute('disabled'))).toBe(true);

    setRole('error', '#invalid');

    expect(screen.getByText(/passes every displayed check/)).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
