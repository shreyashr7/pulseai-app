import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import { storage } from '../utils/storage';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EmergencyContactsScreen } from '../screens/EmergencyContactsScreen';
import { AlertDetailScreen } from '../screens/AlertDetailScreen';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { COLORS } from '../theme';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await storage.getAuthToken();
            setHasToken(!!token);
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated || hasToken ? (
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: COLORS.primary,
                        },
                        headerTintColor: '#FFFFFF',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="MainTabs"
                        component={MainTabNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ title: 'Settings' }}
                    />
                    <Stack.Screen
                        name="EmergencyContacts"
                        component={EmergencyContactsScreen}
                        options={{ title: 'Emergency Contacts' }}
                    />
                    <Stack.Screen
                        name="AlertDetail"
                        component={AlertDetailScreen}
                        options={{ title: 'Alert Details' }}
                    />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};
