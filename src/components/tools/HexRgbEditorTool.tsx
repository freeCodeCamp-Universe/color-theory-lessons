import { memo, useState, useEffect, useRef } from 'react';
import type { RGB } from '../../utils/color.ts';
import { rgbToHex, parseHex, rgbString, colorDistance } from '../../utils/color.ts';
import shellStyles from './ToolShell.module.css';
import styles from './HexRgbEditorTool.module.css';

// ─── Presets ─────────────────────────────────────────────────────────────

const PRESETS: { label: string; rgb: RGB }[] = [
  { label: 'white',   rgb: { r: 255, g: 255, b: 255 } },
  { label: 'black',   rgb: { r: 0,   g: 0,   b: 0   } },
  { label: 'gray',    rgb: { r: 128, g: 128, b: 128 } },
  { label: 'blue',    rgb: { r: 30,  g: 64,  b: 175 } },
  { label: 'red',     rgb: { r: 220, g: 38,  b: 38  } },
  { label: 'orange',  rgb: { r: 245, g: 158, b: 11  } },
  { label: 'green',   rgb: { r: 22,  g: 163, b: 74  } },
];

// ─── Challenge targets ────────────────────────────────────────────────────

const TARGETS: { name: string; rgb: RGB }[] = [
  { name: 'link blue',      rgb: { r: 59,  g: 130, b: 246 } },
  { name: 'error red',      rgb: { r: 220, g: 38,  b: 38  } },
  { name: 'light gray surface', rgb: { r: 241, g: 241, b: 241 } },
];

const MATCH_THRESHOLD = 20; // Euclidean distance

// ─── Channel metadata ─────────────────────────────────────────────────────

const CHANNELS: { key: keyof RGB; label: string; trackColor: string }[] = [
  { key: 'r', label: 'Red',   trackColor: '#e03030' },
  { key: 'g', label: 'Green', trackColor: '#22c55e' },
  { key: 'b', label: 'Blue',  trackColor: '#3b82f6' },
];

// ─── Component ────────────────────────────────────────────────────────────

interface HexRgbEditorToolProps {
  interactive?: boolean;
  onComplete?: () => void;
}

