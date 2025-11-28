import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { storage } from '../utils/storage';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await storage.getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await storage.getRefreshToken();
                if (refreshToken) {
                    // Attempt to refresh token
                    const response = await axios.post(
                        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
                        { refreshToken }
                    );

                    const { token } = response.data;
                    await storage.saveAuthToken(token);

                    // Retry original request
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens
                await storage.clearAuthTokens();
                // Redirect to login would happen here
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with error
            return error.response.data?.message || error.response.data?.error || 'An error occurred';
        } else if (error.request) {
            // Request made but no response
            return 'Network error. Please check your connection.';
        }
    }
    return 'An unexpected error occurred';
};
