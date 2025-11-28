export const API_CONFIG = {
    // Base URL - Cloud server
    BASE_URL: 'http://34.197.138.31:8000',
    
    // WebSocket URL
    WS_URL: 'ws://34.197.138.31:8000/ws',

    // Timeout settings
    TIMEOUT: 15000, // 15 seconds

    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second

    // Endpoints
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/api/v1/auth/register',
        LOGIN: '/api/v1/auth/login',
        ME: '/api/v1/auth/me',

        // Device endpoints
        REGISTER_DEVICE: '/api/v1/devices/register',
        DEVICES: '/api/v1/devices',

        // Health data endpoints
        INGEST: '/api/v1/ingest',
        LATEST: '/api/v1/health/latest',
        HISTORY: '/api/v1/health/history',
        SUMMARY: '/api/v1/health/summary',

        // Alert endpoints
        ALERTS: '/api/v1/alerts',
        ALERT_READ: '/api/v1/alerts/:id/read',
        ALERTS_READ_ALL: '/api/v1/alerts/read-all',

        // Emergency endpoints
        EMERGENCY_CONTACTS: '/api/v1/emergency-contacts',

        // Settings endpoints
        SETTINGS: '/api/v1/settings',
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
