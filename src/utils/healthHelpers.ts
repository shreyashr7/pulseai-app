import { HealthState, ActivityLevel } from '../types';
import { COLORS, getHealthStateColor } from '../theme/colors';
import { APP_CONFIG } from '../config/api.config';

export const healthHelpers = {
    // Get color for health state
    getHealthStateColor,

    // Get health state description
    getHealthStateDescription: (state: HealthState): string => {
        const descriptions: Record<HealthState, string> = {
            'Normal': 'Your vitals are within normal range',
            'Stressed': 'Elevated stress indicators detected',
            'Tachycardia': 'Heart rate is elevated',
            'Bradycardia': 'Heart rate is lower than normal',
            'Hypoxia': 'Blood oxygen levels are low',
            'Warning': 'Some vitals require attention',
            'Critical': 'Immediate attention required',
        };
        return descriptions[state] || 'Unknown health state';
    },

    // Get activity level description
    getActivityDescription: (activity: ActivityLevel): string => {
        const descriptions: Record<ActivityLevel, string> = {
            'Resting': 'Minimal physical activity',
            'Light': 'Light movement detected',
            'Moderate': 'Moderate physical activity',
            'Active': 'Active movement',
            'Intense': 'High-intensity activity',
        };
        return descriptions[activity] || 'Unknown activity';
    },

    // Determine HR status
    getHeartRateStatus: (hr: number): 'low' | 'normal' | 'elevated' | 'high' => {
        const { HEART_RATE } = APP_CONFIG.HEALTH_RANGES;

        if (hr < HEART_RATE.WARNING_MIN) return 'low';
        if (hr < HEART_RATE.NORMAL_MIN) return 'low';
        if (hr <= HEART_RATE.NORMAL_MAX) return 'normal';
        if (hr <= HEART_RATE.WARNING_MAX) return 'elevated';
        return 'high';
    },

    // Determine SpO2 status
    getSpO2Status: (spo2: number): 'critical' | 'low' | 'normal' => {
        const { SPO2 } = APP_CONFIG.HEALTH_RANGES;

        if (spo2 < SPO2.CRITICAL) return 'critical';
        if (spo2 < SPO2.NORMAL_MIN) return 'low';
        return 'normal';
    },

    // Get HR gauge color
    getHeartRateColor: (hr: number): string => {
        const status = healthHelpers.getHeartRateStatus(hr);
        switch (status) {
            case 'low':
                return COLORS.health.warning;
            case 'normal':
                return COLORS.health.normal;
            case 'elevated':
                return COLORS.health.stressed;
            case 'high':
                return COLORS.health.critical;
            default:
                return COLORS.health.normal;
        }
    },

    // Get SpO2 gauge color
    getSpO2Color: (spo2: number): string => {
        const status = healthHelpers.getSpO2Status(spo2);
        switch (status) {
            case 'critical':
                return COLORS.health.critical;
            case 'low':
                return COLORS.health.warning;
            case 'normal':
                return COLORS.health.normal;
            default:
                return COLORS.health.normal;
        }
    },

    // Calculate health score percentile
    getHealthScoreLevel: (score: number): 'poor' | 'fair' | 'good' | 'excellent' => {
        if (score < 50) return 'poor';
        if (score < 70) return 'fair';
        if (score < 85) return 'good';
        return 'excellent';
    },

    // Get health score color
    getHealthScoreColor: (score: number): string => {
        const level = healthHelpers.getHealthScoreLevel(score);
        switch (level) {
            case 'poor':
                return COLORS.health.critical;
            case 'fair':
                return COLORS.health.warning;
            case 'good':
                return COLORS.health.normal;
            case 'excellent':
                return COLORS.health.excellent;
            default:
                return COLORS.health.normal;
        }
    },
};
