import { useState, useMemo, useCallback, Fragment } from 'react';
import {
  hexToRgb,
  hexToHsl,
  hslToHex,
  getRelatedHues,
  parseHex,
  rgbToHex,
  contrastRatioWcag,
  clamp,
  luminanceWcag,
} from '../utils/color.ts';
import type { RGB, Relationship } from '../utils/color.ts';
import styles from './PaletteBuilderPage.module.css';
import { DocumentTitle } from '../components/accessibility/DocumentTitle.tsx';

/* ── Types ────────────────────────────────────────────────────────────────── */

interface PaletteColor {
  hex: string;
  label: string;
}

type RoleKey =
  | 'background'
  | 'surface'
  | 'primaryText'
  | 'secondaryText'
  | 'accent'
  | 'accentSecondary';

const ROLE_LABELS: Record<RoleKey, string> = {
  background: 'background',
  surface: 'surface',
  primaryText: 'primary text',
  secondaryText: 'secondary text',
  accent: 'accent',
  accentSecondary: 'accent 2',
};

const ROLE_KEYS: RoleKey[] = [
  'background',
  'surface',
  'primaryText',
  'secondaryText',
  'accent',
  'accentSecondary',
];

type PickerTab = 'rgb' | 'hsl' | 'swatches';

const CSS_NAMED_COLORS_RAW: { name: string; hex: string }[] = [
  { name: 'red', hex: '#FF0000' },
  { name: 'crimson', hex: '#DC143C' },
  { name: 'firebrick', hex: '#B22222' },
  { name: 'darkred', hex: '#8B0000' },
  { name: 'maroon', hex: '#800000' },
  { name: 'indianred', hex: '#CD5C5C' },
  { name: 'lightcoral', hex: '#F08080' },
  { name: 'salmon', hex: '#FA8072' },
  { name: 'darksalmon', hex: '#E9967A' },
  { name: 'brown', hex: '#A52A2A' },
  { name: 'sienna', hex: '#A0522D' },
  { name: 'saddlebrown', hex: '#8B4513' },
  { name: 'chocolate', hex: '#D2691E' },
  { name: 'peru', hex: '#CD853F' },
  { name: 'sandybrown', hex: '#F4A460' },
  { name: 'rosybrown', hex: '#BC8F8F' },
  { name: 'coral', hex: '#FF7F50' },
  { name: 'tomato', hex: '#FF6347' },
  { name: 'orangered', hex: '#FF4500' },
  { name: 'darkorange', hex: '#FF8C00' },
  { name: 'orange', hex: '#FFA500' },
  { name: 'darkgoldenrod', hex: '#B8860B' },
  { name: 'goldenrod', hex: '#DAA520' },
  { name: 'burlywood', hex: '#DEB887' },
  { name: 'tan', hex: '#D2B48C' },
  { name: 'wheat', hex: '#F5DEB3' },
  { name: 'cornsilk', hex: '#FFF8DC' },
  { name: 'gold', hex: '#FFD700' },
  { name: 'darkkhaki', hex: '#BDB76B' },
  { name: 'khaki', hex: '#F0E68C' },
  { name: 'yellow', hex: '#FFFF00' },
  { name: 'lightyellow', hex: '#FFFFE0' },
  { name: 'olive', hex: '#808000' },
  { name: 'darkolivegreen', hex: '#556B2F' },
  { name: 'olivedrab', hex: '#6B8E23' },
  { name: 'greenyellow', hex: '#ADFF2F' },
  { name: 'chartreuse', hex: '#7FFF00' },
  { name: 'lawngreen', hex: '#7CFC00' },
  { name: 'darkgreen', hex: '#006400' },
  { name: 'green', hex: '#008000' },
  { name: 'forestgreen', hex: '#228B22' },
  { name: 'limegreen', hex: '#32CD32' },
  { name: 'lime', hex: '#00FF00' },
  { name: 'lightgreen', hex: '#90EE90' },
  { name: 'palegreen', hex: '#98FB98' },
  { name: 'seagreen', hex: '#2E8B57' },
  { name: 'mediumseagreen', hex: '#3CB371' },
  { name: 'springgreen', hex: '#00FF7F' },
  { name: 'mediumspringgreen', hex: '#00FA9A' },
  { name: 'mediumaquamarine', hex: '#66CDAA' },
  { name: 'aquamarine', hex: '#7FFFD4' },
  { name: 'teal', hex: '#008080' },
  { name: 'darkcyan', hex: '#008B8B' },
  { name: 'lightseagreen', hex: '#20B2AA' },
  { name: 'mediumturquoise', hex: '#48D1CC' },
  { name: 'turquoise', hex: '#40E0D0' },
  { name: 'darkturquoise', hex: '#00CED1' },
  { name: 'paleturquoise', hex: '#AFEEEE' },
  { name: 'aqua', hex: '#00FFFF' },
  { name: 'lightcyan', hex: '#E0FFFF' },
  { name: 'cadetblue', hex: '#5F9EA0' },
  { name: 'powderblue', hex: '#B0E0E6' },
  { name: 'lightblue', hex: '#ADD8E6' },
  { name: 'skyblue', hex: '#87CEEB' },
  { name: 'lightskyblue', hex: '#87CEFA' },
  { name: 'deepskyblue', hex: '#00BFFF' },
  { name: 'steelblue', hex: '#4682B4' },
  { name: 'lightsteelblue', hex: '#B0C4DE' },
  { name: 'dodgerblue', hex: '#1E90FF' },
  { name: 'cornflowerblue', hex: '#6495ED' },
  { name: 'royalblue', hex: '#4169E1' },
  { name: 'mediumblue', hex: '#0000CD' },
  { name: 'blue', hex: '#0000FF' },
  { name: 'darkblue', hex: '#00008B' },
  { name: 'navy', hex: '#000080' },
  { name: 'midnightblue', hex: '#191970' },
  { name: 'darkslateblue', hex: '#483D8B' },
  { name: 'slateblue', hex: '#6A5ACD' },
  { name: 'mediumslateblue', hex: '#7B68EE' },
  { name: 'mediumpurple', hex: '#9370DB' },
  { name: 'rebeccapurple', hex: '#663399' },
  { name: 'indigo', hex: '#4B0082' },
  { name: 'blueviolet', hex: '#8A2BE2' },
  { name: 'darkviolet', hex: '#9400D3' },
  { name: 'darkorchid', hex: '#9932CC' },
  { name: 'purple', hex: '#800080' },
  { name: 'darkmagenta', hex: '#8B008B' },
  { name: 'mediumorchid', hex: '#BA55D3' },
  { name: 'orchid', hex: '#DA70D6' },
  { name: 'violet', hex: '#EE82EE' },
  { name: 'plum', hex: '#DDA0DD' },
  { name: 'thistle', hex: '#D8BFD8' },
  { name: 'lavender', hex: '#E6E6FA' },
  { name: 'fuchsia', hex: '#FF00FF' },
  { name: 'deeppink', hex: '#FF1493' },
  { name: 'hotpink', hex: '#FF69B4' },
  { name: 'mediumvioletred', hex: '#C71585' },
  { name: 'palevioletred', hex: '#DB7093' },
  { name: 'pink', hex: '#FFC0CB' },
  { name: 'lightpink', hex: '#FFB6C1' },
  { name: 'mistyrose', hex: '#FFE4E1' },
  { name: 'lavenderblush', hex: '#FFF0F5' },
  // Achromatic — sorted by lightness (dark → light)
  { name: 'black', hex: '#000000' },
  { name: 'darkslategray', hex: '#2F4F4F' },
  { name: 'dimgray', hex: '#696969' },
  { name: 'slategray', hex: '#708090' },
  { name: 'lightslategray', hex: '#778899' },
  { name: 'gray', hex: '#808080' },
  { name: 'darkgray', hex: '#A9A9A9' },
  { name: 'silver', hex: '#C0C0C0' },
  { name: 'lightgray', hex: '#D3D3D3' },
  { name: 'gainsboro', hex: '#DCDCDC' },
  { name: 'whitesmoke', hex: '#F5F5F5' },
  { name: 'snow', hex: '#FFFAFA' },
  { name: 'seashell', hex: '#FFF5EE' },
  { name: 'linen', hex: '#FAF0E6' },
  { name: 'antiquewhite', hex: '#FAEBD7' },
  { name: 'oldlace', hex: '#FDF5E6' },
  { name: 'floralwhite', hex: '#FFFAF0' },
  { name: 'beige', hex: '#F5F5DC' },
  { name: 'ivory', hex: '#FFFFF0' },
  { name: 'honeydew', hex: '#F0FFF0' },
  { name: 'mintcream', hex: '#F5FFFA' },
  { name: 'azure', hex: '#F0FFFF' },
  { name: 'aliceblue', hex: '#F0F8FF' },
  { name: 'ghostwhite', hex: '#F8F8FF' },
  { name: 'white', hex: '#FFFFFF' },
];

