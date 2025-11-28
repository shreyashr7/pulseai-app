export const API_CONFIG = {
    // Base URL - Point to data processor backend
    BASE_URL: __DEV__
        ? 'http://localhost:8000'  // Data processor API
        : 'https://api.pulsai.health',

    // ML API URL
    ML_API_URL: __DEV__
        ? 'http://localhost:8001'  // ML API
        : 'https://ml.pulsai.health',

    // Timeout settings
    TIMEOUT: 15000, // 15 seconds

    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second

    // Endpoints
    ENDPOINTS: {
        // Backend endpoints
        INGEST_DATA: '/ingest',
        HEALTH_SUMMARY: '/summary',
        HEALTH_TRENDS: '/summary/trends',

        // Auth endpoints (for future implementation)
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',

        // User endpoints
        USER_PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',

        // Health data endpoints
        CURRENT_HEALTH: '/health/current',
        HISTORICAL_DATA: '/health/historical',
        HEALTH_SCORE_TRENDS: '/health/score-trends',
        BEHAVIORAL_PATTERNS: '/health/behavioral-patterns',

        // Alert endpoints
        ALERTS: '/alerts',
        ALERT_DETAIL: '/alerts/:id',
        ACKNOWLEDGE_ALERT: '/alerts/:id/acknowledge',

        // Emergency endpoints
        EMERGENCY_CONTACTS: '/emergency/contacts',
        TRIGGER_SOS: '/emergency/sos',
        CONFIRM_EMERGENCY: '/emergency/:id/confirm',
        CANCEL_EMERGENCY: '/emergency/:id/cancel',

        // Notification endpoints
        REGISTER_DEVICE: '/notifications/register-device',
        NOTIFICATION_PREFERENCES: '/notifications/preferences',

        // Settings endpoints
        SETTINGS: '/settings',
        UPDATE_THRESHOLDS: '/settings/thresholds',
    },
};

export const APP_CONFIG = {
    // Refresh intervals
    DASHBOARD_REFRESH_INTERVAL: 5000, // 5 seconds
    ALERTS_REFRESH_INTERVAL: 30000, // 30 seconds

    // Chart configurations
    CHART_DEFAULTS: {
        ANIMATION_DURATION: 300,
        POINT_RADIUS: 4,
        LINE_WIDTH: 2,
    },

    // Health thresholds (display ranges)
    HEALTH_RANGES: {
        HEART_RATE: {
            MIN: 40,
            MAX: 200,
            NORMAL_MIN: 60,
            NORMAL_MAX: 100,
            WARNING_MIN: 50,
            WARNING_MAX: 120,
        },
        SPO2: {
            MIN: 70,
            MAX: 100,
            NORMAL_MIN: 95,
            CRITICAL: 90,
        },
    },

    // Feature flags
    FEATURES: {
        OAUTH_ENABLED: true,
        PUSH_NOTIFICATIONS: true,
        BEHAVIORAL_INSIGHTS: true,
    },
};
