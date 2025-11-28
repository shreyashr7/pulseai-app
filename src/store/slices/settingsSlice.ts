import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings, ThresholdSettings, NotificationPreferences } from '../../types';

interface SettingsState extends AppSettings {
    loading: boolean;
    error: string | null;
}

const initialState: SettingsState = {
    thresholds: {
        lowSpo2: 92,
        highHeartRate: 120,
        lowHeartRate: 50,
        criticalSpo2: 88,
    },
    notifications: {
        predictiveAlerts: true,
        anomalyAlerts: true,
        emergencyAlerts: true,
        systemNotifications: true,
        soundEnabled: true,
        vibrationEnabled: true,
    },
    darkMode: false, // Dark mode disabled
    autoRefreshInterval: 5,
    loading: false,
    error: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateThresholds: (state, action: PayloadAction<Partial<ThresholdSettings>>) => {
            state.thresholds = { ...state.thresholds, ...action.payload };
        },
        updateNotificationPreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        },
        setAutoRefreshInterval: (state, action: PayloadAction<number>) => {
            state.autoRefreshInterval = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    updateThresholds,
    updateNotificationPreferences,
    toggleDarkMode,
    setDarkMode,
    setAutoRefreshInterval,
    clearError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
