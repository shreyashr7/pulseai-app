import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCurrentHealth } from '../store/slices/healthSlice';
import { fetchAlerts } from '../store/slices/alertSlice';
import { HealthGauge } from '../components/health/HealthGauge';
import { HealthStatusCard } from '../components/health/HealthStatusCard';
import { SOSButton } from '../components/emergency/SOSButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';
import { SPACING, TEXT_STYLES } from '../theme';
import { useTheme } from '../theme/useTheme';
import { formatters } from '../utils/formatters';
import { emergencyService } from '../services/emergency.service';
import { APP_CONFIG } from '../config/api.config';

type Props = NativeStackScreenProps<any, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { currentHealth, loading, lastUpdated } = useAppSelector(
        (state) => state.health
    );
    const { alerts } = useAppSelector((state) => state.alerts);
    const { user } = useAppSelector((state) => state.auth);

    const { colors } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        loadData();

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => {
            dispatch(fetchCurrentHealth());
        }, APP_CONFIG.DASHBOARD_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        await Promise.all([
            dispatch(fetchCurrentHealth()),
            dispatch(fetchAlerts()),
        ]);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleSOS = async () => {
        try {
            await emergencyService.triggerSOS();
            alert('Emergency alert sent to your contacts!');
        } catch (error) {
            alert('Failed to send emergency alert');
        }
    };

    if (loading && !currentHealth) {
        return <LoadingSpinner />;
    }

    const unreadAlerts = alerts.filter((a) => !a.read);
    const latestAlert = unreadAlerts.length > 0 ? unreadAlerts[0] : null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
                        <Text style={styles.subGreeting}>
                            {lastUpdated
                                ? `Updated ${formatters.relativeTime(lastUpdated)}`
                                : 'Welcome to PulsAI'}
                        </Text>
                    </View>
                    <SOSButton onConfirm={handleSOS} />
                </View>

                {/* Latest Alert */}
                {latestAlert && (
                    <Card style={styles.alertBanner}>
                        <Text style={styles.alertTitle}>⚠️ Latest Alert</Text>
                        <Text style={styles.alertMessage} numberOfLines={2}>
                            {latestAlert.message}
                        </Text>
                    </Card>
                )}

                {/* Health Gauges */}
                {currentHealth && (
                    <View style={styles.gaugesContainer}>
                        <HealthGauge
                            value={currentHealth.heartRate}
                            maxValue={200}
                            label="Heart Rate"
                            unit="bpm"
                            type="hr"
                        />
                        <HealthGauge
                            value={currentHealth.spo2}
                            maxValue={100}
                            label="Blood Oxygen"
                            unit="%"
                            type="spo2"
                        />
                    </View>
                )}

                {/* Health Status */}
                {currentHealth && (
                    <HealthStatusCard
                        healthState={currentHealth.healthState}
                        activityLevel={currentHealth.activityLevel}
                    />
                )}

                {/* Health Score */}
                {currentHealth?.healthScore && (
                    <Card style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>Daily Health Score</Text>
                        <Text style={styles.scoreValue}>
                            {currentHealth.healthScore}/100
                        </Text>
                        <Text style={styles.scoreDescription}>
                            Your overall health is{' '}
                            {currentHealth.healthScore >= 85
                                ? 'excellent'
                                : currentHealth.healthScore >= 70
                                    ? 'good'
                                    : 'fair'}
                        </Text>
                    </Card>
                )}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    greeting: {
        ...TEXT_STYLES.h3,
        color: colors.text,
    },
    subGreeting: {
        ...TEXT_STYLES.bodySmall,
        color: colors.textSecondary,
        marginTop: SPACING.xs,
    },
    alertBanner: {
        backgroundColor: colors.warning,
        marginBottom: SPACING.md,
    },
    alertTitle: {
        ...TEXT_STYLES.h4,
        color: '#FFFFFF',
        marginBottom: SPACING.xs,
    },
    alertMessage: {
        ...TEXT_STYLES.body,
        color: '#FFFFFF',
    },
    gaugesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: SPACING.lg,
    },
    scoreCard: {
        alignItems: 'center',
        marginVertical: SPACING.md,
        paddingVertical: SPACING.lg,
    },
    scoreLabel: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        marginBottom: SPACING.xs,
    },
    scoreValue: {
        ...TEXT_STYLES.h1,
        color: colors.primary,
        fontWeight: 'bold',
    },
    scoreDescription: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        marginTop: SPACING.xs,
    },
});
