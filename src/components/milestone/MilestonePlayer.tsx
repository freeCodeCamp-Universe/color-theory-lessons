import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneConfig } from '../../types/milestone.ts';
import { useMilestoneCompletion } from '../../hooks/useMilestoneCompletion.ts';
import { units } from '../../data/units.ts';
import { MILESTONE_SESSION_PREFIX } from '../../state/persistence.ts';
import { ChallengeRenderer } from './ChallengeRenderer.tsx';
import { InterfaceMockup } from './InterfaceMockup.tsx';
import styles from './MilestonePlayer.module.css';

interface MilestonePlayerProps {
  milestone: MilestoneConfig;
}

type Phase = 'question' | 'challenge' | 'part-summary' | 'complete';

interface Answer {
  questionId: string;
  choiceId: string;
  isCorrect: boolean;
}

interface MilestoneSessionState {
  version: 1;
  phase: Phase;
  partIndex: number;
  questionIndex: number;
  selectedChoice: string | null;
  submitted: boolean;
  answers: Answer[];
  completedChallenges: string[];
  attemptId: number;
}

function phaseForPart(milestone: MilestoneConfig, index: number): Extract<Phase, 'question' | 'challenge'> {
  return milestone.parts[index]?.kind === 'challenge' ? 'challenge' : 'question';
}

function initialMilestoneSession(milestone: MilestoneConfig): MilestoneSessionState {
  return {
    version: 1,
    phase: phaseForPart(milestone, 0),
    partIndex: 0,
    questionIndex: 0,
    selectedChoice: null,
    submitted: false,
    answers: [],
    completedChallenges: [],
    attemptId: 1,
  };
}

function loadMilestoneSession(milestone: MilestoneConfig): MilestoneSessionState {
  const fallback = initialMilestoneSession(milestone);

  try {
    const stored = sessionStorage.getItem(`${MILESTONE_SESSION_PREFIX}${milestone.id}`);
    if (stored === null) return fallback;

    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return fallback;
    const saved = parsed as Partial<MilestoneSessionState>;

    const partIndex = Number.isInteger(saved.partIndex)
      ? Math.min(Math.max(saved.partIndex as number, 0), milestone.parts.length - 1)
      : 0;
    const part = milestone.parts[partIndex];
    const questionIndex = part.kind === 'quiz' && Number.isInteger(saved.questionIndex)
      ? Math.min(Math.max(saved.questionIndex as number, 0), part.questions.length - 1)
      : 0;
    const currentQuestion = part.kind === 'quiz' ? part.questions[questionIndex] : undefined;

    const answers: Answer[] = [];
    if (Array.isArray(saved.answers)) {
      for (const savedAnswer of saved.answers) {
        if (typeof savedAnswer !== 'object' || savedAnswer === null) continue;
        const answer = savedAnswer as Partial<Answer>;
        const question = milestone.parts
          .flatMap((item) => item.kind === 'quiz' ? item.questions : [])
          .find((item) => item.id === answer.questionId);
        const choice = question?.choices.find((item) => item.id === answer.choiceId);
        if (!question || !choice || answers.some((item) => item.questionId === question.id)) continue;
        answers.push({ questionId: question.id, choiceId: choice.id, isCorrect: choice.isCorrect });
      }
    }

    const challengeIds = new Set(
      milestone.parts.filter((item) => item.kind === 'challenge').map((item) => item.id),
    );
    const completedChallenges = Array.isArray(saved.completedChallenges)
      ? saved.completedChallenges.filter((id): id is string => typeof id === 'string' && challengeIds.has(id))
      : [];
    const selectedChoice = typeof saved.selectedChoice === 'string'
      && currentQuestion?.choices.some((choice) => choice.id === saved.selectedChoice)
      ? saved.selectedChoice
      : null;
    const validPhases: Phase[] = ['question', 'challenge', 'part-summary', 'complete'];
    let phase = validPhases.includes(saved.phase as Phase) ? saved.phase as Phase : phaseForPart(milestone, partIndex);
    if (phase === 'question' && part.kind !== 'quiz') phase = phaseForPart(milestone, partIndex);
    if (phase === 'challenge' && part.kind !== 'challenge') phase = phaseForPart(milestone, partIndex);

    return {
      version: 1,
      phase,
      partIndex,
      questionIndex,
      selectedChoice,
      submitted: saved.submitted === true && selectedChoice !== null,
      answers,
      completedChallenges,
      attemptId: Number.isInteger(saved.attemptId) && (saved.attemptId as number) > 0
        ? saved.attemptId as number
        : 1,
    };
  } catch {
    return fallback;
  }
}