export const HexRgbEditorTool = memo(function HexRgbEditorTool({ interactive = true, onComplete }: HexRgbEditorToolProps) {
  const [current, setCurrent] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hexInput, setHexInput] = useState<string>(rgbToHex({ r: 99, g: 102, b: 241 }));
  const [hexError, setHexError] = useState(false);

  // challenge state
  const [targetIdx, setTargetIdx] = useState(0);
  const [checked, setChecked] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  const target = TARGETS[targetIdx];
  const isClose = colorDistance(current, target.rgb) <= MATCH_THRESHOLD;

  // ── Setters ──────────────────────────────────────────────────────────────

  function applyRgb(rgb: RGB) {
    setCurrent(rgb);
    setHexInput(rgbToHex(rgb));
    setHexError(false);
  }

  // Sliders disabled during challenge — learner must use HEX input to match targets
  const slidersLocked = interactive && !allDone;

  function handleSlider(key: keyof RGB, val: number) {
    if (!interactive || slidersLocked) return;
    applyRgb({ ...current, [key]: val });
  }

  function handleHexChange(raw: string) {
    if (!interactive) return;
    setHexInput(raw);
    const parsed = parseHex(raw);
    if (parsed) {
      setCurrent(parsed);
      setHexError(false);
    } else {
      setHexError(raw.replace(/^#/, '').length > 0);
    }
  }

  function handlePreset(rgb: RGB) {
    if (!interactive || (checked && !allDone)) return;
    applyRgb(rgb);
  }

  // ── Challenge flow ────────────────────────────────────────────────────────

  function handleCheck() {
    if (!interactive) return;
    setChecked(true);
    if (isClose) {
      const next = targetIdx + 1;
      if (next < TARGETS.length) {
        timerRef.current = setTimeout(() => {
          setTargetIdx(next);
          setChecked(false);
        }, 800);
      } else {
        timerRef.current = setTimeout(() => {
          setAllDone(true);
          onComplete?.();
        }, 800);
      }
    }
  }

  function handleRetry() {
    setChecked(false);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>HEX / RGB dual editor</span>

      <div className={styles.root}>

        {/* ─ Swatches ─ */}
        <div className={styles.swatchRow}>
          {/* Current color */}
          <div className={styles.swatchBox}>
            <span className={styles.swatchLabel}>current</span>
            <div
              className={styles.swatch}
              style={{ backgroundColor: rgbString(current) }}
            />
            <span className={styles.swatchValue}>
              {rgbToHex(current)} · {rgbString(current)}
            </span>
          </div>

          {/* Challenge target */}
          <div className={styles.swatchBox}>
            <span className={styles.swatchLabel}>
              {allDone ? 'done' : `target ${targetIdx + 1} of ${TARGETS.length}`}
            </span>
            <div
              className={styles.swatch}
              style={{ backgroundColor: interactive ? rgbString(target.rgb) : 'transparent' }}
            />
            <span className={styles.swatchValue}>
              {interactive && !allDone ? target.name : (allDone ? 'all matched ✓' : 'no target')}
            </span>
          </div>
        </div>

        {/* ─ HEX input ─ */}
        <div className={styles.hexRow}>
          <span className={styles.hexLabel}>HEX</span>
          <input
            className={styles.hexInput}
            type="text"
            value={hexInput}
            maxLength={7}
            disabled={!interactive}
            onChange={(e) => handleHexChange(e.target.value)}
            aria-label="HEX color input"
            spellCheck={false}
          />
          {hexError && (
            <span className={styles.hexError}>invalid HEX</span>
          )}
        </div>

        {/* ─ RGB sliders ─ */}
        {slidersLocked && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
            sliders locked; type a HEX value to match
          </span>
        )}
        <div className={styles.sliders}>
          {CHANNELS.map(({ key, label, trackColor }) => (
            <div key={key} className={styles.sliderRow}>
              <div className={styles.sliderHeader}>
                <span className={styles.sliderName} style={{ color: trackColor }}>
                  {label}
                </span>
                <span className={styles.sliderValue}>{current[key]}</span>
              </div>
              <input
                className={styles.slider}
                type="range"
                min={0}
                max={255}
                value={current[key]}
                disabled={!interactive || slidersLocked}
                onChange={(e) => handleSlider(key, Number(e.target.value))}
                style={{ accentColor: trackColor }}
                aria-label={`${label} channel`}
              />
            </div>
          ))}
        </div>

        {/* ─ Presets ─ */}
        <div className={styles.presets}>
          <span className={styles.presetsLabel}>presets</span>
          <div className={styles.presetButtons}>
            {PRESETS.map(({ label, rgb }) => (
              <button
                key={label}
                className={styles.presetBtn}
                disabled={!interactive || slidersLocked}
                onClick={() => handlePreset(rgb)}
              >
                <span
                  className={styles.presetDot}
                  style={{ backgroundColor: rgbString(rgb) }}
                />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ─ Challenge check / feedback ─ */}
        {interactive && !allDone && (
          <>
            {!checked ? (
              <button className={styles.checkBtn} onClick={handleCheck}>
                check match
              </button>
            ) : (
              <div className={styles.matchRow}>
                {isClose ? (
                  <span className={styles.matchPass}>✓ matched; loading next target…</span>
                ) : (
                  <>
                    <span className={styles.matchFail}>not close enough yet</span>
                    <button className={styles.checkBtn} onClick={handleRetry}>
                      retry
                    </button>
                  </>
                )}
              </div>
            )}
            <span className={styles.progress}>
              {targetIdx + 1} / {TARGETS.length} targets
            </span>
          </>
        )}

        {allDone && (
          <div className={styles.matchRow}>
            <span className={styles.matchPass}>✓ all three targets matched</span>
          </div>
        )}
      </div>
    </div>
  );
});
