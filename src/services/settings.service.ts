import api from './api';
import { AppSettings, ThresholdSettings, NotificationPreferences } from '../types';
import { API_CONFIG } from '../config/api.config';
import { storage } from '../utils/storage';

const USE_MOCK = false;

// Default settings
const defaultSettings: AppSettings = {
    thresholds: {
        lowSpo2: 92,
        highHeartRate: 120,
        lowHeartRate: 50,
        criticalSpo2: 90,
    },
    notifications: {
        predictiveAlerts: true,
        anomalyAlerts: true,
        emergencyAlerts: true,
        systemNotifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
    },
    darkMode: false,
    autoRefreshInterval: 5,
};

export const settingsService = {
    // Get settings from backend
    getSettings: async (): Promise<AppSettings> => {
        if (USE_MOCK) {
            const cached = await storage.getSettings();
            return cached || defaultSettings;
        }

        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.SETTINGS);
            const data = response.data;

            // Transform backend format to app format
            const settings: AppSettings = {
                thresholds: {
                    lowSpo2: data.low_spo2_threshold || 92,
                    highHeartRate: data.high_hr_threshold || 120,
                    lowHeartRate: data.low_hr_threshold || 50,
                    criticalSpo2: 90,
                },
                notifications: {
                    predictiveAlerts: data.enable_predictive_alerts ?? true,
                    anomalyAlerts: data.enable_anomaly_alerts ?? true,
                    emergencyAlerts: data.enable_emergency_alerts ?? true,
                    systemNotifications: true,
                    soundEnabled: data.enable_sound ?? true,
                    vibrationEnabled: data.enable_vibration ?? true,
                },
                darkMode: false, // Not stored on backend
                autoRefreshInterval: 5,
            };

            // Cache locally
            await storage.saveSettings(settings);
            return settings;
        } catch (error) {
            console.warn('Failed to fetch settings, using cached/defaults:', error);
            const cached = await storage.getSettings();
            return cached || defaultSettings;
        }
    },

    // Update settings on backend
    updateSettings: async (settings: Partial<AppSettings>): Promise<AppSettings> => {
        // Get current settings
        const currentSettings = await settingsService.getSettings();
        const newSettings = { ...currentSettings, ...settings };

        if (USE_MOCK) {
            await storage.saveSettings(newSettings);
            return newSettings;
        }

        try {
            // Transform to backend format
            const payload = {
                low_spo2_threshold: newSettings.thresholds.lowSpo2,
                high_hr_threshold: newSettings.thresholds.highHeartRate,
                low_hr_threshold: newSettings.thresholds.lowHeartRate,
                enable_predictive_alerts: newSettings.notifications.predictiveAlerts,
                enable_anomaly_alerts: newSettings.notifications.anomalyAlerts,
                enable_emergency_alerts: newSettings.notifications.emergencyAlerts,
                enable_sound: newSettings.notifications.soundEnabled,
                enable_vibration: newSettings.notifications.vibrationEnabled,
            };

            await api.put(API_CONFIG.ENDPOINTS.SETTINGS, payload);
            
            // Cache locally
            await storage.saveSettings(newSettings);
            return newSettings;
        } catch (error) {
            console.warn('Failed to update settings on backend:', error);
            // Still save locally
            await storage.saveSettings(newSettings);
            throw error;
        }
    },

    // Update only thresholds
    updateThresholds: async (thresholds: Partial<ThresholdSettings>): Promise<AppSettings> => {
        const currentSettings = await settingsService.getSettings();
        return settingsService.updateSettings({
            thresholds: { ...currentSettings.thresholds, ...thresholds },
        });
    },

    // Update only notification preferences
    updateNotificationPreferences: async (notifications: Partial<NotificationPreferences>): Promise<AppSettings> => {
        const currentSettings = await settingsService.getSettings();
        return settingsService.updateSettings({
            notifications: { ...currentSettings.notifications, ...notifications },
        });
    },
};
