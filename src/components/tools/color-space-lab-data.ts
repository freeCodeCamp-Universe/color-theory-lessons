export type P3Channels = readonly [number, number, number];

export interface DisplayP3Sample {
  id: string;
  label: string;
  p3: string;
  p3Channels: P3Channels;
  srgbFallback: string;
}

export const DISPLAY_P3_SAMPLES: readonly DisplayP3Sample[] = [
  {
    id: 'vivid-orange',
    label: 'Vivid orange',
    p3: 'color(display-p3 1 0.25 0)',
    p3Channels: [1, 0.25, 0],
    srgbFallback: '#FF1B00',
  },
  {
    id: 'bright-green',
    label: 'Bright green',
    p3: 'color(display-p3 0 1 0.3)',
    p3Channels: [0, 1, 0.3],
    srgbFallback: '#00FF06',
  },
  {
    id: 'deep-pink',
    label: 'Deep pink',
    p3: 'color(display-p3 1 0.1 0.55)',
    p3Channels: [1, 0.1, 0.55],
    srgbFallback: '#FF008E',
  },
  {
    id: 'soft-blue',
    label: 'Soft blue',
    p3: 'color(display-p3 0.25 0.45 0.8)',
    p3Channels: [0.25, 0.45, 0.8],
    srgbFallback: '#2B74D3',
  },
  {
    id: 'muted-coral',
    label: 'Muted coral',
    p3: 'color(display-p3 0.72 0.38 0.32)',
    p3Channels: [0.72, 0.38, 0.32],
    srgbFallback: '#C55B4C',
  },
] as const;

const P3_TO_XYZ = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0, 0.04511338185890264, 1.043944368900976],
] as const;

const XYZ_TO_SRGB = [
  [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
  [0.05563007969699366, -0.20397695888897652, 1.0569715142428786],
] as const;

function decodeRgbChannel(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function multiplyMatrixVector(matrix: readonly (readonly number[])[], vector: readonly number[]) {
  return matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
}

export function isDisplayP3OutsideSrgb(channels: P3Channels) {
  const linearP3 = channels.map(decodeRgbChannel);
  const xyz = multiplyMatrixVector(P3_TO_XYZ, linearP3);
  const linearSrgb = multiplyMatrixVector(XYZ_TO_SRGB, xyz);
  const tolerance = 1e-7;

  return linearSrgb.some((channel) => channel < -tolerance || channel > 1 + tolerance);
}
