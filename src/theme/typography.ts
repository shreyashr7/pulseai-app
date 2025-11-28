export const TYPOGRAPHY = {
    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Font Weights
    fontWeight: {
        light: '300' as const,
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    // Line Heights
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },

    // Letter Spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
};

export const TEXT_STYLES = {
    h1: {
        fontSize: TYPOGRAPHY.fontSize['4xl'],
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        lineHeight: TYPOGRAPHY.fontSize['4xl'] * TYPOGRAPHY.lineHeight.tight,
    },
    h2: {
        fontSize: TYPOGRAPHY.fontSize['3xl'],
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        lineHeight: TYPOGRAPHY.fontSize['3xl'] * TYPOGRAPHY.lineHeight.tight,
    },
    h3: {
        fontSize: TYPOGRAPHY.fontSize['2xl'],
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        lineHeight: TYPOGRAPHY.fontSize['2xl'] * TYPOGRAPHY.lineHeight.normal,
    },
    h4: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.normal,
    },
    body: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
    },
    bodyLarge: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.relaxed,
    },
    bodySmall: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    },
    caption: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.normal,
    },
    button: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.tight,
    },
};
