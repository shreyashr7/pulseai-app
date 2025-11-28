import api from './api';
import { Alert } from '../types';
import { API_CONFIG } from '../config/api.config';
import { generateAlertsFromAnomalies } from '../utils/backendTransformers';
import { mockAlerts } from '../mocks/healthData';

// Set to false to use real backend
const USE_MOCK = false;

export const alertService = {
    // Get all alerts
    getAlerts: async (): Promise<Alert[]> => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.HEALTH_SUMMARY);
            return generateAlertsFromAnomalies(response.data);
        } catch (error) {
            console.warn('Backend unavailable, using mock alerts:', error);
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 300));
                return [...mockAlerts];
            }
            throw error;
        }
    },

    // Get alert details
    getAlertDetails: async (alertId: string): Promise<Alert> => {
        // For backend, get all alerts and find the specific one
        try {
            const alerts = await alertService.getAlerts();
            const alert = alerts.find(a => a.id === alertId);
            if (!alert) throw new Error('Alert not found');
            return alert;
        } catch (error) {
            console.warn('Backend unavailable, using mock alerts:', error);
            if (USE_MOCK) {
                await new Promise(resolve => setTimeout(resolve, 200));
                const alert = mockAlerts.find(a => a.id === alertId);
                if (!alert) throw new Error('Alert not found');
                return alert;
            }
            throw error;
        }
    },

    // Acknowledge alert
    acknowledgeAlert: async (alertId: string): Promise<void> => {
        // Backend doesn't have alert acknowledgement yet
        // For now, just simulate success
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('Alert acknowledged (local only):', alertId);
    },

    // Mark alert as read
    markAsRead: async (alertId: string): Promise<void> => {
        // Backend doesn't have mark as read yet
        // For now, just simulate success
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Alert marked as read (local only):', alertId);
    },
};