// Sort chromatic colors by hue, then by lightness; achromatic at the end by lightness
const CSS_NAMED_COLORS = CSS_NAMED_COLORS_RAW.map((c) => {
  const hsl = hexToHsl(c.hex);
  return { ...c, ...hsl };
}).sort((a, b) => {
  const aChrom = a.s > 5;
  const bChrom = b.s > 5;
  if (aChrom && !bChrom) return -1;
  if (!aChrom && bChrom) return 1;
  if (!aChrom && !bChrom) return a.l - b.l;
  if (a.h !== b.h) return a.h - b.h;
  return a.l - b.l;
});

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function buildVariants(hex: string) {
  const { h, s, l } = hexToHsl(hex);
  return {
    lighter: hslToHex(h, s, clamp(l + 25, 0, 96)),
    darker: hslToHex(h, s, clamp(l - 25, 5, 100)),
    muted: hslToHex(h, Math.round(s * 0.4), l),
  };
}

interface HarmonySuggestion {
  hex: string;
  label: string;
  lighter: string;
  darker: string;
  muted: string;
}

function buildHarmonySuggestions(
  primaryHex: string,
  harmony: Relationship,
): HarmonySuggestion[] {
  const { h, s, l } = hexToHsl(primaryHex);
  const relatedHues = getRelatedHues(h, harmony);

  const labels =
    harmony === 'analogous'
      ? ['analogous +30', 'analogous −30']
      : harmony === 'complementary'
        ? ['complement']
        : ['triadic +120', 'triadic +240'];

  return relatedHues.map((hue, i) => {
    const hex = hslToHex(hue, s, l);
    const variants = buildVariants(hex);
    return { hex, label: labels[i], ...variants };
  });
}

function lum(hex: string) {
  return luminanceWcag(hexToRgb(hex));
}

function sortByLuminance(hexes: string[], asc: boolean) {
  return [...hexes].sort((a, b) =>
    asc ? lum(a) - lum(b) : lum(b) - lum(a),
  );
}

function autoAssignRoles(
  palette: PaletteColor[],
  mode: 'dark' | 'light',
): Record<RoleKey, string> {
  const all = palette.map((c) => c.hex);

  // Only use colors that are actually in the palette — repeat if needed
  const pick = (index: number) => all[index % all.length];

  const sorted = sortByLuminance(all, true); // darkest first

  if (mode === 'dark') {
    return {
      background: sorted[0],
      surface: sorted[1 % sorted.length],
      primaryText: sorted[sorted.length - 1],
      secondaryText: sorted[Math.max(sorted.length - 2, 0)],
      accent: pick(0),
      accentSecondary: pick(1),
    };
  } else {
    return {
      background: sorted[sorted.length - 1],
      surface: sorted[Math.max(sorted.length - 2, 0)],
      primaryText: sorted[0],
      secondaryText: sorted[1 % sorted.length],
      accent: pick(0),
      accentSecondary: pick(1),
    };
  }
}

function contrastBadge(ratio: number) {
  if (ratio >= 7)
    return <span className={styles.badgeAaa}>AAA {ratio.toFixed(1)}:1</span>;
  if (ratio >= 4.5)
    return <span className={styles.badgeAa}>AA {ratio.toFixed(1)}:1</span>;
  return <span className={styles.badgeFail}>fail {ratio.toFixed(1)}:1</span>;
}

function ratioOf(a: string, b: string) {
  return contrastRatioWcag(hexToRgb(a), hexToRgb(b));
}

function remapRoleHexes(
  roles: Record<RoleKey, string> | null,
  fromHex: string,
  toHex: string,
) {
  if (!roles) return roles;
  const fromUpper = fromHex.toUpperCase();
  let changed = false;
  const next = { ...roles };
  for (const role of ROLE_KEYS) {
    if (roles[role].toUpperCase() === fromUpper) {
      next[role] = toHex;
      changed = true;
    }
  }
  return changed ? next : roles;
}

