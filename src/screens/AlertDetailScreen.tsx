import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { markAlertAsRead, acknowledgeAlert } from '../store/slices/alertSlice';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../theme';
import { useTheme } from '../theme/useTheme';
import { formatters } from '../utils/formatters';

type Props = NativeStackScreenProps<any, 'AlertDetail'>;

export const AlertDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { alertId } = route.params;
    const dispatch = useAppDispatch();
    const { alerts } = useAppSelector((state) => state.alerts);

    const { colors } = useTheme();
    const styles = React.useMemo(() => getStyles(colors), [colors]);

    const alert = alerts.find((a) => a.id === alertId);

    useEffect(() => {
        if (alert && !alert.read) {
            dispatch(markAlertAsRead(alert.id));
        }
    }, [alert, dispatch]);

    const handleAcknowledge = () => {
        if (alert) {
            dispatch(acknowledgeAlert(alert.id));
            navigation.goBack();
        }
    };

    if (!alert) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Alert not found</Text>
                    <Button title="Go Back" onPress={() => navigation.goBack()} />
                </View>
            </SafeAreaView>
        );
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High':
                return COLORS.alert.high;
            case 'Medium':
                return COLORS.alert.medium;
            case 'Low':
                return COLORS.alert.low;
            default:
                return colors.info;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.headerCard}>
                    <View style={styles.typeContainer}>
                        <View
                            style={[
                                styles.severityBadge,
                                { backgroundColor: getSeverityColor(alert.severity) },
                            ]}
                        >
                            <Text style={styles.severityText}>{alert.severity}</Text>
                        </View>
                        <Text style={styles.timestamp}>
                            {formatters.dateTime(alert.timestamp)}
                        </Text>
                    </View>
                    <Text style={styles.title}>{alert.title}</Text>
                    <Text style={styles.message}>{alert.message}</Text>
                </Card>

                {alert.relatedMetrics && (
                    <Card style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Related Metrics</Text>
                        {Object.entries(alert.relatedMetrics).map(([key, value]) => (
                            <View key={key} style={styles.metricRow}>
                                <Text style={styles.metricLabel}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                                <Text style={styles.metricValue}>{value}</Text>
                            </View>
                        ))}
                    </Card>
                )}

                {alert.recommendedActions && alert.recommendedActions.length > 0 && (
                    <Card style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Recommended Actions</Text>
                        {alert.recommendedActions.map((action, index) => (
                            <View key={index} style={styles.actionRow}>
                                <Text style={styles.actionBullet}>•</Text>
                                <Text style={styles.actionText}>{action}</Text>
                            </View>
                        ))}
                    </Card>
                )}

                {!alert.acknowledged && (
                    <Button
                        title="Acknowledge Alert"
                        onPress={handleAcknowledge}
                        style={styles.acknowledgeButton}
                    />
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
    content: {
        padding: SPACING.md,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        ...TEXT_STYLES.h3,
        color: colors.textSecondary,
        marginBottom: SPACING.lg,
    },
    headerCard: {
        marginBottom: SPACING.md,
    },
    typeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    severityBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
    },
    severityText: {
        ...TEXT_STYLES.caption,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    timestamp: {
        ...TEXT_STYLES.caption,
        color: colors.textSecondary,
    },
    title: {
        ...TEXT_STYLES.h3,
        color: colors.text,
        marginBottom: SPACING.sm,
    },
    message: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    sectionCard: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...TEXT_STYLES.h4,
        color: colors.text,
        marginBottom: SPACING.md,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    metricLabel: {
        ...TEXT_STYLES.body,
        color: colors.textSecondary,
        textTransform: 'capitalize',
    },
    metricValue: {
        ...TEXT_STYLES.body,
        color: colors.text,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    actionBullet: {
        ...TEXT_STYLES.body,
        color: colors.primary,
        marginRight: SPACING.sm,
    },
    actionText: {
        ...TEXT_STYLES.body,
        color: colors.text,
        flex: 1,
    },
    acknowledgeButton: {
        marginTop: SPACING.md,
    },
});
