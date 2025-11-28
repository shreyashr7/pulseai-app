import { COLORS } from './colors';
import { TYPOGRAPHY, TEXT_STYLES } from './typography';
import { SPACING, BORDER_RADIUS, SHADOWS } from './spacing';

export const theme = {
    colors: COLORS,
    typography: TYPOGRAPHY,
    textStyles: TEXT_STYLES,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
};

export type Theme = typeof theme;

export { COLORS, TYPOGRAPHY, TEXT_STYLES, SPACING, BORDER_RADIUS, SHADOWS };
export * from './colors';
