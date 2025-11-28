import api from './api';
import { Alert } from '../types';
import { API_CONFIG } from '../config/api.config';
import { transformBackendAlerts } from '../utils/backendTransformers';
import { mockAlerts } from '../mocks/healthData';

// Set to false to use real backend
const USE_MOCK = false;

export const alertService = {
    // Get all alerts
    getAlerts: async (unreadOnly: boolean = false): Promise<Alert[]> => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.ALERTS}?limit=50&unread_only=${unreadOnly}`);
            return transformBackendAlerts(response.data);
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

    // Acknowledge alert (mark as read)
    acknowledgeAlert: async (alertId: string): Promise<void> => {
        try {
            await api.patch(API_CONFIG.ENDPOINTS.ALERT_READ.replace(':id', alertId));
        } catch (error) {
            console.warn('Failed to acknowledge alert:', error);
            if (!USE_MOCK) throw error;
        }
    },

    // Mark alert as read
    markAsRead: async (alertId: string): Promise<void> => {
        try {
            await api.patch(API_CONFIG.ENDPOINTS.ALERT_READ.replace(':id', alertId));
        } catch (error) {
            console.warn('Failed to mark alert as read:', error);
            if (!USE_MOCK) throw error;
        }
    },

    // Mark all alerts as read
    markAllAsRead: async (): Promise<void> => {
        try {
            await api.patch(API_CONFIG.ENDPOINTS.ALERTS_READ_ALL);
        } catch (error) {
            console.warn('Failed to mark all alerts as read:', error);
            if (!USE_MOCK) throw error;
        }
    },
};
