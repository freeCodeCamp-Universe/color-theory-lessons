import type { ReactNode } from 'react';
import type { DescribedVisual } from '../../types/accessibility.ts';

interface VisualDescriptionProps {
  id?: string;
  children?: ReactNode;
  visual?: DescribedVisual;
}

/** Renders an authored visual equivalent without adding visible duplicate text. */
export function VisualDescription({ id, children, visual }: VisualDescriptionProps) {
  const colors = visual?.colors
    ?.map((color) => `${color.name}: ${color.value}`)
    .join('; ');

  return (
    <span id={id} className="sr-only">
      {visual?.accessibleName ? `${visual.accessibleName}. ` : null}
      {visual?.accessibleDescription}
      {colors ? ` Colors: ${colors}.` : null}
      {children}
    </span>
  );
}
