/**
 * Backend Data Transformers
 * 
 * Transform data from backend API format to mobile app format
 * Updated for new cloud API: http://34.197.138.31:8000
 */

import {
    CurrentHealthStatus,
    HistoricalDataPoint,
    Alert,
    TimeRange,
    HealthState,
    ActivityLevel,
    AlertType,
    AlertSeverity
} from '../types';

/**
 * Transform /api/v1/health/latest response to CurrentHealthStatus
 */
export function transformLatestToCurrentHealth(latest: any): CurrentHealthStatus {
    // Map backend prediction to HealthState
    const predictionMap: Record<string, HealthState> = {
        'Normal': 'Normal',
        'Resting': 'Normal',
        'Exercising': 'Normal',
        'Stressed': 'Stressed',
        'Tachycardia': 'Tachycardia',
        'Bradycardia': 'Bradycardia',
        'Hypoxia': 'Hypoxia',
        'Arrhythmia': 'Critical',
    };

    const healthState = predictionMap[latest.prediction] || 'Normal';

    // Map cluster_label to ActivityLevel
    const activityMap: Record<string, ActivityLevel> = {
        'Resting': 'Resting',
        'Light Activity': 'Light',
        'Moderate Activity': 'Moderate',
        'Active': 'Active',
        'Intense': 'Intense',
    };

    const activityLevel = activityMap[latest.cluster_label] || 'Resting';

    // Calculate health score based on state and anomaly
    let healthScore = 85;
    if (latest.is_anomaly) healthScore -= 15;
    if (healthState === 'Stressed') healthScore -= 10;
    if (healthState === 'Tachycardia' || healthState === 'Bradycardia') healthScore -= 20;
    if (healthState === 'Hypoxia' || healthState === 'Critical') healthScore -= 30;
    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
        heartRate: latest.heart_rate || 75,
        spo2: latest.spo2 || 98,
        healthState,
        activityLevel,
        healthScore,
        timestamp: latest.time || new Date().toISOString(),
    };
}

/**
 * Transform /api/v1/health/history response to HistoricalDataPoint[]
 */
export function transformHistoryToHistoricalData(
    history: any[],
    timeRange: TimeRange
): HistoricalDataPoint[] {
    if (!history || history.length === 0) {
        return [];
    }

    // Sample data based on time range to avoid too many points
    const sampleRate = {
        '24h': 1,
        '7d': 6,
        '30d': 24,
        '90d': 72,
    }[timeRange] || 1;

    const sampledData = history.filter((_, index) => index % sampleRate === 0);

    return sampledData.map((reading) => {
        // Map activity level
        const activityMap: Record<string, ActivityLevel> = {
            'Resting': 'Resting',
            'Light Activity': 'Light',
            'Moderate Activity': 'Moderate',
            'Active': 'Active',
        };

        // Calculate health score for each reading
        let healthScore = 85;
        if (reading.is_anomaly) healthScore -= 15;
        if (reading.prediction === 'Stressed') healthScore -= 10;
        if (['Tachycardia', 'Bradycardia', 'Hypoxia', 'Arrhythmia'].includes(reading.prediction)) {
            healthScore -= 25;
        }
        healthScore = Math.max(0, Math.min(100, healthScore));

        return {
            timestamp: reading.time || new Date().toISOString(),
            heartRate: reading.heart_rate,
            spo2: reading.spo2,
            healthScore,
            activityLevel: activityMap[reading.cluster_label] || 'Resting',
        };
    });
}

/**
 * Transform /api/v1/health/summary to trend data
 */
export function transformSummaryToBehavioralPatterns(
    summary: any,
    timeRange: TimeRange
): HistoricalDataPoint[] {
    const stateDistribution = summary.state_distribution_percent || {};
    const activityDistribution = summary.activity_distribution_percent || {};
    
    // Calculate overall health score from distribution
    const normalPercent = stateDistribution['Normal'] || 0;
    const stressedPercent = stateDistribution['Stressed'] || 0;
    const criticalPercent = (stateDistribution['Hypoxia'] || 0) +
        (stateDistribution['Tachycardia'] || 0) +
        (stateDistribution['Bradycardia'] || 0);
    
    let healthScore = normalPercent * 0.8 - stressedPercent * 0.3 - criticalPercent * 0.6;
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore + 50)));

    // Return a single summary point
    return [{
        timestamp: new Date().toISOString(),
        heartRate: summary.average_resting_hr || 75,
        healthScore,
    }];
}

/**
 * Transform /api/v1/alerts response to Alert[]
 */
export function transformBackendAlerts(alerts: any[]): Alert[] {
    if (!alerts || alerts.length === 0) {
        return [];
    }

    return alerts.map((alert) => {
        // Map backend type to AlertType
        const typeMap: Record<string, AlertType> = {
            'anomaly': 'Anomaly',
            'critical': 'Emergency',
            'predictive': 'Predictive',
            'system': 'System',
        };

        // Determine severity from type
        const severityMap: Record<string, AlertSeverity> = {
            'anomaly': 'Medium',
            'critical': 'Critical',
            'predictive': 'Low',
            'system': 'Low',
        };

        const alertType = typeMap[alert.type] || 'System';
        const severity = severityMap[alert.type] || 'Medium';

        return {
            id: alert.id.toString(),
            type: alertType,
            severity,
            title: alert.title || 'Health Alert',
            message: alert.body || 'Health notification',
            timestamp: alert.sent_at || new Date().toISOString(),
            read: alert.is_read || false,
            acknowledged: alert.is_read || false,
            relatedMetrics: alert.data ? {
                heartRate: alert.data.heart_rate,
                spo2: alert.data.spo2,
            } : undefined,
            recommendedActions: getRecommendedActions(alert.type),
        };
    });
}

