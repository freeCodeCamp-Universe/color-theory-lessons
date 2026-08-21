import { memo, useState, useMemo } from 'react';

interface HueWheelProps {
  /** Current hue angle in degrees (0–359). */
  hue: number;
  /** When true, the wheel responds to click and keyboard input. */
  interactive: boolean;
  /** Called with the new hue whenever the user changes it. */
  onChange: (hue: number) => void;
}

export const HUE_MAX = 359;

/**
 * A circular hue-selector widget.
 *
 * Renders a full-spectrum color ring, marks the selected hue angle with a
 * dot, and forwards click and keyboard events to `onChange`.  When
 * `interactive` is true the SVG acts as an ARIA `slider` so keyboard and
 * assistive-technology users can operate it.
 */
export const HueWheel = memo(function HueWheel({ hue, interactive, onChange }: HueWheelProps) {
  const [focused, setFocused] = useState(false);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  const ringWidth = 28;

  const segments = useMemo(() => {
    const count = 60;
    return Array.from({ length: count }, (_, i) => {
      const startAngle = (i / count) * 360;
      const endAngle = ((i + 1) / count) * 360;
      const s1 = (startAngle - 90) * (Math.PI / 180);
      const e1 = (endAngle - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(s1);
      const y1 = cy + r * Math.sin(s1);
      const x2 = cx + r * Math.cos(e1);
      const y2 = cy + r * Math.sin(e1);
      const xi = cx + (r - ringWidth) * Math.cos(s1);
      const yi = cy + (r - ringWidth) * Math.sin(s1);
      const xi2 = cx + (r - ringWidth) * Math.cos(e1);
      const yi2 = cy + (r - ringWidth) * Math.sin(e1);
      return {
        d: `M ${xi} ${yi} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r - ringWidth} ${r - ringWidth} 0 0 0 ${xi} ${yi} Z`,
        hue: startAngle,
      };
    });
  }, [cx, cy, r, ringWidth]);

  function hueToXY(h: number, radius: number) {
    const angle = (h - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const dist = Math.sqrt(x * x + y * y);
    if (dist < r - ringWidth || dist > r + 5) return;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    onChange(((Math.round(angle) + 360) % 360));
  }

  function handleKeyDown(e: React.KeyboardEvent<SVGSVGElement>) {
    if (!interactive) return;
    const delta =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 5
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -5
      : 0;
    if (delta === 0) return;
    e.preventDefault();
    onChange(((hue + delta) + 360) % 360);
  }

  const dot = hueToXY(hue, r - ringWidth / 2);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={interactive ? 0 : -1}
      role="slider"
      aria-disabled={!interactive}
      aria-valuemin={0}
      aria-valuemax={HUE_MAX}
      aria-valuenow={hue}
      aria-label={`Hue wheel: ${hue}°`}
      style={{ cursor: interactive ? 'crosshair' : 'default', flexShrink: 0, outline: 'none' }}
    >
      {focused && interactive && (
        <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="var(--accent-cta)" strokeWidth={2} strokeDasharray="4 3" />
      )}
      {segments.map((seg) => (
        <path key={seg.hue} d={seg.d} fill={`hsl(${seg.hue}, 80%, 55%)`} />
      ))}
      {/* Center fill */}
      <circle cx={cx} cy={cy} r={r - ringWidth} fill="var(--surface)" />
      {/* Selected hue dot */}
      <circle cx={dot.x} cy={dot.y} r={10} fill={`hsl(${hue}, 80%, 55%)`} stroke="var(--gray-00)" strokeWidth={2} />
    </svg>
  );
});
