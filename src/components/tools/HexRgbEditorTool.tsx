import { memo, useState } from 'react';
import type { RGB } from '../../utils/color.ts';
import { rgbToHex, parseHex, rgbString, colorDistance } from '../../utils/color.ts';
import { ExerciseStage } from './ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseToolProps } from './exercise-stage.ts';
import { useExerciseStages } from './useExerciseStages.ts';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';
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

const TARGET_DESCRIPTIONS: Record<string, string> = {
  'link blue': 'A saturated medium blue target.',
  'error red': 'A strong red target used for an error state.',
  'light gray surface': 'A very light neutral gray surface target.',
};

const MATCH_THRESHOLD = 20; // Euclidean distance

// ─── Channel metadata ─────────────────────────────────────────────────────

const CHANNELS: { key: keyof RGB; label: string; trackColor: string }[] = [
  { key: 'r', label: 'Red',   trackColor: '#e03030' },
  { key: 'g', label: 'Green', trackColor: '#22c55e' },
  { key: 'b', label: 'Blue',  trackColor: '#3b82f6' },
];

// ─── Component ────────────────────────────────────────────────────────────

const STAGES: readonly ExerciseStageDefinition[] = TARGETS.map((target) => ({
  id: target.name.replaceAll(' ', '-'),
  title: `Match ${target.name}`,
  instruction: `Use the HEX input to match the ${target.name} target.`,
  nextActionLabel: 'next target',
}));

export const HexRgbEditorTool = memo(function HexRgbEditorTool({
  interactive = true,
  onComplete,
  onStageChange,
}: ExerciseToolProps) {
  const [current, setCurrent] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [hexInput, setHexInput] = useState<string>(rgbToHex({ r: 99, g: 102, b: 241 }));
  const [hexError, setHexError] = useState(false);

  const stageController = useExerciseStages({ stages: STAGES, onComplete, onStageChange });
  const targetIdx = stageController.activeStage.position - 1;

  const target = TARGETS[targetIdx];
  const isClose = colorDistance(current, target.rgb) <= MATCH_THRESHOLD;
  const currentDescription = `Current color: ${rgbToHex(current)}, RGB ${current.r}, ${current.g}, ${current.b}.`;

  // ── Setters ──────────────────────────────────────────────────────────────

  function applyRgb(rgb: RGB) {
    setCurrent(rgb);
    setHexInput(rgbToHex(rgb));
    setHexError(false);
  }

  // Sliders are disabled during the challenge because learners must match targets with the HEX input.
  const slidersLocked = interactive;

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
    if (!interactive || stageController.result !== 'idle') return;
    applyRgb(rgb);
  }

  // ── Challenge flow ────────────────────────────────────────────────────────

  function handleCheck() {
    if (!interactive) return;
    if (isClose) stageController.markPassed();
    else stageController.markIncorrect();
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>HEX / RGB dual editor</span>

      <ExerciseStage
        controller={stageController}
        incorrectFeedback="That HEX value is not close enough to the target. Try this stage again."
        passedFeedback="Target matched. Continue to the next target."
        completionFeedback="All three HEX targets matched."
      >
        <div className={styles.root}>

        {/* ─ Swatches ─ */}
        <div className={styles.swatchRow}>
          {/* Current color */}
          <div className={styles.swatchBox}>
            <span className={styles.swatchLabel}>current</span>
            <div
              className={styles.swatch}
              style={{ backgroundColor: rgbString(current) }}
              aria-hidden="true"
            />
            <span className={styles.swatchValue}>
              {rgbToHex(current)} · rgb({current.r} {current.g} {current.b})
            </span>
          </div>

          {/* Challenge target */}
          <div className={styles.swatchBox}>
            <span className={styles.swatchLabel}>
              target color
            </span>
            <div
              className={styles.swatch}
              style={{ backgroundColor: interactive ? rgbString(target.rgb) : 'transparent' }}
              aria-hidden="true"
            />
            <span className={styles.swatchValue}>
              {interactive ? target.name : 'no target'}
            </span>
            {interactive && <VisualDescription>{`Target appearance: ${TARGET_DESCRIPTIONS[target.name]}`}</VisualDescription>}
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
            disabled={!interactive || stageController.result !== 'idle'}
            onChange={(e) => handleHexChange(e.target.value)}
            aria-label="HEX color input"
            aria-describedby="hex-current-description"
            aria-invalid={hexError}
            spellCheck={false}
          />
          {hexError && (
            <span className={styles.hexError} role="alert">invalid HEX</span>
          )}
        </div>

        {/* ─ RGB sliders ─ */}
        {slidersLocked && (
          <span style={{ fontSize: '1rem', color: 'var(--muted)' }}>
            sliders locked; type a HEX value to match
          </span>
        )}
        <div className={styles.sliders}>
          {CHANNELS.map(({ key, label, trackColor }) => (
            <div key={key} className={styles.sliderRow}>
              <div className={styles.sliderHeader}>
                <span className={styles.sliderName}>
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
                aria-describedby="hex-current-description"
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
                  aria-hidden="true"
                />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ─ Challenge check / feedback ─ */}
        {interactive && stageController.result === 'idle' && (
          <>
              <button className={styles.checkBtn} onClick={handleCheck}>
                check match
              </button>
          </>
        )}
        <VisualDescription id="hex-current-description">{currentDescription}</VisualDescription>
        </div>
      </ExerciseStage>
    </div>
  );
});
