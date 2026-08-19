import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneConfig } from '../../types/milestone.ts';
import { useMilestoneCompletion } from '../../hooks/useMilestoneCompletion.ts';
import { units } from '../../data/units.ts';
import { ChallengeRenderer } from './ChallengeRenderer.tsx';
import { InterfaceMockup } from './InterfaceMockup.tsx';
import styles from './MilestonePlayer.module.css';

interface MilestonePlayerProps {
  milestone: MilestoneConfig;
}

type Phase = 'question' | 'challenge' | 'part-summary' | 'complete';

interface Answer {
  questionId: string;
  isCorrect: boolean;
}

function phaseForPart(milestone: MilestoneConfig, index: number): Extract<Phase, 'question' | 'challenge'> {
  return milestone.parts[index]?.kind === 'challenge' ? 'challenge' : 'question';
}

export function MilestonePlayer({ milestone }: MilestonePlayerProps) {
  const { completeMilestone } = useMilestoneCompletion(milestone.id);
  const [partIndex, setPartIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>(() => phaseForPart(milestone, 0));

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
      { questionId: currentQuestion.id, isCorrect: choice.isCorrect },
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
      // Last question of last part — complete the milestone
      completeMilestone();
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
      completeMilestone();
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
        </div>

        {/* Part progress dots */}
        <div className={styles.progress} aria-label="Milestone progress">
          {milestone.parts.map((p, i) => (
            <span
              key={p.id}
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
          <div className={styles.stepContent}>
            <div className={styles.questionMeta}>
              <span className={styles.partLabel}>
                Part {partIndex + 1} of {milestone.parts.length} — {currentPart.title}
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
                  </label>
                );
              })}
            </fieldset>

            {submitted && currentQuestion.choices.find((c) => c.id === selectedChoice)?.explanation && (
              <p className={styles.explanation}>
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
          <div className={styles.stepContent}>
            <div className={styles.questionMeta}>
              <span className={styles.partLabel}>
                Part {partIndex + 1} of {milestone.parts.length} — {currentPart.title}
              </span>
              <span className={styles.questionCounter}>Challenge · {currentPart.pointValue} point{currentPart.pointValue === 1 ? '' : 's'}</span>
            </div>

            <p className={styles.questionPrompt}>{currentPart.briefing}</p>
          </div>
        )}

        {/* ── Part summary phase ── */}
        {phase === 'part-summary' && (
          <div className={styles.partSummary}>
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
          <div className={styles.complete}>
            <span
              className={`${styles.completeBadge} ${passed ? styles.completeBadgePassed : styles.completeBadgeFailed}`}
            >
              {passed ? 'milestone passed' : 'milestone complete'}
            </span>
            <p className={styles.completeTitle}>{milestone.title}</p>
            <p className={styles.completeScore}>
              {totalScore} / {totalPossiblePoints} points
              {passed
                ? ` — you passed (needed ${milestone.passThreshold})`
                : ` — needed ${milestone.passThreshold} to pass`}
            </p>
            <div className={styles.completeActions}>
              {nextUnitFirstLesson && (
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
