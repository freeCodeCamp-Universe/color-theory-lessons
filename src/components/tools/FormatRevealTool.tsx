import { memo, useState } from 'react';
import { hexToRgb, hslToHex } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';
import { StatusAnnouncement } from '../accessibility/StatusAnnouncement.tsx';
import shellStyles from './ToolShell.module.css';
import styles from './FormatRevealTool.module.css';

interface ColorElement {
  id: string;
  label: string;
  hex: string;
  description: string;
}

const ELEMENTS: ColorElement[] = [
  {
    id: 'nav-bg',
    label: 'Nav background',
    hex: '#1e3a5f',
    description: 'The dark navy used for the navigation background.',
  },
  {
    id: 'nav-text',
    label: 'Nav text',
    hex: '#e2e8f0',
    description: 'Light text that contrasts with the dark navigation background.',
  },
  {
    id: 'hero-bg',
    label: 'Hero surface',
    hex: '#f0f4f8',
    description: 'A cool off-white surface used as the hero background.',
  },
  {
    id: 'cta',
    label: 'Primary action button',
    hex: '#2563eb',
    description: 'The saturated blue used for the primary action button.',
  },
  {
    id: 'cta-text',
    label: 'Button text',
    hex: '#ffffff',
    description: 'White text that contrasts with the blue button background.',
  },
  {
    id: 'card-bg',
    label: 'Card background',
    hex: '#ffffff',
    description: 'The white background used for the card.',
  },
  {
    id: 'card-border',
    label: 'Card border',
    hex: '#cbd5e1',
    description: 'The light blue-gray border that separates the card from its background.',
  },
  {
    id: 'accent',
    label: 'Success accent',
    hex: '#16a34a',
    description: 'A mid-tone green used for success states and confirmations.',
  },
];

const STAGES: readonly ExerciseStageDefinition[] = [{
  id: 'explore-formats',
  title: 'Explore interface color formats',
  instruction: 'Select all eight colored interface elements to compare their HEX, RGB, and HSL values.',
}];

interface HslDisplay {
  h: number;
  s: number;
  l: number;
}

