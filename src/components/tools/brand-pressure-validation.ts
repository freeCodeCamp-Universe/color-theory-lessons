import { contrastRatioWcag, hexToRgb } from '../../utils/color.ts';

const BRAND = '#7c3aed';
const NORMAL_TEXT_MINIMUM = 4.5;

export type RoleKey = 'page-bg' | 'surface' | 'primary-text' | 'neutral-divider';

export interface FixedAction {
  label: string;
  role: string;
  background: string;
  foreground: string;
}

export const FIXED_ACTIONS: readonly FixedAction[] = [
  { label: 'Save', role: 'action', background: BRAND, foreground: '#ffffff' },
  { label: 'Cancel', role: 'secondary-action', background: '#a78bfa', foreground: '#1c1917' },
];

function getContrast(fg: string, bg: string): number {
  try { return contrastRatioWcag(hexToRgb(fg), hexToRgb(bg)); } catch { return 1; }
}

function isValidHex(h: string) { return /^#[0-9a-fA-F]{6}$/.test(h); }

function brandPressurePercent(roles: Record<RoleKey, string>): number {
  let count = 0;
  const brandHue = 262;
  for (const val of Object.values(roles)) {
    if (!isValidHex(val)) continue;
    try {
      const rgb = hexToRgb(val);
      const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max === min) continue;
      let h = 0;
      if (max === r) h = ((g - b) / (max - min)) * 60;
      else if (max === g) h = (2 + (b - r) / (max - min)) * 60;
      else h = (4 + (r - g) / (max - min)) * 60;
      if (h < 0) h += 360;
      const diff = Math.abs(h - brandHue);
      const wrapped = Math.min(diff, 360 - diff);
      const s = (max - min) / max;
      if (wrapped < 50 && s > 0.3) count++;
    } catch { /* skip */ }
  }
  // count is out of 4 editable roles + 2 read-only = 6 total visual areas
  const total = 6;
  const brandCount = count + 2; // action and secondary_action always brand
  return Math.round((brandCount / total) * 100);
}

export function getBrandPressureStatus(
  roles: Record<RoleKey, string>,
  fixedActions: readonly FixedAction[] = FIXED_ACTIONS,
) {
  const pageTextContrast = getContrast(roles['primary-text'], roles['page-bg']);
  const cardTextContrast = getContrast(roles['primary-text'], roles['surface']);
  const surfaceContrast = getContrast(roles['surface'], roles['page-bg']);
  const pressure = brandPressurePercent(roles);
  const actionChecks = fixedActions.map(action => {
    const ratio = getContrast(action.foreground, action.background);
    return { ...action, ratio, pass: ratio >= NORMAL_TEXT_MINIMUM };
  });

  const pageTextOk = pageTextContrast >= NORMAL_TEXT_MINIMUM;
  const cardTextOk = cardTextContrast >= NORMAL_TEXT_MINIMUM;
  const surfaceOk = surfaceContrast >= 1.2;
  const pressureOk = pressure < 40;
  const fixedActionsOk = actionChecks.every(check => check.pass);

  return {
    pageTextContrast,
    cardTextContrast,
    surfaceContrast,
    pressure,
    actionChecks,
    pageTextOk,
    cardTextOk,
    surfaceOk,
    pressureOk,
    allPass: pageTextOk && cardTextOk && surfaceOk && pressureOk && fixedActionsOk,
  };
}
