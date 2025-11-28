import api from './api';
import { CurrentHealthStatus, HistoricalDataPoint, BehavioralPattern, TimeRange } from '../types';
import { API_CONFIG } from '../config/api.config';
import {
    transformSummaryToCurrentHealth,
    transformTrendsToHistoricalData,
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
            const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH_SUMMARY);
            return transformSummaryToCurrentHealth(response.data);
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
            const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH_TRENDS);
            return transformTrendsToHistoricalData(response.data, timeRange);
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
            const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH_TRENDS);
            return transformTrendsToHistoricalData(response.data, timeRange);
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
        // Note: Backend doesn't provide behavioral patterns yet
        // Always use mock data for now
        await new Promise(resolve => setTimeout(resolve, 400));
        return mockBehavioralPatterns;
    },
};
