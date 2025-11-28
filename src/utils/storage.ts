import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    AUTH_TOKEN: '@pulsai_auth_token',
    REFRESH_TOKEN: '@pulsai_refresh_token',
    USER_DATA: '@pulsai_user_data',
    SETTINGS: '@pulsai_settings',
    THEME: '@pulsai_theme',
};

export const storage = {
    // Save data
    async save(key: string, value: any): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error('Error saving to storage:', error);
            throw error;
        }
    },

    // Get data
    async get<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    // Remove data
    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from storage:', error);
            throw error;
        }
    },

    // Clear all data
    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    },

    // Auth specific
    async saveAuthToken(token: string): Promise<void> {
        await this.save(STORAGE_KEYS.AUTH_TOKEN, token);
    },

    async getAuthToken(): Promise<string | null> {
        return await this.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    },

    async saveRefreshToken(token: string): Promise<void> {
        await this.save(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return await this.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    },

    async clearAuthTokens(): Promise<void> {
        await this.remove(STORAGE_KEYS.AUTH_TOKEN);
        await this.remove(STORAGE_KEYS.REFRESH_TOKEN);
    },

    // User data
    async saveUserData(userData: any): Promise<void> {
        await this.save(STORAGE_KEYS.USER_DATA, userData);
    },

    async getUserData(): Promise<any> {
        return await this.get(STORAGE_KEYS.USER_DATA);
    },

    // Settings
    async saveSettings(settings: any): Promise<void> {
        await this.save(STORAGE_KEYS.SETTINGS, settings);
    },

    async getSettings(): Promise<any> {
        return await this.get(STORAGE_KEYS.SETTINGS);
    },

    // Theme
    async saveTheme(theme: 'light' | 'dark'): Promise<void> {
        await this.save(STORAGE_KEYS.THEME, theme);
    },

    async getTheme(): Promise<'light' | 'dark' | null> {
        return await this.get<'light' | 'dark'>(STORAGE_KEYS.THEME);
    },
};
