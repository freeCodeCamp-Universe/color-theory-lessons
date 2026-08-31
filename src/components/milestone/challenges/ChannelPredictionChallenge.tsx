import { Fragment, useEffect, useMemo, useState } from 'react';
import { CHANNEL_PREDICTION_SESSION_PREFIX } from '../../../state/persistence.ts';
import { hexToRgb, rgbToHex } from '../../../utils/color.ts';
import { ExerciseStage } from '../../tools/ExerciseStage.tsx';
import type { ExerciseStageDefinition, ExerciseStageResult } from '../../tools/exercise-stage.ts';
import { useExerciseStages } from '../../tools/useExerciseStages.ts';
import styles from './ChannelPredictionChallenge.module.css';
import type { MilestoneChallengeProps, StoredMilestoneStage } from './milestone-stage.ts';
import { restoreMilestoneStage } from './milestone-stage.ts';
import { VisualDescription } from '../../accessibility/VisualDescription.tsx';

type Channel = 'R' | 'G' | 'B';

type Round = {
  id: string;
  dominantHex: string;
  dominantAnswer: Channel;
  mixA: string;
  mixB: string;
  swatches: string[];
  mixAnswer: string;
};

const ROUNDS: Round[] = [
  { id: 'r1', dominantHex: '#2563eb', dominantAnswer: 'B', mixA: '#ff0000', mixB: '#00ff00', swatches: ['#ff00ff', '#ffff00', '#00ffff', '#ffffff'], mixAnswer: '#ffff00' },
  { id: 'r2', dominantHex: '#16a34a', dominantAnswer: 'G', mixA: '#0000ff', mixB: '#00ff00', swatches: ['#ff0000', '#00ffff', '#ffff00', '#ff00ff'], mixAnswer: '#00ffff' },
  { id: 'r3', dominantHex: '#ea580c', dominantAnswer: 'R', mixA: '#ff0000', mixB: '#0000ff', swatches: ['#ff00ff', '#00ff00', '#ffffff', '#ffff00'], mixAnswer: '#ff00ff' },
  { id: 'r4', dominantHex: '#7c3aed', dominantAnswer: 'B', mixA: '#00ff00', mixB: '#ff00ff', swatches: ['#ffffff', '#0000ff', '#ffff00', '#ff0000'], mixAnswer: '#ffffff' },
];

const MIN_PER_STAGE = 3;
const SWATCH_DESCRIPTIONS: Record<string, string> = {
  '#ff0000': 'A fully saturated red swatch.',
  '#00ff00': 'A fully saturated green swatch.',
  '#0000ff': 'A fully saturated blue swatch.',
  '#ff00ff': 'A fully saturated magenta swatch.',
  '#ffff00': 'A fully saturated yellow swatch.',
  '#00ffff': 'A fully saturated cyan swatch.',
  '#ffffff': 'A white swatch.',
};
const STAGES: readonly ExerciseStageDefinition[] = [
  {
    id: 'dominant-channel',
    title: 'Predict dominant channels',
    instruction: 'Identify the dominant RGB channel in each of the four colors.',
    nextActionLabel: 'continue to additive mixes',
  },
  {
    id: 'additive-mix',
    title: 'Predict additive mixes',
    instruction: 'Choose the result of each additive color mix.',
  },
];

interface ChannelPredictionSession extends StoredMilestoneStage {
  version: 1;
  dominantAnswers: Record<string, Channel | ''>;
  mixAnswers: Record<string, string>;
}

function loadSession(sessionKey?: string): ChannelPredictionSession {
  const fallback: ChannelPredictionSession = {
    version: 1,
    dominantAnswers: {},
    mixAnswers: {},
    activeStageId: STAGES[0].id,
    stageResult: 'idle',
  };
  if (!sessionKey) return fallback;

  try {
    const stored = sessionStorage.getItem(`${CHANNEL_PREDICTION_SESSION_PREFIX}${sessionKey}`);
    if (stored === null) return fallback;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return fallback;
    const saved = parsed as Partial<ChannelPredictionSession>;
    const channels = new Set<Channel>(['R', 'G', 'B']);
    const dominantAnswers: Record<string, Channel | ''> = {};
    const mixAnswers: Record<string, string> = {};

    for (const round of ROUNDS) {
      const dominantAnswer = saved.dominantAnswers?.[round.id];
      if (dominantAnswer === '' || channels.has(dominantAnswer as Channel)) {
        dominantAnswers[round.id] = dominantAnswer as Channel | '';
      }
      const mixAnswer = saved.mixAnswers?.[round.id];
      if (typeof mixAnswer === 'string' && round.swatches.includes(mixAnswer.toLowerCase())) {
        mixAnswers[round.id] = mixAnswer.toLowerCase();
      }
    }

    const stage = restoreMilestoneStage(saved, STAGES);
    const currentAnswersComplete = ROUNDS.every((round) => (
      stage.activeStageId === 'dominant-channel'
        ? dominantAnswers[round.id]
        : mixAnswers[round.id]
    ));
    return {
      version: 1,
      dominantAnswers,
      mixAnswers,
      ...stage,
      stageResult: currentAnswersComplete ? stage.stageResult : 'idle',
    };
  } catch {
    return fallback;
  }
}

function saveSession(sessionKey: string | undefined, session: ChannelPredictionSession) {
  if (!sessionKey) return;
  try {
    sessionStorage.setItem(
      `${CHANNEL_PREDICTION_SESSION_PREFIX}${sessionKey}`,
      JSON.stringify(session),
    );
  } catch {
    // Continue without per-tab challenge persistence when storage is unavailable.
  }
}

