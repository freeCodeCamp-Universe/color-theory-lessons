import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RoleBuilderTool } from './RoleBuilderTool.tsx';

afterEach(() => cleanup());

const ROLE_INDEX = {
  'page-bg': 0,
  surface: 1,
  'primary-text': 2,
  'secondary-text': 3,
  action: 4,
  success: 5,
  warning: 6,
  error: 7,
} as const;

function setRole(role: keyof typeof ROLE_INDEX, value: string) {
  fireEvent.change(screen.getAllByRole('textbox')[ROLE_INDEX[role]], { target: { value } });
}

describe('RoleBuilderTool', () => {
  it('checks primary text against the card surface', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('primary-text', '#777777');
    setRole('page-bg', '#000000');

    expect(screen.getByText('Primary text / surface').parentElement).toHaveTextContent('✗ 4.48:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete with an invalid success color', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('success', '#invalid');

    expect(screen.getByText('Valid role colors').parentElement).toHaveTextContent('✗');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete when two status colors match', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('success', '#facc15');

    expect(screen.getByText('Status hues ≥ 30° apart').parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Status luminance ≥ 1.5:1').parentElement).toHaveTextContent('✗ 1.00:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not treat an achromatic status color as having a distinct hue', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('success', '#000000');
    setRole('error', '#0000ff');

    expect(screen.getByText('Status hues ≥ 30° apart').parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Status luminance ≥ 1.5:1').parentElement).toHaveTextContent('✓ 2.44:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete when the page and card surface match', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('page-bg', '#ffffff');

    expect(screen.getByText('Page / surface ≥ 1.5:1').parentElement).toHaveTextContent('✗ 1.00:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('requires AAA contrast for action and status text', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('action', '#777777');
    setRole('success', '#777777');

    expect(screen.getByText('Action text AAA').parentElement).toHaveTextContent('✗ 4.69:1');
    expect(screen.getByText('Success text AAA').parentElement).toHaveTextContent('✗ 4.69:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('completes with valid, readable, and distinct semantic colors', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('primary-text', '#101827');

    expect(screen.getByText('All color-role checks pass. The preview keeps labels and icons so meaning never depends on color alone.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('clears completion when a passing configuration becomes invalid', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('primary-text', '#101827');
    expect(screen.getByText(/All color-role checks pass/)).toBeInTheDocument();

    setRole('success', '#invalid');
    expect(screen.queryByText(/All color-role checks pass/)).not.toBeInTheDocument();
    expect(screen.getByText('Valid role colors').parentElement).toHaveTextContent('✗');
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
