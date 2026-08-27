/** A named color exposed by an authored visual. */
export interface AccessibleColor {
  /** Human-readable color name, using the same terminology as the visible UI. */
  name: string;
  /** Visible color value, such as a HEX, RGB, HSL, or token value. */
  value: string;
}

/** Accessibility metadata for content that communicates visual information. */
export interface DescribedVisual {
  classification: 'informative' | 'assessment';
  /** Short name for the visual when its visible heading is not sufficient. */
  accessibleName?: string;
  /**
   * Authored equivalent for the visible evidence. Assessment descriptions must
   * describe only observable evidence and must not identify the expected answer.
   */
  accessibleDescription: string;
  /** Colors whose names and values are available to sighted learners. */
  colors?: AccessibleColor[];
}

/** Decorative content is excluded from the accessibility tree. */
export interface DecorativeVisual {
  classification: 'decorative';
}

export type VisualAccessibility = DescribedVisual | DecorativeVisual;
