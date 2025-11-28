import {
    User,
    CurrentHealthStatus,
    HistoricalDataPoint,
    Alert,
    EmergencyContact,
    BehavioralPattern,
    TimeRange
} from '../types';

// Mock User
export const mockUser: User = {
    id: '1',
    email: 'demo@pulsai.health',
    name: 'John Doe',
    age: 35,
    phone: '+1234567890',
    createdAt: new Date().toISOString(),
};

// Generate realistic mock current health status
export const generateMockCurrentHealth = (): CurrentHealthStatus => {
    const now = new Date();
    const hour = now.getHours();

    // Simulate circadian rhythm - HR slightly higher during day
    const baseHR = hour >= 6 && hour <= 22 ? 75 : 65;
    const hrVariation = Math.random() * 15 - 7.5;

    return {
        heartRate: Math.round(baseHR + hrVariation),
        spo2: Math.round(97 + Math.random() * 2), // 97-99%
        healthState: Math.random() > 0.8 ? 'Stressed' : 'Normal',
        activityLevel: hour >= 9 && hour <= 17 ? 'Light' : 'Resting',
        timestamp: now.toISOString(),
        healthScore: Math.round(75 + Math.random() * 20), // 75-95
    };
};

// Generate historical data
export const generateHistoricalData = (timeRange: TimeRange): HistoricalDataPoint[] => {
    const data: HistoricalDataPoint[] = [];
    const now = new Date();

    let points = 24; // default for 24h
    let intervalMinutes = 60;

    switch (timeRange) {
        case '24h':
            points = 24;
            intervalMinutes = 60;
            break;
        case '7d':
            points = 168;
            intervalMinutes = 60;
            break;
        case '30d':
            points = 120;
            intervalMinutes = 360; // 6 hours
            break;
        case '90d':
            points = 90;
            intervalMinutes = 1440; // 1 day
            break;
    }

    for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * intervalMinutes * 60000);
        const hour = timestamp.getHours();

        // Simulate daily patterns
        const isNight = hour >= 22 || hour <= 6;
        const baseHR = isNight ? 65 : 75;
        const hrVariation = Math.random() * 20 - 10;

        data.push({
            timestamp: timestamp.toISOString(),
            heartRate: Math.round(baseHR + hrVariation),
            spo2: Math.round(96 + Math.random() * 3),
            healthScore: Math.round(70 + Math.random() * 25),
            activityLevel: isNight ? 'Resting' : (Math.random() > 0.5 ? 'Light' : 'Moderate'),
        });
    }

    return data;
};

// Mock Alerts
export const mockAlerts: Alert[] = [
    {
        id: '1',
        type: 'Predictive',
        severity: 'Medium',
        title: 'Elevated HR Predicted',
        message: 'Our AI model predicts your heart rate may increase to 105 bpm in the next 15 minutes. Consider taking a break.',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        read: false,
        acknowledged: false,
        relatedMetrics: {
            heartRate: 78,
            predictedValue: 105,
        },
        recommendedActions: [
            'Take deep breaths',
            'Hydrate',
            'Reduce physical activity',
        ],
    },
    {
        id: '2',
        type: 'Anomaly',
        severity: 'High',
        title: 'Unusual Activity Pattern',
        message: 'Anomaly detected: Your activity level is significantly different from your normal pattern.',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
        acknowledged: false,
        relatedMetrics: {
            heartRate: 92,
            spo2: 96,
        },
    },
    {
        id: '3',
        type: 'System',
        severity: 'Low',
        title: 'Daily Health Report Ready',
        message: 'Your daily health summary for today is now available.',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: true,
        acknowledged: true,
    },
    {
        id: '4',
        type: 'Predictive',
        severity: 'Low',
        title: 'Improved Sleep Quality Expected',
        message: 'Based on your activity today, our model predicts better sleep quality tonight.',
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        read: true,
        acknowledged: true,
        recommendedActions: [
            'Maintain consistent bedtime',
            'Avoid caffeine after 6 PM',
        ],
    },
];

// Mock Emergency Contacts
export const mockEmergencyContacts: EmergencyContact[] = [
    {
        id: '1',
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891',
        email: 'jane@example.com',
        isPrimary: true,
        priority: 1,
    },
    {
        id: '2',
        name: 'Dr. Smith',
        relationship: 'Primary Care Physician',
        phone: '+1234567892',
        email: 'dr.smith@hospital.com',
        isPrimary: false,
        priority: 2,
    },
    {
        id: '3',
        name: 'Robert Doe',
        relationship: 'Brother',
        phone: '+1234567893',
        isPrimary: false,
        priority: 3,
    },
];

// Mock Behavioral Patterns
export const mockBehavioralPatterns: BehavioralPattern[] = [
    {
        id: '1',
        pattern: 'Morning Exercise Routine',
        description: 'Elevated heart rate between 6:00-7:30 AM on weekdays',
        occurrences: [
            { timestamp: new Date(Date.now() - 86400000).toISOString(), duration: 45 },
            { timestamp: new Date(Date.now() - 172800000).toISOString(), duration: 50 },
            { timestamp: new Date(Date.now() - 259200000).toISOString(), duration: 40 },
        ],
        cluster: 1,
    },
    {
        id: '2',
        pattern: 'Afternoon Stress Peak',
        description: 'Elevated HR and stress indicators around 2:00-4:00 PM',
        occurrences: [
            { timestamp: new Date(Date.now() - 43200000).toISOString(), duration: 90 },
            { timestamp: new Date(Date.now() - 129600000).toISOString(), duration: 120 },
        ],
        cluster: 2,
    },
    {
        id: '3',
        pattern: 'Deep Sleep Phase',
        description: 'Consistent resting state with low HR between 11:00 PM - 5:00 AM',
        occurrences: [
            { timestamp: new Date(Date.now() - 21600000).toISOString(), duration: 360 },
            { timestamp: new Date(Date.now() - 108000000).toISOString(), duration: 380 },
        ],
        cluster: 0,
    },
];
