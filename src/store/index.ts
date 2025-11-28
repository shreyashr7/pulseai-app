import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import healthReducer from './slices/healthSlice';
import alertReducer from './slices/alertSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        health: healthReducer,
        alerts: alertReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
