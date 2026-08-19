import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LessonConfig } from '../../types/lesson.ts';
import { useLessonCompletion, type QuizAnswer } from '../../hooks/useLessonCompletion.ts';
import { units } from '../../data/units.ts';
import { ToolRenderer } from '../tools/ToolRenderer.tsx';
import StepPanelRenderer from './StepPanelRenderer.tsx';
import styles from './LessonPlayer.module.css';

interface LessonPlayerProps {
  lesson: LessonConfig;
}

type Phase = 'steps' | 'challenge' | 'quiz' | 'complete';

interface LessonSessionState {
  version: 1;
  phase: Phase;
  stepIndex: number;
  challengeDone: boolean;
  quizIndex: number;
  answers: QuizAnswer[];
  selectedChoice: string | null;
  submitted: boolean;
}

const LESSON_SESSION_PREFIX = 'color-theory-course-lesson-session:';
const LEGACY_STEP_STORAGE_PREFIX = 'color-theory-course-step:';

function initialLessonSession(): LessonSessionState {
  return {
    version: 1,
    phase: 'steps',
    stepIndex: 0,
    challengeDone: false,
    quizIndex: 0,
    answers: [],
    selectedChoice: null,
    submitted: false,
  };
}

function clampIndex(value: unknown, itemCount: number): number {
  if (itemCount === 0 || !Number.isInteger(value)) return 0;
  return Math.min(Math.max(value as number, 0), itemCount - 1);
}

function loadLessonSession(lesson: LessonConfig): LessonSessionState {
  const fallback = initialLessonSession();

  try {
    const stored = sessionStorage.getItem(`${LESSON_SESSION_PREFIX}${lesson.id}`);
    if (stored === null) {
      const legacyStep = sessionStorage.getItem(`${LEGACY_STEP_STORAGE_PREFIX}${lesson.id}`);
      return {
        ...fallback,
        stepIndex: clampIndex(legacyStep === null ? 0 : Number.parseInt(legacyStep, 10), lesson.steps.length),
      };
    }

    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return fallback;

    const saved = parsed as Partial<LessonSessionState>;
    const validPhases: Phase[] = ['steps', 'challenge', 'quiz', 'complete'];
    let phase = validPhases.includes(saved.phase as Phase) ? saved.phase as Phase : 'steps';
    if (phase === 'quiz' && lesson.quizItems.length === 0) phase = 'challenge';

    const quizIndex = clampIndex(saved.quizIndex, lesson.quizItems.length);
    const question = lesson.quizItems[quizIndex];
    const selectedChoice =
      typeof saved.selectedChoice === 'string' &&
      question?.choices.some((choice) => choice.id === saved.selectedChoice)
        ? saved.selectedChoice
        : null;

    const answers: QuizAnswer[] = [];
    if (Array.isArray(saved.answers)) {
      for (const savedAnswer of saved.answers) {
        if (typeof savedAnswer !== 'object' || savedAnswer === null) continue;
        const answer = savedAnswer as Partial<QuizAnswer>;
        const answerQuestion = lesson.quizItems.find((item) => item.id === answer.questionId);
        const choice = answerQuestion?.choices.find((item) => item.id === answer.choiceId);
        if (!answerQuestion || !choice || answers.some((item) => item.questionId === answerQuestion.id)) continue;
        answers.push({
          questionId: answerQuestion.id,
          choiceId: choice.id,
          isCorrect: choice.isCorrect,
        });
      }
    }

    return {
      version: 1,
      phase,
      stepIndex: clampIndex(saved.stepIndex, lesson.steps.length),
      challengeDone: saved.challengeDone === true || phase === 'quiz' || phase === 'complete',
      quizIndex,
      answers,
      selectedChoice,
      submitted: saved.submitted === true && selectedChoice !== null,
    };
  } catch {
    return fallback;
  }
}

