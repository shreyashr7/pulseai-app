import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import { storage } from '../utils/storage';
import { mockUser } from '../mocks/healthData';
import { API_CONFIG } from '../config/api.config';

// Mock mode - set to false to use real API
const USE_MOCK = false;

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

        // Real API call
        const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
        const data = response.data;

        // Transform backend response to app format
        const authResponse: AuthResponse = {
            user: {
                id: data.user.id.toString(),
                email: data.user.email,
                name: data.user.full_name || data.user.email.split('@')[0],
                phone: data.user.phone,
                createdAt: new Date().toISOString(),
            },
            token: data.access_token,
            refreshToken: data.access_token, // Backend uses same token
        };

        // Save tokens
        await storage.saveAuthToken(authResponse.token);
        await storage.saveRefreshToken(authResponse.refreshToken);
        await storage.saveUserData(authResponse.user);

        return authResponse;
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

        // Real API call - transform to backend format
        const registerPayload = {
            email: userData.email,
            password: userData.password,
            full_name: userData.name,
            phone: userData.phone || '',
        };

        const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, registerPayload);
        const data = response.data;

        // Transform backend response to app format
        const authResponse: AuthResponse = {
            user: {
                id: data.user.id.toString(),
                email: data.user.email,
                name: data.user.full_name || userData.name,
                phone: userData.phone,
                age: userData.age,
                createdAt: new Date().toISOString(),
            },
            token: data.access_token,
            refreshToken: data.access_token,
        };

        await storage.saveAuthToken(authResponse.token);
        await storage.saveRefreshToken(authResponse.refreshToken);
        await storage.saveUserData(authResponse.user);

        return authResponse;
    },

    // Logout
    logout: async (): Promise<void> => {
        await storage.clearAuthTokens();
        await storage.remove('@pulsai_user_data');
    },

    // Get current user profile
    getCurrentUser: async (): Promise<User> => {
        if (USE_MOCK) {
            const user = await storage.getUserData();
            return user || mockUser;
        }

        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.ME);
            const data = response.data;
            
            return {
                id: data.id.toString(),
                email: data.email,
                name: data.full_name || data.email.split('@')[0],
                phone: data.phone,
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            // Fallback to stored user data
            const user = await storage.getUserData();
            if (user) return user;
            throw error;
        }
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

        // Backend doesn't have update profile endpoint yet
        // Store locally for now
        const currentUser = await storage.getUserData();
        const updatedUser = { ...currentUser, ...updates };
        await storage.saveUserData(updatedUser);
        return updatedUser;
    },
};
