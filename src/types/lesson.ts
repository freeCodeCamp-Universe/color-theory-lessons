import type { VisualAccessibility } from './accessibility.ts';

export interface UnitConfig {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  milestoneId: string;
}

export interface LessonConfig {
  id: string;
  unitId: string;
  title: string;
  interactionType: InteractionType;
  steps: LessonStep[];
  challenge: Challenge;
  quizItems: QuizItem[];
  reviewTags: string[];
  keyPoints?: string[];
}

export const INTERACTION_TYPES = [
  'color-wheel',
  'rgb-mixer',
  'temperature-sorter',
  'contrast-checker',
  'before-after',
  'slider-explore',
  'additive-sort',
  'logic-fixer',
  'mismatch-explainer',
  'background-shift',
  'format-reveal',
  'hex-rgb-editor',
  'hsl-playground',
  'alpha-layer',
  'theme-sandbox',
  'token-map',
  'color-space-lab',
  'eye-diagram',
  'vision-cards',
  'interface-gallery',
  'color-only-detector',
  'state-workshop',
  'inclusive-review',
  'text-contrast-lab',
  'component-checker',
  'audit-flow',
  'pattern-repair',
  'system-comparison',
  'role-builder',
  'brand-pressure',
  'dark-translator',
  'chart-tuner',
  'system-stress',
] as const;

export type InteractionType = (typeof INTERACTION_TYPES)[number];

type StepPanelAccessibility = {
  /** Authored accessibility treatment for the rendered step visual. */
  accessibility?: VisualAccessibility;
};

export type StepPanelConfig = StepPanelAccessibility & (
  | { type: 'color-wheel-preview'; relationship: 'analogous' | 'complementary' | 'triadic' }
  | { type: 'hsl-slider-preview'; dimension: 'h' | 's' | 'l' }
  | { type: 'rgb-mixer-preview'; mode: 'extremes' | 'channel-pairs' | 'neutral-grays' }
  | { type: 'hsl-playground-preview' }
  | { type: 'vision-cards-preview'; expandedNames: string[] }
  | { type: 'interface-gallery-preview'; simulation: 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia' }
  | { type: 'before-after-preview'; mockup: 'purposeful' | 'noisy' }
);

export interface LessonStep {
  text: string;
  panel?: StepPanelConfig | null;
}

export interface Challenge {
  prompt: string;
  hints: ChallengeHint[];
}

export type ChallengeHint = string | {
  text: string;
  /** Stable stage identifier from the exercise-stage contract. */
  stageId?: string;
};

export interface QuizChoice {
  stableId: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizItem {
  id: string;
  prompt: string;
  colorSwatches?: {
    /** Visible color name. */
    label: string;
    /** Visible color value. */
    color: string;
    /** Assessment-safe description of the evidence visible in the swatch. */
    accessibleDescription?: string;
  }[];
  choices: QuizChoice[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedLessons: string[];
}