/**
 * Get recommended actions based on alert type
 */
function getRecommendedActions(alertType: string): string[] {
    switch (alertType) {
        case 'anomaly':
            return [
                'Check your sensor placement',
                'Rest and monitor your vitals',
                'Contact your healthcare provider if symptoms persist',
            ];
        case 'critical':
            return [
                'Seek immediate medical attention',
                'Contact your emergency contacts',
                'Call emergency services if needed',
            ];
        case 'predictive':
            return [
                'Review your recent activities',
                'Consider taking preventive measures',
                'Monitor your health closely',
            ];
        default:
            return [
                'Review your health data',
                'Contact support if needed',
            ];
    }
}

// Legacy function for backward compatibility
export function transformSummaryToCurrentHealth(summary: any): CurrentHealthStatus {
    const stateDistribution = summary.state_distribution_percent || {};
    const states = Object.entries(stateDistribution);

    let healthState: HealthState = 'Normal';
    if (states.length > 0) {
        const [dominantState] = states.reduce((max: any, curr: any) =>
            curr[1] > max[1] ? curr : max
        );
        healthState = dominantState as HealthState;
    }

    const activityDistribution = summary.activity_distribution_percent || {};
    const activities = Object.entries(activityDistribution);
    let activityLevel: ActivityLevel = 'Resting';
    if (activities.length > 0) {
        const [dominantActivity] = activities.reduce((max: any, curr: any) =>
            curr[1] > max[1] ? curr : max
        );
        activityLevel = dominantActivity as ActivityLevel;
    }

    const heartRate = summary.average_resting_hr || 75;
    let spo2 = 98;
    if (healthState === 'Hypoxia') spo2 = 88;
    else if (healthState === 'Stressed') spo2 = 95;

    const healthScore = calculateHealthScore(stateDistribution, summary.anomaly_count || 0);

    return {
        heartRate,
        spo2,
        healthState,
        activityLevel,
        healthScore,
        timestamp: new Date().toISOString(),
    };
}

// Legacy function
export function transformTrendsToHistoricalData(
    trends: any[],
    timeRange: TimeRange
): HistoricalDataPoint[] {
    if (!trends || trends.length === 0) {
        return [];
    }

    const limitMap: { [key: string]: number } = {
        '24h': 24,
        '7d': 7,
        '30d': 30,
        '90d': 90,
    };

    const limit = limitMap[timeRange] || 30;
    const filteredTrends = trends.slice(0, limit).reverse();

    return filteredTrends.map((trend, index) => ({
        timestamp: trend.summary_date || new Date(Date.now() - (limit - index) * 86400000).toISOString(),
        heartRate: trend.avg_resting_hr || 75,
        spo2: 98,
        healthScore: calculateHealthScoreFromTrend(trend),
        activityLevel: determineActivityLevel(trend.minutes_exercising || 0) as ActivityLevel,
    }));
}

// Legacy function
export function generateAlertsFromAnomalies(summary: any): Alert[] {
    const alerts: Alert[] = [];
    const anomalyCount = summary.anomaly_count || 0;

    if (anomalyCount > 0) {
        alerts.push({
            id: `anomaly-${Date.now()}`,
            type: 'Anomaly',
            severity: anomalyCount > 5 ? 'High' : 'Medium',
            title: 'Health Anomalies Detected',
            message: `${anomalyCount} anomalous readings detected in the last 24 hours.`,
            timestamp: new Date().toISOString(),
            read: false,
            acknowledged: false,
            relatedMetrics: {
                predictedValue: anomalyCount,
            },
            recommendedActions: [
                'Review your recent activities',
                'Ensure proper sensor placement',
                'Consult healthcare provider if persistent',
            ],
        });
    }

    return alerts;
}

// Helper functions
function calculateHealthScore(stateDistribution: Record<string, number>, anomalyCount: number): number {
    const normalPercent = stateDistribution['Normal'] || 0;
    const stressedPercent = stateDistribution['Stressed'] || 0;
    const criticalPercent = (stateDistribution['Hypoxia'] || 0) +
        (stateDistribution['Tachycardia'] || 0) +
        (stateDistribution['Bradycardia'] || 0);

    let score = normalPercent * 0.8;
    score -= stressedPercent * 0.3;
    score -= criticalPercent * 0.6;
    score -= Math.min(anomalyCount * 2, 20);

    return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateHealthScoreFromTrend(trend: any): number {
    let score = 85;
    const stressMinutes = trend.minutes_in_stress || 0;
    score -= Math.min(stressMinutes / 10, 20);
    const exerciseMinutes = trend.minutes_exercising || 0;
    score += Math.min(exerciseMinutes / 20, 10);
    const anomalies = trend.total_anomalies || 0;
    score -= Math.min(anomalies * 2, 15);

    return Math.max(0, Math.min(100, Math.round(score)));
}

function determineActivityLevel(exerciseMinutes: number): string {
    if (exerciseMinutes > 60) return 'Active';
    if (exerciseMinutes > 30) return 'Moderate';
    if (exerciseMinutes > 10) return 'Light';
    return 'Resting';
}
