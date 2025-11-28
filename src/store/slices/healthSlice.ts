import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CurrentHealthStatus, HistoricalDataPoint, BehavioralPattern, TimeRange } from '../../types';
import { healthService } from '../../services/health.service';
import { handleApiError } from '../../services/api';

interface HealthState {
    currentHealth: CurrentHealthStatus | null;
    historicalData: HistoricalDataPoint[];
    behavioralPatterns: BehavioralPattern[];
    selectedTimeRange: TimeRange;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

const initialState: HealthState = {
    currentHealth: null,
    historicalData: [],
    behavioralPatterns: [],
    selectedTimeRange: '24h',
    loading: false,
    error: null,
    lastUpdated: null,
};

// Async thunks
export const fetchCurrentHealth = createAsyncThunk(
    'health/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const data = await healthService.getCurrentHealth();
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const fetchHistoricalData = createAsyncThunk(
    'health/fetchHistorical',
    async (timeRange: TimeRange, { rejectWithValue }) => {
        try {
            const data = await healthService.getHistoricalData(timeRange);
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const fetchBehavioralPatterns = createAsyncThunk(
    'health/fetchBehavioralPatterns',
    async (timeRange: TimeRange, { rejectWithValue }) => {
        try {
            const data = await healthService.getBehavioralPatterns(timeRange);
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {
        setTimeRange: (state, action) => {
            state.selectedTimeRange = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch current health
        builder.addCase(fetchCurrentHealth.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCurrentHealth.fulfilled, (state, action) => {
            state.loading = false;
            state.currentHealth = action.payload;
            state.lastUpdated = new Date().toISOString();
            state.error = null;
        });
        builder.addCase(fetchCurrentHealth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch historical data
        builder.addCase(fetchHistoricalData.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchHistoricalData.fulfilled, (state, action) => {
            state.loading = false;
            state.historicalData = action.payload;
            state.error = null;
        });
        builder.addCase(fetchHistoricalData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch behavioral patterns
        builder.addCase(fetchBehavioralPatterns.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBehavioralPatterns.fulfilled, (state, action) => {
            state.loading = false;
            state.behavioralPatterns = action.payload;
            state.error = null;
        });
        builder.addCase(fetchBehavioralPatterns.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setTimeRange, clearError } = healthSlice.actions;
export default healthSlice.reducer;
