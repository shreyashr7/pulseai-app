import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SPACING, TEXT_STYLES, BORDER_RADIUS } from '../theme';
import { useTheme } from '../theme/useTheme';

type Props = NativeStackScreenProps<any, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const { colors } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => dispatch(logout()),
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.title}>Profile & Settings</Text>

                {/* User Info Card */}
                <Card style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                    {user?.age && (
                        <Text style={styles.info}>Age: {user.age} years</Text>
                    )}
                    {user?.phone && (
                        <Text style={styles.info}>Phone: {user.phone}</Text>
                    )}
                </Card>

                {/* Menu Options */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('EmergencyContacts')}
                    >
                        <Text style={styles.menuIcon}>👥</Text>
                        <Text style={styles.menuText}>Emergency Contacts</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={styles.menuIcon}>⚙️</Text>
                        <Text style={styles.menuText}>Settings & Preferences</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => Alert.alert('About', 'PulsAI Health Monitor v1.0.0')}
                    >
                        <Text style={styles.menuIcon}>ℹ️</Text>
                        <Text style={styles.menuText}>About PulsAI</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            Alert.alert(
                                'Help',
                                'For support, please contact support@pulsai.health'
                            )
                        }
                    >
                        <Text style={styles.menuIcon}>❓</Text>
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Logout"
                    onPress={handleLogout}
                    variant="danger"
                    style={styles.logoutButton}
                />

                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    title: {
        ...TEXT_STYLES.h2,
        color: colors.text,
        marginBottom: SPACING.lg,
    },
    card: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        ...TEXT_STYLES.h1,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    name: {
        ...TEXT_STYLES.h3,
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    email: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        marginBottom: SPACING.sm,
    },
    info: {
        ...TEXT_STYLES.bodySmall,
        color: colors.textSecondary,
        marginTop: SPACING.xs,
    },
    menuContainer: {
        marginBottom: SPACING.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: SPACING.md,
    },
    menuText: {
        flex: 1,
        ...TEXT_STYLES.body,
        color: colors.text,
        fontWeight: '500',
    },
    menuArrow: {
        ...TEXT_STYLES.h3,
        color: colors.textSecondary,
    },
    logoutButton: {
        marginVertical: SPACING.lg,
    },
    version: {
        ...TEXT_STYLES.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
});
