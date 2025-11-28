import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
    Dashboard: undefined;
    Trends: undefined;
    Alerts: undefined;
    Profile: undefined;
};

// Root Stack (includes modals and additional screens)
export type RootStackParamList = {
    MainTabs: undefined;
    Settings: undefined;
    EmergencyContacts: undefined;
    AlertDetail: { alertId: string };
};

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

export type MainTabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
>;
