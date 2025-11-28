import api from './api';
import { CurrentHealthStatus, HistoricalDataPoint, BehavioralPattern, TimeRange } from '../types';
import { API_CONFIG } from '../config/api.config';
import {
    transformLatestToCurrentHealth,
    transformHistoryToHistoricalData,
    transformSummaryToBehavioralPatterns,
} from '../utils/backendTransformers';
import {
    generateMockCurrentHealth,
    generateHistoricalData,
    mockBehavioralPatterns
} from '../mocks/healthData';

// Set to false to use real backend
const USE_MOCK = false;

export const healthService = {
    // Get current health status
    getCurrentHealth: async (): Promise<CurrentHealthStatus> => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.LATEST);
            return transformLatestToCurrentHealth(response.data);
        } catch (error) {
            console.warn('Backend unavailable, using mock data:', error);
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 300));
                return generateMockCurrentHealth();
            }
            throw error;
        }
    },

    // Get historical health data
    getHistoricalData: async (timeRange: TimeRange): Promise<HistoricalDataPoint[]> => {
        try {
            // Map time range to hours
            const hoursMap: Record<TimeRange, number> = {
                '24h': 24,
                '7d': 168,
                '30d': 720,
                '90d': 2160,
            };
            const hours = hoursMap[timeRange] || 24;
            
            const response = await api.get(`${API_CONFIG.ENDPOINTS.HISTORY}?hours=${hours}&limit=500`);
            return transformHistoryToHistoricalData(response.data, timeRange);
        } catch (error) {
            console.warn('Backend unavailable, using mock data:', error);
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 500));
                return generateHistoricalData(timeRange);
            }
            throw error;
        }
    },

    // Get health score trends
    getHealthScoreTrends: async (timeRange: TimeRange): Promise<HistoricalDataPoint[]> => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.SUMMARY);
            return transformSummaryToBehavioralPatterns(response.data, timeRange);
        } catch (error) {
            console.warn('Backend unavailable, using mock data:', error);
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 400));
                return generateHistoricalData(timeRange);
            }
            throw error;
        }
    },

    // Get behavioral patterns
    getBehavioralPatterns: async (timeRange: TimeRange): Promise<BehavioralPattern[]> => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.SUMMARY);
            const summary = response.data;
            
            // Generate patterns from summary data
            const patterns: BehavioralPattern[] = [];
            
            const stateDistribution = summary.state_distribution_percent || {};
            const activityDistribution = summary.activity_distribution_percent || {};
            
            // Create patterns from state distribution
            Object.entries(stateDistribution).forEach(([state, percent], index) => {
                if (percent as number > 5) {
                    patterns.push({
                        id: `state-${index}`,
                        pattern: state,
                        description: `${state} state detected ${(percent as number).toFixed(1)}% of the time`,
                        occurrences: [{
                            timestamp: new Date().toISOString(),
                            duration: Math.round((percent as number) * 14.4), // Convert to minutes in 24h
                        }],
                    });
                }
            });
            
            // Create patterns from activity distribution
            Object.entries(activityDistribution).forEach(([activity, percent], index) => {
                if (percent as number > 5) {
                    patterns.push({
                        id: `activity-${index}`,
                        pattern: activity,
                        description: `${activity} for ${(percent as number).toFixed(1)}% of the day`,
                        occurrences: [{
                            timestamp: new Date().toISOString(),
                            duration: Math.round((percent as number) * 14.4),
                        }],
                    });
                }
            });
            
            return patterns;
        } catch (error) {
            console.warn('Backend unavailable, using mock patterns:', error);
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 400));
                return mockBehavioralPatterns;
            }
            throw error;
        }
    },
};
