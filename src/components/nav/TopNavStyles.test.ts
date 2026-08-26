/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/components/nav/TopNav.module.css', 'utf8');

describe('TopNav responsive styles', () => {
  it('switches to the menu before the desktop links can clip', () => {
    expect(css).toContain('@media (max-width: 700px)');
    expect(css).not.toContain('@media (max-width: 500px)');
  });
});
