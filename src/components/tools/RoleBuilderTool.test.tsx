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

function setPassingRoles() {
  setRole('page-bg', '#c4cbd4');
  setRole('surface', '#ffffff');
  setRole('primary-text', '#101827');
  setRole('secondary-text', '#4b5563');
  setRole('action', '#1e40af');
  setRole('success', '#052e16');
  setRole('warning', '#facc15');
  setRole('error', '#991b1b');
}

describe('RoleBuilderTool', () => {
  it('describes invalid hex values with a visible error', () => {
    render(<RoleBuilderTool interactive />);

    const input = screen.getByRole('textbox', { name: 'primary-text hex color' });
    fireEvent.change(input, { target: { value: 'nope' } });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute(
      'aria-describedby',
      'role-builder-primary-text-hex-error',
    );
    expect(screen.getByText(
      'Error: enter a 3- or 6-digit hex color for primary-text.',
    )).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '#101827' } });
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByText(/hex color for primary-text/)).not.toBeInTheDocument();
  });

  it('starts with failed checks and does not complete after one passing edit', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    expect(screen.getByText('Stage 1 of 1')).toBeInTheDocument();
    expect(screen.getByText('Secondary text / surface').parentElement).not.toHaveTextContent('✗');

    setRole('primary-text', '#101827');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Secondary text / surface').parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Page / surface ≥ 1.5:1').parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Status luminance ≥ 1.5:1').parentElement).toHaveTextContent('✗');

    expect(screen.queryByText(/All color-role checks pass/)).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('uses the theme-aware danger role for failed validation text', () => {
    render(<RoleBuilderTool interactive />);

    setRole('primary-text', '#101827');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    const result = screen.getByText('Secondary text / surface')
      .parentElement?.lastElementChild as HTMLElement;
    expect(result.style.color).toBe('var(--accent-danger)');
  });

  it('checks primary text against the card surface', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('primary-text', '#777777');
    setRole('page-bg', '#000000');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Primary text / surface').parentElement).toHaveTextContent('✗ 4.48:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete with an invalid success color', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('success', '#invalid');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Valid role colors').parentElement).toHaveTextContent('✗');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete when two status colors match', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('success', '#facc15');
    setRole('warning', '#facc15');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Status hues ≥ 30° apart').parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Status luminance ≥ 1.5:1').parentElement).toHaveTextContent('✗ 1.00:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not treat an achromatic status color as having a distinct hue', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('success', '#000000');
    setRole('error', '#0000ff');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Status hues ≥ 30° apart').parentElement).toHaveTextContent('✗');
    expect(screen.getByText('Status luminance ≥ 1.5:1').parentElement).toHaveTextContent('✓ 2.44:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('does not complete when the page and card surface match', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('page-bg', '#ffffff');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Page / surface ≥ 1.5:1').parentElement).toHaveTextContent('✗ 1.00:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('requires AAA contrast for action and status text', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setRole('action', '#777777');
    setRole('success', '#777777');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Action text AAA').parentElement).toHaveTextContent('✗ 4.69:1');
    expect(screen.getByText('Success text AAA').parentElement).toHaveTextContent('✗ 4.69:1');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('completes with valid, readable, and distinct semantic colors', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setPassingRoles();

    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('All color-role checks pass. The preview keeps labels and icons so meaning never depends on color alone.')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('allows a failed stage to be retried and completes once', () => {
    const onComplete = vi.fn();
    render(<RoleBuilderTool interactive onComplete={onComplete} />);

    setPassingRoles();
    setRole('success', '#invalid');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText(/One or more role checks still fail/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'try stage again' }));
    setRole('success', '#052e16');
    fireEvent.click(screen.getByRole('button', { name: 'check stage' }));

    expect(screen.getByText('Valid role colors').parentElement).toHaveTextContent('✓');
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
