/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const html = readFileSync('index.html', 'utf8');

function readPrepaintScript(): string {
  const matched = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
  if (!matched) throw new Error('Expected an inline theme prepaint script');
  return matched;
}

const script = readPrepaintScript();

function runPrepaint(stored: unknown, systemDark: boolean) {
  const documentElement = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  let themeColor = '';

  runInNewContext(script, {
    localStorage: {
      getItem: () => stored === null ? null : JSON.stringify(stored),
    },
    matchMedia: () => ({ matches: systemDark }),
    document: {
      documentElement,
      querySelector: () => ({
        setAttribute: (_name: string, value: string) => {
          themeColor = value;
        },
      }),
    },
  });

  return {
    theme: documentElement.dataset.theme,
    colorScheme: documentElement.style.colorScheme,
    themeColor,
  };
}

describe('theme prepaint', () => {
  it('ignores a saved theme from an outdated storage schema', () => {
    expect(runPrepaint({ version: 2, preferences: { theme: 'light' } }, true)).toEqual({
      theme: 'dark',
      colorScheme: 'dark',
      themeColor: '#0a0a23',
    });
  });

  it('applies a valid saved theme before rendering', () => {
    expect(runPrepaint({ version: 3, preferences: { theme: 'light' } }, true)).toEqual({
      theme: 'light',
      colorScheme: 'light',
      themeColor: '#ffffff',
    });
  });
});