function findAccessibleVariant(
  fgHex: string,
  bgHex: string,
  targetRatio: number,
  direction: 'lighten' | 'darken',
): string | null {
  const { h, s } = hexToHsl(fgHex);
  let { l } = hexToHsl(fgHex);
  const step = direction === 'lighten' ? 1 : -1;
  for (let i = 0; i < 101; i++) {
    l = clamp(l + step, 0, 100);
    const candidate = hslToHex(h, s, l);
    if (ratioOf(candidate, bgHex) >= targetRatio) return candidate;
    if (l <= 0 || l >= 100) break;
  }
  return null;
}

interface AccessibilitySuggestion {
  msg: string;
  mode: 'dark' | 'light';
  role: RoleKey;
  suggestedHex: string;
  suggestedLabel: string;
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function PaletteBuilderPage() {
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [primaryHex, setPrimaryHex] = useState<string | null>(null);
  const [paletteColors, setPaletteColors] = useState<PaletteColor[]>([]);
  const [paletteIsCustom, setPaletteIsCustom] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editHexInput, setEditHexInput] = useState('');
  const [paletteError, setPaletteError] = useState('');
  const [darkRoles, setDarkRoles] = useState<Record<RoleKey, string> | null>(
    null,
  );
  const [lightRoles, setLightRoles] = useState<Record<RoleKey, string> | null>(
    null,
  );
  const [openPicker, setOpenPicker] = useState<{
    mode: 'dark' | 'light';
    role: RoleKey;
  } | null>(null);
  const [pickerTab, setPickerTab] = useState<PickerTab>('rgb');
  const [rgbSliders, setRgbSliders] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hslSliders, setHslSliders] = useState({ h: 217, s: 91, l: 60 });

  const isValid = parseHex(hexInput) !== null;

  const paletteHexes = useMemo(
    () => paletteColors.map((c) => c.hex),
    [paletteColors],
  );

  const effectiveDark = useMemo(
    () => darkRoles ?? (paletteColors.length > 0 ? autoAssignRoles(paletteColors, 'dark') : null),
    [darkRoles, paletteColors],
  );
  const effectiveLight = useMemo(
    () => lightRoles ?? (paletteColors.length > 0 ? autoAssignRoles(paletteColors, 'light') : null),
    [lightRoles, paletteColors],
  );

  /* ── All harmony suggestions (all three types at once) ─────────────────── */

  const allHarmonySuggestions = useMemo(() => {
    if (!primaryHex) return [];
    return [
      { type: 'analogous' as Relationship, colors: buildHarmonySuggestions(primaryHex, 'analogous') },
      { type: 'complementary' as Relationship, colors: buildHarmonySuggestions(primaryHex, 'complementary') },
      { type: 'triadic' as Relationship, colors: buildHarmonySuggestions(primaryHex, 'triadic') },
    ];
  }, [primaryHex]);

  const paletteHexSet = useMemo(
    () => new Set(paletteColors.map((c) => c.hex.toUpperCase())),
    [paletteColors],
  );

  const getEditHexError = (index: number) => {
    const parsed = parseHex(editHexInput);
    if (!parsed) return 'Error: enter a 3- or 6-digit hex color.';

    const canonical = rgbToHex(parsed);
    const isDuplicate = paletteColors.some(
      (color, colorIndex) =>
        colorIndex !== index && color.hex.toUpperCase() === canonical,
    );
    return isDuplicate ? 'Error: that color is already in your palette.' : '';
  };

  /* ── Lighter / darker / neutral suggestions ────────────────────────────── */

  const missingLighter = useMemo(() => {
    if (paletteColors.length < 2 || !primaryHex) return [];
    const hasLight = paletteColors.some((c) => hexToHsl(c.hex).l > 75);
    if (hasLight) return [];

    const sources = [...paletteHexes];
    for (const group of allHarmonySuggestions) {
      for (const c of group.colors) sources.push(c.hex);
    }
    const seen = new Set(paletteHexSet);
    const suggestions: { hex: string; from: string }[] = [];
    for (const src of sources) {
      const v = buildVariants(src);
      const upper = v.lighter.toUpperCase();
      if (!seen.has(upper) && hexToHsl(v.lighter).l > 75) {
        seen.add(upper);
        suggestions.push({ hex: v.lighter, from: src });
      }
    }
    return suggestions;
  }, [paletteColors, primaryHex, paletteHexes, paletteHexSet, allHarmonySuggestions]);

  const missingDarker = useMemo(() => {
    if (paletteColors.length < 2 || !primaryHex) return [];
    const hasDark = paletteColors.some((c) => hexToHsl(c.hex).l < 25);
    if (hasDark) return [];

    const sources = [...paletteHexes];
    for (const group of allHarmonySuggestions) {
      for (const c of group.colors) sources.push(c.hex);
    }
    const seen = new Set(paletteHexSet);
    const suggestions: { hex: string; from: string }[] = [];
    for (const src of sources) {
      const v = buildVariants(src);
      const upper = v.darker.toUpperCase();
      if (!seen.has(upper) && hexToHsl(v.darker).l < 25) {
        seen.add(upper);
        suggestions.push({ hex: v.darker, from: src });
      }
    }
    return suggestions;
  }, [paletteColors, primaryHex, paletteHexes, paletteHexSet, allHarmonySuggestions]);

  const missingNeutrals = useMemo(() => {
    if (paletteColors.length < 2 || !primaryHex) return [];
    const hasNeutral = paletteColors.some((c) => hexToHsl(c.hex).s < 20);
    if (hasNeutral) return [];

    const sources = [...paletteHexes];
    for (const group of allHarmonySuggestions) {
      for (const c of group.colors) sources.push(c.hex);
    }
    const seen = new Set(paletteHexSet);
    const suggestions: { hex: string; from: string }[] = [];
    for (const src of sources) {
      const v = buildVariants(src);
      const upper = v.muted.toUpperCase();
      if (!seen.has(upper) && hexToHsl(v.muted).s < 20) {
        seen.add(upper);
        suggestions.push({ hex: v.muted, from: src });
      }
    }
    return suggestions;
  }, [paletteColors, primaryHex, paletteHexes, paletteHexSet, allHarmonySuggestions]);

  /* ── Primary color actions ─────────────────────────────────────────────── */

  const syncPickerStates = useCallback((hex: string) => {
    setHexInput(hex);
    const rgb = hexToRgb(hex);
    setRgbSliders(rgb);
    const hsl = hexToHsl(hex);
    setHslSliders(hsl);
  }, []);

  const applyPrimary = useCallback((hex: string) => {
    setPrimaryHex(hex);
    syncPickerStates(hex);
    if (paletteColors.length === 0) {
      setPaletteColors([{ hex, label: 'primary' }]);
    } else {
      setPaletteColors((prev) =>
        prev.map((c, i) => (i === 0 ? { hex, label: 'primary' } : c)),
      );
    }
    setPaletteIsCustom(false);
    setEditingIndex(null);
    setDarkRoles(null);
    setLightRoles(null);
    setOpenPicker(null);
  }, [paletteColors.length, syncPickerStates]);

  const handleHexBlur = () => {
    const parsed = parseHex(hexInput);
    if (parsed) {
      const canonical = rgbToHex(parsed);
      applyPrimary(canonical);
    }
  };

  const handleHexKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleHexBlur();
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const next = { ...rgbSliders, [channel]: value };
    setRgbSliders(next);
    const hex = rgbToHex(next);
    setHexInput(hex);
    setHslSliders(hexToHsl(hex));
    applyPrimary(hex);
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const next = { ...hslSliders, [channel]: value };
    setHslSliders(next);
    const hex = hslToHex(next.h, next.s, next.l);
    setHexInput(hex.toUpperCase());
    setRgbSliders(hexToRgb(hex));
    applyPrimary(hex.toUpperCase());
  };

  const handleSwatchPick = (hex: string) => {
    applyPrimary(hex);
  };

  const handleRoleClick = (mode: 'dark' | 'light', role: RoleKey) => {
    if (
      openPicker &&
      openPicker.mode === mode &&
      openPicker.role === role
    ) {
      setOpenPicker(null);
    } else {
      setOpenPicker({ mode, role });
    }
  };

  const handleRolePick = (
    mode: 'dark' | 'light',
    role: RoleKey,
    hex: string,
  ) => {
    if (mode === 'dark') {
      setDarkRoles((prev) => ({ ...(prev ?? effectiveDark!), [role]: hex }));
    } else {
      setLightRoles((prev) => ({ ...(prev ?? effectiveLight!), [role]: hex }));
    }
    setOpenPicker(null);
  };

  /* ── Palette edit helpers ───────────────────────────────────────────────── */

  const updatePaletteColor = (index: number, newHex: string) => {
    const isDuplicate = paletteColors.some(
      (color, colorIndex) =>
        colorIndex !== index && color.hex.toUpperCase() === newHex.toUpperCase(),
    );
    if (isDuplicate) return false;

    const previousHex = paletteColors[index]?.hex;
    setPaletteColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex: newHex } : c)),
    );

    if (previousHex) {
      if (index === 0) {
        setPrimaryHex(newHex);
        syncPickerStates(newHex);
      }
      setDarkRoles((prev) => remapRoleHexes(prev, previousHex, newHex));
      setLightRoles((prev) => remapRoleHexes(prev, previousHex, newHex));
    }

    setPaletteIsCustom(true);
    setPaletteError('');
    return true;
  };

  const addPaletteColor = (hex = '#808080', label?: string) => {
    if (paletteHexSet.has(hex.toUpperCase())) {
      setPaletteError(`${hex.toUpperCase()} is already in your palette.`);
      const existingIndex = paletteColors.findIndex(
        (color) => color.hex.toUpperCase() === hex.toUpperCase(),
      );
      setEditingIndex(existingIndex);
      setEditHexInput(hex.toUpperCase());
      return false;
    }

    setPaletteColors((prev) => {
      const customCount = prev.filter((c) => c.label.startsWith('custom')).length;
      return [...prev, { hex, label: label ?? `custom ${customCount + 1}` }];
    });
    setDarkRoles(null);
    setLightRoles(null);
    setPaletteIsCustom(true);
    setEditingIndex(null);
    setPaletteError('');
    return true;
  };

  const removePaletteColor = (index: number) => {
    setPaletteColors((prev) => prev.filter((_, i) => i !== index));
    setDarkRoles(null);
    setLightRoles(null);
    setPaletteIsCustom(true);
    setPaletteError('');
    setEditingIndex((prev) =>
      prev === index ? null : prev !== null && prev > index ? prev - 1 : prev,
    );
  };

  const handleResetPalette = () => {
    if (primaryHex) {
      setPaletteColors([{ hex: primaryHex, label: 'primary' }]);
    } else {
      setPaletteColors([]);
    }
    setPaletteIsCustom(false);
    setEditingIndex(null);
    setPaletteError('');
  };

  /* ── Contrast matrix data ───────────────────────────────────────────────── */

  const uniqueColors = useMemo(() => {
    const seen = new Set<string>();
    return paletteHexes.filter((c) => {
      const upper = c.toUpperCase();
      if (seen.has(upper)) return false;
      seen.add(upper);
      return true;
    });
  }, [paletteHexes]);

  const matrixPairs = useMemo(() => {
    const pairs: { fg: string; bg: string; ratio: number }[] = [];
    for (let i = 0; i < uniqueColors.length; i++) {
      for (let j = i + 1; j < uniqueColors.length; j++) {
        const a = uniqueColors[i];
        const b = uniqueColors[j];
        const lA = hexToHsl(a).l;
        const lB = hexToHsl(b).l;
        if (Math.abs(lA - lB) < 30) continue;
        pairs.push({ fg: a, bg: b, ratio: ratioOf(a, b) });
      }
    }
    pairs.sort((a, b) => b.ratio - a.ratio);
    return pairs;
  }, [uniqueColors]);

  /* ── Accessibility suggestions ──────────────────────────────────────────── */

  const buildA11ySuggestions = (
    roles: Record<RoleKey, string>,
    mode: 'dark' | 'light',
  ): AccessibilitySuggestion[] => {
    const out: AccessibilitySuggestion[] = [];
    const dir1 = mode === 'dark' ? 'lighten' as const : 'darken' as const;
    const dir2 = mode === 'dark' ? 'darken' as const : 'lighten' as const;

    const checks: { fg: string; bg: string; fgRole: RoleKey; bgRole: RoleKey; label1: string; label2: string }[] = [
      { fg: roles.primaryText, bg: roles.background, fgRole: 'primaryText', bgRole: 'background',
        label1: mode === 'dark' ? 'lighter text' : 'darker text', label2: mode === 'dark' ? 'darker background' : 'lighter background' },
      { fg: roles.secondaryText, bg: roles.surface, fgRole: 'secondaryText', bgRole: 'surface',
        label1: mode === 'dark' ? 'lighter text' : 'darker text', label2: mode === 'dark' ? 'darker surface' : 'lighter surface' },
      { fg: roles.accent, bg: roles.background, fgRole: 'accent', bgRole: 'background',
        label1: mode === 'dark' ? 'lighter accent' : 'darker accent', label2: '' },
    ];

    for (const { fg, bg, fgRole, bgRole, label1, label2 } of checks) {
      const ratio = ratioOf(fg, bg);
      if (ratio >= 7) continue;
      const fix = findAccessibleVariant(fg, bg, 7, dir1)
        ?? (label2 ? findAccessibleVariant(bg, fg, 7, dir2) : null);
      const fixRole = findAccessibleVariant(fg, bg, 7, dir1) ? fgRole : bgRole;
      const fixLabel = findAccessibleVariant(fg, bg, 7, dir1) ? label1 : label2;
      if (fix) {
        const pairLabel = fgRole === 'accent' ? 'accent/bg'
          : fgRole === 'primaryText' ? 'primary text/bg' : 'secondary text/surface';
        out.push({
          msg: `${mode === 'dark' ? 'Dark' : 'Light'}: ${pairLabel} is ${ratio.toFixed(1)}:1 — needs 7:1 for AAA.`,
          mode,
          role: fixRole,
          suggestedHex: fix,
          suggestedLabel: fixLabel,
        });
      }
    }
    return out;
  };

  const darkSuggestions = useMemo(
    () => effectiveDark ? buildA11ySuggestions(effectiveDark, 'dark') : [],
    [effectiveDark],
  );

  const lightSuggestions = useMemo(
    () => effectiveLight ? buildA11ySuggestions(effectiveLight, 'light') : [],
    [effectiveLight],
  );

  /* ── Theme insufficiency suggestions ────────────────────────────────────── */

  interface RoleSuggestion {
    msg: string;
    hex: string;
    label: string;
    mode: 'dark' | 'light';
    role: RoleKey;
  }

  const roleSuggestions = useMemo((): RoleSuggestion[] => {
    if (paletteColors.length === 0 || !primaryHex) return [];
    const out: RoleSuggestion[] = [];
    const existing = new Set(paletteHexSet);

    const suggest = (hex: string, label: string, msg: string, mode: 'dark' | 'light', role: RoleKey) => {
      const upper = hex.toUpperCase();
      if (!existing.has(upper)) {
        existing.add(upper);
        out.push({ msg, hex, label, mode, role });
      }
    };

    const primaryHsl = hexToHsl(primaryHex);

    // Check each mode for duplicate roles
    for (const mode of ['dark', 'light'] as const) {
      const roles = mode === 'dark' ? effectiveDark : effectiveLight;
      if (!roles) continue;

      const usedHexes = new Set<string>();
      const duplicateRoles: RoleKey[] = [];
      for (const key of ROLE_KEYS) {
        const upper = roles[key].toUpperCase();
        if (usedHexes.has(upper)) {
          duplicateRoles.push(key);
        }
        usedHexes.add(upper);
      }

      for (const role of duplicateRoles) {
        if (role === 'background' || role === 'surface') {
          // Need a very dark (dark mode) or very light (light mode) color
          const targetL = mode === 'dark'
            ? (role === 'background' ? 5 : 12)
            : (role === 'background' ? 97 : 90);
          const hex = hslToHex(primaryHsl.h, Math.max(primaryHsl.s, 10), targetL);
          suggest(hex, `${mode} ${ROLE_LABELS[role]}`, `${mode} mode: ${ROLE_LABELS[role]} shares a color with another role.`, mode, role);
        } else if (role === 'primaryText' || role === 'secondaryText') {
          // Need a very light (dark mode) or very dark (light mode) color
          const targetL = mode === 'dark'
            ? (role === 'primaryText' ? 95 : 80)
            : (role === 'primaryText' ? 10 : 25);
          const hex = hslToHex(primaryHsl.h, Math.min(primaryHsl.s, 15), targetL);
          suggest(hex, `${mode} ${ROLE_LABELS[role]}`, `${mode} mode: ${ROLE_LABELS[role]} shares a color with another role.`, mode, role);
        } else if (role === 'accentSecondary') {
          // Generate from a harmony color
          const relHues = getRelatedHues(primaryHsl.h, 'complementary');
          const hex = hslToHex(relHues[0], primaryHsl.s, primaryHsl.l);
          suggest(hex, 'accent 2', `${mode} mode: accent 2 shares a color with another role.`, mode, role);
        }
      }
    }

    return out;
  }, [paletteColors, primaryHex, paletteHexSet, effectiveDark, effectiveLight]);

  /* ── Render ─────────────────────────────────────────────────────────────── */

  const previewHex = primaryHex ?? '#3B82F6';
  const primaryHsl = hexToHsl(previewHex);

  const a11ySuggestions = [...darkSuggestions, ...lightSuggestions];

  return (
    <div className={styles.container}>
      <DocumentTitle page="Palette Builder" />
      <h1 className={styles.heading}>palette builder</h1>
      <p className={styles.subtitle}>
        Pick a primary color, explore harmony suggestions, and build your
        palette by choosing the colors you want.
      </p>

      <div className={styles.twoColumn}>
        {/* ════════════════ LEFT: SUGGESTIONS COLUMN ════════════════ */}
        <div className={styles.suggestionsColumn}>

          {/* ── Color Picker ──────────────────────────────────────── */}
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>pick your primary color</h2>

            {/* Preview + hex input row */}
            <div className={styles.inputBar}>
              <div
                className={styles.swatchPreview}
                style={{ backgroundColor: previewHex }}
                aria-hidden="true"
              />
              <div className={styles.pickerMeta}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${!isValid ? styles.hexInputInvalid : ''}`}
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  onBlur={handleHexBlur}
                  onKeyDown={handleHexKey}
                  aria-label="Hex color value"
                  aria-invalid={!isValid}
                  aria-describedby={!isValid ? 'palette-primary-hex-error' : undefined}
                  spellCheck={false}
                />
                {!isValid && (
                  <span id="palette-primary-hex-error" className={styles.inputError}>
                    Error: enter a 3- or 6-digit hex color.
                  </span>
                )}
                <span className={styles.hslReadout}>
                  H {primaryHsl.h} &middot; S {primaryHsl.s} &middot; L {primaryHsl.l}
                </span>
              </div>
            </div>

            {/* Tab buttons */}
            <div className={styles.pickerTabs}>
              {(['rgb', 'hsl', 'swatches'] as PickerTab[]).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.pickerTab} ${pickerTab === tab ? styles.pickerTabActive : ''}`}
                  onClick={() => setPickerTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className={styles.pickerPanel}>
              {pickerTab === 'rgb' && (
                <div className={styles.sliderGroup}>
                  {(['r', 'g', 'b'] as const).map((ch) => (
                    <label key={ch} className={styles.sliderRow}>
                      <span className={styles.sliderLabel}>{ch.toUpperCase()}</span>
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={rgbSliders[ch]}
                        onChange={(e) => handleRgbChange(ch, Number(e.target.value))}
                        className={styles.slider}
                        style={{
                          '--slider-color': ch === 'r' ? '#ff4444' : ch === 'g' ? '#44bb44' : '#4488ff',
                        } as React.CSSProperties}
                        aria-label={`${ch.toUpperCase()} channel`}
                      />
                      <span className={styles.sliderValue}>{rgbSliders[ch]}</span>
                    </label>
                  ))}
                </div>
              )}

              {pickerTab === 'hsl' && (
                <div className={styles.sliderGroup}>
                  {/* Hue ring */}
                  <div className={styles.hueRingWrap}>
                    <div
                      className={styles.hueRing}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const cx = rect.width / 2;
                        const cy = rect.height / 2;
                        const dx = e.clientX - rect.left - cx;
                        const dy = e.clientY - rect.top - cy;
                        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                        const hue = ((angle + 90) % 360 + 360) % 360;
                        handleHslChange('h', Math.round(hue));
                      }}
                      role="slider"
                      aria-label="Hue"
                      aria-valuemin={0}
                      aria-valuemax={360}
                      aria-valuenow={hslSliders.h}
                      tabIndex={0}
                    >
                      <div
                        className={styles.hueIndicator}
                        style={{
                          transform: `rotate(${hslSliders.h - 90}deg) translateX(60px)`,
                          backgroundColor: hslToHex(hslSliders.h, 100, 50),
                        }}
                      />
                      <div
                        className={styles.hueRingCenter}
                        style={{ backgroundColor: previewHex }}
                      />
                    </div>
                  </div>
                  <label className={styles.sliderRow}>
                    <span className={styles.sliderLabel}>H</span>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={hslSliders.h}
                      onChange={(e) => handleHslChange('h', Number(e.target.value))}
                      className={styles.slider}
                      style={{ '--slider-color': hslToHex(hslSliders.h, 100, 50) } as React.CSSProperties}
                      aria-label="Hue"
                    />
                    <span className={styles.sliderValue}>{hslSliders.h}°</span>
                  </label>
                  <label className={styles.sliderRow}>
                    <span className={styles.sliderLabel}>S</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hslSliders.s}
                      onChange={(e) => handleHslChange('s', Number(e.target.value))}
                      className={styles.slider}
                      style={{ '--slider-color': hslToHex(hslSliders.h, 100, 50) } as React.CSSProperties}
                      aria-label="Saturation"
                    />
                    <span className={styles.sliderValue}>{hslSliders.s}%</span>
                  </label>
                  <label className={styles.sliderRow}>
                    <span className={styles.sliderLabel}>L</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hslSliders.l}
                      onChange={(e) => handleHslChange('l', Number(e.target.value))}
                      className={styles.slider}
                      style={{ '--slider-color': hslToHex(hslSliders.h, hslSliders.s, 50) } as React.CSSProperties}
                      aria-label="Lightness"
                    />
                    <span className={styles.sliderValue}>{hslSliders.l}%</span>
                  </label>
                </div>
              )}

              {pickerTab === 'swatches' && (
                <div className={styles.swatchGrid}>
                  {CSS_NAMED_COLORS.map(({ name, hex }) => (
                    <button
                      key={name}
                      className={`${styles.namedSwatch} ${hex.toUpperCase() === previewHex.toUpperCase() ? styles.namedSwatchActive : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => handleSwatchPick(hex)}
                      title={name}
                      aria-label={`${name} (${hex})`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Harmony Suggestions (all three types) ─────────────── */}
          {primaryHex && allHarmonySuggestions.map(({ type, colors }) => {
            const seen = new Set(paletteHexSet);
            const unique: { hex: string; label: string }[] = [];
            for (const color of colors) {
              for (const { hex, label } of [
                { hex: color.hex, label: color.label },
                { hex: color.lighter, label: `${color.label} lighter` },
                { hex: color.darker, label: `${color.label} darker` },
              ]) {
                const upper = hex.toUpperCase();
                if (!seen.has(upper)) {
                  seen.add(upper);
                  unique.push({ hex, label });
                }
              }
            }
            if (unique.length === 0) return null;
            return (
              <div key={type} className={styles.harmonySection}>
                <h2 className={styles.sectionHeading}>{type}</h2>
                <div className={styles.harmonySwatches}>
                  {unique.map(({ hex, label }) => (
                    <button
                      key={hex}
                      className={styles.harmonySwatch}
                      style={{ backgroundColor: hex }}
                      onClick={() => addPaletteColor(hex, label)}
                      title={`${label} — ${hex.toUpperCase()} — click to add`}
                      aria-label={`Add ${label} to palette`}
                    >
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* ── Missing lighter colors ────────────────────────────── */}
          {missingLighter.length > 0 && (
            <div className={styles.harmonySection}>
              <h2 className={styles.sectionHeading}>missing lighter colors</h2>
              <div className={styles.harmonySwatches}>
                {missingLighter.map(({ hex }) => {
                  const isAdded = paletteHexSet.has(hex.toUpperCase());
                  return (
                    <button
                      key={hex}
                      className={`${styles.harmonySwatch} ${isAdded ? styles.harmonySwatchAdded : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => { if (!isAdded) addPaletteColor(hex, 'lighter'); }}
                      disabled={isAdded}
                      title={isAdded ? `${hex.toUpperCase()} — already added` : `${hex.toUpperCase()} — click to add`}
                      aria-label={isAdded ? 'Already in palette' : `Add ${hex.toUpperCase()} to palette`}
                    >
                      {isAdded && <span className={styles.harmonySwatchCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Missing darker colors ─────────────────────────────── */}
          {missingDarker.length > 0 && (
            <div className={styles.harmonySection}>
              <h2 className={styles.sectionHeading}>missing darker colors</h2>
              <div className={styles.harmonySwatches}>
                {missingDarker.map(({ hex }) => {
                  const isAdded = paletteHexSet.has(hex.toUpperCase());
                  return (
                    <button
                      key={hex}
                      className={`${styles.harmonySwatch} ${isAdded ? styles.harmonySwatchAdded : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => { if (!isAdded) addPaletteColor(hex, 'darker'); }}
                      disabled={isAdded}
                      title={isAdded ? `${hex.toUpperCase()} — already added` : `${hex.toUpperCase()} — click to add`}
                      aria-label={isAdded ? 'Already in palette' : `Add ${hex.toUpperCase()} to palette`}
                    >
                      {isAdded && <span className={styles.harmonySwatchCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Missing neutrals ──────────────────────────────────── */}
          {missingNeutrals.length > 0 && (
            <div className={styles.harmonySection}>
              <h2 className={styles.sectionHeading}>missing neutral colors</h2>
              <div className={styles.harmonySwatches}>
                {missingNeutrals.map(({ hex }) => {
                  const isAdded = paletteHexSet.has(hex.toUpperCase());
                  return (
                    <button
                      key={hex}
                      className={`${styles.harmonySwatch} ${isAdded ? styles.harmonySwatchAdded : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => { if (!isAdded) addPaletteColor(hex, 'neutral'); }}
                      disabled={isAdded}
                      title={isAdded ? `${hex.toUpperCase()} — already added` : `${hex.toUpperCase()} — click to add`}
                      aria-label={isAdded ? 'Already in palette' : `Add ${hex.toUpperCase()} to palette`}
                    >
                      {isAdded && <span className={styles.harmonySwatchCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Role gap suggestions ──────────────────────────────── */}
          {roleSuggestions.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>colors needed for theme roles</h2>
              <div className={styles.suggestion}>
                {roleSuggestions.map((s, i) => (
                  <div key={i} className={styles.a11ySuggestion}>
                    <p className={styles.a11ySuggestionMsg}>{s.msg}</p>
                    <div className={styles.a11ySuggestionFix}>
                      <div
                        className={styles.a11ySuggestionSwatch}
                        style={{ backgroundColor: s.hex }}
                      />
                      <span className={styles.a11ySuggestionHex}>
                        {s.hex.toUpperCase()}
                      </span>
                      <button
                        className={styles.a11ySuggestionApply}
                        onClick={() => {
                          addPaletteColor(s.hex, s.label);
                          handleRolePick(s.mode, s.role, s.hex);
                        }}
                        aria-label={`Add ${s.hex.toUpperCase()} and assign as ${ROLE_LABELS[s.role]}`}
                      >
                        + add as {s.mode} {ROLE_LABELS[s.role]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Contrast / accessibility suggestions ──────────────── */}
          {a11ySuggestions.length > 0 && paletteColors.length >= 2 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>accessibility suggestions</h2>
              <div className={styles.suggestion}>
                {a11ySuggestions.map((s, i) => {
                  const alreadyInPalette = paletteHexSet.has(s.suggestedHex.toUpperCase());
                  return (
                    <div key={i} className={styles.a11ySuggestion}>
                      <p className={styles.a11ySuggestionMsg}>{s.msg}</p>
                      <div className={styles.a11ySuggestionFix}>
                        <div
                          className={styles.a11ySuggestionSwatch}
                          style={{ backgroundColor: s.suggestedHex }}
                        />
                        <span className={styles.a11ySuggestionHex}>
                          {s.suggestedHex.toUpperCase()}
                        </span>
                        <span className={styles.a11ySuggestionFixLabel}>
                          {s.suggestedLabel}
                        </span>
                        <button
                          className={styles.a11ySuggestionApply}
                          onClick={() => {
                            if (!alreadyInPalette) addPaletteColor(s.suggestedHex, s.suggestedLabel);
                            handleRolePick(s.mode, s.role, s.suggestedHex);
                          }}
                          aria-label={alreadyInPalette
                            ? `Assign ${s.suggestedHex.toUpperCase()} as ${ROLE_LABELS[s.role]}`
                            : `Add ${s.suggestedHex.toUpperCase()} and assign as ${ROLE_LABELS[s.role]}`}
                        >
                          {alreadyInPalette ? `assign as ${ROLE_LABELS[s.role]}` : `+ add & assign as ${ROLE_LABELS[s.role]}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ════════════════ RIGHT: PALETTE COLUMN ════════════════ */}
        <div className={styles.paletteColumn}>

          {/* ── Palette Grid ──────────────────────────────────────── */}
          <div className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionHeading}>your palette</h2>
              {paletteIsCustom && (
                <button className={styles.resetBtn} onClick={handleResetPalette}>
                  ↺ reset
                </button>
              )}
            </div>

            {paletteColors.length === 0 ? (
              <p className={styles.harmonyDesc}>
                Pick a primary color to get started.
              </p>
            ) : (
              <>
                <div className={styles.paletteGrid}>
                  {paletteColors.map((color, i) => (
                    <div key={i} className={styles.swatchColumn}>
                      <div className={styles.swatchColumnHeader}>
                        <span className={styles.swatchColumnLabel}>{color.label}</span>
                        {paletteColors.length > 1 && (
                          <button
                            className={styles.removeBtn}
                            onClick={() => removePaletteColor(i)}
                            aria-label={`Remove ${color.label}`}
                            title="Remove color"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <button
                        className={styles.swatchEditable}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => {
                          if (editingIndex === i) {
                            setEditingIndex(null);
                          } else {
                            setEditingIndex(i);
                            setEditHexInput(color.hex.toUpperCase());
                          }
                        }}
                        aria-label={`Edit ${color.label} — ${color.hex.toUpperCase()}`}
                        title="Click to edit"
                      />
                      {editingIndex === i && (
                        <div className={styles.editInline}>
                          <input
                            type="color"
                            className={styles.editInlinePicker}
                            value={editHexInput.toLowerCase()}
                            onChange={(e) => {
                              const val = e.target.value.toUpperCase();
                              setEditHexInput(val);
                              updatePaletteColor(i, val);
                            }}
                            aria-label="Pick color"
                          />
                          <div className={styles.editInlineMeta}>
                            <input
                              type="text"
                              className={`${styles.editInlineInput} ${getEditHexError(i) ? styles.hexInputInvalid : ''}`}
                              value={editHexInput}
                              onChange={(e) => setEditHexInput(e.target.value)}
                              onBlur={() => {
                                const parsed = parseHex(editHexInput);
                                if (parsed) {
                                  const canonical = rgbToHex(parsed);
                                  setEditHexInput(canonical);
                                  updatePaletteColor(i, canonical);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const parsed = parseHex(editHexInput);
                                  if (parsed) {
                                    const canonical = rgbToHex(parsed);
                                    setEditHexInput(canonical);
                                    if (updatePaletteColor(i, canonical)) {
                                      setEditingIndex(null);
                                    }
                                  }
                                }
                                if (e.key === 'Escape') setEditingIndex(null);
                              }}
                              autoFocus
                              aria-label="Hex color value"
                              aria-invalid={getEditHexError(i) !== ''}
                              aria-describedby={getEditHexError(i) ? `palette-color-${i}-hex-error` : undefined}
                              spellCheck={false}
                            />
                            {getEditHexError(i) && (
                              <span id={`palette-color-${i}-hex-error`} className={styles.inputError}>
                                {getEditHexError(i)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <span className={styles.swatchHex}>{color.hex.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={styles.addColorBtn}
                  onClick={() => addPaletteColor()}
                >
                  + add color
                </button>
                {paletteError && (
                  <p className={styles.inputError} role="status">
                    {paletteError}
                  </p>
                )}
              </>
            )}
          </div>

          {/* ── Contrast Matrix ────────────────────────────────────── */}
          {paletteColors.length >= 2 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>contrast pairings</h2>
              {matrixPairs.length === 0 ? (
                <p className={styles.harmonyDesc}>
                  No high-contrast pairings found. Try adding colors with more
                  lightness variation.
                </p>
              ) : (
                <div className={styles.matrixWrap}>
                  <div
                    className={styles.matrix}
                    style={{
                      gridTemplateColumns: `14ch 1fr 1fr 1fr`,
                    }}
                  >
                    <div className={styles.matrixHeader}>pair</div>
                    <div className={styles.matrixHeader}>ratio</div>
                    <div className={styles.matrixHeader}>level</div>
                    <div className={styles.matrixHeader}>preview</div>
                    {matrixPairs.slice(0, 20).map(({ fg, bg, ratio }, i) => {
                      const even = i % 2 === 0;
                      const cellCls = even
                        ? styles.matrixCellEven
                        : styles.matrixCellOdd;
                      return (
                        <Fragment key={`${fg}-${bg}`}>
                          <div className={`${styles.matrixCell} ${cellCls}`}>
                            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <span
                                className={styles.matrixHeaderSwatch}
                                style={{ backgroundColor: fg }}
                              />
                              <span style={{ color: 'var(--muted)' }}>on</span>
                              <span
                                className={styles.matrixHeaderSwatch}
                                style={{ backgroundColor: bg }}
                              />
                            </span>
                          </div>
                          <div className={`${styles.matrixCell} ${cellCls}`}>
                            <span className={styles.matrixRatio}>
                              {ratio.toFixed(1)}:1
                            </span>
                          </div>
                          <div className={`${styles.matrixCell} ${cellCls}`}>
                            {contrastBadge(ratio)}
                          </div>
                          <div className={`${styles.matrixCell} ${cellCls}`}>
                            <span
                              style={{
                                backgroundColor: bg,
                                color: fg,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1rem',
                              }}
                            >
                              sample
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Theme Arranger ─────────────────────────────────────── */}
          {paletteColors.length >= 2 && effectiveDark && effectiveLight && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>theme arranger</h2>
              <div className={styles.arrangerRow}>
                {(
                  [
                    ['dark', effectiveDark, darkSuggestions] as const,
                    ['light', effectiveLight, lightSuggestions] as const,
                  ]
                ).map(([mode, roles]) => (
                  <div key={mode} className={styles.modePanel}>
                    <h3 className={styles.sectionHeading}>{mode} mode</h3>

                    {ROLE_KEYS.map((role) => (
                      <div key={role}>
                        <div className={styles.roleRow}>
                          <span className={styles.roleLabel}>
                            {ROLE_LABELS[role]}
                          </span>
                          <button
                            className={styles.roleSwatch}
                            style={{ backgroundColor: roles[role] }}
                            onClick={() => handleRoleClick(mode, role)}
                            aria-label={`Change ${mode} ${ROLE_LABELS[role]} color`}
                          />
                          <span className={styles.roleHex}>
                            {roles[role].toUpperCase()}
                          </span>
                        </div>
                        {openPicker?.mode === mode && openPicker?.role === role && (
                          <div className={styles.rolePickerPopover}>
                            {paletteHexes.map((hex, i) => (
                              <button
                                key={`${hex}-${i}`}
                                className={styles.rolePickerSwatch}
                                style={{ backgroundColor: hex }}
                                onClick={() => handleRolePick(mode, role, hex)}
                                aria-label={`Select ${hex.toUpperCase()}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Mini preview */}
                    <div
                      className={styles.miniPreview}
                      data-authored-visual
                      style={{
                        backgroundColor: roles.background,
                        borderColor: roles.surface,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: roles.surface,
                          padding: 'var(--spacing-sm)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <span
                          className={styles.miniPreviewHeading}
                          style={{ color: roles.primaryText }}
                        >
                          Card heading
                        </span>
                        <p
                          className={styles.miniPreviewBody}
                          style={{ color: roles.secondaryText }}
                        >
                          Secondary body text on surface.
                        </p>
                      </div>
                      <span
                        className={styles.miniPreviewBtn}
                        style={{
                          backgroundColor: roles.accent,
                          color: roles.background,
                        }}
                      >
                        accent button
                      </span>
                      <span
                        className={styles.miniPreviewBtn}
                        style={{
                          backgroundColor: roles.accentSecondary,
                          color: roles.background,
                        }}
                      >
                        secondary action
                      </span>
                    </div>

                    {/* Contrast checks */}
                    <div className={styles.contrastChecks}>
                      <div className={styles.checkRow}>
                        text/bg:{' '}
                        {contrastBadge(ratioOf(roles.primaryText, roles.background))}
                      </div>
                      <div className={styles.checkRow}>
                        text/surface:{' '}
                        {contrastBadge(
                          ratioOf(roles.secondaryText, roles.surface),
                        )}
                      </div>
                      <div className={styles.checkRow}>
                        accent/bg:{' '}
                        {contrastBadge(ratioOf(roles.accent, roles.background))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
