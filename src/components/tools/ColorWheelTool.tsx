import { memo, useState, useMemo } from 'react';
import type { Relationship } from '../../utils/color.ts';
import { hslToHex, getRelatedHues } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';

interface ColorWheelProps {
  baseH: number;
  relatedH: number[];
  interactive: boolean;
  onChange: (h: number) => void;
}

function ColorWheel({ baseH, relatedH, interactive, onChange }: ColorWheelProps) {
  const [focused, setFocused] = useState(false);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  const dotR = 10;

  const segments = useMemo(() => {
    const count = 60;
    return Array.from({ length: count }, (_, i) => {
      const startAngle = (i / count) * 360;
      const endAngle = ((i + 1) / count) * 360;
      const s1 = (startAngle - 90) * (Math.PI / 180);
      const e1 = (endAngle - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(s1);
      const y1 = cy + r * Math.sin(s1);
      const x2 = cx + r * Math.cos(e1);
      const y2 = cy + r * Math.sin(e1);
      const xi = cx + (r - 28) * Math.cos(s1);
      const yi = cy + (r - 28) * Math.sin(s1);
      const xi2 = cx + (r - 28) * Math.cos(e1);
      const yi2 = cy + (r - 28) * Math.sin(e1);
      return {
        d: `M ${xi} ${yi} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r - 28} ${r - 28} 0 0 0 ${xi} ${yi} Z`,
        hue: startAngle,
      };
    });
  }, [cx, cy, r]);

  function hueToXY(h: number, radius: number) {
    const angle = (h - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < r - 28 || dist > r + 5) return;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    onChange(((Math.round(angle) + 360) % 360));
  }

  function handleKeyDown(e: React.KeyboardEvent<SVGSVGElement>) {
    if (!interactive) return;
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 5
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -5
      : 0;
    if (delta === 0) return;
    e.preventDefault();
    onChange((baseH + delta + 360) % 360);
  }

  const baseDot = hueToXY(baseH, r - 14);
  const relatedDots = relatedH.map((h) => hueToXY(h, r - 14));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={interactive ? 0 : -1}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={baseH}
      aria-disabled={!interactive}
      aria-label={`Color wheel hue selector: ${baseH}°`}
      style={{ cursor: interactive ? 'crosshair' : 'default', flexShrink: 0, outline: 'none' }}
    >
      {focused && interactive && (
        <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="var(--accent-cta)" strokeWidth={2} strokeDasharray="4 3" />
      )}
      {segments.map((seg) => (
        <path key={seg.hue} d={seg.d} fill={`hsl(${seg.hue}, 80%, 55%)`} />
      ))}
      {/* Center */}
      <circle cx={cx} cy={cy} r={r - 28} fill="var(--surface)" />
      {/* Related hue dots */}
      {relatedDots.map((dot, i) => (
        <circle key={relatedH[i]} cx={dot.x} cy={dot.y} r={dotR - 2} fill={`hsl(${relatedH[i]}, 80%, 60%)`} stroke="var(--gray-00)" strokeWidth={2} />
      ))}
      {/* Base hue dot */}
      <circle cx={baseDot.x} cy={baseDot.y} r={dotR} fill={`hsl(${baseH}, 80%, 55%)`} stroke="var(--gray-00)" strokeWidth={2} />
    </svg>
  );
}

interface ColorWheelToolProps {
  interactive?: boolean;
  onComplete?: () => void;
  previewRelationship?: Relationship;
}

