export const READING_FONT_STORAGE_KEY = 'alexyelab-reading-font-percent';
export const READING_FONT_DEFAULT = 100;
export const READING_FONT_PERCENTAGES = [
  85, 90, 95, 100, 105, 110, 115, 120, 125,
] as const;

export const parseReadingFontPercent = (value: string | null): number => {
  const percent = Number(value);
  return READING_FONT_PERCENTAGES.some((size) => size === percent)
    ? percent
    : READING_FONT_DEFAULT;
};
