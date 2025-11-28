/**
 * Backend Data Transformers
 * 
 * Transform data from backend API format to mobile app format
 */

import {
    CurrentHealthStatus,
    HistoricalDataPoint,
    Alert,
    TimeRange,
    HealthState,
    ActivityLevel,
    AlertType
} from '../types';

/**
 * Transform /summary response to CurrentHealthStatus
 */
export function transformSummaryToCurrentHealth(summary: any): CurrentHealthStatus {
    // Backend summary provides state distribution and metrics
    // We'll derive current health from the most common state
    const stateDistribution = summary.state_distribution_percent || {};
    const states = Object.entries(stateDistribution);

    // Find the dominant health state
    let healthState: HealthState = 'Normal';
    if (states.length > 0) {
        const [dominantState] = states.reduce((max: any, curr: any) =>
            curr[1] > max[1] ? curr : max
        );
        healthState = dominantState as HealthState;
    }

    // Derive activity level from cluster distribution
    const activityDistribution = summary.activity_distribution_percent || {};
    const activities = Object.entries(activityDistribution);
    let activityLevel: ActivityLevel = 'Resting';
    if (activities.length > 0) {
        const [dominantActivity] = activities.reduce((max: any, curr: any) =>
            curr[1] > max[1] ? curr : max
        );
        activityLevel = dominantActivity as ActivityLevel;
    }

    // Use average resting HR as current HR (approximate)
    const heartRate = summary.average_resting_hr || 75;

    // Estimate SpO2 based on health state
    let spo2 = 98;
    if (healthState === 'Hypoxia') spo2 = 88;
    else if (healthState === 'Stressed') spo2 = 95;

    // Calculate health score from state distribution
    const healthScore = calculateHealthScore(stateDistribution, summary.anomaly_count || 0);

    return {
        heartRate,
        spo2,
        heartRateVariability: 45, // Not available from backend, use default
        respiratoryRate: 16, // Not available from backend, use default
        bloodPressure: undefined, // Not available from backend
        temperature: undefined, // Not available from backend
        healthState,
        activityLevel,
        healthScore,
        stressLevel: healthState === 'Stressed' ? 'High' as any : 'Normal' as any,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Transform /summary/trends to HistoricalDataPoint[]
 */
export function transformTrendsToHistoricalData(
    trends: any[],
    timeRange: TimeRange
): HistoricalDataPoint[] {
    if (!trends || trends.length === 0) {
        return [];
    }

    // Filter based on time range  
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
        spo2: 98, // Not available from trends
        heartRateVariability: 45, // Not available
        healthScore: calculateHealthScoreFromTrend(trend),
        activityLevel: determineActivityLevel(trend.minutes_exercising || 0) as ActivityLevel,
        stressLevel: undefined,
    }));
}

/**
 * Generate alerts from anomaly data
 */
export function generateAlertsFromAnomalies(summary: any): Alert[] {
    const alerts: Alert[] = [];
    const anomalyCount = summary.anomaly_count || 0;

    if (anomalyCount > 0) {
        alerts.push({
            id: `anomaly-${Date.now()}`,
            type: 'Anomaly' as AlertType,
            severity: anomalyCount > 5 ? 'High' : 'Medium',
            title: 'Health Anomalies Detected',
            message: `${anomalyCount} anomalous readings detected in the last 24 hours. Please monitor your health closely.`,
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

    // Check for stress
    const stateDistribution = summary.state_distribution_percent || {};
    const stressedPercent = stateDistribution['Stressed'] || 0;

    if (stressedPercent > 20) {
        alerts.push({
            id: `stress-${Date.now()}`,
            type: 'Predictive' as AlertType,
            severity: 'Medium',
            title: 'Elevated Stress Levels',
            message: `You've been in a stressed state for ${stressedPercent.toFixed(0)}% of the past 24 hours.`,
            timestamp: new Date().toISOString(),
            read: false,
            acknowledged: false,
            recommendedActions: [
                'Practice deep breathing exercises',
                'Take regular breaks',
                'Consider meditation or relaxation techniques',
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

    // Base score from normal percentage
    let score = normalPercent * 0.8;

    // Deduct for stressed state
    score -= stressedPercent * 0.3;

    // Deduct heavily for critical states
    score -= criticalPercent * 0.6;

    // Deduct for anomalies
    score -= Math.min(anomalyCount * 2, 20);

    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateHealthScoreFromTrend(trend: any): number {
    let score = 85; // Base score

    // Deduct for stress
    const stressMinutes = trend.minutes_in_stress || 0;
    score -= Math.min(stressMinutes / 10, 20);

    // Add for exercise
    const exerciseMinutes = trend.minutes_exercising || 0;
    score += Math.min(exerciseMinutes / 20, 10);

    // Deduct for anomalies
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
