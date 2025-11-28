import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import { storage } from '../utils/storage';
import { mockUser } from '../mocks/healthData';

// Mock mode - using mock data instead of real API
const USE_MOCK = true;

export const authService = {
    // Login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        if (USE_MOCK) {
            // Mock login - simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simple validation
            if (credentials.email && credentials.password) {
                const mockToken = 'mock_jwt_token_' + Date.now();
                const mockRefreshToken = 'mock_refresh_token_' + Date.now();

                const response = {
                    user: mockUser,
                    token: mockToken,
                    refreshToken: mockRefreshToken,
                };

                // Save tokens
                await storage.saveAuthToken(mockToken);
                await storage.saveRefreshToken(mockRefreshToken);
                await storage.saveUserData(mockUser);

                return response;
            }
            throw new Error('Invalid credentials');
        }

        const response = await api.post('/auth/login', credentials);
        const data: AuthResponse = response.data;

        // Save tokens
        await storage.saveAuthToken(data.token);
        await storage.saveRefreshToken(data.refreshToken);
        await storage.saveUserData(data.user);

        return data;
    },

    // Register
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newUser: User = {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name,
                age: userData.age,
                phone: userData.phone,
                createdAt: new Date().toISOString(),
            };

            const mockToken = 'mock_jwt_token_' + Date.now();
            const mockRefreshToken = 'mock_refresh_token_' + Date.now();

            const response = {
                user: newUser,
                token: mockToken,
                refreshToken: mockRefreshToken,
            };

            await storage.saveAuthToken(mockToken);
            await storage.saveRefreshToken(mockRefreshToken);
            await storage.saveUserData(newUser);

            return response;
        }

        const response = await api.post('/auth/register', userData);
        const data: AuthResponse = response.data;

        await storage.saveAuthToken(data.token);
        await storage.saveRefreshToken(data.refreshToken);
        await storage.saveUserData(data.user);

        return data;
    },

    // Logout
    logout: async (): Promise<void> => {
        if (USE_MOCK) {
            await storage.clearAuthTokens();
            await storage.remove('@pulsai_user_data');
            return;
        }

        try {
            await api.post('/auth/logout');
        } finally {
            await storage.clearAuthTokens();
            await storage.remove('@pulsai_user_data');
        }
    },

    // Get current user profile
    getCurrentUser: async (): Promise<User> => {
        if (USE_MOCK) {
            const user = await storage.getUserData();
            return user || mockUser;
        }

        const response = await api.get('/user/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (updates: Partial<User>): Promise<User> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const currentUser = await storage.getUserData();
            const updatedUser = { ...currentUser, ...updates };
            await storage.saveUserData(updatedUser);
            return updatedUser;
        }

        const response = await api.put('/user/profile', updates);
        const updatedUser = response.data;
        await storage.saveUserData(updatedUser);
        return updatedUser;
    },
};