function hexToPreciseHsl(hex: string): HslDisplay {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;

  switch (max) {
    case rn:
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      break;
    case gn:
      h = ((bn - rn) / d + 2) / 6;
      break;
    default:
      h = ((rn - gn) / d + 4) / 6;
      break;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function roundTo(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

function formatHslValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toString();
}

function getRoundTripHsl(hex: string): HslDisplay {
  const precise = hexToPreciseHsl(hex);
  const targetHex = hex.toUpperCase();

  for (let decimals = 0; decimals <= 4; decimals += 1) {
    const candidate = {
      h: roundTo(precise.h, decimals),
      s: roundTo(precise.s, decimals),
      l: roundTo(precise.l, decimals),
    };

    if (hslToHex(candidate.h, candidate.s, candidate.l).toUpperCase() === targetHex) {
      return candidate;
    }
  }

  return {
    h: roundTo(precise.h, 4),
    s: roundTo(precise.s, 4),
    l: roundTo(precise.l, 4),
  };
}

export const FormatRevealTool = memo(function FormatRevealTool({
  interactive = true,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const done = stageController.result === 'passed';

  function handleSelect(id: string) {
    if (!interactive) return;
    setSelectedId(id);
    const next = new Set(revealed).add(id);
    setRevealed(next);
    if (next.size === ELEMENTS.length) stageController.markPassed();
  }

  const selected = ELEMENTS.find((e) => e.id === selectedId) ?? null;
  const rgb = selected ? hexToRgb(selected.hex) : null;
  const hsl = selected ? getRoundTripHsl(selected.hex) : null;

  const remaining = ELEMENTS.length - revealed.size;
  const selectionMessage = selected && rgb && hsl
    ? `${selected.label} selected. ${selected.description} HEX ${selected.hex.toUpperCase()}; RGB ${rgb.r}, ${rgb.g}, ${rgb.b}; HSL ${formatHslValue(hsl.h)} degrees, ${formatHslValue(hsl.s)} percent saturation, ${formatHslValue(hsl.l)} percent lightness.`
    : '';

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>format explorer</span>
      <StatusAnnouncement message={selectionMessage} />

      <ExerciseStage
        controller={stageController}
        completionFeedback="Format exploration complete. You compared all eight elements in three color formats."
      >
        <div className={styles.layout}>
        {/* ── Left: UI mockup ── */}
        <div className={styles.mockupWrapper}>
          <p className={styles.instruction}>
            {done
              ? 'All elements explored.'
              : `Select each colored element. ${remaining} remaining.`}
          </p>

          <div className={styles.mockup}>
            <div data-authored-visual>
            {/* Nav */}
            <div
              className={`${styles.nav} ${selectedId === 'nav-bg' ? styles.selected : ''} ${revealed.has('nav-bg') ? styles.visited : ''}`}
              style={{ backgroundColor: '#1e3a5f' }}
              onClick={() => handleSelect('nav-bg')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect('nav-bg')}
              aria-label="Nav background"
              aria-describedby="format-selection-description"
            >
              <span
                className={`${styles.navText} ${selectedId === 'nav-text' ? styles.selected : ''} ${revealed.has('nav-text') ? styles.visited : ''}`}
                style={{ color: '#e2e8f0' }}
                onClick={(e) => { e.stopPropagation(); handleSelect('nav-text'); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.stopPropagation(), handleSelect('nav-text'))}
                aria-label="Nav text"
                aria-describedby="format-selection-description"
                data-target-size-exception="essential"
              >
                site.ui
              </span>
            </div>

            {/* Hero */}
            <div
              className={`${styles.hero} ${selectedId === 'hero-bg' ? styles.selected : ''} ${revealed.has('hero-bg') ? styles.visited : ''}`}
              style={{ backgroundColor: '#f0f4f8' }}
              onClick={() => handleSelect('hero-bg')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect('hero-bg')}
                aria-label="Hero surface"
                aria-describedby="format-selection-description"
            >
              <p className={styles.heroTitle}>The design tool for developers.</p>
              <div
                className={`${styles.cta} ${selectedId === 'cta' ? styles.selected : ''} ${revealed.has('cta') ? styles.visited : ''}`}
                style={{ backgroundColor: '#2563eb' }}
              >
                <button
                  className={styles.ctaColorControl}
                  onClick={(e) => { e.stopPropagation(); handleSelect('cta'); }}
                  aria-label="Primary action button"
                  aria-describedby="format-selection-description"
                />
                <button
                  className={`${styles.ctaText} ${selectedId === 'cta-text' ? styles.selected : ''} ${revealed.has('cta-text') ? styles.visited : ''}`}
                  style={{ color: '#ffffff' }}
                  onClick={(e) => { e.stopPropagation(); handleSelect('cta-text'); }}
                  aria-label="Button text"
                  aria-describedby="format-selection-description"
                >
                  Try it free →
                </button>
              </div>
            </div>

            {/* Card */}
            <div
              className={`${styles.card} ${selectedId === 'card-bg' ? styles.selected : ''} ${revealed.has('card-bg') ? styles.visited : ''}`}
              style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              onClick={() => handleSelect('card-bg')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect('card-bg')}
              aria-label="Card background"
              aria-describedby="format-selection-description"
            >
              <div
                className={`${styles.cardBorder} ${selectedId === 'card-border' ? styles.selected : ''} ${revealed.has('card-border') ? styles.visited : ''}`}
                onClick={(e) => { e.stopPropagation(); handleSelect('card-border'); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.stopPropagation(), handleSelect('card-border'))}
                aria-label="Card border"
                aria-describedby="format-selection-description"
                data-target-size-exception="essential"
              >
                border →
              </div>
              <span
                className={`${styles.accent} ${selectedId === 'accent' ? styles.selected : ''} ${revealed.has('accent') ? styles.visited : ''}`}
                style={{ color: '#16a34a' }}
                onClick={(e) => { e.stopPropagation(); handleSelect('accent'); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.stopPropagation(), handleSelect('accent'))}
                aria-label="Success accent"
                aria-describedby="format-selection-description"
                data-target-size-exception="essential"
              >
                ✓ success
              </span>
            </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--accent-warning)' }} aria-hidden="true" /> selected
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--accent-success)' }} aria-hidden="true" /> explored
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Format panel ── */}
        <div className={styles.panel}>
          <VisualDescription id="format-selection-description">{selectionMessage}</VisualDescription>
          {selected && rgb && hsl ? (
            <>
              <div className={styles.swatchRow}>
                <div
                  className={styles.swatch}
                  style={{ backgroundColor: selected.hex }}
                  aria-hidden="true"
                />
                <div className={styles.swatchMeta}>
                  <span className={styles.elementLabel}>{selected.label}</span>
                  <p className={styles.elementDesc}>{selected.description}</p>
                </div>
              </div>

              <div className={styles.formats}>
                <div className={styles.formatBlock}>
                  <span className={styles.formatName}>HEX</span>
                  <code className={styles.formatValue}>{selected.hex.toUpperCase()}</code>
                  <p className={styles.formatNote}>Compact hexadecimal with two digits per channel. Common in CSS and design tools.</p>
                </div>
                <div className={styles.formatBlock}>
                  <span className={styles.formatName}>RGB</span>
                  <code className={styles.formatValue}>rgb({rgb.r} {rgb.g} {rgb.b})</code>
                  <p className={styles.formatNote}>Lists the red, green, and blue channel values used for screen colors.</p>
                </div>
                <div className={styles.formatBlock}>
                  <span className={styles.formatName}>HSL</span>
                  <code className={styles.formatValue}>
                    hsl({formatHslValue(hsl.h)} {formatHslValue(hsl.s)}% {formatHslValue(hsl.l)}%)
                  </code>
                  <p className={styles.formatNote}>Organizes a color by hue, saturation, and lightness for color adjustments.</p>
                </div>
              </div>

              <p className={styles.formatFooter}>
                All three values above describe the same sRGB color.
              </p>
            </>
          ) : (
            <div className={styles.emptyPanel}>
              <span className={styles.emptyIcon}>←</span>
              <p className={styles.emptyText}>Select any colored element in the mockup to reveal its formats here.</p>
            </div>
          )}
        </div>
        </div>
      </ExerciseStage>
    </div>
  );
});
