import { memo, useState } from 'react';
import { hexToHsl, hexToRgb, contrastRatioWcag } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface ProblemArea {
  id: string;
  label: string;
  textColor: string;
  bgColor: string;
  fixBg: boolean; // true = user adjusts bg lightness; false = adjust text lightness
  /** WCAG AA contrast ratio threshold required to pass. */
  threshold: number;
}

const AREAS: ProblemArea[] = [
  { id: 'heading', label: 'Section label', textColor: '#858591', bgColor: '#2a2a40', fixBg: false, threshold: 4.5 },
  { id: 'helper', label: 'Helper text below input', textColor: '#5a5a6e', bgColor: '#2a2a40', fixBg: false, threshold: 4.5 },
  { id: 'button', label: 'Submit button', textColor: '#ffffff', bgColor: '#8080a8', fixBg: true, threshold: 3 },
];

const AREA_GRADIENTS: Record<string, string> = Object.fromEntries(
  AREAS.map((area) => {
    const { h, s } = area.fixBg ? hexToHsl(area.bgColor) : hexToHsl(area.textColor);
    return [area.id, `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`];
  }),
);

/** Compute the WCAG contrast ratio for a problem area given the current lightness value. */
function computeRatio(area: ProblemArea, l: number): number {
  const base = area.fixBg ? hexToHsl(area.bgColor) : hexToHsl(area.textColor);
  const adjustedHex = hslToApproxRgb(base.h, base.s, l);
  const fixedRgb = hexToRgb(area.fixBg ? area.textColor : area.bgColor);
  return contrastRatioWcag(adjustedHex, fixedRgb);
}

/** Convert HSL to an RGB object (in-memory, no hex round-trip needed). */
function hslToApproxRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

interface ContrastToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const ContrastTool = memo(function ContrastTool({ interactive = true, onComplete }: ContrastToolProps) {
  const [lightness, setLightness] = useState<Record<string, number>>({
    heading: hexToHsl(AREAS[0].textColor).l,
    helper: hexToHsl(AREAS[1].textColor).l,
    button: hexToHsl(AREAS[2].bgColor).l,
  });
  const [completed, setCompleted] = useState(false);
  const [checked, setChecked] = useState(false);

  function isFixed(area: ProblemArea) {
    return computeRatio(area, lightness[area.id]) >= area.threshold;
  }

  function handleChange(id: string, val: number) {
    if (completed || !interactive) return;
    setLightness((prev) => ({ ...prev, [id]: val }));
  }

  function handleCheck() {
    const allFixed = AREAS.every((area) => isFixed(area));
    setChecked(true);
    if (allFixed) {
      setCompleted(true);
      onComplete?.();
    }
  }

  function handleRetry() {
    setChecked(false);
  }

  const failingLabels = checked && !completed
    ? AREAS.filter((area) => !isFixed(area)).map((area) => area.label)
    : [];

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>contrast repair lab</span>
      <p style={{ fontSize: '0.9rem', color: 'var(--secondary-foreground)' }}>
        Adjust the lightness slider for each color pair, then select check.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {AREAS.map((area) => {
          const l = lightness[area.id];
          const ratio = computeRatio(area, l);
          const fixed = ratio >= area.threshold;

          // Compute displayed color
          const baseHSL = area.fixBg
            ? hexToHsl(area.bgColor)
            : hexToHsl(area.textColor);

          const displayedColor = `hsl(${baseHSL.h}, ${baseHSL.s}%, ${l}%)`;
          const textColor = area.fixBg ? area.textColor : displayedColor;
          const bgColor = area.fixBg ? displayedColor : area.bgColor;

          const gradient = AREA_GRADIENTS[area.id];

          return (
            <div
              key={area.id}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${fixed ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {area.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: fixed ? 'var(--green)' : 'var(--muted)' }}>
                  {fixed ? '✓ readable' : 'adjust lightness'}
                </span>
              </div>

              {/* Ratio display */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: fixed ? 'var(--green)' : 'var(--yellow)' }}>
                ratio: {ratio.toFixed(2)}:1 — need {area.threshold}:1 (WCAG AA)
              </div>

              {/* Preview */}
              <div
                style={{
                  background: bgColor,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem var(--spacing-md)',
                  color: textColor,
                  fontSize: area.id === 'button' ? '0.9rem' : '0.9rem',
                  fontFamily: area.id === 'button' ? 'var(--font-mono)' : 'var(--font-sans)',
                  fontWeight: area.id === 'button' ? 700 : 400,
                  transition: 'background 0.1s ease, color 0.1s ease',
                  border: area.id === 'button' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  display: area.id === 'button' ? 'inline-block' : 'block',
                }}
              >
                {area.id === 'heading' && 'Section label text'}
                {area.id === 'helper' && 'Enter your email address'}
                {area.id === 'button' && 'Submit'}
              </div>

              {/* Lightness slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {area.fixBg ? 'button background' : 'text'} lightness
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--yellow)' }}>
                    {l}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={l}
                  disabled={completed || !interactive}
                  style={{
                    width: '100%',
                    background: gradient,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    height: '6px',
                    borderRadius: '3px',
                    cursor: completed ? 'not-allowed' : 'pointer',
                  }}
                  onChange={(e) => handleChange(area.id, Number(e.target.value))}
                  aria-label={`Lightness for ${area.label}: ${l}%`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {interactive && !completed && !checked && (
        <button
          onClick={handleCheck}
          style={{
            alignSelf: 'flex-start',
            padding: '0.4rem 1rem',
            background: 'var(--yellow)',
            color: 'var(--gray-90)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          check
        </button>
      )}

      {checked && !completed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--red)' }}>
            {failingLabels.length > 0
              ? `Still failing: ${failingLabels.join(', ')}. Select retry to continue adjusting.`
              : 'One or more color pairs do not pass yet. Select retry to continue adjusting.'}
          </p>
          <button
            onClick={handleRetry}
            style={{
              padding: '0.3rem 0.75rem',
              background: 'transparent',
              color: 'var(--secondary-foreground)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            retry
          </button>
        </div>
      )}

      {completed && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)' }}>
          ✓ All three color pairs passed. Good work!
        </p>
      )}
    </div>
  );
});