function saveLessonSession(lessonId: string, state: LessonSessionState) {
  try {
    sessionStorage.setItem(`${LESSON_SESSION_PREFIX}${lessonId}`, JSON.stringify(state));
  } catch {
    // Continue without per-tab lesson persistence when storage is unavailable.
  }
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const { completeLesson } = useLessonCompletion(lesson);
  const [initialSession] = useState(() => loadLessonSession(lesson));
  const [phase, setPhase] = useState<Phase>(initialSession.phase);
  const [stepIndex, setStepIndex] = useState(initialSession.stepIndex);
  const [challengeDone, setChallengeDone] = useState(initialSession.challengeDone);
  const [quizIndex, setQuizIndex] = useState(initialSession.quizIndex);
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialSession.answers);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(initialSession.selectedChoice);
  const [submitted, setSubmitted] = useState(initialSession.submitted);

  useEffect(() => {
    saveLessonSession(lesson.id, {
      version: 1,
      phase,
      stepIndex,
      challengeDone,
      quizIndex,
      answers,
      selectedChoice,
      submitted,
    });
  }, [answers, challengeDone, lesson.id, phase, quizIndex, selectedChoice, stepIndex, submitted]);

  function handleNextStep() {
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase('challenge');
    }
  }

  function handlePrevStep() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function handleChallengeComplete() {
    setChallengeDone(true);
    if (lesson.quizItems.length > 0) {
      setPhase('quiz');
    } else {
      completeLesson([]);
      setPhase('complete');
    }
  }

  function handleChoiceSelect(choiceId: string) {
    if (submitted) return;
    setSelectedChoice(choiceId);
  }

  function handleRedo() {
    setPhase('steps');
    setStepIndex(0);
    setChallengeDone(false);
    setQuizIndex(0);
    setAnswers([]);
    setSelectedChoice(null);
    setSubmitted(false);
  }

  function handleSubmitAnswer() {
    if (!selectedChoice || submitted) return;
    const question = lesson.quizItems[quizIndex];
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (!choice) return;
    setSubmitted(true);
    setAnswers((prev) => [
      ...prev,
      { questionId: question.id, choiceId: selectedChoice, isCorrect: choice.isCorrect },
    ]);
  }

  function handleNextQuestion() {
    setSelectedChoice(null);
    setSubmitted(false);
    if (quizIndex < lesson.quizItems.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      completeLesson(answers);
      setPhase('complete');
    }
  }

  const question = phase === 'quiz' ? lesson.quizItems[quizIndex] : null;
  const challenge = lesson.challenge;
  const currentStep = lesson.steps[stepIndex];

  const hasRightPanel =
    phase !== 'quiz' && phase !== 'complete' && (
      phase !== 'steps' ||
      stepIndex === lesson.steps.length - 1 ||
      !!currentStep?.panel
    );

  return (
    <div className={styles.layout}>
      {/* ── Left instruction panel ── */}
      <aside className={styles.panel}>
        <div className={styles.lessonMeta}>
          <span className={styles.unitLabel}>
            Unit {lesson.unitId.split('-')[1]} · Lesson {lesson.id.split('-')[1].replace('l', '')}
          </span>
          <h1 className={styles.lessonTitle}>{lesson.title}</h1>
        </div>

        {/* Progress dots */}
        <div className={styles.progress} aria-label="Lesson progress">
          {lesson.steps.map((_, i) => (
            <span
              key={`step-${i}`}
              className={`${styles.progressDot} ${
                phase === 'steps' && i < stepIndex
                  ? styles.done
                  : phase === 'steps' && i === stepIndex
                    ? styles.current
                    : phase !== 'steps'
                      ? styles.done
                      : ''
              }`}
            />
          ))}
          <span
            className={`${styles.progressDot} ${
              challengeDone || phase === 'quiz' || phase === 'complete' || phase === 'challenge' ? styles.done : ''
            }`}
          />
          {lesson.quizItems.map((_, i) => (
            <span
              key={`q${i}`}
              className={`${styles.progressDot} ${
                phase === 'quiz' && i < quizIndex
                  ? styles.done
                  : phase === 'quiz' && i === quizIndex
                    ? styles.current
                    : phase === 'complete'
                      ? styles.done
                      : ''
              }`}
            />
          ))}
        </div>

        {/* ── Steps phase ── */}
        {phase === 'steps' && (
          <div className={styles.stepContent}>
            <div className={styles.scrollArea}>
              <span className={styles.stepNumber}>
                {stepIndex + 1} / {lesson.steps.length}
              </span>
              <p className={styles.stepText}>{currentStep.text}</p>
              {stepIndex === lesson.steps.length - 1 && challenge && (
                <>
                  <p className={styles.challengePrompt}>{challenge.prompt}</p>
                  <div className={styles.hints}>
                    <span className={styles.hintsLabel}>hints</span>
                    {challenge.hints.map((h) => (
                      <p key={h} className={styles.hint}>{h}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className={styles.stepActions}>
              <button
                className={styles.btnSecondary}
                onClick={handlePrevStep}
                disabled={stepIndex === 0}
              >
                back
              </button>
              {stepIndex < lesson.steps.length - 1 ? (
                <button className={styles.btnPrimary} onClick={handleNextStep}>
                  next
                </button>
              ) : challengeDone ? (
                <button className={styles.btnPrimary} onClick={handleChallengeComplete}>
                  {lesson.quizItems.length > 0 ? 'take the quiz →' : 'finish lesson →'}
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* ── Challenge phase ── */}
        {phase === 'challenge' && challenge && (
          <div className={styles.stepContent}>
            <div className={styles.scrollArea}>
              <span className={styles.stepNumber}>challenge</span>
              <p className={styles.challengePrompt}>{challenge.prompt}</p>
              <div className={styles.hints}>
                <span className={styles.hintsLabel}>hints</span>
                {challenge.hints.map((h, i) => (
                  <p key={i} className={styles.hint}>{h}</p>
                ))}
              </div>
            </div>
            <div aria-live="polite">
              {challengeDone && (
                <div className={styles.stepActions}>
                  <button className={styles.btnPrimary} onClick={handleChallengeComplete}>
                    {lesson.quizItems.length > 0 ? 'take the quiz →' : 'finish lesson →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Quiz phase ── */}
        {phase === 'quiz' && question && (
          <div className={styles.stepContent}>
            <div className={styles.scrollArea}>
              <span className={styles.quizHeader}>
                question {quizIndex + 1} of {lesson.quizItems.length}
              </span>
              {question.colorSwatches && question.colorSwatches.length > 0 && (
                <div className={styles.quizSwatches}>
                  {question.colorSwatches.map((swatch) => (
                    <div key={swatch.label} className={styles.swatchItem}>
                      <div className={styles.swatchColor} style={{ backgroundColor: swatch.color }} />
                      <span className={styles.swatchLabel}>{swatch.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className={styles.quizPrompt}>{question.prompt}</p>
              <div className={styles.choices}>
                {question.choices.map((choice) => {
                  const isSelected = selectedChoice === choice.id;
                  const showResult = submitted;
                  return (
                    <button
                      key={choice.id}
                      className={`${styles.choice} ${
                        showResult && choice.isCorrect
                          ? styles.correct
                          : showResult && isSelected && !choice.isCorrect
                            ? styles.incorrect
                            : isSelected && !showResult
                              ? styles.chosen
                              : ''
                      }`}
                      onClick={() => handleChoiceSelect(choice.id)}
                      disabled={submitted && !choice.isCorrect && selectedChoice !== choice.id}
                    >
                      <span className={styles.choiceKey}>{choice.id}.</span>
                      <span>{choice.label}</span>
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite" aria-atomic="true">
                {submitted && question.choices.find((c) => c.id === selectedChoice)?.explanation && (
                  <p className={styles.explanation}>
                    {question.choices.find((c) => c.id === selectedChoice)?.explanation}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.stepActions}>
              {!submitted ? (
                <button
                  className={styles.btnPrimary}
                  onClick={handleSubmitAnswer}
                  disabled={!selectedChoice}
                >
                  check
                </button>
              ) : (
                <button className={styles.btnPrimary} onClick={handleNextQuestion}>
                  {quizIndex < lesson.quizItems.length - 1 ? 'next question →' : 'finish lesson →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Complete phase ── */}
        {phase === 'complete' && (() => {
          const allLessonIds = units.flatMap((unit) => unit.lessons);
          const idx = allLessonIds.indexOf(lesson.id);
          const nextLessonId = idx >= 0 ? allLessonIds[idx + 1] : undefined;
          const nextLesson = nextLessonId
            ? { id: nextLessonId, unitId: nextLessonId.split('-')[0].replace('u', 'unit-') }
            : undefined;
          const isSameUnit = nextLesson?.unitId === lesson.unitId;
          const currentUnit = units.find((u) => u.id === lesson.unitId);
          const isLastInUnit = !isSameUnit;
          const milestoneLink =
            isLastInUnit && currentUnit?.milestoneId
              ? `/milestone/${currentUnit.milestoneId}`
              : null;
          return (
            <div className={styles.complete}>
              <span className={styles.completeBadge}>lesson complete</span>
              <p className={styles.completeTitle}>{lesson.title}</p>
              <p className={styles.completeBody}>
                {answers.filter((a) => a.isCorrect).length} of {lesson.quizItems.length} quiz
                questions correct.
              </p>
              <div className={styles.completeActions}>
                {isSameUnit && nextLesson ? (
                  <Link to={`/lesson/${nextLesson.id}`} className={styles.btnPrimary}>
                    next lesson →
                  </Link>
                ) : milestoneLink ? (
                  <Link to={milestoneLink} className={styles.btnPrimary}>
                    start milestone →
                  </Link>
                ) : nextLesson ? (
                  <Link to={`/lesson/${nextLesson.id}`} className={styles.btnPrimary}>
                    next unit →
                  </Link>
                ) : null}
                <button className={styles.btnSecondary} onClick={handleRedo}>
                  redo lesson
                </button>
                <Link to="/" className={styles.btnSecondary}>
                  ← all units
                </Link>
              </div>
            </div>
          );
        })()}
      </aside>

      {/* ── Right tool panel ── */}
      <div className={hasRightPanel ? styles.rightPanel : styles.rightPanelHidden}>
        {phase === 'steps' && stepIndex < lesson.steps.length - 1
          ? <fieldset className={styles.examplePanel}>
              <legend className={styles.panelExampleLabel}>example</legend>
              <StepPanelRenderer panel={currentStep?.panel} />
            </fieldset>
          : phase !== 'quiz' && phase !== 'complete'
            ? <fieldset className={styles.examplePanel}>
                <legend className={styles.panelExampleLabel}>exercise</legend>
                <ToolRenderer
                  lesson={lesson}
                  onChallengeComplete={() => setChallengeDone(true)}
                />
              </fieldset>
            : null
        }
      </div>
    </div>
  );
}
