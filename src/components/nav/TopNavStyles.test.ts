/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/nav/TopNav.module.css', 'utf8');

describe('TopNav responsive styles', () => {
  it('uses proportional neutral text for the course home link', () => {
    expect(css).toMatch(
      /\.logo\s*{[^}]*font-family:\s*var\(--font-sans\)[^}]*color:\s*var\(--primary-foreground\)/s,
    );
  });

  it('switches to the menu before the desktop links can clip', () => {
    expect(css).toContain('@media (max-width: 700px)');
    expect(css).not.toContain('@media (max-width: 500px)');
  });

  it('uses proportional type for the mobile menu control', () => {
    expect(css).toMatch(
      /\.menuButton\s*{[^}]*font-family:\s*var\(--font-sans\)/s,
    );
  });
});
