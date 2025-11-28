export const COLORS = {
    // Primary Brand Colors
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',

    // Secondary Colors
    secondary: '#10B981', // Emerald
    secondaryDark: '#059669',
    secondaryLight: '#34D399',

    // Health Status Colors
    health: {
        normal: '#10B981', // Green
        stressed: '#F59E0B', // Amber
        warning: '#F97316', // Orange
        critical: '#EF4444', // Red
        excellent: '#059669', // Dark Green
    },

    // Alert Severity Colors
    alert: {
        low: '#3B82F6', // Blue
        medium: '#F59E0B', // Amber
        high: '#F97316', // Orange
        critical: '#DC2626', // Dark Red
    },

    // Activity Level Colors
    activity: {
        resting: '#6B7280', // Gray
        light: '#60A5FA', // Light Blue
        moderate: '#34D399', // Light Green
        active: '#FBBF24', // Yellow
        intense: '#F87171', // Light Red
    },

    // UI Colors - Light Mode
    light: {
        background: '#FFFFFF',
        surface: '#F9FAFB',
        card: '#FFFFFF',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        divider: '#F3F4F6',
        disabled: '#D1D5DB',
        placeholder: '#9CA3AF',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
    },

    // UI Colors - Dark Mode
    dark: {
        background: '#111827',
        surface: '#1F2937',
        card: '#374151',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB',
        border: '#4B5563',
        divider: '#374151',
        disabled: '#6B7280',
        placeholder: '#9CA3AF',
        error: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
        info: '#60A5FA',
    },

    // Emergency/SOS
    emergency: '#DC2626',
    emergencyDark: '#991B1B',

    // Transparent overlays
    overlay: {
        light: 'rgba(0, 0, 0, 0.5)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
};

export const getHealthStateColor = (state: string): string => {
    switch (state.toLowerCase()) {
        case 'normal':
            return COLORS.health.normal;
        case 'stressed':
            return COLORS.health.stressed;
        case 'tachycardia':
        case 'bradycardia':
        case 'warning':
            return COLORS.health.warning;
        case 'hypoxia':
        case 'critical':
            return COLORS.health.critical;
        default:
            return COLORS.health.normal;
    }
};

export const getAlertSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
        case 'low':
            return COLORS.alert.low;
        case 'medium':
            return COLORS.alert.medium;
        case 'high':
            return COLORS.alert.high;
        case 'critical':
            return COLORS.alert.critical;
        default:
            return COLORS.alert.low;
    }
};

export const getActivityColor = (activity: string): string => {
    switch (activity.toLowerCase()) {
        case 'resting':
            return COLORS.activity.resting;
        case 'light':
            return COLORS.activity.light;
        case 'moderate':
            return COLORS.activity.moderate;
        case 'active':
            return COLORS.activity.active;
        case 'intense':
            return COLORS.activity.intense;
        default:
            return COLORS.activity.resting;
    }
};
