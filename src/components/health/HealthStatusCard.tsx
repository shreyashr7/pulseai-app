import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../../theme';
import { HealthState, ActivityLevel } from '../../types';
import { healthHelpers } from '../../utils/healthHelpers';
import { getActivityColor } from '../../theme/colors';

interface HealthStatusCardProps {
    healthState: HealthState;
    activityLevel: ActivityLevel;
}

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({
    healthState,
    activityLevel,
}) => {
    const healthColor = healthHelpers.getHealthStateColor(healthState);
    const activityColor = getActivityColor(activityLevel);

    return (
        <Card style={styles.card}>
            <View style={styles.statusItem}>
                <Text style={styles.label}>Health Status</Text>
                <View style={[styles.badge, { backgroundColor: healthColor }]}>
                    <Text style={styles.badgeText}>{healthState}</Text>
                </View>
                <Text style={styles.description}>
                    {healthHelpers.getHealthStateDescription(healthState)}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statusItem}>
                <Text style={styles.label}>Activity Level</Text>
                <View style={[styles.badge, { backgroundColor: activityColor }]}>
                    <Text style={styles.badgeText}>{activityLevel}</Text>
                </View>
                <Text style={styles.description}>
                    {healthHelpers.getActivityDescription(activityLevel)}
                </Text>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: SPACING.md,
    },
    statusItem: {
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    label: {
        ...TEXT_STYLES.bodySmall,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        marginBottom: SPACING.xs,
    },
    badgeText: {
        ...TEXT_STYLES.body,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    description: {
        ...TEXT_STYLES.bodySmall,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.light.divider,
        marginVertical: SPACING.sm,
    },
});