export const ColorWheelTool = memo(function ColorWheelTool({ interactive = true, onComplete, previewRelationship }: ColorWheelToolProps) {
  const [baseH, setBaseH] = useState(210);
  const [internalRelationship, setInternalRelationship] = useState<Relationship>(previewRelationship ?? 'complementary');
  const relationship = previewRelationship ?? internalRelationship;
  const [palette, setPalette] = useState<{ dominant: number; support: number; accent: number } | null>(null);
  const [paletteDone, setPaletteDone] = useState(false);
  const [validationAnswer, setValidationAnswer] = useState<string | null>(null);
  const [validationSubmitted, setValidationSubmitted] = useState(false);

  const relatedH = getRelatedHues(baseH, relationship);
  const controlsInteractive = interactive && !palette;

  const baseColor = hslToHex(baseH, 70, 50);
  const relatedColors = relatedH.map((h) => hslToHex(h, 70, 50));

  const relationshipDesc: Record<Relationship, string> = {
    analogous: 'This tool places two related hues 30° on either side of the base.',
    complementary: 'One hue, 180° from the base.',
    triadic: 'Three hues spaced 120° apart.',
  };

  function buildPalette() {
    const accent = relatedH[0];
    const support = relationship === 'analogous' ? relatedH[1] ?? (baseH + 30) % 360 : (baseH + 30) % 360;
    setPalette({ dominant: baseH, support, accent });
  }

  function handleFinish() {
    setPaletteDone(true);
    onComplete?.();
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>color wheel explorer</span>

      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <ColorWheel baseH={baseH} relatedH={relatedH} interactive={controlsInteractive} onChange={setBaseH} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', flex: 1, minWidth: '180px' }}>
          {/* Base hue control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>base hue</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--yellow)' }}>{baseH}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={359}
              value={baseH}
              onChange={(e) => controlsInteractive && setBaseH(Number(e.target.value))}
              disabled={!controlsInteractive}
              style={{
                width: '100%',
                background: `linear-gradient(to right, hsl(0,80%,55%), hsl(60,80%,55%), hsl(120,80%,55%), hsl(180,80%,55%), hsl(240,80%,55%), hsl(300,80%,55%), hsl(360,80%,55%))`,
                appearance: 'none',
                WebkitAppearance: 'none',
                height: '6px',
                borderRadius: '3px',
                cursor: controlsInteractive ? 'pointer' : 'not-allowed',
              }}
              aria-label={`Base hue: ${baseH}°`}
            />
          </div>

          {/* Relationship selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>relationship</span>
            {(['analogous', 'complementary', 'triadic'] as Relationship[]).map((r) => (
              <button
                key={r}
                onClick={() => controlsInteractive && setInternalRelationship(r)}
                disabled={!controlsInteractive}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: relationship === r ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${relationship === r ? 'var(--yellow)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: relationship === r ? 'var(--yellow)' : 'var(--secondary-foreground)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  cursor: controlsInteractive ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                }}
              >
                {r}
              </button>
            ))}
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{relationshipDesc[relationship]}</p>
          </div>

          {/* Palette preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>palette preview</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div title={`Base: hsl(${baseH}, 70%, 50%)`} style={{ flex: 3, height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: baseColor }} />
              {relatedColors.map((c, i) => (
                <div key={c} title={`Related: hsl(${relatedH[i]}, 70%, 50%)`} style={{ flex: 1, height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: c }} />
              ))}
              <div style={{ flex: 1, height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-80)' }} title="Neutral" />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>base · related hues · neutral</span>
          </div>
        </div>
      </div>

      {/* Build palette task — hidden in preview mode */}
      {!previewRelationship && <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>build your starter palette</span>
        <p style={{ fontSize: '0.9rem', color: 'var(--secondary-foreground)' }}>
          Choose a relationship, adjust the base hue, then lock in your palette.
        </p>
        {interactive && !palette && (
          <button
            onClick={buildPalette}
            style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', background: 'var(--yellow)', color: 'var(--gray-90)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}
          >
            lock in this palette
          </button>
        )}
        {palette && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', gap: '4px', height: '56px' }}>
              <div style={{ flex: 3, borderRadius: 'var(--radius-sm)', backgroundColor: hslToHex(palette.dominant, 70, 50), display: 'flex', alignItems: 'flex-end', padding: '4px 8px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,0,0,0.7)' }}>dominant</span>
              </div>
              <div style={{ flex: 1.5, borderRadius: 'var(--radius-sm)', backgroundColor: hslToHex(palette.support, 60, 55), display: 'flex', alignItems: 'flex-end', padding: '4px 8px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,0,0,0.7)' }}>support</span>
              </div>
              <div style={{ flex: 1, borderRadius: 'var(--radius-sm)', backgroundColor: hslToHex(palette.accent, 85, 60), display: 'flex', alignItems: 'flex-end', padding: '4px 8px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,0,0,0.7)' }}>accent</span>
              </div>
              <div style={{ flex: 2, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gray-80)', display: 'flex', alignItems: 'flex-end', padding: '4px 8px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>neutral</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>
              Selected relationship: <strong style={{ color: 'var(--primary-foreground)' }}>{relationship}</strong>. The swatches are labeled by their intended roles.
            </p>
            {interactive && !paletteDone && (() => {
              const VALIDATION: Record<Relationship, { question: string; choices: { id: string; label: string; isCorrect: boolean }[]; feedback: string }> = {
                analogous: {
                  question: 'Where are analogous hues positioned relative to the base hue?',
                  choices: [
                    { id: 'a', label: 'On either side of the base hue', isCorrect: true },
                    { id: 'b', label: 'Opposite the base hue', isCorrect: false },
                    { id: 'c', label: 'At 120° intervals from the base hue', isCorrect: false },
                  ],
                  feedback: 'Analogous hues sit 30° on either side of the base hue in this tool.',
                },
                complementary: {
                  question: 'Where is a complementary hue positioned relative to the base hue?',
                  choices: [
                    { id: 'a', label: '30° from the base hue', isCorrect: false },
                    { id: 'b', label: '180° from the base hue', isCorrect: true },
                    { id: 'c', label: '120° from the base hue', isCorrect: false },
                  ],
                  feedback: 'A complementary hue sits opposite the base hue, 180° away.',
                },
                triadic: {
                  question: 'How are the three hues in a triadic relationship spaced?',
                  choices: [
                    { id: 'a', label: '30° apart', isCorrect: false },
                    { id: 'b', label: '180° apart', isCorrect: false },
                    { id: 'c', label: '120° apart', isCorrect: true },
                  ],
                  feedback: 'A triadic relationship contains three hues spaced 120° apart.',
                },
              };
              const v = VALIDATION[relationship];
              const selected = validationAnswer;
              const correct = v.choices.find((c) => c.isCorrect);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-sm)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>reflect</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-foreground)', margin: 0 }}>{v.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {v.choices.map((choice) => {
                      const isSelected = selected === choice.id;
                      const showResult = validationSubmitted;
                      const borderColor = showResult
                        ? choice.isCorrect ? 'var(--green)' : isSelected ? 'var(--red)' : 'var(--border)'
                        : isSelected ? 'var(--yellow)' : 'var(--border)';
                      const bg = showResult
                        ? choice.isCorrect ? 'color-mix(in srgb, var(--green) 10%, var(--surface))' : isSelected ? 'color-mix(in srgb, var(--red) 10%, var(--surface))' : 'var(--surface)'
                        : isSelected ? 'color-mix(in srgb, var(--yellow) 10%, var(--surface))' : 'var(--surface)';
                      return (
                        <button
                          key={choice.id}
                          disabled={validationSubmitted}
                          onClick={() => !validationSubmitted && setValidationAnswer(choice.id)}
                          style={{ padding: '0.45rem 0.75rem', background: bg, border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', textAlign: 'left', cursor: validationSubmitted ? 'default' : 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                  {!validationSubmitted && (
                    <button
                      disabled={!selected}
                      onClick={() => selected && setValidationSubmitted(true)}
                      style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem', background: selected ? 'var(--yellow)' : 'var(--border)', color: 'var(--gray-90)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: selected ? 'pointer' : 'not-allowed' }}
                    >
                      check
                    </button>
                  )}
                  {validationSubmitted && (
                    <>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: validationAnswer === correct?.id ? 'var(--green)' : 'var(--yellow)', margin: 0 }}>
                        {validationAnswer === correct?.id ? '✓ ' : '→ '}{v.feedback}
                      </p>
                      <button
                        onClick={handleFinish}
                        style={{ alignSelf: 'flex-start', padding: '0.5rem 1.25rem', background: 'var(--yellow)', color: 'var(--gray-90)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}
                      >
                        done →
                      </button>
                    </>
                  )}
                </div>
              );
            })()}
            {paletteDone && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)' }}>
                ✓ palette built. Moving on.
              </p>
            )}
          </div>
        )}
      </div>}
    </div>
  );
});
