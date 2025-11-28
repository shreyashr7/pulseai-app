import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TEXT_STYLES, SHADOWS } from '../../theme';
import { Button } from '../common/Button';

interface SOSButtonProps {
    onConfirm: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onConfirm }) => {
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handlePress = () => {
        setShowModal(true);
    };

    const handleConfirm = () => {
        setShowModal(false);
        onConfirm();
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.sosButton}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.warningIcon}>⚠️</Text>
                        </View>

                        <Text style={styles.modalTitle}>Emergency Alert</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to trigger an emergency alert? This will
                            notify your emergency contacts immediately.
                        </Text>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Cancel"
                                onPress={handleCancel}
                                variant="outline"
                                style={styles.button}
                            />
                            <Button
                                title="Confirm Emergency"
                                onPress={handleConfirm}
                                variant="danger"
                                style={styles.button}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    sosButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.emergency,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.xl,
    },
    sosText: {
        ...TEXT_STYLES.h2,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginHorizontal: SPACING.lg,
        maxWidth: 400,
        width: '90%',
        ...SHADOWS.xl,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    warningIcon: {
        fontSize: 48,
    },
    modalTitle: {
        ...TEXT_STYLES.h3,
        color: COLORS.light.text,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    modalMessage: {
        ...TEXT_STYLES.body,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: SPACING.xs,
    },
});
