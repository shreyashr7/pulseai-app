import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAlerts, markAlertAsRead } from '../store/slices/alertSlice';
import { AlertCard } from '../components/alerts/AlertCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SPACING, TEXT_STYLES } from '../theme';
import { useTheme } from '../theme/useTheme';
import { Alert } from '../types';

type Props = NativeStackScreenProps<any, 'Alerts'>;

export const AlertsScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { alerts, loading, unreadCount } = useAppSelector((state) => state.alerts);

    const { colors } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

    useEffect(() => {
        dispatch(fetchAlerts());

        // Refresh every 30 seconds
        const interval = setInterval(() => {
            dispatch(fetchAlerts());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleAlertPress = (alert: Alert) => {
        if (!alert.read) {
            dispatch(markAlertAsRead(alert.id));
        }
        navigation.navigate('AlertDetail', { alertId: alert.id });
    };

    const filteredAlerts = filter === 'unread'
        ? alerts.filter(a => !a.read)
        : alerts;

    if (loading && alerts.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Alerts & Notifications</Text>
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
                    onPress={() => setFilter('all')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filter === 'all' && styles.activeFilterText,
                        ]}
                    >
                        All ({alerts.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
                    onPress={() => setFilter('unread')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filter === 'unread' && styles.activeFilterText,
                        ]}
                    >
                        Unread ({unreadCount})
                    </Text>
                </TouchableOpacity>
            </View>

            {filteredAlerts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        {filter === 'unread'
                            ? 'No unread alerts'
                            : 'No alerts yet'}
                    </Text>
                    <Text style={styles.emptySubText}>
                        You'll see notifications about your health here
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredAlerts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AlertCard alert={item} onPress={() => handleAlertPress(item)} />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    title: {
        ...TEXT_STYLES.h2,
        color: colors.text,
        marginRight: SPACING.sm,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xs,
    },
    badgeText: {
        ...TEXT_STYLES.caption,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    filterTab: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        marginRight: SPACING.sm,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    activeFilterTab: {
        backgroundColor: colors.primary,
    },
    filterText: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    listContent: {
        padding: SPACING.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        ...TEXT_STYLES.h3,
        color: colors.textSecondary,
        marginBottom: SPACING.sm,
    },
    emptySubText: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
