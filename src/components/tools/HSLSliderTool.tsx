import { memo, useState, useEffect, useRef, useMemo } from 'react';
import type { HSL } from '../../utils/color.ts';
import { hslString } from '../../utils/color.ts';
import { HueWheel } from './HueWheel.tsx';
import shellStyles from './ToolShell.module.css';
import styles from './HSLSliderTool.module.css';

interface Target {
  name: string;
  locked: 'h' | 's' | 'l';
  target: HSL;
  start: HSL;
}

const TARGETS: Target[] = [
  {
    name: 'Match the hue',
    locked: 'h',
    target: { h: 200, s: 70, l: 55 },
    start: { h: 0, s: 70, l: 55 },
  },
  {
    name: 'Match the saturation',
    locked: 's',
    target: { h: 200, s: 20, l: 55 },
    start: { h: 200, s: 90, l: 55 },
  },
  {
    name: 'Match the lightness',
    locked: 'l',
    target: { h: 200, s: 70, l: 20 },
    start: { h: 200, s: 70, l: 80 },
  },
];

const TOLERANCE = 8;

interface HSLSliderToolProps {
  interactive?: boolean;
  onComplete?: () => void;
  previewDimension?: 'h' | 's' | 'l';
}

export const HSLSliderTool = memo(function HSLSliderTool({ interactive = true, onComplete, previewDimension }: HSLSliderToolProps) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [current, setCurrent] = useState<HSL>({ ...TARGETS[0].start });
  const [checked, setChecked] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  // State used only in the previewDimension branch (always declared to follow Rules of Hooks)
  const [previewCurrent, setPreviewCurrent] = useState<HSL>({ h: 200, s: 70, l: 55 });

  const target = TARGETS[targetIdx];

  const close =
    Math.abs(current.h - target.target.h) <= TOLERANCE &&
    Math.abs(current.s - target.target.s) <= TOLERANCE &&
    Math.abs(current.l - target.target.l) <= TOLERANCE;

  function updateChannel(ch: 'h' | 's' | 'l', val: number) {
    if (checked) return;
    setCurrent((prev) => ({ ...prev, [ch]: val }));
  }

  function handleCheck() {
    setChecked(true);
    if (close) {
      timerRef.current = setTimeout(() => {
        if (targetIdx < TARGETS.length - 1) {
          const next = targetIdx + 1;
          setTargetIdx(next);
          setCurrent({ ...TARGETS[next].start });
          setChecked(false);
        } else {
          setAllDone(true);
          onComplete?.();
        }
      }, 900);
    }
  }

  function handleRetry() {
    setCurrent({ ...target.start });
    setChecked(false);
  }

  const hueGradient = useMemo(
    () =>
      `linear-gradient(to right, hsl(0,${current.s}%,${current.l}%), hsl(60,${current.s}%,${current.l}%), hsl(120,${current.s}%,${current.l}%), hsl(180,${current.s}%,${current.l}%), hsl(240,${current.s}%,${current.l}%), hsl(300,${current.s}%,${current.l}%), hsl(360,${current.s}%,${current.l}%))`,
    [current.s, current.l],
  );

  const satGradient = useMemo(
    () => `linear-gradient(to right, hsl(${current.h},0%,${current.l}%), hsl(${current.h},100%,${current.l}%))`,
    [current.h, current.l],
  );
  const lightGradient = useMemo(
    () => `linear-gradient(to right, hsl(${current.h},${current.s}%,0%), hsl(${current.h},${current.s}%,50%), hsl(${current.h},${current.s}%,100%))`,
    [current.h, current.s],
  );

  if (previewDimension) {
    const preview = previewCurrent;
    const setPreview = setPreviewCurrent;
    const pHueGrad = `linear-gradient(to right, hsl(0,${preview.s}%,${preview.l}%), hsl(60,${preview.s}%,${preview.l}%), hsl(120,${preview.s}%,${preview.l}%), hsl(180,${preview.s}%,${preview.l}%), hsl(240,${preview.s}%,${preview.l}%), hsl(300,${preview.s}%,${preview.l}%), hsl(360,${preview.s}%,${preview.l}%))`;
    const pSatGrad = `linear-gradient(to right, hsl(${preview.h},0%,${preview.l}%), hsl(${preview.h},100%,${preview.l}%))`;
    const pLightGrad = `linear-gradient(to right, hsl(${preview.h},${preview.s}%,0%), hsl(${preview.h},${preview.s}%,50%), hsl(${preview.h},${preview.s}%,100%))`;
    const gradients = { h: pHueGrad, s: pSatGrad, l: pLightGrad };
    const labels = { h: 'Hue', s: 'Saturation', l: 'Lightness' };
    const maxes = { h: 360, s: 100, l: 100 };
    const units = { h: '°', s: '%', l: '%' };
    const isHueDimension = previewDimension === 'h';
    return (
      <div className={shellStyles.shell}>
        <span className={shellStyles.toolLabel}>HSL color lab</span>
        <div className={styles.root}>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {isHueDimension && (
              <HueWheel
                hue={preview.h}
                interactive={interactive}
                onChange={(h) => setPreview((prev) => ({ ...prev, h }))}
              />
            )}
            <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div className={styles.swatchRow}>
                <div className={styles.swatchBox}>
                  <span className={styles.swatchLabel}>color</span>
                  <div className={styles.swatch} style={{ backgroundColor: hslString(preview) }} />
                  <span className={styles.hslValue}>H:{preview.h} S:{preview.s}% L:{preview.l}%</span>
                </div>
              </div>
              <div className={styles.sliders}>
                {(['h', 's', 'l'] as const).map((ch) => {
                  const isActive = ch === previewDimension;
                  return (
                    <div key={ch} className={styles.sliderRow}>
                      <div className={styles.sliderHeader}>
                        <span className={styles.sliderName} style={{ color: isActive ? 'var(--yellow)' : undefined }}>{labels[ch]}</span>
                        <span className={styles.sliderVal}>{preview[ch]}{units[ch]}</span>
                      </div>
                      <input
                        type="range"
                        className={styles.slider}
                        min={0}
                        max={maxes[ch]}
                        value={preview[ch]}
                        disabled={!isActive || !interactive}
                        style={{ background: gradients[ch], opacity: isActive ? 1 : 0.4 }}
                        onChange={(e) => isActive && setPreview((prev) => ({ ...prev, [ch]: Number(e.target.value) }))}
                        aria-label={`${labels[ch]}: ${preview[ch]}${units[ch]}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>HSL color lab</span>

      <div className={styles.root}>
        {/* Swatches */}
        <div className={styles.swatchRow}>
          <div className={styles.swatchBox}>
            <span className={styles.swatchLabel}>your color</span>
            <div className={styles.swatch} style={{ backgroundColor: hslString(current) }} />
            <span className={styles.hslValue}>
              H:{current.h} S:{current.s}% L:{current.l}%
            </span>
          </div>
          <div className={styles.swatchBox}>
            <span className={styles.swatchLabel}>target</span>
            <div className={styles.swatch} style={{ backgroundColor: hslString(target.target) }} />
            <span className={styles.hslValue}>
              {target.locked === 'h' ? `H:?` : `H:${target.target.h}`}{' '}
              {target.locked === 's' ? `S:?` : `S:${target.target.s}%`}{' '}
              {target.locked === 'l' ? `L:?` : `L:${target.target.l}%`}
            </span>
          </div>
        </div>

        {/* Challenge label */}
        <div>
          <span className={styles.sliderName} style={{ color: 'var(--yellow)' }}>
            {targetIdx + 1}/{TARGETS.length}: {target.name}
          </span>
          <p style={{ fontSize: '0.85rem', color: 'var(--secondary-foreground)', marginTop: '4px' }}>
            Only the <strong style={{ color: 'var(--primary-foreground)' }}>
              {target.locked === 'h' ? 'hue' : target.locked === 's' ? 'saturation' : 'lightness'}
            </strong> slider is unlocked. Adjust it to match the target, then check.
          </p>
        </div>

        {/* Sliders */}
        <div className={styles.sliders}>
          {(['h', 's', 'l'] as const).map((ch) => {
            const isLocked = target.locked !== ch;
            const max = ch === 'h' ? 360 : 100;
            const label = ch === 'h' ? 'Hue' : ch === 's' ? 'Saturation' : 'Lightness';
            const unit = ch === 'h' ? '°' : '%';
            const gradient = ch === 'h' ? hueGradient : ch === 's' ? satGradient : lightGradient;
            return (
              <div key={ch} className={styles.sliderRow}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderName}>{label}</span>
                  {isLocked ? (
                    <span className={styles.sliderLocked}>locked</span>
                  ) : (
                    <span className={styles.sliderVal}>{current[ch]}{unit}</span>
                  )}
                </div>
                <input
                  type="range"
                  className={styles.slider}
                  min={0}
                  max={max}
                  value={current[ch]}
                  disabled={isLocked || !interactive || checked}
                  style={{ background: gradient }}
                  onChange={(e) => updateChannel(ch, Number(e.target.value))}
                  aria-label={`${label}: ${current[ch]}${unit}`}
                />
              </div>
            );
          })}
        </div>

        {/* Actions / result */}
        {interactive && !allDone && !checked && (
          <button
            onClick={handleCheck}
            disabled={false}
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

        {checked && !allDone && (
          close ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)' }}>
              ✓ match! advancing…
            </p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--red)' }}>
                No match yet. Select retry to reset the slider.
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
          )
        )}

        {allDone && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green)' }}>
            ✓ all three dimensions matched. Great work!
          </p>
        )}
      </div>
    </div>
  );
});
