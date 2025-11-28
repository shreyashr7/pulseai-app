import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { COLORS, SPACING, TEXT_STYLES, BORDER_RADIUS } from '../../theme';
import { Alert } from '../../types';
import { getAlertSeverityColor } from '../../theme/colors';
import { formatters } from '../../utils/formatters';

interface AlertCardProps {
    alert: Alert;
    onPress: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress }) => {
    const severityColor = getAlertSeverityColor(alert.severity);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={[styles.card, !alert.read && styles.unreadCard]}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                            <Text style={styles.severityText}>{alert.severity}</Text>
                        </View>
                        <Text style={styles.type}>{alert.type}</Text>
                    </View>
                    {!alert.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.title}>{alert.title}</Text>
                <Text style={styles.message} numberOfLines={2}>
                    {alert.message}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.timestamp}>
                        {formatters.relativeTime(alert.timestamp)}
                    </Text>
                    {alert.acknowledged && (
                        <Text style={styles.acknowledged}>Acknowledged</Text>
                    )}
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: SPACING.md,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    severityBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
        marginRight: SPACING.sm,
    },
    severityText: {
        ...TEXT_STYLES.caption,
        color: '#FFFFFF',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    type: {
        ...TEXT_STYLES.bodySmall,
        color: COLORS.light.textSecondary,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    title: {
        ...TEXT_STYLES.h4,
        color: COLORS.light.text,
        marginBottom: SPACING.xs,
    },
    message: {
        ...TEXT_STYLES.body,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timestamp: {
        ...TEXT_STYLES.caption,
        color: COLORS.light.textSecondary,
    },
    acknowledged: {
        ...TEXT_STYLES.caption,
        color: COLORS.secondary,
        fontWeight: '600',
    },
});
