import { memo, useState } from 'react';
import shellStyles from './ToolShell.module.css';

interface CardData {
  name: string;
  tint: string;
  description: string;
  risk: string;
  colorEffect: string;
}

const CARDS: CardData[] = [
  {
    name: 'Protanopia',
    tint: '#ff6b6b',
    description:
      'Loss of function from the L-cone photopigment. Red-green distinctions are harder to make, and reds can appear darker.',
    risk: 'Status systems using red/green chips with no labels.',
    colorEffect: 'Some red and green shades look alike, and red can appear darker.',
  },
  {
    name: 'Protanomaly',
    tint: '#ff9999',
    description:
      'Altered L-cone photopigment sensitivity. Some red-green distinctions are harder to make, and reds can appear greener and less bright.',
    risk: 'Subtle tonal differences in red-green areas, such as chart series.',
    colorEffect: 'Some red and green shades look alike, and red can appear greener and less bright.',
  },
  {
    name: 'Deuteranopia',
    tint: '#6bcb77',
    description:
      'Loss of function from the M-cone photopigment. Red-green distinctions are harder to make.',
    risk: 'Red-green success/error states, traffic-light color systems.',
    colorEffect: 'Red and green can be difficult or impossible to distinguish.',
  },
  {
    name: 'Deuteranomaly',
    tint: '#99d9a0',
    description:
      'Altered M-cone photopigment sensitivity. It is the most common inherited type of color vision deficiency and makes some red-green distinctions harder.',
    risk: 'Maps and charts using red/green with no direct labels.',
    colorEffect: 'Some green shades can appear more red.',
  },
  {
    name: 'Tritanopia',
    tint: '#4d9de0',
    description:
      'Loss of function from the S-cone photopigment. Several blue-yellow color distinctions are harder to make.',
    risk: 'Warnings that rely on yellow against blue or green without text or icons.',
    colorEffect: 'Blue can be confused with green, purple with red, and yellow with pink.',
  },
  {
    name: 'Achromatopsia',
    tint: '#aaaaaa',
    description:
      'Achromatopsia reduces color discrimination and also affects visual acuity and light sensitivity. In the complete form, all three cone types lack function.',
    risk: 'Any interface relying on hue for meaning without sufficient lightness contrast.',
    colorEffect: 'Complete achromatopsia removes color discrimination; incomplete forms retain some.',
  },
];

interface VisionCardsToolProps {
  interactive?: boolean;
  onComplete?: () => void;
  previewExpandedNames?: string[];
}

export const VisionCardsTool = memo(function VisionCardsTool({ interactive = false, onComplete, previewExpandedNames }: VisionCardsToolProps) {
  const [expanded, setExpanded] = useState<boolean[]>(
    CARDS.map((c) => previewExpandedNames?.includes(c.name) ?? false)
  );
  const [everExpanded, setEverExpanded] = useState<boolean[]>(CARDS.map(() => false));
  const [completed, setCompleted] = useState(false);

  function toggleCard(idx: number) {
    if (!interactive) return;
    const nextExpanded = [...expanded];
    nextExpanded[idx] = !nextExpanded[idx];
    setExpanded(nextExpanded);

    const nextEver = [...everExpanded];
    nextEver[idx] = true;
    setEverExpanded(nextEver);

    if (nextEver.every(Boolean) && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  }

  const allExplored = everExpanded.every(Boolean);

  return (
    <div className={shellStyles.shell}>
      <span className={shellStyles.toolLabel}>vision types</span>

      {!interactive && (
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
          Review the expanded cards to learn about each type of color vision deficiency.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {CARDS.map((card, idx) => {
          const isOpen = expanded[idx];
          const wasSeen = everExpanded[idx];
          return (
            <div
              key={card.name}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => toggleCard(idx)}
                disabled={!interactive}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  background: isOpen
                    ? `color-mix(in srgb, ${card.tint} 12%, var(--surface))`
                    : 'transparent',
                  border: 'none',
                  cursor: interactive ? 'pointer' : 'default',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: card.tint, flexShrink: 0, border: '1px solid var(--border)',
                }} />
                <strong style={{ fontSize: '0.85rem', flex: 1 }}>{card.name}</strong>
                {wasSeen && !isOpen && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-success)' }}>✓</span>
                )}
                {interactive && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                )}
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 0.75rem 0.65rem',
                  background: `color-mix(in srgb, ${card.tint} 5%, var(--surface))`,
                }}>
                  <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.35rem' }}>
                    {card.description}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                    <strong>Common risk:</strong> {card.risk}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
                    <strong>Color effects:</strong> {card.colorEffect}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allExplored && (
        <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          All six cards explored. Check that your designs do not rely on color alone.
        </p>
      )}
    </div>
  );
});