export function ChannelPredictionChallenge({
  onComplete,
  sessionKey,
  onStageChange,
}: MilestoneChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [dominantAnswers, setDominantAnswers] = useState<Record<string, Channel | ''>>(
    initialSession.dominantAnswers,
  );
  const [mixAnswers, setMixAnswers] = useState<Record<string, string>>(initialSession.mixAnswers);
  const stageController = useExerciseStages({
    stages: STAGES,
    onComplete,
    onStageChange,
    initialStageId: initialSession.activeStageId as string,
    initialResult: initialSession.stageResult as ExerciseStageResult,
  });

  useEffect(() => {
    saveSession(sessionKey, {
      version: 1,
      dominantAnswers,
      mixAnswers,
      activeStageId: stageController.activeStage.id,
      stageResult: stageController.result,
    });
  }, [dominantAnswers, mixAnswers, sessionKey, stageController.activeStage.id, stageController.result]);

  const dominantScore = useMemo(() => ROUNDS.reduce((score, round) => (
    score + Number(dominantAnswers[round.id] === round.dominantAnswer)
  ), 0), [dominantAnswers]);
  const mixScore = useMemo(() => ROUNDS.reduce((score, round) => (
    score + Number(mixAnswers[round.id]?.toUpperCase() === round.mixAnswer.toUpperCase())
  ), 0), [mixAnswers]);
  const isDominantStage = stageController.activeStage.id === 'dominant-channel';
  const currentScore = isDominantStage ? dominantScore : mixScore;
  const allAnswered = ROUNDS.every((round) => (
    isDominantStage ? dominantAnswers[round.id] : mixAnswers[round.id]
  ));

  function checkPredictions() {
    if (!allAnswered) return;
    if (currentScore >= MIN_PER_STAGE) stageController.markPassed();
    else stageController.markIncorrect();
  }

  return (
    <div className={styles.panel}>
      <ExerciseStage
        controller={stageController}
        incorrectFeedback={`${currentScore} of 4 correct. You need at least 3 correct in this stage.`}
        passedFeedback={`${currentScore} of 4 dominant-channel predictions are correct. Next action: continue to additive mixes.`}
        completionFeedback={`${currentScore} of 4 additive-mix predictions are correct. Challenge complete.`}
      >
        <div className={styles.meta}>
          <span>4 {isDominantStage ? 'channel' : 'mix'} predictions</span>
          <span className={styles.score}>
            {stageController.result === 'idle'
              ? `${ROUNDS.filter((round) => (isDominantStage ? dominantAnswers[round.id] : mixAnswers[round.id])).length} / 4 answered`
              : `${currentScore} / 4 correct`}
          </span>
        </div>

        {ROUNDS.map((round, index) => {
          const rgb = hexToRgb(round.dominantHex);
          const computedMix = rgbToHex({
            r: Math.min(255, hexToRgb(round.mixA).r + hexToRgb(round.mixB).r),
            g: Math.min(255, hexToRgb(round.mixA).g + hexToRgb(round.mixB).g),
            b: Math.min(255, hexToRgb(round.mixA).b + hexToRgb(round.mixB).b),
          }).toLowerCase();

          return (
            <section key={round.id} className={styles.card} aria-labelledby={`${round.id}-title`}>
              <h3 id={`${round.id}-title`} className={styles.roundTitle}>Round {index + 1}</h3>
              {isDominantStage ? (
                <fieldset className={styles.questionGroup}>
                  <legend className={styles.prompt}>Which channel dominates <code>{round.dominantHex}</code> (R:{rgb.r} G:{rgb.g} B:{rgb.b})?</legend>
                  <div className={styles.choices}>
                    {(['R', 'G', 'B'] as Channel[]).map((channel) => (
                      <button
                        key={channel}
                        type="button"
                        className={`${styles.choice} ${dominantAnswers[round.id] === channel ? styles.active : ''}`}
                        onClick={() => setDominantAnswers((previous) => ({ ...previous, [round.id]: channel }))}
                        aria-pressed={dominantAnswers[round.id] === channel}
                        disabled={stageController.result !== 'idle'}
                      >
                        {channel}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <fieldset className={styles.questionGroup}>
                  <legend className={styles.prompt}>What does <code>{round.mixA}</code> + <code>{round.mixB}</code> produce?</legend>
                  <div className={styles.swatches}>
                    {round.swatches.map((swatch) => (
                      <Fragment key={swatch}>
                      <button
                        aria-describedby={`${round.id}-${swatch.slice(1)}-description`}
                        type="button"
                        className={`${styles.swatch} ${mixAnswers[round.id] === swatch ? styles.active : ''}`}
                        onClick={() => setMixAnswers((previous) => ({ ...previous, [round.id]: swatch }))}
                        aria-pressed={mixAnswers[round.id] === swatch}
                        disabled={stageController.result !== 'idle'}
                      >
                        <span className={styles.chip} style={{ backgroundColor: swatch }} aria-hidden="true" />
                        <span className={styles.swatchLabel}>{swatch.toUpperCase()}</span>
                      </button>
                      <VisualDescription id={`${round.id}-${swatch.slice(1)}-description`}>
                        {SWATCH_DESCRIPTIONS[swatch]}
                      </VisualDescription>
                      </Fragment>
                    ))}
                  </div>
                </fieldset>
              )}
              {computedMix !== round.mixAnswer && <p className={styles.prompt}>Round data error detected.</p>}
            </section>
          );
        })}

        {stageController.result === 'idle' && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.button}
              onClick={checkPredictions}
              disabled={!allAnswered}
            >
              check {isDominantStage ? 'channels' : 'mixes'}
            </button>
          </div>
        )}
      </ExerciseStage>
    </div>
  );
}