function saveMilestoneSession(milestoneId: string, state: MilestoneSessionState) {
  try {
    sessionStorage.setItem(`${MILESTONE_SESSION_PREFIX}${milestoneId}`, JSON.stringify(state));
  } catch {
    // Continue without per-tab milestone persistence when storage is unavailable.
  }
}

export function MilestonePlayer({ milestone }: MilestonePlayerProps) {
  const { completeMilestone } = useMilestoneCompletion(milestone.id);
  const [initialSession] = useState(() => loadMilestoneSession(milestone));
  const [partIndex, setPartIndex] = useState(initialSession.partIndex);
  const [questionIndex, setQuestionIndex] = useState(initialSession.questionIndex);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(initialSession.selectedChoice);
  const [submitted, setSubmitted] = useState(initialSession.submitted);
  const [answers, setAnswers] = useState<Answer[]>(initialSession.answers);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(initialSession.completedChallenges);
  const [attemptId, setAttemptId] = useState(initialSession.attemptId);
  const [phase, setPhase] = useState<Phase>(initialSession.phase);
  const activeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveMilestoneSession(milestone.id, {
      version: 1,
      phase,
      partIndex,
      questionIndex,
      selectedChoice,
      submitted,
      answers,
      completedChallenges,
      attemptId,
    });
  }, [answers, attemptId, completedChallenges, milestone.id, partIndex, phase, questionIndex, selectedChoice, submitted]);

  useEffect(() => {
    activeContentRef.current?.focus();
  }, [partIndex, phase, questionIndex]);

  const currentPart = milestone.parts[partIndex];
  const currentQuestion = phase === 'question' && currentPart.kind === 'quiz'
    ? currentPart.questions[questionIndex]
    : null;

  const totalQuestions = milestone.parts.reduce((acc, p) => acc + (p.kind === 'quiz' ? p.questions.length : 0), 0);
  const totalChallengePoints = milestone.parts.reduce((acc, p) => acc + (p.kind === 'challenge' ? p.pointValue : 0), 0);
  const totalPossiblePoints = totalQuestions + totalChallengePoints;
  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const challengePointsEarned = milestone.parts.reduce((acc, p) => {
    if (p.kind !== 'challenge') return acc;
    return completedChallenges.includes(p.id) ? acc + p.pointValue : acc;
  }, 0);
  const totalScore = totalCorrect + challengePointsEarned;
  const passed = totalScore >= milestone.passThreshold;

  // How many questions completed before the current part
  const questionsBeforePart = milestone.parts
    .slice(0, partIndex)
    .reduce((acc, p) => acc + (p.kind === 'quiz' ? p.questions.length : 0), 0);
  const globalQuestionNumber = questionsBeforePart + questionIndex + 1;

  // Correct count within the current part only (for part-summary)
  const partQuestionIds = currentPart.kind === 'quiz'
    ? new Set(currentPart.questions.map((q) => q.id))
    : null;
  const partCorrect = currentPart.kind === 'quiz'
    ? answers.filter((a) => partQuestionIds?.has(a.questionId) && a.isCorrect).length
    : completedChallenges.includes(currentPart.id)
      ? currentPart.pointValue
      : 0;
  const partMaxScore = currentPart.kind === 'quiz' ? currentPart.questions.length : currentPart.pointValue;

  // Next unit's first lesson (for the complete screen)
  const currentUnitIndex = units.findIndex((u) => u.id === milestone.unitId);
  const nextUnit = currentUnitIndex >= 0 ? units[currentUnitIndex + 1] : undefined;
  const nextUnitFirstLesson = nextUnit?.lessons[0];

  function handleChoiceSelect(id: string) {
    if (submitted) return;
    setSelectedChoice(id);
  }

  function handleSubmit() {
    if (!selectedChoice || submitted || !currentQuestion) return;
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;
    setSubmitted(true);
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, choiceId: choice.id, isCorrect: choice.isCorrect },
    ]);
  }

  function handleNext() {
    if (currentPart.kind !== 'quiz') return;

    const isLastQuestion = questionIndex >= currentPart.questions.length - 1;
    const isLastPart = partIndex >= milestone.parts.length - 1;

    if (!isLastQuestion) {
      setQuestionIndex((i) => i + 1);
      setSelectedChoice(null);
      setSubmitted(false);
    } else if (!isLastPart) {
      setPhase('part-summary');
    } else {
      if (passed) completeMilestone();
      setPhase('complete');
    }
  }

  function handleNextPart() {
    const nextPartIndex = partIndex + 1;

    setPartIndex(nextPartIndex);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setSubmitted(false);
    setPhase(phaseForPart(milestone, nextPartIndex));
  }

  function handleCompleteChallenge() {
    if (currentPart.kind !== 'challenge') return;
    setCompletedChallenges((prev) => prev.includes(currentPart.id) ? prev : [...prev, currentPart.id]);

    const isLastPart = partIndex >= milestone.parts.length - 1;
    if (isLastPart) {
      const alreadyCompleted = completedChallenges.includes(currentPart.id);
      const finalScore = totalScore + (alreadyCompleted ? 0 : currentPart.pointValue);
      if (finalScore >= milestone.passThreshold) completeMilestone();
      setPhase('complete');
      return;
    }

    setPhase('part-summary');
  }

  function handleRetry() {
    setPartIndex(0);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setSubmitted(false);
    setAnswers([]);
    setCompletedChallenges([]);
    setAttemptId((id) => id + 1);
    setPhase(phaseForPart(milestone, 0));
  }

  // Determine right-panel content
  const showMockup =
    milestone.heroVisual === 'interface-mockup' && phase !== 'complete';
  const swatchColor =
    phase === 'question' && currentQuestion?.swatchColor
      ? currentQuestion.swatchColor
      : undefined;

  return (
    <div className={styles.layout}>
      {/* ── Left instruction panel ── */}
      <aside className={styles.panel}>
        <div className={styles.milestoneMeta}>
          <span className={styles.unitLabel}>
            Unit {milestone.unitId.split('-')[1]} · Milestone
          </span>
          <h1 className={styles.milestoneTitle}>{milestone.title}</h1>
          <p className={styles.milestoneDescription}>{milestone.description}</p>
          <span className={styles.estimatedTime}>About {milestone.estimatedMinutes} minutes</span>
        </div>

        {/* Part progress dots */}
        <div
          className={styles.progress}
          role="progressbar"
          aria-label={`Milestone progress: part ${phase === 'complete' ? milestone.parts.length : partIndex + 1} of ${milestone.parts.length}`}
          aria-valuemin={1}
          aria-valuemax={milestone.parts.length}
          aria-valuenow={phase === 'complete' ? milestone.parts.length : partIndex + 1}
        >
          {milestone.parts.map((p, i) => (
            <span
              key={p.id}
              aria-hidden="true"
              className={`${styles.progressDot} ${
                i < partIndex
                  ? styles.done
                  : i === partIndex && phase !== 'complete'
                    ? styles.current
                    : phase === 'complete'
                      ? styles.done
                      : ''
              }`}
            />
          ))}
        </div>

        {/* ── Question phase ── */}
        {phase === 'question' && currentQuestion && (
          <div className={styles.stepContent} ref={activeContentRef} tabIndex={-1}>
            <div className={styles.questionMeta}>
              <span className={styles.partLabel}>
                Part {partIndex + 1} of {milestone.parts.length}: {currentPart.title}
              </span>
              <span className={styles.questionCounter}>
                {globalQuestionNumber} / {totalQuestions}
              </span>
            </div>

            <p className={styles.questionPrompt}>{currentQuestion.prompt}</p>

            <fieldset className={styles.choices}>
              <legend className={styles.choicesLegend}>{currentQuestion.prompt}</legend>
              {currentQuestion.choices.map((choice) => {
                const isSelected = selectedChoice === choice.id;
                const showResult = submitted;
                const choiceClass = `${styles.choice} ${
                  showResult && choice.isCorrect
                    ? styles.correct
                    : showResult && isSelected && !choice.isCorrect
                      ? styles.incorrect
                      : isSelected && !showResult
                        ? styles.chosen
                        : ''
                }`;
                const inputId = `choice-${currentQuestion.id}-${choice.id}`;
                return (
                  <label
                    key={choice.id}
                    htmlFor={inputId}
                    className={choiceClass}
                  >
                    <input
                      type="radio"
                      id={inputId}
                      name={`question-${currentQuestion.id}`}
                      value={choice.id}
                      checked={isSelected}
                      onChange={() => handleChoiceSelect(choice.id)}
                      disabled={submitted}
                      className={styles.choiceRadio}
                    />
                    <span className={styles.choiceKey}>{choice.id}.</span>
                    <span>{choice.label}</span>
                    {showResult && choice.isCorrect && <span className={styles.srOnly}> Correct answer.</span>}
                    {showResult && isSelected && !choice.isCorrect && <span className={styles.srOnly}> Incorrect answer.</span>}
                  </label>
                );
              })}
            </fieldset>

            {submitted && currentQuestion.choices.find((c) => c.id === selectedChoice)?.explanation && (
              <p className={styles.explanation} role="status" aria-live="polite">
                <strong>
                  {currentQuestion.choices.find((c) => c.id === selectedChoice)!.isCorrect ? 'Correct. ' : 'Not quite. '}
                </strong>
                {currentQuestion.choices.find((c) => c.id === selectedChoice)!.explanation}
              </p>
            )}

            <div className={styles.stepActions}>
              {!submitted ? (
                <button
                  className={styles.btnPrimary}
                  onClick={handleSubmit}
                  disabled={!selectedChoice}
                >
                  check
                </button>
              ) : (
                <button className={styles.btnPrimary} onClick={handleNext}>
                  {currentPart.kind === 'quiz' && questionIndex < currentPart.questions.length - 1
                    ? 'next →'
                    : partIndex < milestone.parts.length - 1
                      ? 'finish part →'
                      : 'finish milestone →'}
                </button>
              )}
            </div>
          </div>
        )}

        {phase === 'challenge' && currentPart.kind === 'challenge' && (
          <div className={styles.stepContent} ref={activeContentRef} tabIndex={-1}>
            <div className={styles.questionMeta}>
              <span className={styles.partLabel}>
                Part {partIndex + 1} of {milestone.parts.length}: {currentPart.title}
              </span>
              <span className={styles.questionCounter}>Challenge · {currentPart.pointValue} point{currentPart.pointValue === 1 ? '' : 's'}</span>
            </div>

            <p className={styles.questionPrompt}>{currentPart.briefing}</p>
          </div>
        )}

        {/* ── Part summary phase ── */}
        {phase === 'part-summary' && (
          <div className={styles.partSummary} ref={activeContentRef} tabIndex={-1}>
            <span className={styles.partSummaryBadge}>
              Part {partIndex + 1} complete
            </span>
            <p className={styles.partSummaryTitle}>{currentPart.title}</p>
            <p className={styles.partSummaryScore}>
              {currentPart.kind === 'quiz'
                ? `${partCorrect} of ${partMaxScore} correct`
                : `${partCorrect} of ${partMaxScore} points earned`}
            </p>
            {currentPart.kind === 'challenge' && (
              <p className={styles.explanation}>{currentPart.successMessage}</p>
            )}
            <div className={styles.stepActions}>
              <button className={styles.btnPrimary} onClick={handleNextPart}>
                next part →
              </button>
            </div>
          </div>
        )}

        {/* ── Complete phase ── */}
        {phase === 'complete' && (
          <div className={styles.complete} ref={activeContentRef} tabIndex={-1}>
            <div className={styles.completeResult} role="status" aria-live="polite">
              <span
                className={`${styles.completeBadge} ${passed ? styles.completeBadgePassed : styles.completeBadgeFailed}`}
              >
                {passed ? 'milestone passed' : 'milestone not passed'}
              </span>
              <p className={styles.completeTitle}>{milestone.title}</p>
              <p className={styles.completeScore}>
                {totalScore} of {totalPossiblePoints} points.
                {passed
                  ? ` You needed ${milestone.passThreshold} to pass.`
                  : ` You need ${milestone.passThreshold} to pass.`}
              </p>
            </div>
            <div className={styles.completeActions}>
              {passed && nextUnitFirstLesson && (
                <Link
                  to={`/lesson/${nextUnitFirstLesson}`}
                  className={styles.btnPrimary}
                >
                  continue to Unit {(currentUnitIndex + 2)} →
                </Link>
              )}
              <button className={styles.btnSecondary} onClick={handleRetry}>
                retry milestone
              </button>
              <Link to="/" className={styles.btnSecondary}>
                ← all units
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* ── Right context panel ── */}
      <div className={styles.contextPanel}>
        {phase === 'challenge' && currentPart.kind === 'challenge' ? (
          <ChallengeRenderer
            challengeType={currentPart.challengeType}
            onComplete={handleCompleteChallenge}
            sessionKey={`${milestone.id}:${attemptId}`}
          />
        ) : swatchColor ? (
          <div className={styles.swatchPanel}>
            <span className={styles.swatchLabel}>target color</span>
            <div
              className={styles.swatch}
              style={{ backgroundColor: swatchColor }}
            />
            <span className={styles.swatchHex}>{swatchColor.toUpperCase()}</span>
            <p className={styles.swatchHint}>
              Identify which RGB channel values produce this color.
            </p>
          </div>
        ) : showMockup ? (
          <InterfaceMockup />
        ) : (
          <div className={styles.contextCard}>
            <span className={styles.contextCardLabel}>
              Part {partIndex + 1} of {milestone.parts.length}
            </span>
            <p className={styles.contextCardTitle}>{currentPart.title}</p>
            <p className={styles.contextCardDesc}>{currentPart.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
