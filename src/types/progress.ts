/** Represents the user's course progress, persisted across sessions. */
export interface ProgressState {
  /** Array of IDs for lessons that the user has fully finished. */
  completedLessons: string[];
  /** Array of IDs for lesson quizzes that the user has submitted. */
  completedQuizzes: string[];
  /** Map of quiz IDs to the user's highest achieved score. */
  quizBestScores: Record<string, number>;
  /** Array of IDs for unit milestones completed. */
  completedMilestones: string[];
}
