import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AuditFlowTool } from './AuditFlowTool.tsx';
import { ComponentCheckerTool } from './ComponentCheckerTool.tsx';
import { InclusiveReviewTool } from './InclusiveReviewTool.tsx';
import { PatternRepairTool } from './PatternRepairTool.tsx';
import { StateWorkshopTool } from './StateWorkshopTool.tsx';
import { TextContrastLabTool } from './TextContrastLabTool.tsx';

afterEach(() => cleanup());

describe('Unit 5 visual equivalents', () => {
  it('provides descriptions for every visual Unit 5 tool without exposing assessment answers', () => {
    render(<TextContrastLabTool interactive />);
    expect(screen.getByText(/Body copy preview/)).toHaveClass('sr-only');
    expect(screen.getByRole('textbox', { name: 'Text color hex' })).toHaveAttribute('aria-describedby', 'text-contrast-body-copy-description');
    cleanup();

    render(<ComponentCheckerTool interactive />);
    expect(screen.getByText(/Input border preview/)).toHaveClass('sr-only');
    expect(screen.getByRole('textbox', { name: 'Input border hex color' })).toHaveAttribute('aria-describedby', 'component-input-border-description');
    cleanup();

    render(<StateWorkshopTool interactive />);
    expect(screen.getByText(/Success state preview/)).toHaveClass('sr-only');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Icon (✓)' }));
    expect(screen.getByText('Success icon cue applied.')).toHaveAttribute('role', 'status');
    cleanup();

    render(<PatternRepairTool interactive />);
    expect(screen.getByText(/Before: a form has an Email address field/)).toHaveClass('sr-only');
    cleanup();

    render(<AuditFlowTool interactive />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Text content' }));
    expect(screen.getByText('Text content selected.')).toHaveAttribute('role', 'status');
    cleanup();

    render(<InclusiveReviewTool interactive />);
    expect(screen.getByText(/A dark blue #1E3A5F navigation bar/)).toHaveClass('sr-only');
    fireEvent.click(screen.getByRole('button', { name: 'Deuteranopia' }));
    expect(screen.getByText(/Deuteranopia simulation selected/)).toHaveAttribute('role', 'status');
  });
});
