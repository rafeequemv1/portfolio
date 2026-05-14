export const COLOR_LAB_PRESETS = ['hue_wheel', 'harmonies', 'complementary', 'temperature'] as const;

export type ColorLabPreset = (typeof COLOR_LAB_PRESETS)[number];

export function isColorLabPreset(value: unknown): value is ColorLabPreset {
  return typeof value === 'string' && (COLOR_LAB_PRESETS as readonly string[]).includes(value);
}
