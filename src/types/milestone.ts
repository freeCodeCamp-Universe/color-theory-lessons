/** A single multiple-choice question within a milestone quiz part. */
export interface MilestoneQuestion {
  /** Unique identifier for the question. */
  id: string;
  /** The question text. */
  prompt: string;
  /** 
   * Optional hex color to display as a large swatch in the right panel.
   * Useful for color-matching or identification tasks.
   */
  swatchColor?: string;
  /** Selectable answers. */
  choices: { 
    id: string; 
    label: string; 
    isCorrect: boolean; 
    /** Feedback provided after the user selects this choice. */
    explanation?: string 
  }[];
}

/** A sequence of knowledge-check questions within a milestone. */
export interface MilestoneQuizPart {
  kind: 'quiz';
  /** Unique identifier for this part. */
  id: string;
  /** Section title. */
  title: string;
  /** Narrative description/instruction for this part. */
  description: string;
  /** The array of questions to be answered sequentially. */
  questions: MilestoneQuestion[];
}

/** Supported milestone challenge component types. */
export type MilestoneChallengeType =
  | 'read-interface'
  | 'channel-prediction'
  | 'theme-from-scratch'
  | 'simulation-spotter'
  | 'accessibility-rescue'
  | 'semantic-audit'
  | 'dark-mode-stress';

/** An interactive exercise that acts as a practical challenge in a milestone. */
export interface MilestoneChallengePart {
  kind: 'challenge';
  /** Unique identifier for this part. */
  id: string;
  /** Section title. */
  title: string;
  /** Description shown before the challenge starts. */
  description: string;
  /** 
   * Maps to the specific component rendered by the milestone's 
   * challenge renderer (e.g., 'read-interface').
   */
  challengeType: MilestoneChallengeType;
  /** Instructions shown in the left panel while the challenge is active. */
  briefing: string;
  /** Narrative feedback shown after the user completes the challenge. */
  successMessage: string;
  /** 
   * Contribution to the milestone score upon completion.
   * Equivalent to a single correct quiz answer.
   */
  pointValue: number;
}

/** A milestone is composed of multiple parts (quizzes or interactive challenges). */
export type MilestonePart = MilestoneQuizPart | MilestoneChallengePart;

/** Configuration for a unit's final capstone assessment. */
export interface MilestoneConfig {
  /** Unique identifier (e.g., 'milestone-1'). */
  id: string;
  /** ID of the unit this milestone concludes. */
  unitId: string;
  /** Display title for the milestone start screen. */
  title: string;
  /** Broad overview of the milestone's objectives. */
  description: string;
  /** Predicted completion time for the UI. */
  estimatedMinutes: number;
  /** 
   * Optional persistent visual shown in the right panel for quiz parts.
   * Individual questions can also specify a `swatchColor` which takes precedence.
   */
  heroVisual?: 'interface-mockup';
  /** 
   * Total points (correct answers + challenge points) required to pass 
   * and unlock the next unit.
   */
  passThreshold: number;
  /** Sequential segments of the milestone. */
  parts: MilestonePart[];
}
