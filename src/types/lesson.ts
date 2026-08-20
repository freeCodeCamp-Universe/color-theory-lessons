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

export type InteractionType =
  | 'color-wheel'
  | 'rgb-mixer'
  | 'palette-builder'
  | 'contrast-checker'
  | 'before-after'
  | 'slider-explore'
  | 'additive-sort'
  | 'logic-fixer'
  | 'mismatch-explainer'
  | 'background-shift'
  | 'interface-tuner'
  | 'format-reveal'
  | 'hex-rgb-editor'
  | 'hsl-playground'
  | 'alpha-layer'
  | 'theme-sandbox'
  | 'token-map'
  | 'color-space-lab'
  | 'eye-diagram'
  | 'vision-cards'
  | 'interface-gallery'
  | 'color-only-detector'
  | 'state-workshop'
  | 'inclusive-review'
  | 'broken-usable-cards'
  | 'text-contrast-lab'
  | 'component-checker'
  | 'color-alone-rebuild'
  | 'audit-flow'
  | 'pattern-repair'
  | 'system-comparison'
  | 'role-builder'
  | 'brand-pressure'
  | 'dark-translator'
  | 'chart-tuner'
  | 'system-stress'
  | 'none';

export type StepPanelConfig =
  | { type: 'color-wheel-preview'; relationship: 'analogous' | 'complementary' | 'triadic' }
  | { type: 'hsl-slider-preview'; dimension: 'h' | 's' | 'l' }
  | { type: 'rgb-mixer-preview'; mode: 'extremes' | 'channel-pairs' | 'neutral-grays' }
  | { type: 'hsl-playground-preview' }
  | { type: 'vision-cards-preview'; expandedNames: string[] }
  | { type: 'interface-gallery-preview'; simulation: 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia' }
  | { type: 'before-after-preview'; mockup: 'purposeful' | 'noisy' };

export interface LessonStep {
  text: string;
  panel?: StepPanelConfig | null;
}

export interface Challenge {
  prompt: string;
  hints: string[];
}

export interface QuizItem {
  id: string;
  prompt: string;
  colorSwatches?: { label: string; color: string }[];
  choices: { id: string; label: string; isCorrect: boolean; explanation?: string }[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedLessons: string[];
}
