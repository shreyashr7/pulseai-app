import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from '../../types';
import { alertService } from '../../services/alert.service';
import { handleApiError } from '../../services/api';

interface AlertState {
    alerts: Alert[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: AlertState = {
    alerts: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

// Async thunks
export const fetchAlerts = createAsyncThunk(
    'alerts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await alertService.getAlerts();
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const acknowledgeAlert = createAsyncThunk(
    'alerts/acknowledge',
    async (alertId: string, { rejectWithValue }) => {
        try {
            await alertService.acknowledgeAlert(alertId);
            return alertId;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const markAlertAsRead = createAsyncThunk(
    'alerts/markAsRead',
    async (alertId: string, { rejectWithValue }) => {
        try {
            await alertService.markAsRead(alertId);
            return alertId;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        addAlert: (state, action) => {
            state.alerts.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch alerts
        builder.addCase(fetchAlerts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAlerts.fulfilled, (state, action) => {
            state.loading = false;
            state.alerts = action.payload;
            state.unreadCount = action.payload.filter(a => !a.read).length;
            state.error = null;
        });
        builder.addCase(fetchAlerts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Acknowledge alert
        builder.addCase(acknowledgeAlert.fulfilled, (state, action) => {
            const alert = state.alerts.find(a => a.id === action.payload);
            if (alert) {
                alert.acknowledged = true;
                alert.read = true;
                if (!alert.read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            }
        });

        // Mark as read
        builder.addCase(markAlertAsRead.fulfilled, (state, action) => {
            const alert = state.alerts.find(a => a.id === action.payload);
            if (alert && !alert.read) {
                alert.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        });
    },
});

export const { clearError, addAlert } = alertSlice.actions;
export default alertSlice.reducer;
