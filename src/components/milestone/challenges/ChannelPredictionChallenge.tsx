import { useEffect, useMemo, useRef, useState } from 'react';
import { CHANNEL_PREDICTION_SESSION_PREFIX } from '../../../state/persistence.ts';
import { hexToRgb, rgbToHex } from '../../../utils/color.ts';
import styles from './ChannelPredictionChallenge.module.css';

interface ChannelPredictionChallengeProps {
  onComplete: () => void;
  sessionKey?: string;
}

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
  {
    id: 'r1',
    dominantHex: '#2563eb',
    dominantAnswer: 'B',
    mixA: '#ff0000',
    mixB: '#00ff00',
    swatches: ['#ff00ff', '#ffff00', '#00ffff', '#ffffff'],
    mixAnswer: '#ffff00',
  },
  {
    id: 'r2',
    dominantHex: '#16a34a',
    dominantAnswer: 'G',
    mixA: '#0000ff',
    mixB: '#00ff00',
    swatches: ['#ff0000', '#00ffff', '#ffff00', '#ff00ff'],
    mixAnswer: '#00ffff',
  },
  {
    id: 'r3',
    dominantHex: '#ea580c',
    dominantAnswer: 'R',
    mixA: '#ff0000',
    mixB: '#0000ff',
    swatches: ['#ff00ff', '#00ff00', '#ffffff', '#ffff00'],
    mixAnswer: '#ff00ff',
  },
  {
    id: 'r4',
    dominantHex: '#7c3aed',
    dominantAnswer: 'B',
    mixA: '#00ff00',
    mixB: '#ff00ff',
    swatches: ['#ffffff', '#0000ff', '#ffff00', '#ff0000'],
    mixAnswer: '#ffffff',
  },
];

const MIN_TO_PASS = 6;

interface ChannelPredictionSession {
  version: 1;
  dominantAnswers: Record<string, Channel | ''>;
  mixAnswers: Record<string, string>;
  submitted: boolean;
}

function loadSession(sessionKey?: string): ChannelPredictionSession {
  const fallback: ChannelPredictionSession = {
    version: 1,
    dominantAnswers: {},
    mixAnswers: {},
    submitted: false,
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

    const allAnswered = ROUNDS.every(
      (round) => dominantAnswers[round.id] && mixAnswers[round.id],
    );
    return {
      version: 1,
      dominantAnswers,
      mixAnswers,
      submitted: saved.submitted === true && allAnswered,
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

export function ChannelPredictionChallenge({ onComplete, sessionKey }: ChannelPredictionChallengeProps) {
  const [initialSession] = useState(() => loadSession(sessionKey));
  const [dominantAnswers, setDominantAnswers] = useState<Record<string, Channel | ''>>(
    initialSession.dominantAnswers,
  );
  const [mixAnswers, setMixAnswers] = useState<Record<string, string>>(initialSession.mixAnswers);
  const [submitted, setSubmitted] = useState(initialSession.submitted);
  const firstAnswerRef = useRef<HTMLButtonElement>(null);
  const focusFirstAnswerAfterRetry = useRef(false);

  useEffect(() => {
    saveSession(sessionKey, { version: 1, dominantAnswers, mixAnswers, submitted });
  }, [dominantAnswers, mixAnswers, sessionKey, submitted]);

  useEffect(() => {
    if (!submitted && focusFirstAnswerAfterRetry.current) {
      firstAnswerRef.current?.focus();
      focusFirstAnswerAfterRetry.current = false;
    }
  }, [submitted]);

  const score = useMemo(() => {
    return ROUNDS.reduce((acc, round) => {
      const dominantCorrect = dominantAnswers[round.id] === round.dominantAnswer;
      const mixCorrect = mixAnswers[round.id]?.toUpperCase() === round.mixAnswer.toUpperCase();
      return acc + (dominantCorrect ? 1 : 0) + (mixCorrect ? 1 : 0);
    }, 0);
  }, [dominantAnswers, mixAnswers]);

  const maxScore = ROUNDS.length * 2;
  const passed = score >= MIN_TO_PASS;
  const allAnswered = ROUNDS.every((round) => dominantAnswers[round.id] && mixAnswers[round.id]);
  const answeredCount = ROUNDS.reduce((count, round) => (
    count
    + (dominantAnswers[round.id] ? 1 : 0)
    + (mixAnswers[round.id] ? 1 : 0)
  ), 0);

  function handleAction() {
    if (!submitted) {
      if (allAnswered) setSubmitted(true);
      return;
    }

    if (passed) {
      onComplete();
      return;
    }

    focusFirstAnswerAfterRetry.current = true;
    setDominantAnswers({});
    setMixAnswers({});
    setSubmitted(false);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.meta}>
        <span>4 prediction rounds</span>
        <span className={styles.score}>
          {submitted ? `${score} / ${maxScore} correct` : `${answeredCount} / ${maxScore} answered`}
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
            <h2 id={`${round.id}-title`} className={styles.roundTitle}>Round {index + 1}</h2>
            <fieldset className={styles.questionGroup}>
              <legend className={styles.prompt}>Which channel dominates <code>{round.dominantHex}</code> (R:{rgb.r} G:{rgb.g} B:{rgb.b})?</legend>
              <div className={styles.choices}>
              {(['R', 'G', 'B'] as Channel[]).map((channel) => (
                <button
                  key={channel}
                  type="button"
                  className={`${styles.choice} ${dominantAnswers[round.id] === channel ? styles.active : ''}`}
                  onClick={() => setDominantAnswers((prev) => ({ ...prev, [round.id]: channel }))}
                  aria-pressed={dominantAnswers[round.id] === channel}
                  disabled={submitted}
                  ref={index === 0 && channel === 'R' ? firstAnswerRef : undefined}
                >
                  {channel}
                </button>
              ))}
              </div>
            </fieldset>

            <fieldset className={styles.questionGroup}>
              <legend className={styles.prompt}>What does <code>{round.mixA}</code> + <code>{round.mixB}</code> produce?</legend>
              <div className={styles.swatches}>
              {round.swatches.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  className={`${styles.swatch} ${mixAnswers[round.id] === swatch ? styles.active : ''}`}
                  onClick={() => setMixAnswers((prev) => ({ ...prev, [round.id]: swatch }))}
                  aria-pressed={mixAnswers[round.id] === swatch}
                  disabled={submitted}
                >
                  <span className={styles.chip} style={{ backgroundColor: swatch }} aria-hidden="true" />
                  <span className={styles.swatchLabel}>{swatch.toUpperCase()}</span>
                </button>
              ))}
              </div>
            </fieldset>
            {submitted && (
              <p className={styles.roundResult}>
                {Number(dominantAnswers[round.id] === round.dominantAnswer)
                  + Number(mixAnswers[round.id]?.toUpperCase() === round.mixAnswer.toUpperCase())} of 2 correct in round {index + 1}.
              </p>
            )}
            {computedMix !== round.mixAnswer && <p className={styles.prompt}>Round data error detected.</p>}
          </section>
        );
      })}

      {submitted && (
        <p className={styles.result} role="status" aria-live="polite">
          {passed
            ? `${score} of ${maxScore} correct. You can finish the challenge.`
            : `${score} of ${maxScore} correct. You need at least ${MIN_TO_PASS} correct. Try again.`}
        </p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={handleAction}
          disabled={!submitted && !allAnswered}
        >
          {!submitted ? 'check answers' : passed ? 'finish challenge' : 'try again'}
        </button>
      </div>
    </div>
  );
}
