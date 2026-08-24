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
  setRole('success', '#14532d');
  setRole('error', '#dc2626');
  setPassingBaseRoles();
}

describe('DarkTranslatorTool', () => {
  it.each(['success', 'error'] as const)('does not complete with an invalid %s color', (role) => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole(role, '#invalid');
    setRole(role === 'success' ? 'error' : 'success', role === 'success' ? '#dc2626' : '#14532d');
    setPassingBaseRoles();

    expect(screen.getByText(`Valid ${role} color`).parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✗ invalid');
    expect(screen.queryByText(/Both themes show readable hierarchy/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('rejects duplicate success and error treatments', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole('success', '#14532d');
    setRole('error', '#14532d');
    setPassingBaseRoles();

    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✗ 1.0:1');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✗ 0°');
    expect(screen.queryByText(/Both themes show readable hierarchy/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('explains when a valid achromatic color cannot meet the hue requirement', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setRole('success', '#222222');
    setRole('error', '#14532d');
    setPassingBaseRoles();

    expect(screen.getByText('Valid success color').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Valid error color').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✗ no hue (achromatic)');
    expect(screen.queryByText(/Both themes show readable hierarchy/)).not.toBeInTheDocument();
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

    expect(screen.getByText(checkLabel).parentElement).toHaveTextContent('✗');
    expect(screen.queryByText(/Both themes show readable hierarchy/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('completes with valid, readable, and distinct semantic colors', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setPassingRoles();

    expect(screen.getByText('White / success (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('White / error (4.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error luminance (1.5:1)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Success / error hues (30°)').parentElement).toHaveTextContent('✓');
    expect(screen.getByText('Both themes show readable hierarchy. Dark mode is properly adapted, not just inverted.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('clears completion when a semantic role becomes invalid', () => {
    const onComplete = vi.fn();
    render(<DarkTranslatorTool interactive onComplete={onComplete} />);

    setPassingRoles();
    expect(screen.getByText(/Both themes show readable hierarchy/)).toBeInTheDocument();

    setRole('error', '#invalid');

    expect(screen.queryByText(/Both themes show readable hierarchy/)).not.toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
