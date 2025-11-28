import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TrendsScreen } from '../screens/TrendsScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../theme';
import { useAppSelector } from '../store/hooks';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
    const { unreadCount } = useAppSelector((state) => state.alerts);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.light.textSecondary,
                tabBarStyle: {
                    borderTopColor: COLORS.light.border,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
                }}
            />
            <Tab.Screen
                name="Trends"
                component={TrendsScreen}
                options={{
                    tabBarLabel: 'Trends',
                    tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
                }}
            />
            <Tab.Screen
                name="Alerts"
                component={AlertsScreen}
                options={{
                    tabBarLabel: 'Alerts',
                    tabBarIcon: ({ color }) => <TabIcon icon="🔔" color={color} />,
                    tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};

const TabIcon: React.FC<{ icon: string; color: string }> = ({ icon, color }) => {
    return <Text style={{ fontSize: 24, color }}>{icon}</Text>;
};
