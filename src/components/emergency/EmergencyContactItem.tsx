import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Card } from '../common/Card';
import { COLORS, SPACING, TEXT_STYLES } from '../../theme';
import { EmergencyContact } from '../../types';
import { formatters } from '../../utils/formatters';

interface EmergencyContactItemProps {
    contact: EmergencyContact;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const EmergencyContactItem: React.FC<EmergencyContactItemProps> = ({
    contact,
    onEdit,
    onDelete,
}) => {
    const handleCall = () => {
        Linking.openURL(`tel:${contact.phone}`);
    };

    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.name}>{contact.name}</Text>
                    {contact.isPrimary && (
                        <View style={styles.primaryBadge}>
                            <Text style={styles.primaryText}>Primary</Text>
                        </View>
                    )}
                </View>
            </View>

            <Text style={styles.relationship}>{contact.relationship}</Text>
            <Text style={styles.phone}>{formatters.phone(contact.phone)}</Text>
            {contact.email && <Text style={styles.email}>{contact.email}</Text>}

            <View style={styles.actions}>
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Text style={styles.callButtonText}>📞 Call</Text>
                </TouchableOpacity>
                {onEdit && (
                    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        ...TEXT_STYLES.h4,
        color: COLORS.light.text,
        marginRight: SPACING.sm,
    },
    primaryBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    primaryText: {
        ...TEXT_STYLES.caption,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    relationship: {
        ...TEXT_STYLES.body,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.xs,
    },
    phone: {
        ...TEXT_STYLES.body,
        color: COLORS.light.text,
        fontWeight: '500',
    },
    email: {
        ...TEXT_STYLES.bodySmall,
        color: COLORS.light.textSecondary,
        marginTop: SPACING.xs,
    },
    actions: {
        flexDirection: 'row',
        marginTop: SPACING.md,
    },
    callButton: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        padding: SPACING.sm,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: SPACING.xs,
    },
    callButtonText: {
        ...TEXT_STYLES.body,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    editButton: {
        flex: 1,
        backgroundColor: COLORS.light.surface,
        padding: SPACING.sm,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: SPACING.xs,
    },
    editButtonText: {
        ...TEXT_STYLES.body,
        color: COLORS.primary,
        fontWeight: '600',
    },
});
