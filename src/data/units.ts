import type { UnitConfig } from '../types/lesson.ts';

export const units: UnitConfig[] = [
  { id: 'unit-1', title: 'Seeing and Describing Color', description: 'Build your visual vocabulary for color.', lessons: ['u1-l1', 'u1-l2', 'u1-l3', 'u1-l4', 'u1-l5', 'u1-l6'], milestoneId: 'milestone-1' },
  { id: 'unit-2', title: 'How Screens Make Color', description: 'Understand light-based and pigment-based color models.', lessons: ['u2-l1', 'u2-l2', 'u2-l3', 'u2-l4', 'u2-l5'], milestoneId: 'milestone-2' },
  { id: 'unit-3', title: 'Digital Color in Code', description: 'Use HEX, RGB, HSL, and alpha in CSS.', lessons: ['u3-l1', 'u3-l2', 'u3-l3', 'u3-l4', 'u3-l5', 'u3-l6'], milestoneId: 'milestone-3' },
  { id: 'unit-4', title: 'Human Vision and Color Perception', description: 'Understand how the visual system constructs color and how perception varies.', lessons: ['u4-l1', 'u4-l2', 'u4-l3', 'u4-l4'], milestoneId: 'milestone-4' },
  { id: 'unit-5', title: 'Accessible Color in Practice', description: 'Apply WCAG contrast and color guidance to real interfaces.', lessons: ['u5-l1', 'u5-l2', 'u5-l3', 'u5-l4', 'u5-l5', 'u5-l6'], milestoneId: 'milestone-5' },
  { id: 'unit-6', title: 'Color Systems and Advanced Topics', description: 'Apply color strategically in modern digital design.', lessons: ['u6-l1', 'u6-l2', 'u6-l3', 'u6-l4', 'u6-l5', 'u6-l6', 'u6-l7'], milestoneId: 'milestone-6' },
];
